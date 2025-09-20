"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "../components/Dashboard/Navbar";

// Dummy components for content - replace with your actual card components
const HomesContent = ({ stats }: { stats: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
    <div className="bg-white p-6 rounded-lg shadow-md">
      Apartments: {stats.apartments}
    </div>
    <div className="bg-white p-6 rounded-lg shadow-md">
      Matches: {stats.matches}
    </div>
  </div>
);

const ExperiencesContent = () => (
  <div className="mt-8 text-center">
    <p>Experiences Cards Go Here</p>
  </div>
);
const ServicesContent = () => (
  <div className="mt-8 text-center">
    <p>Services Cards Go Here</p>
  </div>
);

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    apartments: 0,
    people: 0,
    spots: 0,
    matches: 0,
  });
  const router = useRouter();

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   const userData = localStorage.getItem('user');

  //   if (!token || !userData) {
  //     router.push('/login');
  //     return;
  //   }

  //   setUser(JSON.parse(userData));
  //   loadStats();
  //   setLoading(false);
  // }, [router]);

  const [activeTab, setActiveTab] = useState("Homes");

  const loadStats = async () => {
    try {
      const token = localStorage.getItem("token");

      // Load apartments
      const apartmentsRes = await fetch(
        "http://localhost:5002/api/apartments/feed",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const apartmentsData = await apartmentsRes.json();

      // Load people
      const peopleRes = await fetch("http://localhost:5002/api/people/feed", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const peopleData = await peopleRes.json();

      // Load spots
      const spotsRes = await fetch("http://localhost:5002/api/spots/feed", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const spotsData = await spotsRes.json();

      setStats({
        apartments: apartmentsData.apartments?.length || 0,
        people: peopleData.people?.length || 0,
        spots: spotsData.spots?.length || 0,
        matches: Math.floor(Math.random() * 5) + 1, // Mock matches for now
      });
    } catch (error) {
      console.error("Error loading stats:", error);
      // Set fallback stats
      setStats({
        apartments: 12,
        people: 8,
        spots: 15,
        matches: 3,
      });
    }
  };

  return (
    <div className="flex flex-col px-4 sm:px-6 lg:px-8 py-8 w-full">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === "Homes" && <HomesContent stats={stats} />}
        {activeTab === "Experiences" && <ExperiencesContent />}
        {activeTab === "Services" && <ServicesContent />}
      </div>
    </div>
  );
}
