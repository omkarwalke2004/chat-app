import React from 'react'
import "./details.css"
import { auth, db } from '../../libs/firebase'
import { useChatStore } from '../../libs/chatStore'
import { useUserStore } from '../../libs/userStore'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'

const Details = () => {
  const{chatId,user,isCurrentUserBlocked,isReceiverBlocked,changeBlock}=useChatStore();
  const{currentUser}=useUserStore();

  const handelblock = async () => {
    if (!user) return;
    
    const userDocRef = doc(db, "users", currentUser.id);
    
    try {
      // Toggle block status in Firestore
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
  
      // Toggle the state to reflect the block status in the UI
      changeBlock(); 
    } catch (err) {
      console.log("Error updating block status:", err);
    }
  };
  
  return (
    <div className='details'>
      <div className="user">
       <img src={(isCurrentUserBlocked || isReceiverBlocked) ? "./avatar.png" : (user.avtar || "./avatar.png")} alt="" />
       <h2>{user?.username}</h2>
       <p>the future web devloper.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Setting</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="photos">
           
            <div className="photoitem">
             <div className="photho-details">
             <img src="https://images.pexels.com/photos/28859389/pexels-photo-28859389/free-photo-of-spring-luncheon-table-with-fresh-salad-and-potatoes.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />

            <span>photho_2024_2.png</span>
            
             </div>
            <img src="./download.png" alt="" className='icon' />
            </div>
            <div className="photoitem">
             <div className="photho-details">
             <img src="https://images.pexels.com/photos/28859389/pexels-photo-28859389/free-photo-of-spring-luncheon-table-with-fresh-salad-and-potatoes.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
            <span>photho_2024_2.png</span>
            
             </div>
            <img src="./download.png" alt="" className='icon' />
            </div>
            
          </div>
          
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <button onClick={handelblock}>{isCurrentUserBlocked ? "you are blocked":isReceiverBlocked ? "User Blocked":"Block user"}</button>
        <button className='logout' onClick={()=>auth.signOut()}>Logout</button>
      </div>
    </div>
  )
}

export default Details
