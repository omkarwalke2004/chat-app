import React from 'react'
import "./notification.css"

import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Notification = () => {
  return (
    <div className=''>
       <ToastContainer 
       className="Toastify__toast-body"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        color="black"
      />
    </div>
  )
}

export default Notification
