import logo from './logo.svg';
import './App.css';
import React,{useRef, useState} from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/analytics';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {useAuthState, useSignInWithGoogle} from 'react-firebase-hooks/auth';

firebase.initializeApp({
  apiKey: "AIzaSyArP3gtOdQgoSw78cZM3l2MPbMdBRi04h8",
  authDomain: "chatapp-d5982.firebaseapp.com",
  projectId: "chatapp-d5982",
  databaseURL: "https:/chatapp-d5982.firebaseio.com",
  storageBucket: "chatapp-d5982.appspot.com",
  messagingSenderId: "530327799179",
  appId: "1:530327799179:web:200f232bdede4f8f359b8e",
  measurementId: "G-JC910Q7D1X"
})

const auth=firebase.auth();
const firestore=firebase.firestore();

function App() {

  const[user]=useAuthState(auth);
  
  return (
    <div className="App">
      <header>
        <h2>HI there!! </h2>
        <SignOut />
      </header>
      <div className='blanktop'>
        <hr color='red' />
        </div>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
      <div className='blank'>
        <hr color='red' />
      </div>
    </div> 
    
  );
}

function SignIn(){
  const SignInWithGoogle=()=>{
    const provider= new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
    return(
      <>
      <button className='sign-in' onClick={SignInWithGoogle}>Sign In</button>
      <p>So what's on your Mind Today!!!</p>
      </>
    );
      
}

function SignOut(){
  
  return auth.currentUser && (
    <button className='sign-out' onClick={() => auth.signOut()}>Sign Out</button>
  );
}

function ChatRoom(){
  const dummy= useRef();
  const messagepersonalRef= firestore.collection('messagepersonal');
  const query=messagepersonalRef.orderBy('createdAt').limit(1500);
  const [messagepersonal]= useCollectionData(query, {idField : 'id'});
  const [formValue,setFormValue] =useState('');
  const sendMessage= async(e)=>{
    e.preventDefault();
    const {uid,photoURL}=auth.currentUser;

    await messagepersonalRef.add({
      text : formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('');
    // dummy.current.scrollIntoView({behavior:'smooth'});
  }

return(
  <>
  
    {messagepersonal && messagepersonal.map(msg => <ChatMessage key ={msg.id} message={msg} />)}
    
    <form className='mar' onSubmit={sendMessage}>
      <input value={formValue} onChange={(e)=> setFormValue(e.target.value)} placeholder="Write Something..." />
      <button type="submit" disabled={!formValue}>Go</button>
    </form>
  </>
)
}

function ChatMessage(props){

  const {text,uid,photoURL}=props.message;

  const messageClass =() => uid === auth.currentUser.uid ? 'sent' :'received';
  

    return(<>
    
      {/* <div className={"message"} > */}
        <div className={messageClass()}>
      
      <img src={photoURL} alt='Profile'/>
      <p>{text}</p>
      </div>
      
      {/* </div> */}
      
      </>
    )

}

export default App;
