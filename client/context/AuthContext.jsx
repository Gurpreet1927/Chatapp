// /* eslint-disable react-refresh/only-export-components */
// import { createContext, useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { io } from "socket.io-client";

// const backendUrl = import.meta.env.VITE_BACKEND_URL;
// axios.defaults.baseURL = backendUrl;

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [authUser, setAuthUser] = useState(null);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [socket, setSocket] = useState(null);
//   const [blockedUsers, setBlockedUsers] = useState([]);

// useEffect(() => {
//   if (token) {
//     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     checkAuth();
//   }
// }, [token]);


//   const checkAuth = async () => {
//     try {
//       const { data } = await axios.get("/api/auth/check", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (data.success) {
//         setAuthUser(data.user);
//         connectSocket(data.user);
//         fetchBlockedUsers();
//       } else {
//         // If not success, clear token
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         setToken(null);
//         setAuthUser(null);
//         delete axios.defaults.headers.common["Authorization"];
//       }
//     } catch {
//       // If error, clear token
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       setToken(null);
//       setAuthUser(null);
//       delete axios.defaults.headers.common["Authorization"];
//       // Don't show error toast for checkAuth failure
//     }
//   };

//   const fetchBlockedUsers = async () => {
//     try {
//       const { data } = await axios.get("/api/auth/blocked-users", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       if (data.success) {
//         setBlockedUsers(data.blockedUsers);
//       }
//     } catch (error) {
//       console.error("Failed to fetch blocked users:", error);
//     }
//   };

//   const login = async (state, credentials) => {
//     try {
//       const { data } = await axios.post(`/api/auth/${state}`, credentials);
//       if (data.success) {
//         setAuthUser(data.userData);

//         // Save token
//         axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
//         setToken(data.token);
//         localStorage.setItem("token", data.token);

//          localStorage.setItem("user", JSON.stringify(data.userData));

//         connectSocket(data.userData);
//         toast.success(data.message);
//       } else {
//         toast.error(data.message || "Login failed");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setToken(null);
//     setAuthUser(null);
//     setOnlineUsers([]);
//     delete axios.defaults.headers.common["Authorization"];
//     if (socket) socket.disconnect();
//     toast.success("Logged out successfully");
//   };

//   const updateProfile = async (profileData) => {
//   try {
//     const { data } = await axios.put("/api/auth/update-profile", profileData, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     });

//     if (data.success) {
//       setAuthUser(data.user);

//       // persist updated user
//       localStorage.setItem("user", JSON.stringify(data.user));

//       toast.success("Profile updated successfully!");
//       return true;
//     } else {
//       toast.error(data.message || "Update failed");
//       return false;
//     }
//   } catch (err) {
//     console.error("Profile update failed:", err);
//     toast.error(err.response?.data?.message || err.message);
//     return false;
//   }
// };

//   const connectSocket = (userData) => {
//     if (!userData || socket?.connected) return;
//     const newSocket = io(backendUrl, { query: { userId: userData._id } });
//     newSocket.connect();
//     setSocket(newSocket);

//     newSocket.on("getOnlineUsers", (userIds) => {
//       setOnlineUsers(userIds);
//     });
//   };

//   useEffect(() => {
//     if (token) {
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       checkAuth();
//     }
//   }, [token]);

//   const blockUser = async (userId) => {
//     try {
//       const { data } = await axios.put(`/api/auth/block-user/${userId}`, null, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       if (data.success) {
//         toast.success(data.message);
//         setBlockedUsers(prev => [...prev, { _id: userId }]); // Add to blocked list
//         return true;
//       } else {
//         toast.error(data.message || "Failed to block user");
//         return false;
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//       return false;
//     }
//   };

//   const unblockUser = async (userId) => {
//     try {
//       const { data } = await axios.put(`/api/auth/unblock-user/${userId}`, null, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       if (data.success) {
//         toast.success(data.message);
//         setBlockedUsers(prev => prev.filter(user => user._id !== userId)); // Remove from blocked list
//         return true;
//       } else {
//         toast.error(data.message || "Failed to unblock user");
//         return false;
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//       return false;
//     }
//   };

//   const value = {
//     axios,
//     authUser,
//     onlineUsers,
//     socket,
//     login,
//     logout,
//     updateProfile,
//     blockUser,
//     unblockUser,
//     blockedUsers,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };


import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState([]);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      checkAuth();
    } else {
      // clear auth state if no token
      setAuthUser(null);
      setOnlineUsers([]);
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      delete axios.defaults.headers.common["Authorization"];
    }
    // Clean up socket on token/user change
    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [token]);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");

      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
        fetchBlockedUsers();
      } else {
        // If not success, clear token and auth state
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setAuthUser(null);
        delete axios.defaults.headers.common["Authorization"];
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setAuthUser(null);
      delete axios.defaults.headers.common["Authorization"];
      // No toast here for silent failure
    }
  };

  const fetchBlockedUsers = async () => {
    try {
      const { data } = await axios.get("/api/auth/blocked-users");
      if (data.success) {
        setBlockedUsers(data.blockedUsers);
      }
    } catch (error) {
      console.error("Failed to fetch blocked users:", error);
    }
  };

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.userData);

        // Save token
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        setToken(data.token);
        localStorage.setItem("token", data.token);

        localStorage.setItem("user", JSON.stringify(data.userData));

        connectSocket(data.userData);
        toast.success(data.message);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    delete axios.defaults.headers.common["Authorization"];
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    toast.success("Logged out successfully");
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", profileData);

      if (data.success) {
        setAuthUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Profile updated successfully!");
        return true;
      } else {
        toast.error(data.message || "Update failed");
        return false;
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      toast.error(err.response?.data?.message || err.message);
      return false;
    }
  };

  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, { query: { userId: userData._id } });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  const blockUser = async (userId) => {
    try {
      const { data } = await axios.put(`/api/auth/block-user/${userId}`);
      if (data.success) {
        toast.success(data.message);
        setBlockedUsers((prev) => [...prev, { _id: userId }]);
        return true;
      } else {
        toast.error(data.message || "Failed to block user");
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return false;
    }
  };

  const unblockUser = async (userId) => {
    try {
      const { data } = await axios.put(`/api/auth/unblock-user/${userId}`);
      if (data.success) {
        toast.success(data.message);
        setBlockedUsers((prev) => prev.filter((user) => user._id !== userId));
        return true;
      } else {
        toast.error(data.message || "Failed to unblock user");
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return false;
    }
  };

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
    blockUser,
    unblockUser,
    blockedUsers,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
