let user = null;

export const login = (role) => {
  user = {
    isLogged: true,
    role,
  };
};

export const logout = () => {
  user = null;
};

export const getUser = () => user;