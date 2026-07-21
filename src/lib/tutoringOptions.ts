export const SUBJECT_OPTIONS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Computer Science",
  "History",
  "Geography",
  "Economics",
  "Accountancy",
  "Business Studies",
  "Political Science",
].map((s) => ({ label: s, value: s }));

export const BOARD_OPTIONS = ["CBSE", "ICSE", "State Board", "IB", "Cambridge (IGCSE)", "Other"].map((b) => ({
  label: b,
  value: b,
}));

export const GRADE_OPTIONS = [
  "1st Grade",
  "2nd Grade",
  "3rd Grade",
  "4th Grade",
  "5th Grade",
  "6th Grade",
  "7th Grade",
  "8th Grade",
  "9th Grade",
  "10th Grade",
  "11th Grade",
  "12th Grade",
].map((g) => ({ label: g, value: g }));

export const FEE_TIER_OPTIONS = [
  { label: "Free", value: "FREE" },
  { label: "Standard", value: "STANDARD" },
  { label: "Premium", value: "PREMIUM" },
];
