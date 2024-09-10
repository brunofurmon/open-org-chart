import React, { Suspense } from "react";
import Home from "@/components/pages/home";
import { listUsers } from "@/domain/user/service";

const Page = async ({ searchParams }) => {
  const { debug } = searchParams;
  const users = await listUsers(debug === "true");

  return (
    <Suspense>
      <Home users={users} />
    </Suspense>
  );
};

export default Page;
