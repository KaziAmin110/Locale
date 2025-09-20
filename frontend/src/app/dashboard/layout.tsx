import React from "react";
<<<<<<< Updated upstream
import ModernNavbar from "../components/Dashboard/ModernNavbar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ModernNavbar />
      <main className="container mx-auto px-4 py-6">{children}</main>
=======

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex flex-col w=full bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="flex flex-col w-full  mx-auto px-4">{children}</main>
>>>>>>> Stashed changes
    </div>
  );
};

export default layout;
