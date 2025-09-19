/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();
export const ChatProvider = ({ children })=>{
    const [messages, setMessages]=useState([]);
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedUser , setSelectedUser] = useState(null)
    const [unseenMessages , setUnseenMessages] = useState({})

    const {socket , axios, authUser } = useContext(AuthContext);

    // function to get sidebar
    const getUsers = async () => {
        if (!authUser) return;
        try {
           const {data} =  await axios.get("/api/messages/users");
           if(data.success)
           {
            setUsers(data.users)
            setUnseenMessages(data.unseenMessages)
           }else{
            toast.error("users not fetched");
           }
        } catch (error) {
            toast.error(error.message)
        }
    }
      const getGroups = async () => {
    if (!authUser) return;
    try {
      const { data } = await axios.get("/api/groups/my-groups");
      if (data.success) setGroups(data.groups);
    } catch (err) {
      console.error("Failed to fetch groups:", err.message);
    }
  };

  const addMember = async (groupId, memberId) => {
    try {
      const { data } = await axios.put(`/api/groups/add-member/${groupId}`, { memberId });
      if (data.success) {
        // Update groups state with updated group
        setGroups((prevGroups) =>
          prevGroups.map((group) =>
            group._id.toString() === groupId ? data.group : group
          )
        );
        // If the selectedUser is the updated group, update it too
        if (selectedUser && selectedUser._id.toString() === groupId) {
          setSelectedUser({ ...data.group, isGroup: true });
        }
        toast.success("Member added successfully");
        // Refresh groups list to ensure sidebar updates
        getGroups();
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (err) {
      console.error("Failed to add member:", err.message);
      toast.error("Failed to add member");
      return false;
    }
  };

  const removeMember = async (groupId, memberId) => {
    try {
      const { data } = await axios.put(`/api/groups/remove-member/${groupId}`, { memberId });
      if (data.success) {
        // Update groups state with updated group
        setGroups((prevGroups) =>
          prevGroups.map((group) =>
            group._id.toString() === groupId ? data.group : group
          )
        );
        // If the selectedUser is the updated group, update it too
        if (selectedUser && selectedUser._id.toString() === groupId) {
          setSelectedUser({ ...data.group, isGroup: true });
        }
        toast.success("Member removed successfully");
        // Refresh groups list to ensure sidebar updates
        getGroups();
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (err) {
      console.error("Failed to remove member:", err.message);
      toast.error("Failed to remove member");
      return false;
    }
  };

  const createGroup = async (groupData) => {
    try {
      const { data } = await axios.post("/api/groups/create", groupData);
      if (data.success) {
        setGroups((prev) => [...prev, data.group]);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to create group:", err.message);
      return false;
    }
  };

  const leaveGroup = async (groupId) => {
    try {
      const { data } = await axios.put(`/api/groups/leave/${groupId}`);
      if (data.success) {
        setGroups((prev) => prev.filter(group => group._id.toString() !== groupId));
        if (selectedUser && selectedUser._id.toString() === groupId) {
          setSelectedUser(null);
        }
        toast.success(data.message);
        // Refresh groups list to ensure sidebar updates
        getGroups();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to leave group:", err.message);
      toast.error("Failed to leave group");
      return false;
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      const { data } = await axios.delete(`/api/groups/delete/${groupId}`);
      if (data.success) {
        setGroups((prev) => prev.filter(group => group._id.toString() !== groupId));
        if (selectedUser && selectedUser._id.toString() === groupId) {
          setSelectedUser(null);
        }
        toast.success(data.message);
        // Refresh groups list to ensure sidebar updates
        getGroups();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to delete group:", err.message);
      toast.error("Failed to delete group");
      return false;
    }
  };

    // function to get messages from selected users
   const getMessage = async (userId) => {
    try {
        const {data} = await axios.get(`/api/messages/${userId}`);
        if(data.success){
            setMessages(data.messages)
        }
    } catch (error) {
        toast.error(error.message)
    }
    
   }

    // function to send messages to selected users
    const sendMessage = async (messageData) => {
        try {
            const requestData = { ...messageData };
            if (selectedUser && selectedUser.isGroup) {
                requestData.groupId = selectedUser._id;
            }
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, requestData);
            if(data.success){
                setMessages((prevMessages)=>[...prevMessages, data.newMessage])
            }else{
                 toast.error(data.message);
            }
        } catch (error) {
             toast.error(error.message)
        }
    }

    // function to delete chat with selected user
    const deleteChatWithUser = async (userId) => {
        try {
            const {data} = await axios.delete(`/api/messages/delete-chat/${userId}`);
            if(data.success){
                setMessages([]);
                // If the selected user is the one being deleted, deselect
                if (selectedUser && selectedUser._id.toString() === userId) {
                    setSelectedUser(null);
                }
                toast.success("Chat deleted successfully");
                return true;
            }else{
                 toast.error(data.message);
                 return false;
            }
        } catch (error) {
             toast.error(error.message);
             return false;
        }
    }

    // function to delete user from list
    const deleteUserFromList = async (userId) => {
        try {
            // Call backend to delete the user
            const { data } = await axios.delete(`/api/auth/delete/${userId}`);
            if (!data.success) {
                toast.error(data.message || "Failed to delete user");
                return false;
            }
            // Remove user from users list
            removeUserFromList(userId);
            // Remove user from all groups' member lists
            setGroups((prevGroups) =>
                prevGroups.map((group) => ({
                    ...group,
                    members: group.members.filter((member) => member._id.toString() !== userId),
                }))
            );
            // If the selected user is the one being deleted, deselect
            if (selectedUser && selectedUser._id.toString() === userId) {
                setSelectedUser(null);
            }
            // If the selected user is a group that had this member, update it
            if (selectedUser && selectedUser.isGroup && selectedUser.members.some(member => member._id.toString() === userId)) {
                setSelectedUser({
                    ...selectedUser,
                    members: selectedUser.members.filter(member => member._id.toString() !== userId)
                });
            }
            // Refresh users list from server to reflect deletion
            await getUsers();
            toast.success("User deleted successfully");
            return true;
        } catch (error) {
            toast.error(error.message || "Failed to delete user");
            return false;
        }
    }

    // function to remove user from users list
    const removeUserFromList = (userId) => {
        setUsers((prevUsers) => prevUsers.filter(user => user._id.toString() !== userId));
    }
    // function to subscribe to messages to selected user
    const subscribeToMessages = async () => {
        if(!socket) return;
        socket.on("newMessage", (newMessage)=>{
            if(selectedUser){
                const isRelevantMessage = selectedUser.isGroup
                    ? newMessage.groupId === selectedUser._id.toString()
                    : newMessage.senderId === selectedUser._id.toString();
                if(isRelevantMessage){
                    newMessage.seen = true;
                    setMessages((prevMessages)=>[...prevMessages, newMessage]);
                    axios.put(`/api/messages/mark/${newMessage._id}`);
                }else{
                    setUnseenMessages((prevUnseenMessages)=>({
                        ...prevUnseenMessages, [newMessage.senderId] : prevUnseenMessages[newMessage.senderId]? prevUnseenMessages[newMessage.senderId] + 1 : 1
                    }))
                }
            }
            // Update users list to reflect new message activity
            getUsers();
        })
    }

    // function to unsubscribe
    const unsubscribeFromMessages = ()=>{
        if(socket) socket.off("newMessage");
    }
    useEffect(()=>{
        subscribeToMessages();
        return()=> unsubscribeFromMessages();
    }, [socket, selectedUser])

    useEffect(() => {
        if (authUser) {
            getUsers();
            getGroups();
        }
    }, [authUser]);
    const value = {
        messages, users, groups, selectedUser, getUsers, sendMessage, setSelectedUser, setGroups, unseenMessages, setUnseenMessages ,  getMessage, getGroups,createGroup, leaveGroup, deleteGroup, addMember, removeMember, deleteChatWithUser, deleteUserFromList, removeUserFromList

    }
    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}


