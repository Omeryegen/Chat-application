import React, { useState } from 'react'
import { useEffect } from 'react'
import { contextProvider } from '../Context';
import { useContext } from 'react';
import ReactLoading from 'react-loading';

const nameUpperCase = (str) =>{
    const arr = str.split(" ");
    for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    const str2 = arr.join(" ");
    return str2
}
function Friend({ friend }) {
    const {getSingleChat, reciever} = useContext(contextProvider)
    console.log("hey")
    const[data, setData] = useState(false)

    
    const getFriends = async() =>{
        const response = await fetch(`http://localhost:8000/account/${friend}`)
        const json = await response.json()
        json[0].userName = nameUpperCase(json[0].userName)
        setData(json[0])
    }
    useEffect(()=>{
        getFriends()
    }, [])
    console.log(reciever)

  if(data){
    return (
      <div style={{backgroundColor: reciever === data.email ? "#333" : "black"}} className='friend'>      
                  <img alt='friend.name' src={data.profileImg }/>
                  <p style={{color: "white"}}>{data.userName}</p>
                  <i className='fa-regular fa-paper-plane' onClick={() =>{ getSingleChat(data.email)}}> </i>
      </div>
    )
  }else{
   return (
    <ReactLoading type={"cylon"} color={"white"} height={'20%'} width={'20%'} />
   )
    
  }
 
}

export default Friend