"use client";

import React, { createContext, useContext, useState } from "react";

const UsersContext = createContext({
  users: [],
  setUsers: () => {},
});

export const useUsersContext = () => useContext(UsersContext);

export default function UsersProvider({ children }) {
  const [users, setUsers] = useState([]);

  return (
    <UsersContext.Provider
      value={{
        users,
        setUsers,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}
