// Seed data - Achievements, Hospitals, Blood Compatibility Chart

const achievements = [
  { name: "First Donation", description: "Completed your very first blood donation", icon: "🩸", points: 50, criteria: { type: "donations", value: 1 } },
  { name: "Lifesaver", description: "Donated 3 times in total", icon: "💪", points: 150, criteria: { type: "donations", value: 3 } },
  { name: "Champion", description: "Donated 5 times in total", icon: "🏆", points: 300, criteria: { type: "donations", value: 5 } },
  { name: "Hero", description: "Donated 10 times in total", icon: "🦸", points: 800, criteria: { type: "donations", value: 10 } },
  { name: "Legend", description: "Donated 25 times in total", icon: "👑", points: 2500, criteria: { type: "donations", value: 25 } },
  { name: "100 Points Club", description: "Earned 100 reward points", icon: "✨", points: 0, criteria: { type: "points", value: 100 } },
  { name: "500 Points Club", description: "Earned 500 reward points", icon: "🌟", points: 0, criteria: { type: "points", value: 500 } },
];

const hospitals = [
  { name: "City General Hospital", address: "12 MG Road", city: "Mumbai", state: "Maharashtra", phone: "022-12345678", emergencyPhone: "022-11223344", bloodBankAvailable: true, verified: true },
  { name: "Apollo Lifeline", address: "45 Park Street", city: "Delhi", state: "Delhi", phone: "011-23456789", emergencyPhone: "011-99887766", bloodBankAvailable: true, verified: true },
  { name: "Fortis Care", address: "78 Jubilee Hills", city: "Hyderabad", state: "Telangana", phone: "040-34567890", emergencyPhone: "040-55667788", bloodBankAvailable: true, verified: true },
  { name: "Rainbow Children's Hospital", address: "221 Anna Salai", city: "Chennai", state: "Tamil Nadu", phone: "044-45678901", emergencyPhone: "044-22334455", bloodBankAvailable: false, verified: true },
  { name: "Star Hospital", address: "5 Sarojini Nagar", city: "Bengaluru", state: "Karnataka", phone: "080-56789012", emergencyPhone: "080-66778899", bloodBankAvailable: true, verified: false },
];

// Blood compatibility chart
// recipient -> donors it can receive from
const bloodCompatibility = {
  "A+": ["A+", "A-", "O+", "O-"],
  "A-": ["A-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  "AB-": ["AB-", "A-", "B-", "O-"],
  "O+": ["O+", "O-"],
  "O-": ["O-"],
};

// who can donate to whom
const canDonateTo = {
  "A+": ["A+", "AB+"],
  "A-": ["A+", "A-", "AB+", "AB-"],
  "B+": ["B+", "AB+"],
  "B-": ["B+", "B-", "AB+", "AB-"],
  "AB+": ["AB+"],
  "AB-": ["AB+", "AB-"],
  "O+": ["O+", "A+", "B+", "AB+"],
  "O-": ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
};

module.exports = { achievements, hospitals, bloodCompatibility, canDonateTo };

