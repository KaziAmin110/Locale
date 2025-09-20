import React from "react";
import Navbar from "../components/Dashboard/Navbar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
};

export default layout;
