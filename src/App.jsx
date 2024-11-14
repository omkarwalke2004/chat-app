import React, { useEffect } from 'react'
import List from './Components/List/List'
import Chat from './Components/chat/chat'
import Details from './Components/details/details'
import Login from './Components/login/login'
import Notification from './Components/notifications/notification'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './libs/firebase'
import { useUserStore } from './libs/userStore'
import { useChatStore } from './libs/chatStore'
  
const App = () => {
  const {currentUser,isLoading,fetchuserInfo} = useUserStore();
  const {chatId} = useChatStore();


  useEffect(()=>{
 const unsub = onAuthStateChanged(auth,(user)=>{
  fetchuserInfo(user?.uid)  
 })
 return ()=>{
  unsub();
 }

  },[fetchuserInfo]);
  console.log(currentUser);
  
  if(isLoading){
    return <div className='loading'>Loading...</div>
  }
  return (
    <div className='container'>
      {currentUser? (<>
        <List/>
     {chatId && <Chat/>}
      {chatId && <Details/>}  
      </>):<Login/> }
     <Notification/>
      
    </div>
  )
}

export default App
