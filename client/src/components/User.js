import React from 'react'

const nameUpperCase = (str) =>{
    const arr = str.split(" ");
    for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    const str2 = arr.join(" ");
    return str2
}
function User({user, handle, message}) {
  
  return (
    <div className='single-user'>
        <img alt={user.email} src={user.profileImg}/>
        <p>{nameUpperCase(user.userName)}</p>
        <button onClick={() => handle(user)}>{message}</button>
    </div>
  )
}

export default User