import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex flex-col w-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="flex flex-col w-full px-4">{children}</main>
    </div>
  );
};

export default layout;
