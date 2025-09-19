// import React, { useContext } from 'react'
// import { Navigate, Route, Routes } from 'react-router-dom'
// import Layout from './pages/Layout'
// import Homepage from './pages/Homepage'
// import Profilepage from './pages/Profilepage'
// import Loginpage from './pages/Loginpage'
// import {Toaster} from "react-hot-toast"
// import { AuthContext } from '../context/AuthContext'


// const App = () => {
//   const {authUser} = useContext(AuthContext)
//   return (
//     <div className="w-screen h-screen bg-[url('./assets/bgImage.svg')] bg-contain">
//       <Toaster/>
//       <Routes>
//         <Route path='/login' element={!authUser ?  <Loginpage/> :  <Navigate to="/"/>}/>
//         <Route path='/' element={authUser ? <Layout><Homepage /></Layout> : <Navigate to="/login"/>}/>
//         <Route path='/profile' element={authUser ? <Layout><Profilepage /></Layout> : <Navigate to="/login"/>}/>
//       </Routes>
//     </div>
//   )
// }

// export default App

import React, { useContext } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout'
import Homepage from './pages/Homepage'
import Profilepage from './pages/Profilepage'
import Loginpage from './pages/Loginpage'
import { Toaster } from "react-hot-toast"
import { AuthContext } from '../context/AuthContext'

const App = () => {
  const { authUser } = useContext(AuthContext)

  return (
    <BrowserRouter basename="/chat">  {/* ✅ Add basename */}
      <div className="w-screen h-screen bg-[url('./assets/bgImage.svg')] bg-contain">
        <Toaster />
        <Routes>
          <Route 
            path='/login' 
            element={!authUser ? <Loginpage /> : <Navigate to="/" />} 
          />
          <Route 
            path='/' 
            element={authUser ? <Layout><Homepage /></Layout> : <Navigate to="/login" />} 
          />
          <Route 
            path='/profile' 
            element={authUser ? <Layout><Profilepage /></Layout> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
