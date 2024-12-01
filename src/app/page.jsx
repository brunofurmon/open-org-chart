import React, { Suspense } from "react";
import Home from "@/components/pages/home";

const Page = ({ searchParams }) => {
  const { debug } = searchParams;

  return (
    <Suspense>
      <Home debugMode={debug} />
    </Suspense>
  );
};

export default Page;
