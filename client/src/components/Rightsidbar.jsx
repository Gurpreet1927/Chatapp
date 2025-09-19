import React from 'react'
import assets from '../assets/assets'
import { useContext } from 'react'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import { useState } from 'react'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import AddMemberModal from './AddMemberModal'

const Rightsidbar = () => {
  const {selectedUser, messages, leaveGroup, deleteGroup, removeMember, deleteChatWithUser, deleteUserFromList} = useContext(ChatContext)
  const {logout, onlineUsers, blockUser, unblockUser, blockedUsers, authUser} = useContext(AuthContext)
  const [msgImages, setMsgImages] = useState([]);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const navigate = useNavigate();
  
  useEffect(()=>{
    setMsgImages(
      messages.filter(msg => msg.image).map(msg=> msg.image)
      )
    
  },[messages])
  return selectedUser&&(
    <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-x-auto overflow-y-scroll ${selectedUser ? "max-md:hidden" : " "}`}>
      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto px-4 min-w-[320px]'>
        <img src={selectedUser ?.profilePic || assets.avatar_icon} alt="" className='w-16 sm:w-20 md:w-24 aspect-[1/1] rounded-full cursor-pointer' onClick={() => window.open(selectedUser?.profilePic || assets.avatar_icon)} />
        <h1 className='px-4 sm:px-8 md:px-10 text-lg sm:text-xl font-medium mx-auto flex items-center gap-2 text-center'>
         {onlineUsers.includes(selectedUser._id) && <p className='w-2 h-2 rounded-full bg-green-500'></p> }
          {selectedUser.name || selectedUser.fullName}
          </h1>
          <p className='px-4 sm:px-8 md:px-10 mx-auto text-center'>{selectedUser.bio || ''}</p>
          {selectedUser.members && selectedUser.createdBy && (
            <p className='px-4 sm:px-8 md:px-10 mx-auto text-center'>Created by: {selectedUser.createdBy.fullName}</p>
          )}
      {!selectedUser.members && (
        <>
          <button
            onClick={async () => {
              if (blockedUsers.some(user => user._id === selectedUser._id)) {
                // User is blocked, so unblock
                const confirmed = window.confirm(`Unblock user ${selectedUser.fullName || selectedUser.name}?`);
                if (!confirmed) return;
                const success = await unblockUser(selectedUser._id);
                if (!success) {
                  toast.error("Failed to unblock user");
                }
              } else {
                // User is not blocked, so block
                const confirmed = window.confirm(`Block user ${selectedUser.fullName || selectedUser.name}?`);
                if (!confirmed) return;
                const success = await blockUser(selectedUser._id);
                if (!success) {
                  toast.error("Failed to block user");
                }
              }
            }}
            className={`mt-2 py-1 px-2 sm:px-4 rounded-full text-xs sm:text-xs text-white ${
              blockedUsers.some(user => user._id === selectedUser._id)
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {blockedUsers.some(user => user._id === selectedUser._id) ? "Unblock" : "Block"}
          </button>

          <button
            onClick={async () => {
              const confirmed = window.confirm(`Delete chat with ${selectedUser.fullName || selectedUser.name}? This will delete all messages.`);
              if (!confirmed) return;
              await deleteChatWithUser(selectedUser._id);
            }}
            className="mt-2 py-1 px-2 sm:px-4 rounded-full text-xs sm:text-xs text-white bg-orange-600 hover:bg-orange-700"
          >
            Delete Chat
          </button>

          <button
            onClick={async () => {
              const confirmed = window.confirm(`Delete user ${selectedUser.fullName || selectedUser.name}? This will remove the user from your list.`);
              if (!confirmed) return;
              await deleteUserFromList(selectedUser._id);
            }}
            className="mt-2 py-1 px-2 sm:px-4 rounded-full text-xs sm:text-xs text-white bg-red-600 hover:bg-red-700"
          >
            Delete User
          </button>
        </>
      )}

      {/* New Edit Profile Button for Group */}
      {selectedUser.members && (
        <>
          <button
            onClick={() => {
              // Navigate to group profile edit page or open modal
              navigate('/profile?groupId=' + selectedUser._id);
            }}
            className="mt-4 w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white py-2 rounded-full text-xs sm:text-sm font-medium hover:opacity-90 transition"
          >
            Edit Profile
          </button>

          <button
            onClick={() => setShowAddMemberModal(true)}
            className="mt-2 w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-full text-xs sm:text-sm font-medium hover:opacity-90 transition"
          >
            Add Member
          </button>

          <button
            onClick={async () => {
              const confirmed = window.confirm(`Are you sure you want to leave the group "${selectedUser.name}"?`);
              if (!confirmed) return;
              await leaveGroup(selectedUser._id);
            }}
            className="mt-2 w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-full text-xs sm:text-sm font-medium hover:opacity-90 transition"
          >
            Exit Group
          </button>

          {authUser && selectedUser.createdBy._id.toString() === authUser._id && (
            <button
              onClick={async () => {
                const confirmed = window.confirm(`Are you sure you want to delete the group "${selectedUser.name}"? This action cannot be undone.`);
                if (!confirmed) return;
                await deleteGroup(selectedUser._id);
              }}
              className="mt-2 w-full bg-gradient-to-r from-red-700 to-red-800 text-white py-2 rounded-full text-xs sm:text-sm font-medium hover:opacity-90 transition"
            >
              Delete Group
            </button>
          )}
        </>
      )}
      </div>
      <hr className="border-[#ffffff50] my-4"/>

      {selectedUser.members && (
        <div className='px-5 text-xs'>
          <p>Members</p>
          <div className='mt-2 max-h-[200px] overflow-y-scroll'>
            {selectedUser.members.map((member, index) => (
              <div key={index} className='flex items-center gap-2 mb-2'>
                <img src={member.profilePic || assets.avatar_icon} alt="" className='w-6 h-6 rounded-full' />
                <span>{member.fullName}</span>
                {authUser && selectedUser.createdBy && selectedUser.createdBy._id.toString() === authUser._id && member._id !== authUser._id && (
                  <button
                    onClick={async () => {
                      const confirmed = window.confirm(`Remove ${member.fullName} from the group?`);
                      if (!confirmed) return;
                      const success = await removeMember(selectedUser._id, member._id);
                      if (!success) {
                        toast.error("Failed to remove member");
                      }
                    }}
                    className="ml-auto text-red-500 hover:text-red-700 text-xs"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <hr className="border-[#ffffff50] my-4"/>

      <div className='px-5 text-xs'>
        <p>Media</p>
        <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-80'>
          {msgImages.map((url,index)=>(
            <div key={index} onClick={()=> window.open(url)} className='cursor-pointer rounded'>
              <img src={url} alt=""  className='h-full rounded-md'/>
            </div>
          ))}
        </div>

      </div>


      {showAddMemberModal && <AddMemberModal group={selectedUser} onClose={() => setShowAddMemberModal(false)} />}
      <div className='px-5 mt-4'>
        <button onClick={()=>logout()} className='w-full bg-gradient-to-r from-blue-400 to-purple-600 text-white border-none text-xs sm:text-sm font-light py-2 px-10 sm:px-20 rounded-full cursor-pointer'>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Rightsidbar
