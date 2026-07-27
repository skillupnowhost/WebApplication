/** Starter reference data for the Indian state→city birth-place picker and Kulam suggestions.
 * Deliberately not exhaustive (state capitals + major cities only) — expand by adding rows,
 * not code, per the project's no-static-data convention (this feeds DB tables, not a hardcoded UI array). */

type CityData = { name: string; nameLocal?: Partial<Record<"ta" | "hi", string>>; lat: number; lon: number };
type StateData = { name: string; nameLocal?: Partial<Record<"ta" | "hi", string>>; cities: CityData[] };

export const INDIAN_PLACES: StateData[] = [
  {
    name: "Andhra Pradesh",
    cities: [
      { name: "Amaravati", nameLocal: { ta: "அமராவதி" }, lat: 16.51, lon: 80.52 },
      { name: "Visakhapatnam", nameLocal: { ta: "விசாகப்பட்டினம்" }, lat: 17.69, lon: 83.22 },
      { name: "Vijayawada", nameLocal: { ta: "விஜயவாடா" }, lat: 16.51, lon: 80.63 },
    ],
  },
  { name: "Arunachal Pradesh", cities: [{ name: "Itanagar", nameLocal: { ta: "இட்டாநகர்" }, lat: 27.1, lon: 93.62 }] },
  { name: "Assam", cities: [{ name: "Guwahati", nameLocal: { ta: "குவஹாத்தி" }, lat: 26.14, lon: 91.74 }] },
  {
    name: "Bihar",
    cities: [
      { name: "Patna", nameLocal: { ta: "பாட்னா" }, lat: 25.59, lon: 85.14 },
      { name: "Gaya", nameLocal: { ta: "கயா" }, lat: 24.8, lon: 85.0 },
    ],
  },
  {
    name: "Chhattisgarh",
    cities: [
      { name: "Raipur", nameLocal: { ta: "ராய்ப்பூர்" }, lat: 21.25, lon: 81.63 },
      { name: "Bilaspur", nameLocal: { ta: "பிலாஸ்பூர்" }, lat: 22.09, lon: 82.15 },
    ],
  },
  {
    name: "Goa",
    cities: [
      { name: "Panaji", nameLocal: { ta: "பணஜி" }, lat: 15.49, lon: 73.83 },
      { name: "Margao", nameLocal: { ta: "மார்கோவா" }, lat: 15.27, lon: 73.96 },
    ],
  },
  {
    name: "Gujarat",
    cities: [
      { name: "Gandhinagar", nameLocal: { ta: "காந்திநகர்" }, lat: 23.22, lon: 72.68 },
      { name: "Ahmedabad", nameLocal: { ta: "அகமதாபாத்" }, lat: 23.02, lon: 72.57 },
      { name: "Surat", nameLocal: { ta: "சூரத்" }, lat: 21.17, lon: 72.83 },
      { name: "Vadodara", nameLocal: { ta: "வதோதரா" }, lat: 22.31, lon: 73.18 },
    ],
  },
  {
    name: "Haryana",
    cities: [
      { name: "Gurugram", nameLocal: { ta: "குருகிராம்" }, lat: 28.46, lon: 77.03 },
      { name: "Faridabad", nameLocal: { ta: "பரிதாபாத்" }, lat: 28.41, lon: 77.32 },
    ],
  },
  { name: "Himachal Pradesh", cities: [{ name: "Shimla", nameLocal: { ta: "சிம்லா" }, lat: 31.1, lon: 77.17 }] },
  {
    name: "Jharkhand",
    cities: [
      { name: "Ranchi", nameLocal: { ta: "ராஞ்சி" }, lat: 23.34, lon: 85.31 },
      { name: "Jamshedpur", nameLocal: { ta: "ஜம்ஷெட்பூர்" }, lat: 22.8, lon: 86.2 },
    ],
  },
  {
    name: "Karnataka",
    cities: [
      { name: "Bengaluru", nameLocal: { ta: "பெங்களூரு" }, lat: 12.97, lon: 77.59 },
      { name: "Mysuru", nameLocal: { ta: "மைசூரு" }, lat: 12.3, lon: 76.64 },
      { name: "Mangaluru", nameLocal: { ta: "மங்களூரு" }, lat: 12.87, lon: 74.88 },
      { name: "Hubballi", nameLocal: { ta: "ஹுப்பள்ளி" }, lat: 15.36, lon: 75.12 },
    ],
  },
  {
    name: "Kerala",
    cities: [
      { name: "Thiruvananthapuram", nameLocal: { ta: "திருவனந்தபுரம்" }, lat: 8.52, lon: 76.94 },
      { name: "Kochi", nameLocal: { ta: "கொச்சி" }, lat: 9.93, lon: 76.27 },
      { name: "Kozhikode", nameLocal: { ta: "கோழிக்கோடு" }, lat: 11.26, lon: 75.78 },
    ],
  },
  {
    name: "Madhya Pradesh",
    cities: [
      { name: "Bhopal", nameLocal: { ta: "போபால்" }, lat: 23.26, lon: 77.41 },
      { name: "Indore", nameLocal: { ta: "இந்தூர்" }, lat: 22.72, lon: 75.86 },
      { name: "Jabalpur", nameLocal: { ta: "ஜபல்பூர்" }, lat: 23.18, lon: 79.99 },
    ],
  },
  {
    name: "Maharashtra",
    cities: [
      { name: "Mumbai", nameLocal: { ta: "மும்பை" }, lat: 19.08, lon: 72.88 },
      { name: "Pune", nameLocal: { ta: "புனே" }, lat: 18.52, lon: 73.86 },
      { name: "Nagpur", nameLocal: { ta: "நாக்பூர்" }, lat: 21.15, lon: 79.09 },
      { name: "Nashik", nameLocal: { ta: "நாசிக்" }, lat: 20.0, lon: 73.79 },
    ],
  },
  { name: "Manipur", cities: [{ name: "Imphal", nameLocal: { ta: "இம்பால்" }, lat: 24.82, lon: 93.94 }] },
  { name: "Meghalaya", cities: [{ name: "Shillong", nameLocal: { ta: "ஷில்லாங்" }, lat: 25.58, lon: 91.89 }] },
  { name: "Mizoram", cities: [{ name: "Aizawl", nameLocal: { ta: "ஐசால்" }, lat: 23.73, lon: 92.72 }] },
  { name: "Nagaland", cities: [{ name: "Kohima", nameLocal: { ta: "கோஹிமா" }, lat: 25.67, lon: 94.11 }] },
  {
    name: "Odisha",
    cities: [
      { name: "Bhubaneswar", nameLocal: { ta: "புவனேஸ்வர்" }, lat: 20.3, lon: 85.82 },
      { name: "Cuttack", nameLocal: { ta: "கட்டாக்" }, lat: 20.46, lon: 85.88 },
    ],
  },
  {
    name: "Punjab",
    cities: [
      { name: "Chandigarh", nameLocal: { ta: "சண்டிகர்" }, lat: 30.73, lon: 76.78 },
      { name: "Amritsar", nameLocal: { ta: "அமிர்தசரஸ்" }, lat: 31.63, lon: 74.87 },
      { name: "Ludhiana", nameLocal: { ta: "லூதியானா" }, lat: 30.9, lon: 75.86 },
    ],
  },
  {
    name: "Rajasthan",
    cities: [
      { name: "Jaipur", nameLocal: { ta: "ஜெய்ப்பூர்" }, lat: 26.91, lon: 75.79 },
      { name: "Jodhpur", nameLocal: { ta: "ஜோத்பூர்" }, lat: 26.24, lon: 73.02 },
      { name: "Udaipur", nameLocal: { ta: "உதய்பூர்" }, lat: 24.58, lon: 73.68 },
    ],
  },
  { name: "Sikkim", cities: [{ name: "Gangtok", nameLocal: { ta: "கங்டோக்" }, lat: 27.34, lon: 88.61 }] },
  {
    name: "Tamil Nadu",
    cities: [
      { name: "Chennai", nameLocal: { ta: "சென்னை" }, lat: 13.08, lon: 80.27 },
      { name: "Madurai", nameLocal: { ta: "மதுரை" }, lat: 9.93, lon: 78.12 },
      { name: "Coimbatore", nameLocal: { ta: "கோயம்புத்தூர்" }, lat: 11.02, lon: 76.96 },
      { name: "Tiruchirappalli", nameLocal: { ta: "திருச்சிராப்பள்ளி" }, lat: 10.79, lon: 78.7 },
      { name: "Salem", nameLocal: { ta: "சேலம்" }, lat: 11.66, lon: 78.15 },
    ],
  },
  {
    name: "Telangana",
    cities: [
      { name: "Hyderabad", nameLocal: { ta: "ஹைதராபாத்" }, lat: 17.39, lon: 78.49 },
      { name: "Warangal", nameLocal: { ta: "வாரங்கல்" }, lat: 17.97, lon: 79.6 },
    ],
  },
  { name: "Tripura", cities: [{ name: "Agartala", nameLocal: { ta: "அகர்தலா" }, lat: 23.83, lon: 91.28 }] },
  {
    name: "Uttar Pradesh",
    cities: [
      { name: "Lucknow", nameLocal: { ta: "லக்னோ" }, lat: 26.85, lon: 80.95 },
      { name: "Kanpur", nameLocal: { ta: "கான்பூர்" }, lat: 26.45, lon: 80.33 },
      { name: "Varanasi", nameLocal: { ta: "வாரணாசி" }, lat: 25.32, lon: 83.01 },
      { name: "Agra", nameLocal: { ta: "ஆக்ரா" }, lat: 27.18, lon: 78.02 },
      { name: "Noida", nameLocal: { ta: "நொய்டா" }, lat: 28.54, lon: 77.39 },
    ],
  },
  {
    name: "Uttarakhand",
    cities: [
      { name: "Dehradun", nameLocal: { ta: "டேராடூன்" }, lat: 30.32, lon: 78.03 },
      { name: "Haridwar", nameLocal: { ta: "ஹரித்துவார்" }, lat: 29.95, lon: 78.16 },
    ],
  },
  {
    name: "West Bengal",
    cities: [
      { name: "Kolkata", nameLocal: { ta: "கொல்கத்தா" }, lat: 22.57, lon: 88.36 },
      { name: "Howrah", nameLocal: { ta: "ஹவுரா" }, lat: 22.59, lon: 88.31 },
      { name: "Siliguri", nameLocal: { ta: "சிலிகுரி" }, lat: 26.73, lon: 88.43 },
    ],
  },
  { name: "Andaman and Nicobar Islands", cities: [{ name: "Port Blair", nameLocal: { ta: "போர்ட் பிளேயர்" }, lat: 11.62, lon: 92.73 }] },
  { name: "Chandigarh (UT)", cities: [{ name: "Chandigarh", nameLocal: { ta: "சண்டிகர்" }, lat: 30.73, lon: 76.78 }] },
  { name: "Dadra and Nagar Haveli and Daman and Diu", cities: [{ name: "Daman", nameLocal: { ta: "டாமன்" }, lat: 20.4, lon: 72.84 }] },
  { name: "Delhi", cities: [{ name: "New Delhi", nameLocal: { ta: "டெல்லி" }, lat: 28.61, lon: 77.21 }] },
  {
    name: "Jammu and Kashmir",
    cities: [
      { name: "Srinagar", nameLocal: { ta: "ஸ்ரீநகர்" }, lat: 34.08, lon: 74.8 },
      { name: "Jammu", nameLocal: { ta: "ஜம்மு" }, lat: 32.73, lon: 74.87 },
    ],
  },
  { name: "Ladakh", cities: [{ name: "Leh", nameLocal: { ta: "லே" }, lat: 34.16, lon: 77.58 }] },
  { name: "Lakshadweep", cities: [{ name: "Kavaratti", nameLocal: { ta: "கவரத்தி" }, lat: 10.57, lon: 72.64 }] },
  { name: "Puducherry", cities: [{ name: "Puducherry", nameLocal: { ta: "புதுச்சேரி" }, lat: 11.94, lon: 79.83 }] },
];

/** Starter Tamil Kulam/gotra names for the Kulam autocomplete — expand via admin/DB, not code. */
export const KULAM_NAMES_TA = [
  "வேளாளர்",
  "முதலியார்",
  "பிள்ளை",
  "நாயுடு",
  "செட்டியார்",
  "கவுண்டர்",
  "தேவர்",
  "நாடார்",
  "அய்யர்",
  "அய்யங்கார்",
  "மறவர்",
  "அகமுடையார்",
  "வன்னியர்",
  "பள்ளர்",
  "ரெட்டியார்",
  "காம்மாளர்",
  "செம்பட்டி",
  "இடையர்",
  "வேட்டுவர்",
  "பரவர்",
];

export const KULAM_NAMES_EN = [
  "Vellalar",
  "Mudaliyar",
  "Pillai",
  "Naidu",
  "Chettiar",
  "Gounder",
  "Thevar",
  "Nadar",
  "Iyer",
  "Iyengar",
  "Maravar",
  "Agamudayar",
  "Vanniyar",
  "Pallar",
  "Reddiyar",
  "Kammalar",
  "Sembatti",
  "Idaiyar",
  "Vettuvar",
  "Paravar",
];
