import { api } from "./api";

const CURRENT_USER_KEY = "currentUser";
const PENDING_ROLE_KEY = "pendingRole";

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password: _password, ...safeUser } = user;
  return safeUser;
};

// get all users
export const getUsers = () => api.get("users");

export const findUserByEmail = async (email) => {
  const users = await getUsers();
  return users.find((u) => u.email === email) || null;
};

export const upsertUserProfile = async ({ clerkId, name, email, role }) => {
  const users = await getUsers();

  const existing = users.find(
    (u) => u.clerkId === clerkId || u.email === email
  );

  const payload = {
    clerkId,
    name,
    email,
    role,
  };

  if (existing?.id) {
    const updated = await api.patch(`users/${existing.id}`, payload);
    return { ...existing, ...updated };
  }

  return api.post("users", payload);
};

// register
export const registerUser = async (userData) => {
  if (!userData?.name?.trim()) {
    return { success: false, message: "Name is required" };
  }

  if (!userData?.email?.trim()) {
    return { success: false, message: "Email is required" };
  }

  if (!userData?.password || userData.password.length < 6) {
    return {
      success: false,
      message: "Password must be at least 6 characters",
    };
  }

  const exists = await findUserByEmail(userData.email);

  if (exists) {
    return { success: false, message: "User already exists" };
  }

  const createdUser = await api.post("users", userData);

  return {
    success: true,
    message: "Registered successfully",
    user: sanitizeUser(createdUser),
  };
};

// login
export const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return { success: false, message: "User not found" };
  }

  if (user.password && user.password !== password) {
    return { success: false, message: "Invalid password" };
  }

  if (user.password && !password) {
    return { success: false, message: "Password is required" };
  }

  return { success: true, user: sanitizeUser(user) };
};

// local storage management (session management)
export const setCurrentUser = (user) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sanitizeUser(user)));
};

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const setPendingRole = (role) => {
  localStorage.setItem(PENDING_ROLE_KEY, role);
};

export const getPendingRole = () => {
  return localStorage.getItem(PENDING_ROLE_KEY);
};

export const clearPendingRole = () => {
  localStorage.removeItem(PENDING_ROLE_KEY);
};