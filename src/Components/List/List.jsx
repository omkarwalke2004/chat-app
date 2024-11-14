import React from 'react'
import "./List.css"
import UserInfo from './userInfo/userInfo'
import Chatlist from './chatlist/chatlist'

const List = () => {
  return (
    <div className='list'>
      <UserInfo/>
      <Chatlist/>
    </div>
  )
}

export default List
