import {createContext} from 'react'
import { useState } from 'react'
import {useCookies} from 'react-cookie'
import { useEffect } from 'react'
export const contextProvider = createContext()
const nameUpperCase = (str) =>{
    const arr = str.split(" ");
    for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    const str2 = arr.join(" ");
    return str2
}

export  function Context({children}) {
    const[cookies, setCookie, removeCookie] = useCookies(null)
    const[account, setAccount] = useState(false)
    const[reciever, setReciever] = useState(null)
    const[chat,setChat] = useState(null)
    const[allUsers, setAllUsers] = useState([])
    const [friends, setFriends] = useState([])
    const authToken = cookies.Token
    const currentEmail = cookies.Email

  
    const getUser = async () =>{
        const response = await fetch(`http://localhost:8000/account/${currentEmail}`)
        const data = await response.json()
        setAccount(data[0])
      }
    const getAll = async ()=>{
        const response = await fetch(`http://localhost:8000/users`)
        const data = await response.json()
        setAllUsers(data)
    }

    const getSingleChat = async (email) =>{
        const response = await fetch(`http://localhost:8000/singleChat`, {
          method: "POST",
          headers: {"Content-Type": "Application/json"},
          body: JSON.stringify({
            friendEmail: email,
            userEmail: currentEmail
          })
        })
        const data = await response.json()
        setChat({data:data, rcv: email})
        setReciever(email)
        getUser()
      }
      const sendMessage = async ( message, to) =>{
        const response = await fetch(`http://localhost:8000/message`, {
          method: "POST",
          headers: {"Content-Type": "Application/json"},
          body: JSON.stringify({
            friendEmail: to,
            userEmail: currentEmail,
            message: message
          })
        })
        
        getSingleChat(to)
      }
      const createChat = async (friend) =>{
        if(currentEmail !== friend.email){
          const response = await fetch(`http://localhost:8000/chat`, {
            method: "POST",
            headers: {"Content-Type": "Application/json"},
            body: JSON.stringify({
              friendEmail: friend.email,
              userEmail: currentEmail
            })
          })
        
          getUser()
        }
      }
      const deleteChat = async (friend) =>{
        console.log('delete')
        if(currentEmail !== friend.email){
          const response = await fetch(`http://localhost:8000/chat`, {
            method: "DELETE",
            headers: {"Content-Type": "Application/json"},
            body: JSON.stringify({
              friendEmail: friend.email,
              userEmail: currentEmail
            })
          })
         
          getUser()
        }
      }
    
      const addFriend = async (friend) =>{
        if(currentEmail !== friend.email){
          const response = await fetch(`http://localhost:8000/friend`, {
            method: "POST",
            headers: {"Content-Type": "Application/json"},
            body: JSON.stringify({
              friendEmail: friend.email,
              userEmail: currentEmail
            })
          })
          getUser()
          createChat(friend)
        }
      }
      const deleteFriend = async (friend) =>{
        if(currentEmail !== friend.email){
          const response = await fetch(`http://localhost:8000/friend`, {
            method: "DELETE",
            headers: {"Content-Type": "Application/json"},
            body: JSON.stringify({
              friendEmail: friend.email,
              userEmail: currentEmail
            })
          })
          getUser()
          deleteChat(friend)
          setChat(null)
        }
      }

      useEffect(()=>{
        if(authToken){
            getAll()
          getUser()
          
        }
      }, [authToken])
      
  return (
    <contextProvider.Provider value={{
        cookies,
        account,
        reciever,
        chat,
        authToken,
        currentEmail,
        getUser,
        deleteFriend,
        getSingleChat,
        addFriend,
        sendMessage,
        allUsers,
        friends
    }}>
        {
            children
        }
    </contextProvider.Provider>
    
  )
}
