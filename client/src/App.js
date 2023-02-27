import Auth from './components/Auth'
import Navbar from './components/Navbar'

import { useEffect } from 'react';
import SideBar from './components/Sidebar';
import Modal from './components/Modal';
import { useContext } from 'react';
import { contextProvider } from './Context';

function App() {
  const {  authToken, chat } = useContext(contextProvider)
  
 
  console.log("ji")
 
  return (
    <>
        {!authToken && <Auth/>}
        {
          authToken && <>
            <Navbar/> 
            <div className='showcase'>
            <SideBar/> 
            {
            chat && <Modal/>
            }
            </div>
          </>
        }
       
    </>
      
    
  );
}

export default App;
