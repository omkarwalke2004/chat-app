import React, { useEffect, useRef, useState } from 'react';
import './chat.css';
import EmojiPicker from 'emoji-picker-react';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../libs/firebase';
import { useChatStore } from '../../libs/chatStore';
import { useUserStore } from '../../libs/userStore';
import upload from '../../libs/Upload';

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [img, setImg] = useState({ file: null, url: '' });
  const [isopen, setisopen] = useState(false);
  const [input, setInput] = useState('');

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
  const { currentUser } = useUserStore();
  const endref = useRef();

  // Handle image selection
  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  // Scroll to the end of the chat on new message
  useEffect(() => {
    endref?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  // Subscribe to chat data using Firebase onSnapshot
  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'chats', chatId), (res) => {
      setChat(res.data());
    });
    return () => {
      unSub();
    };
  }, [chatId]);

  // Toggle emoji picker
  const handelclick = () => {
    setisopen(!isopen);
  };

  // Handle emoji selection
  const handelemojichange = (e) => {
    setInput((prev) => prev + e.emoji);
    setisopen(false);
  };

  // Handle sending a message
  const handelSend = async () => {
    if (input === '') return;

    let imgUrl = null;
    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, 'chats', chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text: input,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIDs = [currentUser.id, user.id];
      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, 'userschats', id);
        const userChatSnapshot = await getDoc(userChatsRef);
        if (userChatSnapshot.exists()) {
          const userChatsData = userChatSnapshot.data();
          const chatIndex = userChatsData?.chats?.findIndex((c) => c.chatId === chatId);
          if (chatIndex !== -1 && userChatsData.chats) {
            userChatsData.chats[chatIndex].lastMessage = input;
            userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
            userChatsData.chats[chatIndex].updatedAt = new Date().toISOString();
            await updateDoc(userChatsRef, { chats: userChatsData.chats });
          }
        }
      });

      setInput('');
      setImg({ file: null, url: '' });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='chat'>
      <div className="top">
        <div className="users">
          {/* Change image when user is blocked */}
          <img
            src={(isCurrentUserBlocked || isReceiverBlocked) ? './avatar.png' : (user?.avtar || './avatar.png')}
            alt="User avatar"
          />
          <div className="texts">
            <span>{user?.username || 'Unknown User'}</span>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="Phone" />
          <img src="./video.png" alt="Video" />
          <img src="./info.png" alt="Info" />
        </div>
      </div>

      <div className="center">
        {chat?.messages?.map((message) => (
          <div className={message.senderId === currentUser?.id ? 'message own' : 'message'} key={message?.createdAt}>
            <div className="texts">
              {message.img && <img src={message.img} alt="Message attachment" />}
              <p>{message.text}</p>
              <span>1 min ago</span>
            </div>
          </div>
        ))}
        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="Uploaded preview" />
            </div>
          </div>
        )}
        <div ref={endref}></div>
      </div>

      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="Upload" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: 'none' }}
            onChange={handleImg}
            disabled={isCurrentUserBlocked || isReceiverBlocked}
          />
          <img src="./camera.png" alt="Camera" />
          <img src="./mic.png" alt="Mic" />
        </div>
        <input
          type="text"
          placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? 'You cannot send messages' : 'Type a message...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img src="./emoji.png" alt="Emoji" onClick={handelclick} />
          {isopen && (
            <div className="picker">
              <EmojiPicker onEmojiClick={handelemojichange} />
            </div>
          )}
        </div>
        <button
          className='sendButton'
          onClick={handelSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
