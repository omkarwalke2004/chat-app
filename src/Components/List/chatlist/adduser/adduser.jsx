import React, { useState } from 'react';
import './adduser.css';
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../../libs/firebase';
import { useUserStore } from '../../../../libs/userStore';

const AddUser = () => {
  const [user, setuser] = useState(null);
  const{currentUser}=useUserStore();

  const handelsearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username'); // Fix: Matching 'name' attribute

    try {
      const userRef = collection(db, 'users');
      const q = query(userRef, where('username', '==', username));
      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setuser(querySnapShot.docs[0].data()); // Store user data
      } else {
        setuser(null); // Clear user if not found
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handeladd=async()=>{
    const chatRef = collection(db,"chats")
    const userchatRef = collection(db,"userschats")

    try{
      const newChatref = doc(chatRef)
      await setDoc(newChatref,{
        createdAt: serverTimestamp(),
        messages:[]
      })
    await updateDoc(doc(userchatRef,user.id),{
      chats:arrayUnion({
        chatId:newChatref.id,
        lastMessage:"",
        receiverId:currentUser.id,
        updateAt:Date.now(),
      })
    });
    await updateDoc(doc(userchatRef,currentUser.id),{
      chats:arrayUnion({
        chatId:newChatref.id,
        lastMessage:"",
        receiverId:user.id,
        updateAt:Date.now(),
      })
    })          

    }
    catch(err){
      console.log(err);
      

    }

  }

  return (
    <div className='adduser'>
      <form action='' onSubmit={handelsearch}>
        {/* Fix the name attribute to 'username' */}
        <input type='text' placeholder='UserName' name='username' />
        <button>Search</button>
      </form>

      {/* Display user if found */}
      
      {user && (
        <div className='user'>
          <div className='details'>
            <img src={user.avtar || './avatar.png'} alt='' /> {/* Fixed fallback URL */}
            <span>{user.username}</span>
          </div>
          <button onClick={handeladd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
