import React, { useContext, useEffect, useState } from 'react'
import Friend from './Friend';
import { useCookies } from 'react-cookie';
import { contextProvider } from '../Context';
const nameUpperCase = (str) =>{
  const arr = str.split(" ");
  for (var i = 0; i < arr.length; i++) {
  arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  const str2 = arr.join(" ");
  return str2
}
function SideBar() {
    const {account} = useContext(contextProvider) 
    
    const[cookies, setCookie, removeCookie] = useCookies(null)

   
    const logOut = (e) =>{
        e.preventDefault()
        removeCookie('Email')
        removeCookie('Token')
        window.location.reload()
    }
  
  return (
    <div className='sidebar'>
            <h2>My Friends</h2>
            {account.friends && account.friends.map(friend => <Friend key={friend} friend={friend}/>)}
            <form className='sidebar-form'>
                <button onClick={logOut}>Log Out</button>
            </form>
    </div>
  )
}

export default SideBar