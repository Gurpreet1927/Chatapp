import React, { useState, useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import toast from "react-hot-toast";

const GroupModal = ({ onClose, onGroupCreated }) => {
  const { users, createGroup } = useContext(ChatContext);
  const [step, setStep] = useState(1); // 1: Select users, 2: Group details
  const [name, setName] = useState("");
  const [selected, setSelected] = useState([]);
  const [profilePic, setProfilePic] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredUsers = users.filter(user =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("Image size should be less than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    if (selected.length === 0) {
      toast.error("Please select at least one member");
      return;
    }
    setStep(2);
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    setIsLoading(true);
    try {
      const success = await createGroup({ name: name.trim(), members: selected, profilePic });
      if (success) {
        toast.success("Group created successfully!");
        if (onGroupCreated) onGroupCreated();
        else onClose();
      } else {
        toast.error("Failed to create group. Please try again.");
      }
    } catch {
      toast.error("An error occurred while creating the group");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-[#282142] rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button
                onClick={handleBack}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ←
              </button>
            )}
            <h2 className="text-lg font-semibold text-white">
              {step === 1 ? "Add Members" : "New Group"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {step === 1 ? (
            // Step 1: Select Users
            <>
              {/* Search */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="w-full p-3 rounded-lg bg-[#1e1b33] text-white placeholder-gray-400 border border-gray-600 focus:border-violet-500 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Selected Count */}
              {selected.length > 0 && (
                <div className="mb-3 text-sm text-gray-300">
                  {selected.length} of {users.length} selected
                </div>
              )}

              {/* Users List */}
              <div className="max-h-64 overflow-y-auto space-y-2">
                {filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1e1b33] cursor-pointer transition-colors"
                    onClick={() => toggleSelect(user._id)}
                  >
                    <div className="relative">
                      <img
                        src={user.profilePic || "https://placehold.co/40x40"}
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {selected.includes(user._id) && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{user.fullName}</p>
                      <p className="text-gray-400 text-sm">
                        {user.email || "No email"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // Step 2: Group Details
            <>
              {/* Group Icon Preview */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <img
                    src={profilePic || "https://placehold.co/80x80"}
                    alt="Group icon"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                  />
                  <label className="absolute bottom-0 right-0 bg-violet-500 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-violet-600 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    📷
                  </label>
                </div>
                <p className="text-gray-400 text-sm">Add group icon</p>
              </div>

              {/* Group Name Input */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Group name"
                  className="w-full p-3 rounded-lg bg-[#1e1b33] text-white placeholder-gray-400 border border-gray-600 focus:border-violet-500 focus:outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={25}
                />
                <p className="text-gray-400 text-xs mt-1">{name.length}/25</p>
              </div>

              {/* Selected Members Preview */}
              <div className="mb-6">
                <p className="text-gray-300 text-sm mb-2">
                  Members ({selected.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selected.slice(0, 5).map((userId) => {
                    const user = users.find(u => u._id === userId);
                    return (
                      <div key={userId} className="flex items-center gap-1 bg-[#1e1b33] px-2 py-1 rounded-full">
                        <img
                          src={user?.profilePic || "https://placehold.co/20x20"}
                          alt={user?.fullName}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span className="text-white text-xs">{user?.fullName}</span>
                      </div>
                    );
                  })}
                  {selected.length > 5 && (
                    <div className="bg-[#1e1b33] px-2 py-1 rounded-full">
                      <span className="text-gray-400 text-xs">+{selected.length - 5} more</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          {step === 1 ? (
            <button
              onClick={handleNext}
              disabled={selected.length === 0}
              className="w-full bg-violet-500 text-white py-3 rounded-lg font-medium disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-violet-600 transition-colors"
            >
              Next ({selected.length})
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={isLoading || !name.trim()}
              className="w-full bg-violet-500 text-white py-3 rounded-lg font-medium disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-violet-600 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                "Create Group"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupModal;
