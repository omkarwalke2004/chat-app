import React, { useEffect, useState } from 'react';
import "./chatlist.css";
import AddUser from './adduser/adduser';
import { useUserStore } from '../../../libs/userStore';
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from '../../../libs/firebase';
import { useChatStore } from '../../../libs/chatStore';

const Chatlist = () => {
    const [addmode, setAddMode] = useState(false);
    const [chats, setChats] = useState([]);
    const { currentUser } = useUserStore();
    const { chatId, changeChat } = useChatStore();
    const[input,setinput]=useState("");


    const handleClick = () => {
        setAddMode(!addmode);
    };

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "userschats", currentUser.id), async (res) => {
            const items = res.data()?.chats || [];
            const promises = items.map(async (item) => {
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);
                const user = userDocSnap.data();
                return { ...item, user };
            });
            const chatData = await Promise.all(promises);
            setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        });

        return () => {
            unsubscribe();
        };
    }, [currentUser.id]);

    const handleSelect = async (chat) => {
        const userChats = chats.map(item => {
            const { user, ...rest } = item;
            return rest;
        });

        const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId);
        if (chatIndex !== -1) {
            userChats[chatIndex].isSeen = true;
        }

        const userChatsRef = doc(db, "userchats", currentUser.id);

        try {
            const userChatsSnap = await getDoc(userChatsRef);

            if (userChatsSnap.exists()) {
                // Update the existing document
                await updateDoc(userChatsRef, {
                    chats: userChats,
                });
            } else {
                // Document doesn't exist, create it
                await setDoc(userChatsRef, {
                    chats: userChats,
                });
            }

            changeChat(chat.chatId, chat.user);
        } catch (err) {
            console.log(err);
        }
    };
    const filterchats=chats.filter(c=>c.user.username.toLowerCase().includes(input.toLowerCase()))

    return (
        <div className='ChatList'>
            <div className='search'>
                <div className="searchbar">
                    <img src="/search.png" alt="" />
                    <input type="text" placeholder='Search' value={input} onChange={(e)=>setinput(e.target.value)} />
                </div>
                <img onClick={handleClick} src={addmode ? "./minus.png" : "./plus.png"} alt="" className='add' />
            </div>
            {filterchats.map(chat => (
                <div
                    className="item"
                    key={chat.chatId}
                    onClick={() => handleSelect(chat)}
                    style={{
                        backgroundColor: chat?.isSeen ? "transparent" : "#5183fe"
                    }}
                >
                    <img
                        src={(chat.user.blocked.includes(currentUser.id)) ? "./avatar.png" : (chat.user.avtar || "./avatar.png")}
                        alt=""
                    />
                    <div className="texts">
                        <span>{chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}</span>
                        <p>{chat.lastMessage}</p>
                    </div>
                </div>
            ))}
            {addmode && <AddUser />}
        </div>
    );
};

export default Chatlist;
