import React, { createContext, useContext } from 'react';
import { UserService } from './UserService';

const UserServiceContext = createContext(null);

export const UserServiceProvider = ({ children }) => {
  return (
    <UserServiceContext.Provider value={UserService}>
      {children}
    </UserServiceContext.Provider>
  );
};

export const useUserService = () => {
  return useContext(UserServiceContext);
};
