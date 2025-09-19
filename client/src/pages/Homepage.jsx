

import React from 'react'
import Sidebar from '../components/Sidebar1.jsx'
import ChatContainer from '../components/Chat.jsx'
import Rightsidbar from '../components/Rightsidbar.jsx'
import { useContext } from 'react'
import { ChatContext } from '../../context/ChatContext.jsx'
const Homepage = () => {
  
    const {selectedUser} = useContext(ChatContext);


  return (
    <div className="w-full px-0 bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] custom-bg">
      <div className={ `backdrop-blur-xl border border-gray-700/50 rounded-3xl min-h-0 h-full grid grid-cols-1 relative shadow-2xl shadow-purple-500/20 ${ selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`}>

        <Sidebar />
        <ChatContainer/>
        <Rightsidbar/>

      </div>
    </div>
  )
}

export default Homepage
