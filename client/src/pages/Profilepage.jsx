// import React, { useContext, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import assets from '../assets/assets';
// import { AuthContext } from '../../context/AuthContext';
// import { ChatContext } from '../../context/ChatContext';
// import toast from 'react-hot-toast';
// import Navbar from '../components/navbar.jsx';

// const Profilepage = () => {
//   const { authUser, updateProfile } = useContext(AuthContext);
//   const { getUsers } = useContext(ChatContext); // To refresh sidebar users
//   const [selectedImg, setSelectedImg] = useState(null);
//   const navigate = useNavigate();
//   const [name, setName] = useState(authUser.fullName || '');
//   const [bio, setBio] = useState(authUser.bio || '');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       let base64Image = null;
//       if (selectedImg) {
//         const reader = new FileReader();
//         reader.readAsDataURL(selectedImg);
//         reader.onload = async () => {
//           base64Image = reader.result;
//           await updateProfile({ profilePic: base64Image, fullName: name, bio });
//           getUsers(); // Refresh sidebar user list immediately
//           toast.success('Profile updated successfully!');
//           navigate('/');
//         };
//       } else {
//         await updateProfile({ fullName: name, bio });
//         getUsers(); // Refresh sidebar user list
//         toast.success('Profile updated successfully!');
//         navigate('/');
//       }
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       toast.error('Failed to update profile.');
//     }
//   };

//   return (
//     <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
//       <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        
//         {/* Profile Form */}
//         <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
//           <h3 className='text-lg'>Profile Details</h3>

//           {/* Upload Image */}
//           <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
//             <input
//               onChange={(e) => setSelectedImg(e.target.files[0])}
//               type="file"
//               id='avatar'
//               accept=".png,.jpg,.jpeg"
//               hidden
//             />
//             <img
//               src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic || assets.avatar_icon}
//               alt="avatar"
//               className='w-12 h-12 rounded-full'
//             />
//             Upload profile image
//           </label>

//           {/* Name Input */}
//           <input
//             type="text"
//             required
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder='Your name...'
//             className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'
//           />

//           {/* Bio Input */}
//           <textarea
//             value={bio}
//             onChange={(e) => setBio(e.target.value)}
//             placeholder='Write profile bio...'
//             rows={4}
//             className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'
//           />

//           {/* Save Button */}
//           <button
//             type="submit"
//             className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'
//           >
//             Save
//           </button>
//         </form>

//         {/* Display Current or Selected Image */}
//         <img
//           src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic || assets.avatar_icon}
//           alt="profile"
//           className='max-w-45 aspect-square rounded-full mx-10 max-sm:mt-10'
//         />

//       </div>
//     </div>
//   );
// };

// export default Profilepage;
 

import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import toast from 'react-hot-toast';

