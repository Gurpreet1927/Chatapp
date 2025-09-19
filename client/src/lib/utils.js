// export function formatMessageTime(date){
//     return new Date(date).toLocaleTimeString("en-US",{
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: "false"
//     })
// }


// utils.js

// API URL for development vs production
const API_URL =
  import.meta.env.PROD
    ? 'https://your-backend-domain.com/api'  // deployed backend
    : 'http://localhost:5000/api';          // local backend

// Auth API functions
export const login = async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
};

export const signup = async (data) => {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
};

// Format message time (24-hour format)
export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // ✅ must be boolean
  });
}
