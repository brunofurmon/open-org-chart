"use client";

import UsersProvider from "@/providers/usersProvider";

const Providers = ({ children }) => {
  return <UsersProvider>{children}</UsersProvider>;
};

export default Providers;
