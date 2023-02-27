import React from 'react'
import { useState } from 'react'
import { useCookies } from 'react-cookie'
import { useContext } from 'react'
import { contextProvider } from '../Context'
function Modal() {
    const {account, reciever, sendMessage, chat} = useContext(contextProvider)
    const[cookies, setCookie, removeCookie] = useCookies(null)
    const[text, setText] = useState("")
    
    const handleChange = (e) =>{
        setText(e.target.value)
    }
  return (
    <div className='showcase-modal'>
        
        <div className='chatbar'>
        {
            chat.data.chat.map(element => <p className={element.email === account.email ? "me" : "sender"} >{element.message}</p>)
        }
        </div>
       <div className='input-group'>
        <input value={text} onChange={handleChange} type="text"/>
        <button onClick={()=> sendMessage(text, chat.rcv)}> <i className='fa-regular fa-paper-plane'> </i></button>
       </div>
        
    </div>
  )
}

export default Modal