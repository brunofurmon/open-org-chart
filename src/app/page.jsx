import React, { Suspense } from "react";
import OrganizationalChart from "@/components/orgChart";
import { listUsers } from "@/domain/user/service";

const Home = async ({ searchParams }) => {
  const { debug } = searchParams;

  const users = await listUsers(debug === "true");

  return (
    <Suspense fallback={<div>Carregando usuários...</div>}>
      <OrganizationalChart users={users} />
    </Suspense>
  );
};

export default Home;
