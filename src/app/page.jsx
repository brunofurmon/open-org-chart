import React, { Suspense } from "react";
import Home from "@/components/pages/home";

const { USER_BACKEND_MODE } = process.env;

const Page = async ({ searchParams }) => {
  const { debug } = await searchParams;

  return (
    <Suspense>
      <Home
        debugMode={debug}
        teamViewEnabled={USER_BACKEND_MODE !== "googleadmin"}
      />
    </Suspense>
  );
};

export default Page;
