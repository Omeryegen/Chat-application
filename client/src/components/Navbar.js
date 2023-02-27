import React, { useState, useRef } from 'react'
import User from './User'
import { useContext } from 'react'
import { contextProvider } from '../Context'
const Navbar = () => {
    const  {account, addFriend, deleteFriend, allUsers} = useContext(contextProvider)
    const [searchedUsers, setSearchedUsers] = useState([])
    const getSingleUser = async(e) =>{
        if(e.target.value.length > 1){
            const filtered = allUsers.filter((element) => {
                if(element.email !== account.email &&  element.userName.includes(e.target.value)) return element
            })
            console.log(filtered)
            setSearchedUsers(filtered)
        }else{
            setSearchedUsers([])
        }
        
    }

  return (
    account &&
    <div className='navbar'>
        <div className='search-box'>
            <input onChange={getSingleUser}   type="text"/>
            <div className='searched-users'>   
            {
                searchedUsers.length > 0 && searchedUsers.map(user => <User  
                    key={user.userName}
                    handle={account.friends.includes(user.email) ? deleteFriend : addFriend} 
                    user={user}
                    message={account.friends.includes(user.email) ? "Delete Friend" : "Add Friend"}
                    />) 
            } 
            </div> 
        </div>
           
    </div>
  )
}

export default Navbar