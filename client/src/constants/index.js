export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

export const DISTRICTS_BY_STATE = {
  Maharashtra: ["Mumbai City", "Mumbai Suburban", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad"],
  Delhi: ["Central Delhi", "South Delhi", "North Delhi", "East Delhi", "West Delhi"],
  Karnataka: ["Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Hubballi", "Mangaluru"],
  Telangana: ["Hyderabad", "Rangareddy", "Medchal", "Warangal", "Karimnagar"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Noida"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
  "West Bengal": ["Kolkata", "Howrah", "Darjeeling", "Siliguri"],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Gwalior", "Jabalpur"],
  Haryana: ["Gurugram", "Faridabad", "Panipat", "Ambala"],
  Bihar: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Puri"],
};

export const URGENCY_LEVELS = [
  { value: "normal", label: "Normal", color: "bg-neutral-100 text-neutral-700" },
  { value: "urgent", label: "Urgent", color: "bg-amber-50 text-amber-700" },
  { value: "emergency", label: "Emergency", color: "bg-red-50 text-red-600" },
];

