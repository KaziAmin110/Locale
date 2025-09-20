"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
  //           <span className="text-white text-2xl font-bold">C</span>
  //         </div>
  //         <p className="text-gray-600">Loading your dashboard...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"></main>
    </div>
  );
}
