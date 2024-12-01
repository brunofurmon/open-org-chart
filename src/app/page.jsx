import React, { Suspense } from "react";
import Home from "@/components/pages/home";

const Page = async ({ searchParams }) => {
  const { debug } = await searchParams;

  return (
    <Suspense>
      <Home debugMode={debug} />
    </Suspense>
  );
};

export default Page;
