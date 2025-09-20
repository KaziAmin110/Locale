"use client";

import React from 'react';

const BuildingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21v-7" /><path d="M4 10V3" /><path d="M12 21v-7" /><path d="M12 10V3" /><path d="M20 21v-7" /><path d="M20 10V3" /><rect width="18" height="6" x="3" y="10" rx="1" /></svg>;
const SpeechBubbleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>;
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;


const EngagementRing = ({ likes, passes }: { likes: number, passes: number }) => {
    const total = likes + passes;
    const percentage = total > 0 ? (likes / total) * 100 : 0;
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="!relative !w-48 !h-48 !flex !items-center !justify-center">
            <svg className="!absolute !w-full !h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="#111111" strokeWidth="8" fill="none" opacity="0.1" />
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="rgb(239, 68, 68)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="!transition-all !duration-1000 !ease-in-out"
                />
            </svg>
            <div className="!text-center">
                <p className="!text-3xl !font-bold !text-gray-900">{total.toLocaleString()}</p>
                <p className="!text-xs !uppercase !tracking-widest !text-gray-500">Total Swipes</p>
            </div>
        </div>
    );
};

export default function CityMateAnalyticsPage() {
    const staticStats = {
        totalLikes: 1283,
        passes: 412,
        discoveryRate: 76,
        topCategory: "Spots",
        categoryCounts: {
            Apartments: 48,
            People: 60,
            Spots: 55,
        }
    };

    return (
        <main className="!min-h-screen !bg-white !text-gray-900 !font-sans !antialiased !p-4 sm:!p-6 lg:!p-8">
            <style jsx global>{`
              @import url('https://rsms.me/inter/inter.css');
              html { font-family: 'Inter', sans-serif; }
            `}</style>
            <div className="!max-w-7xl !mx-auto">
                <header className="!mb-12 !flex !items-center !justify-between">
                    <div>
                        <h1 className="!text-4xl !font-bold">CityMate Analytics</h1>
                        <p className="!text-lg !text-gray-500 !mt-1">Your journey through Austin, visualized.</p>
                    </div>
                    <a
                        href="/swipe"
                        className="!inline-flex !items-center !gap-2 !px-5 !py-3 !rounded-lg !text-sm !font-semibold !text-white !shadow-sm !transition-transform !duration-200 !ease-in-out hover:!scale-105"
                        style={{ backgroundImage: 'linear-gradient(to right, rgb(239, 68, 68), rgb(236, 72, 153))' }}
                    >
                        <ArrowLeftIcon />
                        Back to Swiping
                    </a>
                </header>

                <section 
                    className="!p-8 !mb-8 !rounded-2xl !bg-gray-50/80 !backdrop-blur-xl !border !border-gray-200"
                >
                    <div className="!grid !grid-cols-1 md:!grid-cols-3 !gap-8 !text-center">
                        <div className="!flex !flex-col !items-center !justify-center">
                            <span className="!text-7xl lg:!text-8xl !font-bold !bg-clip-text !text-transparent !bg-gradient-to-br from-gray-900 to-gray-600">
                                {staticStats.discoveryRate}%
                            </span>
                            <span className="!text-sm !font-medium !uppercase !tracking-widest !text-gray-500 !mt-2">Discovery Rate</span>
                        </div>
                        <div className="!flex !flex-col !items-center !justify-center !order-first md:!order-none">
                             <span 
                                className="!text-8xl lg:!text-9xl !font-bold !bg-clip-text !text-transparent"
                                style={{backgroundImage: 'linear-gradient(to right, rgb(239, 68, 68), rgb(236, 72, 153))'}}
                            >
                                {staticStats.totalLikes.toLocaleString()}
                            </span>
                            <span 
                                className="!text-sm !font-medium !uppercase !tracking-widest !mt-2"
                                style={{color: 'rgb(239, 68, 68)'}}
                            >Total Likes</span>
                        </div>
                        <div className="!flex !flex-col !items-center !justify-center">
                            <span className="!text-7xl lg:!text-8xl !font-bold !bg-clip-text !text-transparent !bg-gradient-to-br from-gray-900 to-gray-600">
                                {staticStats.topCategory}
                            </span>
                            <span className="!text-sm !font-medium !uppercase !tracking-widest !text-gray-500 !mt-2">Top Category</span>
                        </div>
                    </div>
                </section>

                <div className="!grid !grid-cols-1 lg:!grid-cols-3 !gap-8">
                    
                    <div className="lg:!col-span-1 !p-6 !rounded-2xl !bg-gray-50/80 !backdrop-blur-xl !border !border-gray-200 !flex !flex-col !items-center !justify-center">
                        <h2 className="!text-xl !font-medium !mb-4">Engagement Breakdown</h2>
                        <EngagementRing likes={staticStats.totalLikes} passes={staticStats.passes} />
                        <div className="!flex !justify-between !w-full !max-w-xs !mt-6 !text-sm">
                            <p><span className="!font-bold" style={{color: 'rgb(239, 68, 68)'}}>{staticStats.totalLikes.toLocaleString()}</span> Likes</p>
                            <p><span className="!font-bold !text-gray-500">{staticStats.passes.toLocaleString()}</span> Passes</p>
                        </div>
                    </div>

                    <div className="lg:!col-span-2 !p-6 !rounded-2xl !bg-gray-50/80 !backdrop-blur-xl !border !border-gray-200">
                         <h2 className="!text-xl !font-medium !mb-6">Your Taste Profile</h2>
                         <div className="!space-y-6">
                            <div className="!flex !items-start !gap-4">
                                <div className="!p-2 !rounded-lg" style={{backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)'}}><BuildingIcon/></div>
                                <p>Your ideal apartment seems to be around <span className="!font-bold" style={{color: 'rgb(239, 68, 68)'}}>$2,150/mo</span>.</p>
                            </div>
                             <div className="!flex !items-start !gap-4">
                                <div className="!p-2 !rounded-lg" style={{backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)'}}><SpeechBubbleIcon/></div>
                                <p>You connect with people who are into <span className="!font-bold !capitalize" style={{color: 'rgb(239, 68, 68)'}}>live music</span>.</p>
                            </div>
                             <div className="!flex !items-start !gap-4">
                                <div className="!p-2 !rounded-lg" style={{backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)'}}><MapPinIcon/></div>
                                <p>Your go-to vibe is <span className="!font-bold" style={{color: 'rgb(239, 68, 68)'}}>Coffee</span>.</p>
                            </div>
                         </div>
                    </div>
                    
                    <div className="lg:!col-span-3 !p-6 !rounded-2xl !bg-gray-50/80 !backdrop-blur-xl !border !border-gray-200">
                        <h2 className="!text-xl !font-medium !mb-4">Category Affinity</h2>
                        <div className="!space-y-4">
                            {(['Apartments', 'People', 'Spots'] as const).map(category => {
                                const count = staticStats.categoryCounts[category] || 0;
                                const maxCount = Math.max(...Object.values(staticStats.categoryCounts));
                                const width = maxCount > 0 ? (count / maxCount) * 100 : 0;
                                return (
                                    <div key={category} className="!flex !items-center !gap-4">
                                        <span className="!w-24 !text-sm !text-gray-600">{category}</span>
                                        <div className="!flex-1 !bg-gray-900/5 !rounded-full !h-6">
                                            <div 
                                                className="!h-6 !rounded-full !flex !items-center !justify-end !pr-3 !transition-all !duration-700 !ease-out" 
                                                style={{ width: `${width}%`, backgroundImage: 'linear-gradient(to right, rgb(239, 68, 68), rgb(236, 72, 153))' }}
                                            >
                                                <span className="!font-bold !text-sm !text-white">{count}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}

