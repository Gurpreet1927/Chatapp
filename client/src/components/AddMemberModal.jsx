import React, { useContext, useState, useEffect } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import assets from '../assets/assets';

const AddMemberModal = ({ group, onClose }) => {
  const { users, addMember } = useContext(ChatContext);
  const { authUser } = useContext(AuthContext);
  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => {
    // Filter users who are not already members and not the current user
    const filtered = users.filter(user =>
      !group.members.some(member => member._id === user._id) &&
      user._id !== authUser._id
    );
    setAvailableUsers(filtered);
  }, [users, group.members, authUser._id]);

  const handleAddMember = async (memberId) => {
    const success = await addMember(group._id, memberId);
    if (success) {
      onClose(); // Close modal after adding
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#282142] text-white p-6 rounded-lg w-96 max-h-96 overflow-y-scroll border border-gray-600">
        <h2 className="text-lg font-semibold mb-4 text-center">Add Member to {group.name}</h2>
        <div className="space-y-2">
          {availableUsers.length === 0 ? (
            <p className="text-gray-400 text-center">No available users to add.</p>
          ) : (
            availableUsers.map(user => (
              <div key={user._id} className="flex items-center justify-between p-3 bg-[#1a1a2e] rounded-lg border border-gray-500">
                <div className="flex items-center gap-3">
                  <img src={user.profilePic || assets.avatar_icon} alt="" className="w-10 h-10 rounded-full" />
                  <span className="text-sm">{user.fullName}</span>
                </div>
                <button
                  onClick={() => handleAddMember(user._id)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-xs font-medium hover:opacity-90 transition"
                >
                  Add
                </button>
              </div>
            ))
          )}
        </div>
        <button onClick={onClose} className="mt-4 w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-2 rounded-full text-sm font-medium hover:opacity-90 transition">
          Close
        </button>
      </div>
    </div>
  );
};

export default AddMemberModal;
