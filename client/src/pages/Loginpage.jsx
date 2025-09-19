import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const Loginpage = () => {
    const[currState,setCurrState] = useState("Sign up")
    const[fullName,setFullName] = useState("")
    const[email,setEmail] = useState("")
    const[password,setPassword] = useState("")
    const[bio,setBio] = useState("")
    const[isDataSubmitted,setIsDataSubmitted] = useState(false);
    const[loading,setLoading] = useState(false);

    const {login} = useContext(AuthContext)

    const onSubmitHandler = async (event) =>
    {
        event.preventDefault();
        if(currState === "Sign up" && !isDataSubmitted)
        {
            setIsDataSubmitted(true)
            return;
        }
        setLoading(true);
        try {
            await login(currState === "Sign up" ? 'signup' : 'login', {fullName, email, password,bio})
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            // Error is handled by AuthContext with toast
        } finally {
            setLoading(false);
        }
    }


  return (

    <div className='min-h-screen bg-cover bg-center flex items-center justify-content gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
        <img src={assets.logo_big} alt="Logo"
        className='w-[min(30vw,250px)]' />
        <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-content items-center'>{currState}
            {isDataSubmitted && <img onClick={()=> setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer'/>}

             </h2>
            {currState === "Sign up" && !isDataSubmitted && (
                       <input  onChange={(e)=>setFullName(e.target.value) } value={fullName}
                       type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='Full Name' required/>
        )}

        {!isDataSubmitted &&(
            <>
            <input onChange={(e)=>setEmail(e.target.value) } value={email}
             type="email" placeholder='Email Address' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />
               <input onChange={(e)=>setPassword(e.target.value) } value={password}
             type="password" placeholder='Password..' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />

            </>
        )}


        {
            currState === "Sign up" && isDataSubmitted &&(
                <textarea onChange={(e)=>setBio(e.target.value)} value={bio}
                rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Provide a short bio.....' required></textarea>
            )
        }


        <button type='submit' disabled={loading}
        className={`py-3 bg-gradient-to-r from-blue-400 to-purple-600 text-white rounded-md cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {loading ? (currState === "Sign up"? "Creating Account..." : "Logging in...") : (currState === "Sign up"? "Create Account" : "Login Now")}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
            <input type="checkbox" required />
            <p>Agree to term of use & privacy policy.</p>
        </div>

        <div>
            {currState==="Sign up" ? (
                <p className='text-sm text-gary-500 cursor-pointer'>Already have an account? <span
                    onClick={()=>{setCurrState("Login"); setIsDataSubmitted(false)}}
                    className='font-medium text-violet-500 cursor-pointer'>
                    Login Here
                    </span></p>
            )
        :(
            <p className='text-sm text-gray-500 cursor-pointer'>Create an account <span onClick={()=>setCurrState("Sign up")} className='font-medium text-blue-500 cursor-pointer'>Click here</span></p>
        )}
        </div>
        </form>

    </div>
  )
}

export default Loginpage
