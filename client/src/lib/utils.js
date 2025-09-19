// export function formatMessageTime(date){
//     return new Date(date).toLocaleTimeString("en-US",{
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: "false"
//     })
// }


// utils.js

// src/lib/utils.js

export const API_URL = import.meta.env.PROD
  ? 'https://your-backend-domain.com/api'
  : 'http://localhost:5000/api';

export const login = async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const signup = async (data) => {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

// ✅ Add this export
export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
