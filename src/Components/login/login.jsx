import React, { useState } from 'react';
import './login.css';
import { MdUpload } from 'react-icons/md';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../libs/firebase';
import { doc, setDoc } from "firebase/firestore"; 
import upload from '../../libs/Upload';
import { query, collection, where, getDocs } from "firebase/firestore"; // Import these from Firestore



const Login = () => {
  const [avtar, setavtar] = useState({
    file: null,
    url: '',
  });
  const[loading,setloading] = useState(false);


  const handelAvatar = (e) => {
    if (e.target.files[0]) {
      setavtar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handelRegister = async (e) => {
    setloading(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);
  
    try {
      // Check if the username is already in use
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        toast.error("Username already taken. Please choose another one.");
        setloading(false);
        return;
      }
  
      // Proceed with user registration if the username is unique
      const res = await createUserWithEmailAndPassword(auth, email, password);
  
      const imgUrl = await upload(avtar.file);
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avtar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });
  
      await setDoc(doc(db, "userschats", res.user.uid), {
        chats: [],
      });
  
      toast.success("Account created!", {
        style: { color: 'black' }, // White text with dark background
      });
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setloading(false);
    }
  };
  const handellogin =async (e) => {
    e.preventDefault()
    setloading(true)
    const formData = new FormData(e.target)
    const{email,password} = Object.fromEntries(formData);
    try{
        await signInWithEmailAndPassword(auth,email,password)
        toast.success("Logged In!", {
            style: { color: 'black' }, // White text with dark background
          });

    }
    catch(err){
        console.log(err)
        toast.error(err.message)
        

    }
    finally{
        setloading(false)
    }

  };

  

  return (
    <div className="login">
      <div className="item2">
        <h2>Welcome back,</h2>
        <form action="" onSubmit={handellogin}>
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={loading}>{loading ? "loading":"Sign In"}</button>
        </form>
      </div>

      <div className="seprator"></div>

      <div className="item2">
        <h2>Create an Account</h2>
        <form action="" onSubmit={handelRegister}>
          <label htmlFor="file">
            <img src={avtar.url || './avatar.png'} alt="Avatar" />
            <MdUpload size={30} />
            Upload an Image
          </label>
          <input type="file" id="file" style={{ display: 'none' }} onChange={handelAvatar} />

          {/* Change name to 'username' */}
          <input type="text" placeholder="UserName" name="username" />

          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={loading}>{loading ? "loading":"Sign Up"}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