const Profilepage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const { getUsers, groups, getGroups } = useContext(ChatContext);
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedGroupImg, setSelectedGroupImg] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [editMode, setEditMode] = useState('user');
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName || '');
  const [bio, setBio] = useState(authUser.bio || '');
  const [groupName, setGroupName] = useState('');
  const [groupBio, setGroupBio] = useState('');

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const initializeGroups = async () => {
      await getGroups();
    };
    initializeGroups();
  }, []);

  useEffect(() => {
    const groupId = searchParams.get('groupId');
    if (groupId && groups.length > 0) {
      const group = groups.find((g) => g._id === groupId);
      if (group) {
        setSelectedGroup(group);
        setGroupName(group.name || '');
        setGroupBio(group.bio || '');
        setEditMode('group');
      }
    }
  }, [searchParams, groups]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode === 'user') {
        let base64Image = null;
        if (selectedImg) {
          const reader = new FileReader();
          reader.readAsDataURL(selectedImg);
          reader.onload = async () => {
            base64Image = reader.result;
            await updateProfile({ profilePic: base64Image, fullName: name, bio });
            getUsers();
            toast.success('Profile updated successfully!');
            navigate('/');
          };
        } else {
          await updateProfile({ fullName: name, bio });
          getUsers();
          toast.success('Profile updated successfully!');
          navigate('/');
        }
      } else if (editMode === 'group' && selectedGroup) {
        let base64GroupImage = null;
        if (selectedGroupImg) {
          const reader = new FileReader();
          reader.readAsDataURL(selectedGroupImg);
          reader.onload = async () => {
            base64GroupImage = reader.result;
            const response = await fetch(`/api/groups/update-profile-pic/${selectedGroup._id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify({ profilePic: base64GroupImage }),
            });
            const data = await response.json();
            if (data.success) {
              toast.success('Group profile picture updated successfully!');
              getGroups();
              setSelectedGroupImg(null);
              setSelectedGroup(null);
              navigate('/');
            } else {
              toast.error(data.message || 'Failed to update group profile picture.');
            }
          };
        } else {
          // If no new group image selected, update name and bio only
          const response = await fetch(`/api/groups/update-details/${selectedGroup._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ name: groupName, bio: groupBio }),
          });
          const data = await response.json();
          if (data.success) {
            toast.success('Group details updated successfully!');
            getGroups();
            setSelectedGroup(null);
            navigate('/');
          } else {
            toast.error(data.message || 'Failed to update group details.');
          }
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen relative overflow-hidden px-110">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[500px] h-[400px] bg-gradient-to-br from-purple-800 to-indigo-900 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-8 text-white">
        <h2 className="text-2xl font-semibold text-center mb-8">Profile details</h2>

        <div className="flex justify-center mb-6 gap-4">
          <button
            className={`px-4 py-2 rounded-full ${editMode === 'user' ? 'bg-purple-600' : 'bg-gray-600'}`}
            onClick={() => setEditMode('user')}
          >
            Edit User Profile
          </button>
          <button
            className={`px-4 py-2 rounded-full ${editMode === 'group' ? 'bg-purple-600' : 'bg-gray-600'}`}
            onClick={() => setEditMode('group')}
          >
            Edit Group Profile
          </button>
        </div>

        {editMode === 'user' ? (
          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1 w-full">
              <label htmlFor="avatar" className="flex flex-col items-center md:items-start gap-2 cursor-pointer">
                <input
                  type="file"
                  id="avatar"
                  accept=".png,.jpg,.jpeg"
                  onChange={(e) => setSelectedImg(e.target.files[0])}
                  hidden
                />
                <img
                  src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic || assets.avatar_icon}
                  alt="avatar"
                  className="w-16 h-16 rounded-full border-2 border-purple-400 shadow-md object-cover"
                />
                <span className="text-sm text-gray-300">upload profile image</span>
              </label>

              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name..."
                className="p-3 w-98 bg-white/10 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              />

              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Hi Everyone, I am Using QuickChat"
                rows={5}
                className="p-3 w-full bg-white/10 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              />

              <button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-violet-600 hover:opacity-90 text-white font-medium py-3 rounded-full shadow-md transition-all duration-300"
              >
                Save
              </button>
            </form>

            <div className="flex-1 flex items-center justify-center">
              <img
                src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic || assets.avatar_icon}
                alt="profile"
                className="w-40 h-40 rounded-full border-4 border-purple-500 shadow-lg object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1 w-full">
              <select
                value={selectedGroup?._id || ''}
                onChange={(e) => {
                  const group = groups.find((g) => g._id === e.target.value);
                  setSelectedGroup(group);
                  setSelectedGroupImg(null);
                  setGroupName(group.name || '');
                  setGroupBio(group.bio || '');
                }}
                className="p-3 w-full bg-white/10 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              >
                <option value="" disabled>
                  Select a group to edit
                </option>
                {groups.map((group) => (
                  <option key={group._id} value={group._id}>
                    {group.name}
                  </option>
                ))}
              </select>

              {selectedGroup && (
                <>
                  <input
                    type="file"
                    id="groupAvatar"
                    accept=".png,.jpg,.jpeg"
                    onChange={(e) => setSelectedGroupImg(e.target.files[0])}
                    hidden
                  />
                  <label htmlFor="groupAvatar" className="flex flex-col items-center md:items-start gap-2 cursor-pointer">
                    <img
                      src={
                        selectedGroupImg
                          ? URL.createObjectURL(selectedGroupImg)
                          : selectedGroup.profilePic || assets.avatar_icon
                      }
                      alt="group avatar"
                      className="w-16 h-16 rounded-full border-2 border-purple-400 shadow-md object-cover"
                    />
                    <span className="text-sm text-gray-300">upload group profile image</span>
                  </label>

                  <input
                    type="text"
                    required
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Group name..."
                    className="p-3 w-98 bg-white/10 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />

                  <textarea
                    value={groupBio}
                    onChange={(e) => setGroupBio(e.target.value)}
                    placeholder="Group bio..."
                    rows={3}
                    className="p-3 w-full bg-white/10 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                  />
                </>
              )}

          <button
            type="submit"
            disabled={!selectedGroup}
            className="bg-gradient-to-r from-purple-500 to-violet-600 hover:opacity-90 text-white font-medium py-3 rounded-full shadow-md transition-all duration-300"
          >
            Save Group Profile
          </button>
            </form>
            {selectedGroup && (
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={selectedGroupImg ? URL.createObjectURL(selectedGroupImg) : selectedGroup?.profilePic || assets.avatar_icon}
                  alt="group profile"
                  className="w-40 h-40 rounded-full border-4 border-purple-500 shadow-lg object-cover"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profilepage;
