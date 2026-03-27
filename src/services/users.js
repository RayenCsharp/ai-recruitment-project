import { api } from "./api";

// get all users
export const getUsers = () => api.get("users");

// register
export const registerUser = async (userData) => {
  const users = await getUsers();

  const exists = users.find((u) => u.email === userData.email);

  if (exists) {
    return { success: false, message: "User already exists" };
  }

  await api.post("users", userData);

  return { success: true, message: "Registered successfully" };
};

// login
export const loginUser = async (email) => {
  const users = await getUsers();

  const user = users.find((u) => u.email === email);

  if (!user) {
    return { success: false, message: "User not found" };
  }

  return { success: true, user };
};

// local storage management (session management)
export const setCurrentUser = (user) => {
  localStorage.setItem("currentUser", JSON.stringify(user));
};

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem("currentUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem("currentUser");
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("currentUser");
};