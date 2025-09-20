"use client";

import { useState } from "react";

// super simple mock data — replace with your API later
const mock = {
  apartments: [
    { id: "a1", title: "Modern Studio in SoCo", price: 1850, img: "https://picsum.photos/seed/apt1/800/500" },
    { id: "a2", title: "2BR Near Zilker",        price: 2350, img: "https://picsum.photos/seed/apt2/800/500" },
  ],
  people: [
    { id: "p1", name: "Sarah", blurb: "Coffee + hikes", img: "https://picsum.photos/seed/p1/800/500" },
    { id: "p2", name: "Alex",  blurb: "Climbing & tacos", img: "https://picsum.photos/seed/p2/800/500" },
  ],
  spots: [
    { id: "s1", name: "Jo’s Coffee", detail: "Coffee · 4.6★", img: "https://picsum.photos/seed/s1/800/500" },
    { id: "s2", name: "Barton Springs", detail: "Park · 4.8★", img: "https://picsum.photos/seed/s2/800/500" },
  ],
};

type Tab = "apartments" | "people" | "spots";

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("apartments");
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState<any[]>([]);

  const list = mock[tab] as any[];
  const card = list[index];

  const pass = () => setIndex(i => Math.min(i + 1, list.length));
  const like = () => {
    if (card) setSaved(s => [card, ...s]);
    pass();
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="text-xl font-bold">CityMate</div>
          <nav className="flex gap-2 bg-neutral-100 p-1 rounded-full">
            {(["apartments","people","spots"] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setIndex(0); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition
                  ${tab===t ? "bg-white shadow" : "hover:bg-neutral-200"}`}
              >
                {t[0].toUpperCase()+t.slice(1)}
              </button>
            ))}
          </nav>
          <div className="text-sm text-neutral-500">Austin, TX</div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Left: swipe area */}
        <section className="flex flex-col items-center gap-4">
          {!card ? (
            <div className="h-[28rem] w-full max-w-xl grid place-items-center rounded-2xl border border-dashed text-neutral-500">
              No more cards — come back later ✨
            </div>
          ) : (
            <>
              {/* Card */}
              <div className="w-full max-w-xl bg-white rounded-2xl shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.img} alt="" className="w-full h-64 object-cover rounded-t-2xl" />
                <div className="p-4 space-y-2">
                  {tab === "apartments" && (
                    <>
                      <h3 className="text-lg font-semibold">{card.title}</h3>
                      <p className="text-neutral-600">${card.price.toLocaleString()}</p>
                    </>
                  )}
                  {tab === "people" && (
                    <>
                      <h3 className="text-lg font-semibold">{card.name}</h3>
                      <p className="text-neutral-600">{card.blurb}</p>
                    </>
                  )}
                  {tab === "spots" && (
                    <>
                      <h3 className="text-lg font-semibold">{card.name}</h3>
                      <p className="text-neutral-600">{card.detail}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button onClick={pass} className="px-5 py-3 rounded-full bg-neutral-100 hover:bg-neutral-200">
                  Pass
                </button>
                <button onClick={like} className="px-5 py-3 rounded-full bg-black text-white hover:opacity-90">
                  Like
                </button>
              </div>

              <p className="text-xs text-neutral-500">{Math.min(index+1, list.length)} / {list.length}</p>
            </>
          )}
        </section>

        {/* Right: saved */}
        <aside className="space-y-3">
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="font-semibold mb-3">Saved</h2>
            <div className="space-y-3">
              {saved.length === 0 && (
                <p className="text-sm text-neutral-500">Likes will show up here.</p>
              )}
              {saved.slice(0,8).map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.img} alt="" className="w-14 h-14 rounded-lg object-cover bg-neutral-200" />
                  <div className="text-sm">
                    <div className="font-medium">{item.title || item.name}</div>
                    <div className="text-neutral-500">
                      {"price" in item ? `$${item.price.toLocaleString()}` : (item.blurb || item.detail || "")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import HomesContent from "../components/Dashboard/HomesContent";
// import Navbar from "../components/Dashboard/Navbar";

// export default function Dashboard() {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   const [stats, setStats] = useState({
//     apartments: 0,
//     people: 0,
//     spots: 0,
//     matches: 0,
//   });

//   // useEffect(() => {
//   //   const token = localStorage.getItem('token');
//   //   const userData = localStorage.getItem('user');

//   //   if (!token || !userData) {
//   //     router.push('/login');
//   //     return;
//   //   }

//   //   setUser(JSON.parse(userData));
//   //   loadStats();
//   //   setLoading(false);
//   // }, [router]);

//   const [activeTab, setActiveTab] = useState("Homes");

//   const loadStats = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       // Load apartments
//       const apartmentsRes = await fetch(
//         "http://localhost:5002/api/apartments/feed",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const apartmentsData = await apartmentsRes.json();

//       // Load people
//       const peopleRes = await fetch("http://localhost:5002/api/people/feed", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const peopleData = await peopleRes.json();

//       // Load spots
//       const spotsRes = await fetch("http://localhost:5002/api/spots/feed", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const spotsData = await spotsRes.json();

//       setStats({
//         apartments: apartmentsData.apartments?.length || 0,
//         people: peopleData.people?.length || 0,
//         spots: spotsData.spots?.length || 0,
//         matches: Math.floor(Math.random() * 5) + 1, // Mock matches for now
//       });
//     } catch (error) {
//       console.error("Error loading stats:", error);
//       // Set fallback stats
//       setStats({
//         apartments: 12,
//         people: 8,
//         spots: 15,
//         matches: 3,
//       });
//     }
//   };

//   return (
//     <div className="flex flex-col px-4 sm:px-6 lg:px-8 py-8 w-full">
//       <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

//       <div className="mt-6">
//         {activeTab === "Homes" && <HomesContent stats={stats} />}
//         {activeTab === "Experiences" && <ExperiencesContent />}
//         {activeTab === "Services" && <ServicesContent />}
//       </div>
//     </div>
//   );
// }
