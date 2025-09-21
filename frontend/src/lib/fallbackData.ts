import type { Apartment, Person, Spot } from "./api";

export const fallbackApartments: Apartment[] = [
  {
    id: "apt-fallback-1",
    title: "Cozy Downtown Loft (Fallback)",
    description:
      "A beautiful loft in the heart of the city. Perfect for young professionals. Comes fully furnished.",
    photos: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=600&fit=crop",
    ],
    match_score: 0.91,
    address: "123 Main St, Cityville",
    price: 1500,
    bedrooms: 1,
    bathrooms: 1,
  },
  {
    id: "apt-fallback-2",
    title: "Suburban Family Home",
    description:
      "Spacious home with a large backyard, ideal for families. Close to schools and parks.",
    photos: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=600&fit=crop",
    ],
    match_score: 0.85,
    address: "456 Oak St, Suburbia",
    price: 2500,
    bedrooms: 3,
    bathrooms: 2,
  },
];

export const fallbackPeople: Person[] = [
  {
    id: "person-fallback-1",
    name: "Alex Doe (Fallback)",
    bio: "Lover of hiking, coffee, and good books. Looking for a roommate to share adventures with.",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    ],
    match_score: 0.95,
    age: 25,
    interests: ["hiking", "coffee", "books"],
  },
  {
    id: "person-fallback-2",
    name: "Jordan Smith",
    bio: "Software developer by day, musician by night. Clean, respectful, and friendly.",
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop",
    ],
    match_score: 0.88,
    age: 30,
    interests: ["coding", "music", "travel"],
  },
];

export const fallbackSpots: Spot[] = [
  {
    id: "spot-fallback-1",
    name: "The Coffee House (Fallback)",
    address: "789 Brew St, Caffeine City",
    description:
      "A great place to work or relax. Known for its artisanal coffee and delicious pastries.",
    photos: [
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=600&fit=crop",
    ],
    match_score: 0.92,
  },
  {
    id: "spot-fallback-2",
    name: "City Park",
    address: "101 Park Ave, Greenfield",
    description:
      "Enjoy a walk, a picnic, or just some fresh air in this beautiful urban oasis.",
    photos: [
      "https://images.unsplash.com/photo-1598533722955-749557404842?w=400&h=600&fit=crop",
    ],
    match_score: 0.87,
  },
];
