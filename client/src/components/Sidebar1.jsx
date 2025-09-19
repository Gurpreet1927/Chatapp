import React, { useState, useContext } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const Sidebar1 = () => {
  const {
    users,
    groups,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const { onlineUsers, authUser } = useContext(AuthContext);

  const [input, setInput] = useState("");

  // Filter users by search input
  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName?.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  // Fetching is handled in ChatContext when authUser is set

  return (
    <div
      className={`bg-[#8185B2]/10 h-full min-h-0 p-5  overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
      style={{ maxHeight: 'calc(100vh - 64px)' }}
    >
      {/* Search bar - positioned at top for better UX */}
      <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mb-5">
        <img src={assets.search_icon} alt="Search" className="w-3" />
        <input
          onChange={(e) => setInput(e.target.value)}
          type="text"
          className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
          placeholder="Search User..."
        />
      </div>

      {/* Content */}
      <div className="pb-5">

        {/* Groups List */}
        <div className="mt-5">
          <h3 className="text-xs text-gray-400 uppercase mb-2">Groups</h3>
          {groups?.length === 0 && (
            <p className="text-xs text-gray-500">No groups yet</p>
          )}
          {groups?.map((group) => (
            <div
              key={group._id}
              onClick={() => setSelectedUser({ ...group, isGroup: true })}
              className={`flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
                selectedUser?._id === group._id ? "bg-[#282142]/50" : ""
              }`}
            >
              <img
                src={group.profilePic || assets.avatar_icon}
                alt="group"
                className="w-[35px] aspect-[1/1] rounded-full"
              />
              <div className="flex flex-col leading-5">
                <p>{group.name}</p>
                <span className="text-xs text-gray-400">
                  {group.members.length} members
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Users List */}
        <div className="mt-5">
          <h3 className="text-xs text-gray-400 uppercase mb-2">Users</h3>
          <div className="flex flex-col">
            {filteredUsers?.map((user, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedUser(user);
                  setUnseenMessages((prev) => ({
                    ...prev,
                    [user._id]: 0,
                  }));
                }}
                className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
                  selectedUser?._id === user._id ? "bg-[#282142]/50" : ""
                }`}
              >
                <img
                  src={user?.blockedUsers?.includes(authUser?._id) ? assets.avatar_icon : (user?.profilePic || assets.avatar_icon)}
                  alt="avatar"
                  className="w-[35px] aspect-[1/1] rounded-full"
                />
                <div className="flex flex-col leading-5">
                  <p>{user.fullName}</p>
                  {onlineUsers?.includes(user._id) ? (
                    <span className="text-green-400 text-xs">Online</span>
                  ) : (
                    <span className="text-neutral-400 text-xs">Offline</span>
                  )}
                </div>

                {/* Unseen messages count */}
                {unseenMessages?.[user._id] > 0 && (
                  <span
                    className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center
                    rounded-full bg-violet-500/70 text-white shadow-md"
                  >
                    {unseenMessages[user._id]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar1;

