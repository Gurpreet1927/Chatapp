import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import assets from "../assets/assets"; // logo, icons
import GroupModal from "./GroupModal.jsx"; // Import GroupModal component

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { getGroups } = useContext(ChatContext);

  const [showMenu, setShowMenu] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);

  // ✅ Create group handler
  const handleCreateGroup = async () => {
    setShowGroupModal(true);
  };

  const onGroupCreated = async () => {
    await getGroups();
    setShowGroupModal(false);
  };

  return (
    <nav className="flex justify-between items-center px-5 py-3 bg-gradient-to-r from-[#282142] to-[#3a2a5a] shadow-lg shadow-purple-500/20 border-b border-gray-700/50">
      {/* Left: Logo */}
      <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
        <img src={assets.logo} alt="logo" className="h-8 w-auto" />
      </div>

      {/* Right: Menu */}
      <div className="relative">
        {/* Menu icon */}
        <img
          src={assets.menu_icon}
          alt="Menu"
          className="h-6 w-6 cursor-pointer select-none"
          onClick={() => setShowMenu((prev) => !prev)}
        />

        {/* Dropdown */}
        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-[#1e1b33] text-white rounded-xl shadow-lg border border-gray-700 z-20">
            <ul className="flex flex-col">
              {/* Edit Profile */}
              <li
                onClick={() => {
                  setShowMenu(false);
                  navigate("/profile");
                }}
                className="px-4 py-2 hover:bg-[#322b56] cursor-pointer"
              >
                ✏️ Edit Profile
              </li>

              {/* Create Group */}
              <li
                onClick={() => {
                  setShowMenu(false);
                  handleCreateGroup();
                }}
                className="px-4 py-2 hover:bg-[#322b56] cursor-pointer"
              >
                ➕ Create Group
              </li>

              {/* Logout */}
              <li
                onClick={() => {
                  setShowMenu(false);
                  logout();
                }}
                className="px-4 py-2 hover:bg-red-600 cursor-pointer rounded-b-xl"
              >
                🚪 Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Group Modal */}
      {showGroupModal && <GroupModal onClose={() => setShowGroupModal(false)} onGroupCreated={onGroupCreated} />}
    </nav>
  );
};

export default Navbar;
