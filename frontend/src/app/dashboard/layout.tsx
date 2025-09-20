import React from "react";
import ModernNavbar from "../components/Dashboard/ModernNavbar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ModernNavbar />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
};

export default layout;
