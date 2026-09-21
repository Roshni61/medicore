import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Heart, Calendar, Users, FileText, Pill, CreditCard, Bell, Search, Settings,
  Activity, Stethoscope, FlaskConical, ClipboardList, LayoutDashboard, LogOut,
  ChevronRight, ChevronLeft, X, Check, Plus, Clock, MapPin, Star, Video,
  Phone, Mic, Camera, MessageSquare, ShieldCheck, TrendingUp, AlertTriangle,
  Download, Upload, Filter, MoreHorizontal, ArrowRight, Sparkles, Menu,
  BedDouble, Building2, UserCheck, Package, Wallet, BarChart3, Moon, Sun,
  CheckCircle2, Loader2, QrCode, Languages, PlayCircle
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

/* ============================= DESIGN TOKENS ============================= */
const COLORS = {
  navy: "#0B1E3D",
  navyLight: "#15305C",
  teal: "#0EA394",
  tealSoft: "#E4F6F3",
  bg: "#F5F7FA",
  card: "#FFFFFF",
  success: "#1FA971",
  warning: "#DB9A34",
  error: "#DD4B4E",
  info: "#3E7BFA",
  text: "#141B2D",
  muted: "#6B7686",
  border: "#E7EAF0",
};

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; }
    .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-body { font-family: 'Inter', sans-serif; }
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-thumb { background: #D7DCE4; border-radius: 8px; }
    @keyframes pulseLine { 0%{stroke-dashoffset:400} 100%{stroke-dashoffset:0} }
    .ecg-path { stroke-dasharray: 400; animation: pulseLine 3.2s linear infinite; }
    @keyframes fadeUp { from{opacity:0; transform:translateY(8px)} to{opacity:1; transform:translateY(0)} }
    .fade-up { animation: fadeUp .35s ease both; }
    @keyframes toastIn { from{opacity:0; transform:translateY(-6px) scale(.98)} to{opacity:1; transform:translateY(0) scale(1)} }
    .toast-in { animation: toastIn .25s ease both; }
    .skel { background: linear-gradient(90deg,#EEF1F5 25%,#E4E8EE 37%,#EEF1F5 63%); background-size:400% 100%; animation: shimmer 1.4s ease infinite; }
    @keyframes shimmer { 0%{background-position:100% 50%} 100%{background-position:0 50%} }
  `}</style>
);

/* ============================= MOCK DATA ============================= */
const DEPARTMENTS = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Dermatology", "General Medicine"];

const DOCTORS = [
  { id: "d1", name: "Dr. Ananya Rao", spec: "Cardiology", exp: 12, rating: 4.9, fee: 800, lang: ["English", "Tamil"], online: true, hospital: "MediCore Central", next: "Today, 3:30 PM" },
  { id: "d2", name: "Dr. Vikram Sen", spec: "Neurology", exp: 15, rating: 4.8, fee: 1200, lang: ["English", "Hindi"], online: true, hospital: "MediCore Central", next: "Tomorrow, 10:00 AM" },
  { id: "d3", name: "Dr. Priya Menon", spec: "Pediatrics", exp: 8, rating: 4.9, fee: 600, lang: ["English", "Malayalam"], online: false, hospital: "MediCore North", next: "Today, 5:00 PM" },
  { id: "d4", name: "Dr. Arjun Nair", spec: "Orthopedics", exp: 10, rating: 4.7, fee: 900, lang: ["English", "Tamil"], online: true, hospital: "MediCore Central", next: "Today, 4:15 PM" },
  { id: "d5", name: "Dr. Kavya Iyer", spec: "Dermatology", exp: 6, rating: 4.8, fee: 700, lang: ["English", "Hindi"], online: true, hospital: "MediCore South", next: "Tomorrow, 9:30 AM" },
  { id: "d6", name: "Dr. Rahul Verma", spec: "General Medicine", exp: 9, rating: 4.6, fee: 500, lang: ["English"], online: true, hospital: "MediCore North", next: "Today, 2:00 PM" },
];

const TODAY_PATIENTS = [
  { id: "p1", name: "Meera Krishnan", age: 34, gender: "F", time: "9:00 AM", type: "In-person", status: "Waiting", blood: "O+", allergies: ["Penicillin"], conditions: ["Hypertension"] },
  { id: "p2", name: "Suresh Kumar", age: 52, gender: "M", time: "9:30 AM", type: "Online", status: "Waiting", blood: "B+", allergies: [], conditions: ["Type 2 Diabetes"] },
  { id: "p3", name: "Anitha Raj", age: 29, gender: "F", time: "10:00 AM", type: "In-person", status: "Completed", blood: "A+", allergies: ["Sulfa drugs"], conditions: [] },
  { id: "p4", name: "Karthik Subramaniam", age: 41, gender: "M", time: "10:30 AM", type: "Online", status: "Waiting", blood: "AB+", allergies: [], conditions: ["Asthma"] },
  { id: "p5", name: "Divya Prakash", age: 47, gender: "F", time: "11:00 AM", type: "In-person", status: "Waiting", blood: "O-", allergies: [], conditions: ["Hypothyroidism"] },
];

const APPOINTMENTS_PATIENT = [
  { id: "a1", doctor: "Dr. Ananya Rao", spec: "Cardiology", date: "Aug 15, 2026", time: "3:30 PM", type: "Online", status: "Confirmed" },
  { id: "a2", doctor: "Dr. Kavya Iyer", spec: "Dermatology", date: "Aug 22, 2026", time: "9:30 AM", type: "In-person", status: "Confirmed" },
  { id: "a3", doctor: "Dr. Rahul Verma", spec: "General Medicine", date: "Jul 30, 2026", time: "2:00 PM", type: "In-person", status: "Completed" },
];

const PRESCRIPTIONS = [
  { id: "rx1", doctor: "Dr. Rahul Verma", date: "Jul 30, 2026", meds: [{ name: "Paracetamol 500mg", dose: "1 tablet", freq: "After food, 2x/day", days: 3 }, { name: "Cetirizine 10mg", dose: "1 tablet", freq: "Night", days: 5 }] },
  { id: "rx2", doctor: "Dr. Ananya Rao", date: "Jul 10, 2026", meds: [{ name: "Amlodipine 5mg", dose: "1 tablet", freq: "Morning", days: 30 }] },
];

const LAB_REPORTS = [
  { id: "l1", test: "Complete Blood Count", doctor: "Dr. Rahul Verma", date: "Jul 29, 2026", status: "Completed", priority: "Normal" },
  { id: "l2", test: "Lipid Profile", doctor: "Dr. Ananya Rao", date: "Aug 5, 2026", status: "Processing", priority: "Normal" },
  { id: "l3", test: "ECG", doctor: "Dr. Ananya Rao", date: "Aug 12, 2026", status: "Sample Collected", priority: "High" },
];

const LAB_QUEUE = [
  { id: "lq1", patient: "Suresh Kumar", test: "Blood Test", doctor: "Dr. Rahul Verma", status: "Requested", priority: "Normal", date: "Aug 14" },
  { id: "lq2", patient: "Divya Prakash", test: "X-Ray", doctor: "Dr. Arjun Nair", status: "Sample Collected", priority: "High", date: "Aug 14" },
  { id: "lq3", patient: "Karthik Subramaniam", test: "ECG", doctor: "Dr. Ananya Rao", status: "Processing", priority: "Urgent", date: "Aug 14" },
  { id: "lq4", patient: "Meera Krishnan", test: "MRI", doctor: "Dr. Vikram Sen", status: "Completed", priority: "Normal", date: "Aug 13" },
];

const MEDICINES = [
  { id: "m1", name: "Paracetamol 500mg", cat: "Analgesic", stock: 420, unit: "tablets", expiry: "Dec 2027", supplier: "ApexPharma", price: 1.5, status: "In Stock" },
  { id: "m2", name: "Amoxicillin 250mg", cat: "Antibiotic", stock: 38, unit: "capsules", expiry: "Mar 2027", supplier: "MedLine", price: 4.2, status: "Low Stock" },
  { id: "m3", name: "Metformin 500mg", cat: "Antidiabetic", stock: 210, unit: "tablets", expiry: "Sep 2026", supplier: "ApexPharma", price: 2.1, status: "Expiring Soon" },
  { id: "m4", name: "Cetirizine 10mg", cat: "Antihistamine", stock: 0, unit: "tablets", expiry: "Jan 2028", supplier: "MedLine", price: 1.0, status: "Out of Stock" },
  { id: "m5", name: "Amlodipine 5mg", cat: "Antihypertensive", stock: 156, unit: "tablets", expiry: "Nov 2027", supplier: "CarePlus", price: 3.0, status: "In Stock" },
];

const BILLS = [
  { id: "INV-1042", desc: "Consultation + Lab", amount: 2400, date: "Aug 12, 2026", status: "Paid" },
  { id: "INV-1051", desc: "Pharmacy Order", amount: 340, date: "Aug 13, 2026", status: "Paid" },
  { id: "INV-1058", desc: "Consultation - Dr. Rao", amount: 800, date: "Aug 15, 2026", status: "Pending" },
];

const NOTIFICATIONS = [
  { id: "n1", text: "Your appointment with Dr. Ananya Rao is tomorrow at 3:30 PM.", time: "2h ago", read: false, cat: "Appointment" },
  { id: "n2", text: "Your ECG report is now processing.", time: "5h ago", read: false, cat: "Lab" },
  { id: "n3", text: "Your prescription has been sent to the pharmacy.", time: "1d ago", read: true, cat: "Pharmacy" },
  { id: "n4", text: "Invoice INV-1058 has been generated.", time: "1d ago", read: true, cat: "Billing" },
];

const QUEUE = [
  { token: "A21", patient: "Meera Krishnan", status: "done" },
  { token: "A22", patient: "Suresh Kumar", status: "serving" },
  { token: "A23", patient: "Anitha Raj", status: "waiting" },
  { token: "A24", patient: "Karthik Subramaniam", status: "waiting" },
  { token: "A25", patient: "Divya Prakash", status: "waiting", priority: true },
];

const REVENUE_TREND = [
  { m: "Mar", revenue: 82, patients: 210 }, { m: "Apr", revenue: 95, patients: 240 },
  { m: "May", revenue: 88, patients: 225 }, { m: "Jun", revenue: 110, patients: 270 },
  { m: "Jul", revenue: 128, patients: 305 }, { m: "Aug", revenue: 141, patients: 330 },
];

const DEPT_DIST = [
  { name: "Cardiology", value: 28, color: "#0EA394" },
  { name: "Neurology", value: 18, color: "#3E7BFA" },
  { name: "Orthopedics", value: 22, color: "#DB9A34" },
  { name: "Pediatrics", value: 16, color: "#DD4B4E" },
  { name: "General", value: 16, color: "#15305C" },
];

const BEDS = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  status: ["Available", "Occupied", "Occupied", "Reserved", "Cleaning", "Occupied"][i % 6],
}));

/* ============================= PRIMITIVES ============================= */
const Badge = ({ children, tone = "neutral" }) => {
  const tones = {
    neutral: { bg: "#EEF1F5", fg: COLORS.muted },
    success: { bg: "#E6F7EE", fg: COLORS.success },
    warning: { bg: "#FBF1E1", fg: COLORS.warning },
    error: { bg: "#FCEBEC", fg: COLORS.error },
    info: { bg: "#E9F0FF", fg: COLORS.info },
    teal: { bg: COLORS.tealSoft, fg: COLORS.teal },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{ background: t.bg, color: t.fg }} className="text-xs font-semibold px-2.5 py-1 rounded-full font-body whitespace-nowrap">
      {children}
    </span>
  );
};

const Card = ({ children, className = "", style = {}, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-2xl border fade-up ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""} ${className}`}
    style={{ borderColor: COLORS.border, boxShadow: "0 1px 2px rgba(11,30,61,0.04)", ...style }}
  >
    {children}
  </div>
);

const Button = ({ children, variant = "primary", size = "md", className = "", icon: Icon, ...props }) => {
  const base = "font-body font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = { sm: "text-sm px-3 py-1.5", md: "text-sm px-4 py-2.5", lg: "text-base px-6 py-3" };
  const variants = {
    primary: { background: COLORS.navy, color: "#fff" },
    teal: { background: COLORS.teal, color: "#fff" },
    outline: { background: "transparent", color: COLORS.navy, border: `1.5px solid ${COLORS.border}` },
    ghost: { background: "transparent", color: COLORS.muted },
    danger: { background: "#FCEBEC", color: COLORS.error },
  };
  return (
    <button
      className={`${base} ${sizes[size]} ${className} hover:opacity-90 active:scale-[0.98]`}
      style={variants[variant]}
      {...props}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

const StatCard = ({ label, value, delta, icon: Icon, tone = "teal" }) => {
  const tones = { teal: COLORS.teal, navy: COLORS.navy, warning: COLORS.warning, error: COLORS.error, info: COLORS.info };
  return (
    <Card className="p-5 flex-1 min-w-[150px]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-body text-slate-500 mb-1">{label}</p>
          <p className="text-2xl font-display font-bold" style={{ color: COLORS.text }}>{value}</p>
          {delta && <p className="text-xs font-body mt-1" style={{ color: COLORS.success }}>{delta}</p>}
        </div>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${tones[tone]}18` }}>
          <Icon size={18} color={tones[tone]} />
        </div>
      </div>
    </Card>
  );
};

const Modal = ({ open, onClose, title, children, wide }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(11,30,61,0.45)" }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-2xl w-full ${wide ? "max-w-2xl" : "max-w-md"} max-h-[88vh] overflow-y-auto fade-up`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white rounded-t-2xl" style={{ borderColor: COLORS.border }}>
          <h3 className="font-display font-bold text-lg" style={{ color: COLORS.text }}>{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const Toast = ({ toast }) => {
  if (!toast) return null;
  return (
    <div className="fixed top-5 right-5 z-[100] toast-in">
      <div className="flex items-center gap-2.5 bg-white border rounded-xl px-4 py-3 shadow-lg" style={{ borderColor: COLORS.border }}>
        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: "#E6F7EE" }}>
          <Check size={14} color={COLORS.success} />
        </div>
        <p className="text-sm font-body font-medium" style={{ color: COLORS.text }}>{toast}</p>
      </div>
    </div>
  );
};

const EmptyState = ({ icon: Icon, title, desc, action }) => (
  <div className="flex flex-col items-center text-center py-14 px-6">
    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: COLORS.tealSoft }}>
      <Icon size={26} color={COLORS.teal} />
    </div>
    <p className="font-display font-bold" style={{ color: COLORS.text }}>{title}</p>
    <p className="text-sm font-body text-slate-500 mt-1 max-w-xs">{desc}</p>
    {action}
  </div>
);

const Skeleton = ({ className }) => <div className={`skel rounded-xl ${className}`} />;

const Input = ({ label, ...props }) => (
  <label className="block mb-4">
    {label && <span className="text-sm font-body font-medium block mb-1.5" style={{ color: COLORS.text }}>{label}</span>}
    <input
      {...props}
      className="w-full px-3.5 py-2.5 rounded-xl border font-body text-sm focus:outline-none focus:ring-2 transition-all"
      style={{ borderColor: COLORS.border, "--tw-ring-color": COLORS.teal }}
    />
  </label>
);

const Select = ({ label, children, ...props }) => (
  <label className="block mb-4">
    {label && <span className="text-sm font-body font-medium block mb-1.5" style={{ color: COLORS.text }}>{label}</span>}
    <select {...props} className="w-full px-3.5 py-2.5 rounded-xl border font-body text-sm focus:outline-none focus:ring-2" style={{ borderColor: COLORS.border }}>
      {children}
    </select>
  </label>
);

/* Signature element: animated ECG mark used as the logo glyph */
const ECGMark = ({ size = 30, stroke = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="11" fill={COLORS.teal} />
    <path className="ecg-path" d="M4 21H12L15 12L20 29L23 21H27L30 15L33 21H36" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ============================= LANDING PAGE ============================= */
function Landing({ goto }) {
  const [faqOpen, setFaqOpen] = useState(0);
  const stats = [
    { label: "Patients", value: "25K+" }, { label: "Doctors", value: "150+" },
    { label: "Satisfaction", value: "98%" }, { label: "Care", value: "24/7" },
  ];
  const services = [
    { icon: Stethoscope, title: "Doctor Appointments", desc: "Book with verified specialists in seconds, in-person or online." },
    { icon: Video, title: "Telemedicine", desc: "Consult from anywhere with secure, high-quality video visits." },
    { icon: FlaskConical, title: "Laboratory", desc: "Track requests from sample collection to digital reports." },
    { icon: Pill, title: "Pharmacy", desc: "Prescriptions routed straight to dispensing, with live stock." },
    { icon: FileText, title: "Medical Records", desc: "One longitudinal timeline for every visit, test and script." },
    { icon: CreditCard, title: "Billing", desc: "Transparent invoices and one-tap payments, no surprises." },
  ];
  const faqs = [
    { q: "Is my medical data secure?", a: "Every record is protected with role-based access control, encryption, and a full audit trail — only authorized clinicians can view sensitive data." },
    { q: "Can I consult a doctor online?", a: "Yes. Choose 'Online' when booking and join a secure video consultation at your scheduled time." },
    { q: "How do I get my lab reports?", a: "Reports appear in your dashboard the moment the lab uploads them, with a notification sent instantly." },
  ];
  return (
    <div className="font-body" style={{ background: COLORS.bg, color: COLORS.text }}>
      {/* NAV */}
      <nav className="sticky top-0 z-40 backdrop-blur bg-white/85 border-b" style={{ borderColor: COLORS.border }}>
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ECGMark size={34} />
            <span className="font-display font-extrabold text-lg tracking-tight">MediCore</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            {["Home", "Services", "Doctors", "About", "FAQ", "Contact"].map((l) => <span key={l} className="hover:text-slate-900 cursor-pointer">{l}</span>)}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => goto("login")}>Login</Button>
            <Button variant="teal" size="sm" onClick={() => goto("register")}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="max-w-7xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <Badge tone="teal">DevFusion 4.O · Hackathon Build</Badge>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl leading-[1.08] mt-5" style={{ color: COLORS.navy }}>
            Healthcare, Connected.<br />Care, Simplified.
          </h1>
          <p className="text-slate-500 text-lg mt-5 max-w-md">One intelligent platform connecting patients, doctors, laboratories, pharmacies and hospitals.</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Button variant="teal" size="lg" icon={Calendar} onClick={() => goto("register")}>Book an Appointment</Button>
            <Button variant="outline" size="lg" icon={Search} onClick={() => goto("register")}>Explore Doctors</Button>
          </div>
          <div className="flex flex-wrap gap-8 mt-12">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display font-extrabold text-2xl" style={{ color: COLORS.navy }}>{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="rounded-3xl p-6 shadow-xl" style={{ background: COLORS.navy }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 text-white/90 text-sm font-medium"><ECGMark size={22} /> Live Overview</div>
              <Badge tone="teal">Today</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[["Patients Today", "142"], ["Revenue", "₹1.4L"], ["Beds Free", "9/24"], ["Avg Wait", "12m"]].map(([l, v]) => (
                <div key={l} className="bg-white/10 rounded-xl p-3.5">
                  <p className="text-white/60 text-xs">{l}</p>
                  <p className="text-white font-display font-bold text-xl mt-1">{v}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-4">
              <p className="text-xs text-slate-500 font-semibold mb-2">Revenue Trend</p>
              <ResponsiveContainer width="100%" height={110}>
                <AreaChart data={REVENUE_TREND}>
                  <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={COLORS.teal} stopOpacity={0.35} /><stop offset="100%" stopColor={COLORS.teal} stopOpacity={0} /></linearGradient></defs>
                  <Area type="monotone" dataKey="revenue" stroke={COLORS.teal} strokeWidth={2.5} fill="url(#g1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </header>

      {/* SERVICES */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="font-display font-extrabold text-2xl mb-8">Everything a hospital needs, in one place</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <Card key={s.title} className="p-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: COLORS.tealSoft }}>
                <s.icon size={19} color={COLORS.teal} />
              </div>
              <p className="font-display font-bold">{s.title}</p>
              <p className="text-sm text-slate-500 mt-1.5">{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* DOCTORS */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display font-extrabold text-2xl">Meet our specialists</h2>
          <Button variant="outline" size="sm" onClick={() => goto("register")}>View all doctors</Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DOCTORS.slice(0, 3).map((d) => (
            <Card key={d.id} className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-white" style={{ background: COLORS.navy }}>
                  {d.name.split(" ").map((n) => n[0]).slice(-2).join("")}
                </div>
                <div>
                  <p className="font-display font-bold text-sm">{d.name}</p>
                  <p className="text-xs text-slate-500">{d.spec} · {d.exp} yrs</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1"><Star size={13} fill="#DB9A34" color="#DB9A34" /> {d.rating}</span>
                <span>·</span><span>{d.lang.join(", ")}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-display font-bold">₹{d.fee}</p>
                <Button size="sm" variant="teal" onClick={() => goto("register")}>Book</Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16" style={{ background: COLORS.navy }}>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          {[
            ["MediCore cut our OPD wait times in half within a month.", "Dr. S. Iyengar, Hospital Admin"],
            ["Booking, reports, prescriptions — all in one app. It just works.", "Ramesh N., Patient"],
            ["The queue and pharmacy modules finally talk to each other.", "Priyanka T., Pharmacist"],
          ].map(([q, a]) => (
            <div key={a} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-white/90 text-sm leading-relaxed">"{q}"</p>
              <p className="text-teal-300 text-xs font-semibold mt-4" style={{ color: COLORS.teal }}>{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="font-display font-extrabold text-2xl mb-8">Frequently asked questions</h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <Card key={f.q} className="p-5 cursor-pointer" onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}>
              <div className="flex items-center justify-between">
                <p className="font-display font-semibold text-sm">{f.q}</p>
                <ChevronRight size={16} className="transition-transform" style={{ transform: faqOpen === i ? "rotate(90deg)" : "none" }} />
              </div>
              {faqOpen === i && <p className="text-sm text-slate-500 mt-3">{f.a}</p>}
            </Card>
          ))}
        </div>
      </section>

      {/* EMERGENCY */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4" style={{ background: "#FCEBEC" }}>
          <div className="flex items-center gap-3">
            <AlertTriangle color={COLORS.error} />
            <div>
              <p className="font-display font-bold text-sm" style={{ color: COLORS.error }}>Medical emergency?</p>
              <p className="text-xs text-slate-600">Call our 24/7 emergency line immediately.</p>
            </div>
          </div>
          <Button variant="danger" icon={Phone}>Call 1800-MEDI-911</Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-12" style={{ borderColor: COLORS.border }}>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-5 gap-8 text-sm">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3"><ECGMark size={26} /><span className="font-display font-bold">MediCore</span></div>
            <p className="text-slate-500 text-sm max-w-xs">Healthcare, connected. Built for DevFusion 4.O.</p>
          </div>
          {[["About", ["Our story", "Careers", "Press"]], ["Resources", ["Blog", "Help center", "API docs"]], ["Legal", ["Privacy", "Terms", "Contact"]]].map(([h, items]) => (
            <div key={h}>
              <p className="font-display font-semibold mb-3">{h}</p>
              {items.map((it) => <p key={it} className="text-slate-500 mb-2">{it}</p>)}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

/* ============================= AUTH ============================= */
function AuthScreen({ mode, goto, onLogin }) {
  const [role, setRole] = useState("Patient");
  const demoRoles = ["Patient", "Doctor", "Receptionist", "Lab Staff", "Pharmacist", "Admin"];
  return (
    <div className="min-h-screen font-body flex items-center justify-center p-6" style={{ background: COLORS.bg }}>
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 justify-center mb-8"><ECGMark size={32} /><span className="font-display font-extrabold text-xl">MediCore</span></div>
        <Card className="p-7">
          <div className="flex gap-2 mb-6">
            <button onClick={() => goto("login")} className="flex-1 text-sm font-semibold py-2 rounded-lg font-body" style={{ background: mode === "login" ? COLORS.navy : "transparent", color: mode === "login" ? "#fff" : COLORS.muted }}>Login</button>
            <button onClick={() => goto("register")} className="flex-1 text-sm font-semibold py-2 rounded-lg font-body" style={{ background: mode === "register" ? COLORS.navy : "transparent", color: mode === "register" ? "#fff" : COLORS.muted }}>Register</button>
          </div>

          {mode === "register" && (
            <div className="flex gap-2 mb-5">
              {["Patient", "Doctor"].map((r) => (
                <button key={r} onClick={() => setRole(r)} className="flex-1 text-sm font-semibold py-2 rounded-xl border" style={{ borderColor: role === r ? COLORS.teal : COLORS.border, color: role === r ? COLORS.teal : COLORS.muted, background: role === r ? COLORS.tealSoft : "transparent" }}>{r}</button>
              ))}
            </div>
          )}

          <Input label="Email address" type="email" placeholder="you@example.com" defaultValue="jiya@medicore.app" />
          <Input label="Password" type="password" placeholder="••••••••" defaultValue="••••••••" />
          {mode === "register" && role === "Patient" && (
            <div className="grid grid-cols-2 gap-3">
              <Input label="Full name" placeholder="Full name" />
              <Input label="Phone" placeholder="+91" />
              <Select label="Gender"><option>Female</option><option>Male</option><option>Other</option></Select>
              <Select label="Blood group">{["O+", "A+", "B+", "AB+", "O-"].map((b) => <option key={b}>{b}</option>)}</Select>
            </div>
          )}
          {mode === "register" && role === "Doctor" && (
            <div className="grid grid-cols-2 gap-3">
              <Input label="Full name" placeholder="Full name" />
              <Select label="Specialization">{DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}</Select>
              <Input label="Experience (yrs)" type="number" placeholder="5" />
              <Input label="License doc" type="file" />
            </div>
          )}

          {mode === "login" && (
            <div className="flex items-center justify-between mb-5 text-xs font-body">
              <label className="flex items-center gap-1.5 text-slate-500"><input type="checkbox" /> Remember me</label>
              <span className="text-teal-600 font-semibold cursor-pointer" style={{ color: COLORS.teal }}>Forgot password?</span>
            </div>
          )}

          <Button variant="teal" className="w-full mb-3" onClick={() => onLogin(mode === "register" ? role : "Patient")}>
            {mode === "login" ? "Login" : "Create account"}
          </Button>
          <Button variant="outline" className="w-full">Continue with Google</Button>

          <div className="mt-6 pt-5 border-t" style={{ borderColor: COLORS.border }}>
            <p className="text-xs text-slate-400 font-semibold mb-2.5 uppercase tracking-wide">Quick demo login</p>
            <div className="flex flex-wrap gap-2">
              {demoRoles.map((r) => (
                <button key={r} onClick={() => onLogin(r)} className="text-xs font-semibold px-3 py-1.5 rounded-full border hover:bg-slate-50" style={{ borderColor: COLORS.border, color: COLORS.navy }}>{r}</button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ============================= APP SHELL ============================= */
const NAV_BY_ROLE = {
  Patient: [
    ["overview", "Overview", LayoutDashboard], ["doctors", "Find Doctors", Search], ["appointments", "Appointments", Calendar],
    ["records", "Medical Records", FileText], ["prescriptions", "Prescriptions", ClipboardList], ["lab", "Lab Reports", FlaskConical],
    ["pharmacy", "Pharmacy", Pill], ["bills", "Bills & Payments", CreditCard], ["family", "Family Members", Users],
  ],
  Doctor: [["overview", "Overview", LayoutDashboard], ["patients", "Today's Patients", Users], ["calendar", "Calendar", Calendar], ["records", "Patient Records", FileText]],
  Receptionist: [["overview", "Overview", LayoutDashboard], ["queue", "Queue", Users], ["checkin", "QR Check-in", QrCode], ["appointments", "Appointments", Calendar]],
  "Lab Staff": [["overview", "Overview", LayoutDashboard], ["lab", "Test Requests", FlaskConical], ["reports", "Reports", FileText]],
  Pharmacist: [["overview", "Overview", LayoutDashboard], ["inventory", "Inventory", Package], ["fulfillment", "Prescriptions", Pill]],
  Admin: [["overview", "Overview", LayoutDashboard], ["analytics", "Analytics", BarChart3], ["departments", "Departments", Building2], ["beds", "Bed Management", BedDouble], ["audit", "Audit Logs", ShieldCheck]],
};

function Sidebar({ role, view, setView, mobileOpen, setMobileOpen, onLogout }) {
  const items = NAV_BY_ROLE[role] || [];
  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed lg:sticky top-0 h-screen z-40 w-64 shrink-0 flex flex-col transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`} style={{ background: COLORS.navy }}>
        <div className="flex items-center gap-2.5 px-6 py-5">
          <ECGMark size={30} /><span className="text-white font-display font-extrabold text-lg">MediCore</span>
        </div>
        <div className="px-5 pb-3">
          <Badge tone="teal">{role} Portal</Badge>
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {items.map(([key, label, Icon]) => (
            <button key={key} onClick={() => { setView(key); setMobileOpen(false); }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-body font-medium transition-colors"
              style={{ background: view === key ? "rgba(14,163,148,0.18)" : "transparent", color: view === key ? "#5FE0CE" : "rgba(255,255,255,0.68)" }}>
              <Icon size={17} /> {label}
            </button>
          ))}
        </nav>
        <div className="px-3 pb-5 pt-2 border-t border-white/10 space-y-1">
          <button onClick={() => alert("Settings — prototype only")} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white"><Settings size={17} /> Settings</button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white"><LogOut size={17} /> Log out</button>
        </div>
      </aside>
    </>
  );
}

function Topbar({ role, setMobileOpen, notifOpen, setNotifOpen, dark, setDark }) {
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;
  return (
    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4" style={{ borderColor: COLORS.border }}>
      <div className="flex items-center gap-3 flex-1">
        <button className="lg:hidden" onClick={() => setMobileOpen(true)}><Menu size={22} /></button>
        <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-xl px-3.5 py-2 flex-1 max-w-md">
          <Search size={16} color={COLORS.muted} />
          <input placeholder="Search patients, doctors, records… (Ctrl+K)" className="bg-transparent text-sm font-body outline-none flex-1" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => setDark(!dark)} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100">{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
        <button onClick={() => setNotifOpen(!notifOpen)} className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100">
          <Bell size={17} />
          {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: COLORS.error }} />}
        </button>
        <div className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-white text-sm" style={{ background: COLORS.teal }}>JD</div>
      </div>
    </div>
  );
}

function NotificationPanel({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed right-4 top-16 z-50 w-80 fade-up">
      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: COLORS.border }}>
          <p className="font-display font-bold text-sm">Notifications</p>
          <button className="text-xs font-semibold" style={{ color: COLORS.teal }}>Mark all read</button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {NOTIFICATIONS.map((n) => (
            <div key={n.id} className="px-4 py-3 border-b last:border-0 flex gap-2.5" style={{ borderColor: COLORS.border, background: n.read ? "transparent" : "#F3FBFA" }}>
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: n.read ? "transparent" : COLORS.teal }} />
              <div>
                <p className="text-sm font-body">{n.text}</p>
                <p className="text-xs text-slate-400 mt-0.5">{n.time} · {n.cat}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ============================= PATIENT VIEWS ============================= */
function PatientOverview({ setView, openBooking }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl">Welcome back, Jiya 👋</h1>
        <p className="text-slate-500 text-sm mt-1">Here's what's happening with your health today.</p>
      </div>
      <div className="flex flex-wrap gap-4">
        <StatCard label="Upcoming Appointment" value="Aug 15" icon={Calendar} tone="teal" />
        <StatCard label="Pending Lab Reports" value="2" icon={FlaskConical} tone="info" />
        <StatCard label="Active Prescriptions" value="2" icon={Pill} tone="navy" />
        <StatCard label="Outstanding Bills" value="₹800" icon={CreditCard} tone="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="font-display font-bold">Upcoming Appointment</p>
            <Badge tone="success">Confirmed</Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-white shrink-0" style={{ background: COLORS.navy }}>AR</div>
            <div className="flex-1">
              <p className="font-display font-bold">Dr. Ananya Rao</p>
              <p className="text-sm text-slate-500">Cardiology · Online consultation</p>
              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1"><Clock size={13} /> Aug 15, 2026 · 3:30 PM</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="teal" size="sm" icon={Video} onClick={() => setView("telemedicine")}>Join</Button>
              <Button variant="outline" size="sm">Reschedule</Button>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <p className="font-display font-bold mb-4">Health Snapshot</p>
          <div className="space-y-3">
            {[["Heart rate", "76 bpm", Heart, COLORS.error], ["Blood pressure", "118/76", Activity, COLORS.info], ["BMI", "22.4", TrendingUp, COLORS.teal]].map(([l, v, Icon, c]) => (
              <div key={l} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${c}18` }}><Icon size={15} color={c} /></div>
                <div className="flex-1"><p className="text-xs text-slate-500">{l}</p><p className="font-display font-bold text-sm">{v}</p></div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <p className="font-display font-bold mb-4">Vitals Trend (30 days)</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={REVENUE_TREND}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="m" tick={{ fontSize: 12 }} stroke={COLORS.muted} />
            <YAxis tick={{ fontSize: 12 }} stroke={COLORS.muted} />
            <Tooltip />
            <Line type="monotone" dataKey="patients" name="Heart rate (avg)" stroke={COLORS.teal} strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <p className="font-display font-bold mb-4">Recent Prescriptions</p>
          {PRESCRIPTIONS.slice(0, 2).map((rx) => (
            <div key={rx.id} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: COLORS.border }}>
              <div><p className="text-sm font-semibold">{rx.meds[0].name}</p><p className="text-xs text-slate-400">{rx.doctor} · {rx.date}</p></div>
              <ChevronRight size={16} color={COLORS.muted} />
            </div>
          ))}
        </Card>
        <Card className="p-6">
          <p className="font-display font-bold mb-4">Recent Lab Reports</p>
          {LAB_REPORTS.map((l) => (
            <div key={l.id} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: COLORS.border }}>
              <div><p className="text-sm font-semibold">{l.test}</p><p className="text-xs text-slate-400">{l.date}</p></div>
              <Badge tone={l.status === "Completed" ? "success" : l.status === "Processing" ? "warning" : "info"}>{l.status}</Badge>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function FindDoctors({ openBooking }) {
  const [q, setQ] = useState("");
  const [specFilter, setSpecFilter] = useState("All");
  const filtered = DOCTORS.filter((d) => (specFilter === "All" || d.spec === specFilter) && d.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl">Find Doctors</h1>
        <p className="text-slate-500 text-sm mt-1">{filtered.length} specialists available</p>
      </div>
      <Card className="p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3.5 py-2.5 flex-1 min-w-[200px]">
          <Search size={16} color={COLORS.muted} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search doctors, specialties…" className="bg-transparent text-sm outline-none flex-1" />
        </div>
        <select value={specFilter} onChange={(e) => setSpecFilter(e.target.value)} className="px-3.5 py-2.5 rounded-xl border text-sm" style={{ borderColor: COLORS.border }}>
          <option>All</option>{DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <Button variant="outline" size="sm" icon={Filter}>More Filters</Button>
      </Card>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((d) => (
          <Card key={d.id} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-white" style={{ background: COLORS.navy }}>{d.name.split(" ").slice(-2).map((n) => n[0]).join("")}</div>
                <div><p className="font-display font-bold text-sm flex items-center gap-1">{d.name} <ShieldCheck size={13} color={COLORS.teal} /></p><p className="text-xs text-slate-500">{d.spec}</p></div>
              </div>
              {d.online && <Badge tone="success">Online</Badge>}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
              <span className="flex items-center gap-1"><Star size={13} fill="#DB9A34" color="#DB9A34" />{d.rating}</span>
              <span>{d.exp} yrs exp</span><span>{d.hospital}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
              <span>Next: {d.next}</span><span className="font-display font-bold text-sm" style={{ color: COLORS.text }}>₹{d.fee}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">Profile</Button>
              <Button variant="teal" size="sm" className="flex-1" onClick={() => openBooking(d)}>Book</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function BookingWizard({ open, onClose, doctor, onConfirm }) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState("Online");
  const [date, setDate] = useState("Aug 15, 2026");
  const [slot, setSlot] = useState("3:30 PM");
  const [reason, setReason] = useState("");
  useEffect(() => { if (open) setStep(1); }, [open]);
  if (!doctor) return null;
  const slots = ["9:00 AM", "10:30 AM", "12:00 PM", "2:00 PM", "3:30 PM", "5:00 PM"];
  const dates = ["Aug 14, 2026", "Aug 15, 2026", "Aug 16, 2026", "Aug 17, 2026"];
  return (
    <Modal open={open} onClose={onClose} title={`Book with ${doctor.name}`} wide>
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex-1 h-1.5 rounded-full" style={{ background: s <= step ? COLORS.teal : COLORS.border }} />
        ))}
      </div>
      {step === 1 && (
        <div className="fade-up">
          <p className="font-display font-bold mb-3 text-sm">Consultation type</p>
          <div className="grid grid-cols-2 gap-3">
            {["Online", "Offline"].map((t) => (
              <button key={t} onClick={() => setType(t)} className="p-4 rounded-xl border text-left" style={{ borderColor: type === t ? COLORS.teal : COLORS.border, background: type === t ? COLORS.tealSoft : "transparent" }}>
                {t === "Online" ? <Video size={18} color={COLORS.teal} /> : <MapPin size={18} color={COLORS.teal} />}
                <p className="font-semibold text-sm mt-2">{t} consultation</p>
                <p className="text-xs text-slate-500">{t === "Online" ? "Video call from anywhere" : `At ${doctor.hospital}`}</p>
              </button>
            ))}
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="fade-up">
          <p className="font-display font-bold mb-3 text-sm">Choose date</p>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {dates.map((d) => (
              <button key={d} onClick={() => setDate(d)} className="p-3 rounded-xl border text-center text-xs font-semibold" style={{ borderColor: date === d ? COLORS.teal : COLORS.border, background: date === d ? COLORS.tealSoft : "transparent" }}>{d.split(",")[0]}</button>
            ))}
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="fade-up">
          <p className="font-display font-bold mb-3 text-sm">Available slots — {date}</p>
          <div className="grid grid-cols-3 gap-2">
            {slots.map((s) => (
              <button key={s} onClick={() => setSlot(s)} className="p-2.5 rounded-xl border text-xs font-semibold" style={{ borderColor: slot === s ? COLORS.teal : COLORS.border, background: slot === s ? COLORS.tealSoft : "transparent" }}>{s}</button>
            ))}
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="fade-up">
          <p className="font-display font-bold mb-3 text-sm">Reason for visit</p>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="Briefly describe your symptoms or reason…" className="w-full p-3 rounded-xl border text-sm mb-4" style={{ borderColor: COLORS.border }} />
          <Card className="p-4" style={{ background: COLORS.tealSoft }}>
            <p className="text-xs font-semibold text-slate-500 mb-2">Summary</p>
            <p className="text-sm">{doctor.name} · {type} · {date} · {slot}</p>
            <p className="text-sm font-display font-bold mt-1">Fee: ₹{doctor.fee}</p>
          </Card>
        </div>
      )}
      <div className="flex justify-between mt-7">
        <Button variant="ghost" onClick={() => step > 1 ? setStep(step - 1) : onClose()} icon={ChevronLeft}>{step > 1 ? "Back" : "Cancel"}</Button>
        {step < 4 ? <Button variant="teal" onClick={() => setStep(step + 1)}>Continue</Button> : <Button variant="teal" icon={Check} onClick={() => onConfirm({ doctor, type, date, slot, reason })}>Confirm Appointment</Button>}
      </div>
    </Modal>
  );
}

function AppointmentConfirmed({ open, onClose, data }) {
  if (!data) return null;
  return (
    <Modal open={open} onClose={onClose} title="Appointment Confirmed">
      <div className="text-center py-2">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#E6F7EE" }}><CheckCircle2 size={32} color={COLORS.success} /></div>
        <p className="font-display font-bold text-lg">You're all set!</p>
        <p className="text-sm text-slate-500 mt-1 mb-5">Appointment ID: #APT{Math.floor(Math.random() * 90000 + 10000)}</p>
        <Card className="p-4 text-left mb-5">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Doctor</span><span className="font-semibold">{data.doctor.name}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Type</span><span className="font-semibold">{data.type}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Date & Time</span><span className="font-semibold">{data.date}, {data.slot}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Fee</span><span className="font-semibold">₹{data.doctor.fee}</span></div>
          </div>
        </Card>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" icon={Calendar}>Add to Calendar</Button>
          <Button variant="outline" className="flex-1" icon={Download}>Download</Button>
        </div>
        <Button variant="teal" className="w-full mt-3" onClick={onClose}>Done</Button>
      </div>
    </Modal>
  );
}

function PatientAppointments() {
  return (
    <div className="space-y-6">
      <h1 className="font-display font-extrabold text-2xl">Appointments</h1>
      <div className="space-y-3">
        {APPOINTMENTS_PATIENT.map((a) => (
          <Card key={a.id} className="p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-white shrink-0" style={{ background: COLORS.navy }}>{a.doctor.split(" ").slice(-1)[0][0]}</div>
              <div>
                <p className="font-display font-bold text-sm">{a.doctor}</p>
                <p className="text-xs text-slate-500">{a.spec} · {a.type} · {a.date}, {a.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={a.status === "Confirmed" ? "success" : "neutral"}>{a.status}</Badge>
              {a.status === "Confirmed" && <><Button variant="outline" size="sm">Reschedule</Button><Button variant="danger" size="sm">Cancel</Button></>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PatientPrescriptions() {
  return (
    <div className="space-y-6">
      <h1 className="font-display font-extrabold text-2xl">Prescriptions</h1>
      {PRESCRIPTIONS.map((rx) => (
        <Card key={rx.id} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div><p className="font-display font-bold text-sm">{rx.doctor}</p><p className="text-xs text-slate-500">{rx.date}</p></div>
            <Button variant="outline" size="sm" icon={Download}>PDF</Button>
          </div>
          <div className="space-y-2">
            {rx.meds.map((m) => (
              <div key={m.name} className="flex items-center justify-between py-2 border-b last:border-0 text-sm" style={{ borderColor: COLORS.border }}>
                <span className="font-semibold">{m.name}</span>
                <span className="text-slate-500 text-xs">{m.dose} · {m.freq} · {m.days} days</span>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function PatientLab() {
  return (
    <div className="space-y-6">
      <h1 className="font-display font-extrabold text-2xl">Lab Reports</h1>
      <div className="space-y-3">
        {LAB_REPORTS.map((l) => (
          <Card key={l.id} className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: COLORS.tealSoft }}><FlaskConical size={17} color={COLORS.teal} /></div>
              <div><p className="font-semibold text-sm">{l.test}</p><p className="text-xs text-slate-500">{l.doctor} · {l.date}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone={l.status === "Completed" ? "success" : l.status === "Processing" ? "warning" : "info"}>{l.status}</Badge>
              {l.status === "Completed" && <Button size="sm" variant="outline" icon={Download}>View</Button>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PatientBills({ toast }) {
  const [payingId, setPayingId] = useState(null);
  const [paid, setPaid] = useState({});
  const pay = (id) => { setPayingId(id); setTimeout(() => { setPaid((p) => ({ ...p, [id]: true })); setPayingId(null); toast("Payment successful — invoice updated."); }, 1400); };
  return (
    <div className="space-y-6">
      <h1 className="font-display font-extrabold text-2xl">Bills & Payments</h1>
      <div className="space-y-3">
        {BILLS.map((b) => {
          const isPaid = b.status === "Paid" || paid[b.id];
          return (
            <Card key={b.id} className="p-5 flex flex-wrap items-center justify-between gap-3">
              <div><p className="font-semibold text-sm">{b.id} — {b.desc}</p><p className="text-xs text-slate-500">{b.date}</p></div>
              <div className="flex items-center gap-3">
                <p className="font-display font-bold">₹{b.amount}</p>
                <Badge tone={isPaid ? "success" : "warning"}>{isPaid ? "Paid" : "Pending"}</Badge>
                {!isPaid && <Button size="sm" variant="teal" onClick={() => pay(b.id)} disabled={payingId === b.id}>{payingId === b.id ? <Loader2 size={14} className="animate-spin" /> : "Pay Now"}</Button>}
                {isPaid && <Button size="sm" variant="outline" icon={Download}>Invoice</Button>}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function MedicalTimeline() {
  const events = [
    { date: "Aug 12, 2026", title: "ECG requested", type: "Lab", icon: FlaskConical },
    { date: "Jul 30, 2026", title: "Consultation — Dr. Rahul Verma", type: "Visit", icon: Stethoscope },
    { date: "Jul 30, 2026", title: "Prescription issued", type: "Prescription", icon: Pill },
    { date: "Jul 10, 2026", title: "Follow-up — Hypertension review", type: "Visit", icon: Stethoscope },
    { date: "Jun 2, 2026", title: "Annual vaccination — Tdap", type: "Vaccination", icon: ShieldCheck },
  ];
  return (
    <div className="space-y-6">
      <h1 className="font-display font-extrabold text-2xl">Medical Records</h1>
      <Card className="p-6">
        <div className="space-y-0">
          {events.map((e, i) => (
            <div key={i} className="flex gap-4 relative">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: COLORS.tealSoft }}><e.icon size={15} color={COLORS.teal} /></div>
                {i < events.length - 1 && <div className="w-px flex-1" style={{ background: COLORS.border }} />}
              </div>
              <div className="pb-7">
                <p className="text-xs text-slate-400">{e.date}</p>
                <p className="font-semibold text-sm mt-0.5">{e.title}</p>
                <Badge tone="neutral">{e.type}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function FamilyMembers() {
  const members = [
    { name: "Radha Darshini", rel: "Mother", age: 58, upcoming: 1 },
    { name: "Arun Darshini", rel: "Father", age: 61, upcoming: 0 },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-extrabold text-2xl">Family Members</h1>
        <Button variant="teal" size="sm" icon={Plus}>Add Member</Button>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {members.map((m) => (
          <Card key={m.name} className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-white" style={{ background: COLORS.navy }}>{m.name[0]}</div>
              <div><p className="font-semibold text-sm">{m.name}</p><p className="text-xs text-slate-500">{m.rel} · {m.age} yrs</p></div>
            </div>
            <Button variant="outline" size="sm">Switch</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================= DOCTOR VIEWS ============================= */
function DoctorOverview({ setView, openPatient }) {
  return (
    <div className="space-y-6">
      <h1 className="font-display font-extrabold text-2xl">Good morning, Dr. Rao</h1>
      <div className="flex flex-wrap gap-4">
        <StatCard label="Today's Patients" value="5" icon={Users} tone="teal" />
        <StatCard label="Upcoming" value="3" icon={Calendar} tone="info" />
        <StatCard label="Pending Reports" value="2" icon={FlaskConical} tone="warning" />
        <StatCard label="Total Patients" value="1,284" icon={UserCheck} tone="navy" />
      </div>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4"><p className="font-display font-bold">Today's Appointments</p><Button variant="outline" size="sm" onClick={() => setView("patients")}>View all</Button></div>
        <div className="space-y-2">
          {TODAY_PATIENTS.slice(0, 4).map((p) => (
            <div key={p.id} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: COLORS.border }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-white text-xs" style={{ background: COLORS.navy }}>{p.name[0]}</div>
                <div><p className="text-sm font-semibold">{p.name}</p><p className="text-xs text-slate-500">{p.age}{p.gender} · {p.time} · {p.type}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={p.status === "Completed" ? "success" : "info"}>{p.status}</Badge>
                <Button size="sm" variant="teal" onClick={() => openPatient(p)}>{p.status === "Completed" ? "View" : "Start"}</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-6">
        <p className="font-display font-bold mb-4">Patient Volume (6mo)</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={REVENUE_TREND}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="m" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip />
            <Bar dataKey="patients" fill={COLORS.teal} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function DoctorPatients({ openPatient }) {
  return (
    <div className="space-y-6">
      <h1 className="font-display font-extrabold text-2xl">Today's Patients</h1>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-slate-500 border-b" style={{ borderColor: COLORS.border }}>
            {["Patient", "Age", "Time", "Type", "Status", ""].map((h) => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}
          </tr></thead>
          <tbody>
            {TODAY_PATIENTS.map((p) => (
              <tr key={p.id} className="border-b last:border-0" style={{ borderColor: COLORS.border }}>
                <td className="px-5 py-3 font-semibold">{p.name}</td>
                <td className="px-5 py-3 text-slate-500">{p.age}{p.gender}</td>
                <td className="px-5 py-3 text-slate-500">{p.time}</td>
                <td className="px-5 py-3 text-slate-500">{p.type}</td>
                <td className="px-5 py-3"><Badge tone={p.status === "Completed" ? "success" : "info"}>{p.status}</Badge></td>
                <td className="px-5 py-3 text-right"><Button size="sm" variant="outline" onClick={() => openPatient(p)}>Open</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function PatientRecordModal({ patient, onClose, onPrescribe }) {
  const [tab, setTab] = useState("Overview");
  if (!patient) return null;
  const tabs = ["Overview", "History", "Prescriptions", "Lab Reports", "Allergies"];
  return (
    <Modal open={!!patient} onClose={onClose} title={patient.name} wide>
      <div className="flex gap-2 mb-5 flex-wrap">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: tab === t ? COLORS.navy : "#F1F3F7", color: tab === t ? "#fff" : COLORS.muted }}>{t}</button>
        ))}
      </div>
      {tab === "Overview" && (
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[["Age", `${patient.age} yrs`], ["Gender", patient.gender], ["Blood Group", patient.blood], ["Emergency Contact", "+91 98xxxxxx21"], ["Conditions", patient.conditions.join(", ") || "None"], ["Allergies", patient.allergies.join(", ") || "None known"]].map(([l, v]) => (
            <div key={l} className="p-3 rounded-xl" style={{ background: "#F7F9FB" }}><p className="text-xs text-slate-400">{l}</p><p className="font-semibold">{v}</p></div>
          ))}
        </div>
      )}
      {tab === "History" && <MedicalTimeline />}
      {tab === "Prescriptions" && <PatientPrescriptions />}
      {tab === "Lab Reports" && <PatientLab />}
      {tab === "Allergies" && (
        <div className="space-y-2">{(patient.allergies.length ? patient.allergies : ["No known allergies"]).map((a) => (
          <Card key={a} className="p-3 flex items-center gap-2"><AlertTriangle size={15} color={COLORS.warning} /><span className="text-sm font-semibold">{a}</span></Card>
        ))}</div>
      )}
      <div className="flex gap-2 mt-6 pt-5 border-t" style={{ borderColor: COLORS.border }}>
        <Button variant="teal" icon={ClipboardList} onClick={() => onPrescribe(patient)}>New Prescription</Button>
        <Button variant="outline" icon={FlaskConical}>Request Lab Test</Button>
        <Button variant="outline" icon={Video}>Start Consultation</Button>
      </div>
    </Modal>
  );
}

function PrescriptionModal({ open, patient, onClose, toast }) {
  const [meds, setMeds] = useState([{ name: "", dose: "", freq: "", days: "" }]);
  const addMed = () => setMeds([...meds, { name: "", dose: "", freq: "", days: "" }]);
  const update = (i, k, v) => setMeds(meds.map((m, idx) => idx === i ? { ...m, [k]: v } : m));
  return (
    <Modal open={open} onClose={onClose} title={`Prescription — ${patient?.name || ""}`} wide>
      <div className="space-y-3">
        {meds.map((m, i) => (
          <Card key={i} className="p-4 grid grid-cols-2 gap-3">
            <Input label="Medicine" placeholder="e.g. Paracetamol 500mg" value={m.name} onChange={(e) => update(i, "name", e.target.value)} />
            <Input label="Dosage" placeholder="1 tablet" value={m.dose} onChange={(e) => update(i, "dose", e.target.value)} />
            <Input label="Frequency" placeholder="After food, 2x/day" value={m.freq} onChange={(e) => update(i, "freq", e.target.value)} />
            <Input label="Duration (days)" placeholder="3" value={m.days} onChange={(e) => update(i, "days", e.target.value)} />
          </Card>
        ))}
      </div>
      <button onClick={addMed} className="text-sm font-semibold flex items-center gap-1.5 mt-3" style={{ color: COLORS.teal }}><Plus size={15} /> Add another medicine</button>
      <textarea rows={2} placeholder="Notes & follow-up instructions…" className="w-full p-3 rounded-xl border text-sm mt-4" style={{ borderColor: COLORS.border }} />
      <div className="flex gap-2 mt-5">
        <Button variant="outline" icon={Download}>Generate PDF</Button>
        <Button variant="teal" icon={Check} onClick={() => { toast("Prescription saved & sent to pharmacy."); onClose(); }}>Save & Send to Pharmacy</Button>
      </div>
    </Modal>
  );
}

/* ============================= RECEPTIONIST ============================= */
function ReceptionistQueue({ toast }) {
  const [queue, setQueue] = useState(QUEUE);
  const callNext = () => {
    setQueue((q) => {
      const idx = q.findIndex((t) => t.status === "waiting");
      if (idx === -1) return q;
      return q.map((t, i) => i === idx ? { ...t, status: "serving" } : t.status === "serving" ? { ...t, status: "done" } : t);
    });
    toast("Next patient called.");
  };
  return (
    <div className="space-y-6">
      <h1 className="font-display font-extrabold text-2xl">Queue Management</h1>
      <div className="grid md:grid-cols-3 gap-5">
        <Card className="p-6 text-center" style={{ background: COLORS.navy }}>
          <p className="text-white/60 text-xs mb-2">Now Serving</p>
          <p className="text-white font-display font-extrabold text-4xl">{queue.find((q) => q.status === "serving")?.token || "—"}</p>
        </Card>
        <Card className="p-6 text-center"><p className="text-slate-400 text-xs mb-2">Waiting</p><p className="font-display font-extrabold text-4xl" style={{ color: COLORS.text }}>{queue.filter((q) => q.status === "waiting").length}</p></Card>
        <Card className="p-6 text-center"><p className="text-slate-400 text-xs mb-2">Est. Wait Time</p><p className="font-display font-extrabold text-4xl" style={{ color: COLORS.text }}>18m</p></Card>
      </div>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="font-display font-bold">Token Queue</p>
          <div className="flex gap-2">
            <Button size="sm" variant="teal" onClick={callNext}>Call Next</Button>
            <Button size="sm" variant="outline" icon={Plus}>Add Patient</Button>
          </div>
        </div>
        <div className="space-y-2">
          {queue.map((t) => (
            <div key={t.token} className="flex items-center justify-between p-3 rounded-xl" style={{ background: t.status === "serving" ? COLORS.tealSoft : "#F7F9FB" }}>
              <div className="flex items-center gap-3">
                <span className="font-display font-bold w-12" style={{ color: t.status === "serving" ? COLORS.teal : COLORS.text }}>{t.token}</span>
                <span className="text-sm font-semibold">{t.patient}</span>
                {t.priority && <Badge tone="error">Priority</Badge>}
              </div>
              <Badge tone={t.status === "done" ? "success" : t.status === "serving" ? "teal" : "neutral"}>{t.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function QRCheckin({ toast }) {
  const [scanned, setScanned] = useState(false);
  return (
    <div className="space-y-6">
      <h1 className="font-display font-extrabold text-2xl">QR Check-in</h1>
      <Card className="p-8 max-w-md mx-auto text-center">
        {!scanned ? (
          <>
            <div className="w-40 h-40 mx-auto rounded-2xl flex items-center justify-center mb-5" style={{ background: "#F1F3F7" }}><QrCode size={72} color={COLORS.navy} /></div>
            <p className="text-sm text-slate-500 mb-5">Ask the patient to show their appointment QR code for scanning.</p>
            <Button variant="teal" className="w-full" onClick={() => { setScanned(true); toast("Patient checked in — token generated."); }}>Simulate Scan</Button>
          </>
        ) : (
          <>
            <CheckCircle2 size={56} color={COLORS.success} className="mx-auto mb-4" />
            <p className="font-display font-bold">Patient verified</p>
            <p className="text-sm text-slate-500 mt-1 mb-4">Appointment confirmed · Token A26 generated</p>
            <Button variant="outline" onClick={() => setScanned(false)}>Scan Another</Button>
          </>
        )}
      </Card>
    </div>
  );
}

/* ============================= LAB & PHARMACY ============================= */
function LabDashboard({ toast }) {
  const [tests, setTests] = useState(LAB_QUEUE);
  const advance = (id) => {
    const order = ["Requested", "Sample Collected", "Processing", "Completed"];
    setTests((ts) => ts.map((t) => t.id === id ? { ...t, status: order[Math.min(order.indexOf(t.status) + 1, 3)] } : t));
    toast("Test status updated.");
  };
  const counts = ["Requested", "Sample Collected", "Processing", "Completed"].map((s) => ({ s, n: tests.filter((t) => t.status === s).length }));
  return (
    <div className="space-y-6">
      <h1 className="font-display font-extrabold text-2xl">Laboratory Dashboard</h1>
      <div className="flex flex-wrap gap-4">
        {counts.map((c) => <StatCard key={c.s} label={c.s} value={c.n} icon={FlaskConical} tone="teal" />)}
      </div>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-slate-500 border-b" style={{ borderColor: COLORS.border }}>
            {["Patient", "Test", "Doctor", "Priority", "Status", ""].map((h) => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}
          </tr></thead>
          <tbody>
            {tests.map((t) => (
              <tr key={t.id} className="border-b last:border-0" style={{ borderColor: COLORS.border }}>
                <td className="px-5 py-3 font-semibold">{t.patient}</td>
                <td className="px-5 py-3">{t.test}</td>
                <td className="px-5 py-3 text-slate-500">{t.doctor}</td>
                <td className="px-5 py-3"><Badge tone={t.priority === "Urgent" ? "error" : t.priority === "High" ? "warning" : "neutral"}>{t.priority}</Badge></td>
                <td className="px-5 py-3"><Badge tone={t.status === "Completed" ? "success" : "info"}>{t.status}</Badge></td>
                <td className="px-5 py-3 text-right">
                  {t.status !== "Completed" ? <Button size="sm" variant="teal" onClick={() => advance(t.id)}>Advance</Button> : <Button size="sm" variant="outline" icon={Upload}>Report</Button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function PharmacyDashboard({ toast }) {
  const [meds] = useState(MEDICINES);
  const [rxStatus, setRxStatus] = useState("Pending");
  const toneFor = (s) => s === "In Stock" ? "success" : s === "Low Stock" ? "warning" : s === "Expiring Soon" ? "warning" : "error";
  return (
    <div className="space-y-6">
      <h1 className="font-display font-extrabold text-2xl">Pharmacy Dashboard</h1>
      <div className="flex flex-wrap gap-4">
        <StatCard label="In Stock" value={meds.filter((m) => m.status === "In Stock").length} icon={Package} tone="teal" />
        <StatCard label="Low Stock" value={meds.filter((m) => m.status === "Low Stock").length} icon={AlertTriangle} tone="warning" />
        <StatCard label="Out of Stock" value={meds.filter((m) => m.status === "Out of Stock").length} icon={AlertTriangle} tone="error" />
      </div>

      <Card className="p-6">
        <p className="font-display font-bold mb-4">Prescription Fulfillment — Meera Krishnan</p>
        <div className="flex items-center gap-2 mb-4">
          {["Pending", "Verify", "Dispense", "Fulfilled"].map((s, i, arr) => (
            <React.Fragment key={s}>
              <Badge tone={arr.indexOf(rxStatus) >= i ? "teal" : "neutral"}>{s}</Badge>
              {i < arr.length - 1 && <ArrowRight size={13} color={COLORS.muted} />}
            </React.Fragment>
          ))}
        </div>
        <Button variant="teal" size="sm" onClick={() => {
          const order = ["Pending", "Verify", "Dispense", "Fulfilled"];
          const next = order[Math.min(order.indexOf(rxStatus) + 1, 3)];
          setRxStatus(next); toast(`Prescription marked: ${next}`);
        }} disabled={rxStatus === "Fulfilled"}>{rxStatus === "Fulfilled" ? "Completed" : "Advance Status"}</Button>
      </Card>

      <Card className="overflow-x-auto">
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <p className="font-display font-bold">Inventory</p>
          <Button size="sm" variant="teal" icon={Plus}>Add Medicine</Button>
        </div>
        <table className="w-full text-sm mt-2">
          <thead><tr className="text-left text-xs text-slate-500 border-b" style={{ borderColor: COLORS.border }}>
            {["Medicine", "Category", "Stock", "Expiry", "Price", "Status", ""].map((h) => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}
          </tr></thead>
          <tbody>
            {meds.map((m) => (
              <tr key={m.id} className="border-b last:border-0" style={{ borderColor: COLORS.border }}>
                <td className="px-5 py-3 font-semibold">{m.name}</td>
                <td className="px-5 py-3 text-slate-500">{m.cat}</td>
                <td className="px-5 py-3">{m.stock} {m.unit}</td>
                <td className="px-5 py-3 text-slate-500">{m.expiry}</td>
                <td className="px-5 py-3">₹{m.price}</td>
                <td className="px-5 py-3"><Badge tone={toneFor(m.status)}>{m.status}</Badge></td>
                <td className="px-5 py-3 text-right"><Button size="sm" variant="ghost" icon={MoreHorizontal} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ============================= ADMIN ============================= */
function AdminOverview() {
  return (
    <div className="space-y-6">
      <h1 className="font-display font-extrabold text-2xl">Hospital Overview</h1>
      <div className="flex flex-wrap gap-4">
        <StatCard label="Total Patients" value="8,412" icon={Users} tone="teal" delta="+4.2% this month" />
        <StatCard label="Active Doctors" value="152" icon={Stethoscope} tone="navy" />
        <StatCard label="Today's Appointments" value="286" icon={Calendar} tone="info" />
        <StatCard label="Revenue (MTD)" value="₹14.1L" icon={Wallet} tone="teal" delta="+10.2%" />
        <StatCard label="Available Beds" value="9 / 24" icon={BedDouble} tone="warning" />
        <StatCard label="Pharmacy Items" value="1,340" icon={Package} tone="navy" />
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <p className="font-display font-bold mb-4">Revenue & Patient Trend</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={REVENUE_TREND}>
              <defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={COLORS.teal} stopOpacity={0.3} /><stop offset="100%" stopColor={COLORS.teal} stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="m" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip />
              <Area type="monotone" dataKey="revenue" stroke={COLORS.teal} strokeWidth={2.5} fill="url(#g2)" name="Revenue (₹L)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <p className="font-display font-bold mb-4">Department Load</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={DEPT_DIST} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={3}>
                {DEPT_DIST.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {DEPT_DIST.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs"><span className="w-2 h-2 rounded-full" style={{ background: d.color }} />{d.name}</div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <h1 className="font-display font-extrabold text-2xl">Analytics</h1>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <p className="font-display font-bold mb-4">Doctor Performance (avg rating)</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={DOCTORS} layout="vertical" margin={{ left: 10 }}>
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11 }} />
              <Tooltip /><Bar dataKey="rating" fill={COLORS.navy} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <p className="font-display font-bold mb-4">Appointment Trends</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={REVENUE_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="m" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip />
              <Line type="monotone" dataKey="patients" stroke={COLORS.info} strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function AdminDepartments() {
  return (
    <div className="space-y-6">
      <h1 className="font-display font-extrabold text-2xl">Departments</h1>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {DEPARTMENTS.map((d, i) => (
          <Card key={d} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-display font-bold text-sm">{d}</p>
              <Badge tone="teal">{[8, 6, 5, 4, 3, 7][i]} doctors</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[["Doctors", [8, 6, 5, 4, 3, 7][i]], ["Patients", [420, 310, 280, 190, 150, 350][i]], ["Appts/wk", [92, 61, 58, 40, 33, 74][i]]].map(([l, v]) => (
                <div key={l} className="p-2 rounded-lg" style={{ background: "#F7F9FB" }}><p className="font-display font-bold text-sm">{v}</p><p className="text-xs text-slate-400">{l}</p></div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AdminBeds() {
  const toneFor = (s) => ({ Available: "success", Occupied: "error", Reserved: "info", Cleaning: "warning" }[s]);
  return (
    <div className="space-y-6">
      <h1 className="font-display font-extrabold text-2xl">Bed Management</h1>
      <div className="flex flex-wrap gap-4">
        {["Available", "Occupied", "Reserved", "Cleaning"].map((s) => (
          <StatCard key={s} label={s} value={BEDS.filter((b) => b.status === s).length} icon={BedDouble} tone={s === "Available" ? "teal" : s === "Occupied" ? "error" : "info"} />
        ))}
      </div>
      <Card className="p-6">
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
          {BEDS.map((b) => (
            <div key={b.id} className="aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-semibold" style={{ background: { Available: "#E6F7EE", Occupied: "#FCEBEC", Reserved: "#E9F0FF", Cleaning: "#FBF1E1" }[b.status], color: { Available: COLORS.success, Occupied: COLORS.error, Reserved: COLORS.info, Cleaning: COLORS.warning }[b.status] }}>
              <BedDouble size={16} /><span className="mt-1">{b.id}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AdminAudit() {
  const logs = [
    { t: "10:42 AM", user: "Dr. Ananya Rao", role: "Doctor", action: "Viewed patient medical record", status: "Success" },
    { t: "10:15 AM", user: "Priyanka T.", role: "Pharmacist", action: "Updated medicine inventory", status: "Success" },
    { t: "09:58 AM", user: "Receptionist - Kavya", role: "Receptionist", action: "Generated invoice INV-1058", status: "Success" },
    { t: "09:30 AM", user: "Admin - Suresh", role: "Admin", action: "Modified user permissions", status: "Success" },
    { t: "09:02 AM", user: "Unknown", role: "—", action: "Failed login attempt", status: "Blocked" },
  ];
  return (
    <div className="space-y-6">
      <h1 className="font-display font-extrabold text-2xl">Audit Logs</h1>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-slate-500 border-b" style={{ borderColor: COLORS.border }}>
            {["Time", "User", "Role", "Action", "Status"].map((h) => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}
          </tr></thead>
          <tbody>
            {logs.map((l, i) => (
              <tr key={i} className="border-b last:border-0" style={{ borderColor: COLORS.border }}>
                <td className="px-5 py-3 text-slate-500">{l.t}</td>
                <td className="px-5 py-3 font-semibold">{l.user}</td>
                <td className="px-5 py-3 text-slate-500">{l.role}</td>
                <td className="px-5 py-3">{l.action}</td>
                <td className="px-5 py-3"><Badge tone={l.status === "Success" ? "success" : "error"}>{l.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ============================= TELEMEDICINE ============================= */
function Telemedicine({ onEnd }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => { const t = setInterval(() => setSeconds((s) => s + 1), 1000); return () => clearInterval(t); }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#0A1424" }}>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 text-white/80 text-sm"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Live · {mm}:{ss}</div>
        <Badge tone="success">Connected</Badge>
      </div>
      <div className="flex-1 flex gap-4 px-6 pb-4 min-h-0">
        <div className="flex-1 rounded-2xl flex items-center justify-center relative" style={{ background: "#111E33" }}>
          <div className="w-24 h-24 rounded-full flex items-center justify-center font-display font-bold text-white text-3xl" style={{ background: COLORS.teal }}>AR</div>
          <div className="absolute bottom-4 left-4 text-white/70 text-sm">Dr. Ananya Rao</div>
          <div className="absolute top-4 right-4 w-32 h-20 rounded-xl bg-white/10 flex items-center justify-center text-white/50 text-xs">You</div>
        </div>
        <div className="w-80 hidden lg:flex flex-col gap-4">
          <Card className="p-4"><p className="text-xs text-slate-400 font-semibold mb-2">Patient</p><p className="font-display font-bold">Jiya Darshini · 24F</p><p className="text-xs text-slate-500 mt-1">Blood group O+ · No known allergies</p></Card>
          <Card className="p-4 flex-1"><p className="text-xs text-slate-400 font-semibold mb-2">Chat</p>
            <div className="text-sm space-y-2"><p><span className="font-semibold">Dr. Rao:</span> Hi Jiya, how have the palpitations been?</p><p><span className="font-semibold">You:</span> Less frequent since starting the medication.</p></div>
          </Card>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 pb-8">
        {[Mic, Camera, MessageSquare].map((Icon, i) => (
          <button key={i} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"><Icon size={19} /></button>
        ))}
        <button onClick={onEnd} className="px-6 h-12 rounded-full bg-red-500 text-white font-semibold text-sm flex items-center gap-2 hover:bg-red-600"><Phone size={16} /> End Call</button>
      </div>
    </div>
  );
}

/* ============================= AI HEALTH ASSISTANT ============================= */
function AIAssistant({ open, onClose }) {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const analyze = () => {
    setLoading(true); setResult(null);
    setTimeout(() => {
      setResult({ category: "Respiratory & General", dept: "General Medicine", urgency: "Low", next: "Book a routine consultation within the next few days." });
      setLoading(false);
    }, 1200);
  };
  return (
    <Modal open={open} onClose={onClose} title="AI Health Assistant" wide>
      <div className="flex items-center gap-2 mb-4 p-3 rounded-xl" style={{ background: COLORS.tealSoft }}>
        <Sparkles size={16} color={COLORS.teal} />
        <p className="text-xs font-medium" style={{ color: COLORS.text }}>AI-generated information is for assistance only and does not replace professional medical advice.</p>
      </div>
      <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} rows={3} placeholder="What symptoms are you experiencing?" className="w-full p-3 rounded-xl border text-sm mb-3" style={{ borderColor: COLORS.border }} />
      <Button variant="teal" onClick={analyze} disabled={!symptoms || loading} icon={loading ? Loader2 : Sparkles}>{loading ? "Analyzing…" : "Check Symptoms"}</Button>
      {result && (
        <Card className="p-5 mt-5 fade-up">
          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
            <div><p className="text-xs text-slate-400">Possible category</p><p className="font-semibold">{result.category}</p></div>
            <div><p className="text-xs text-slate-400">Suggested department</p><p className="font-semibold">{result.dept}</p></div>
            <div><p className="text-xs text-slate-400">Urgency</p><Badge tone="success">{result.urgency}</Badge></div>
          </div>
          <p className="text-sm text-slate-600">{result.next}</p>
          <Button variant="outline" size="sm" className="mt-3" icon={Calendar}>Book with General Medicine</Button>
        </Card>
      )}
    </Modal>
  );
}

/* ============================= APP ROOT ============================= */
export default function MediCoreApp() {
  const [screen, setScreen] = useState("landing"); // landing | login | register | app
  const [role, setRole] = useState("Patient");
  const [view, setView] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [openPatientRecord, setOpenPatientRecord] = useState(null);
  const [rxPatient, setRxPatient] = useState(null);
  const [showTelemed, setShowTelemed] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const toast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 3200); };

  const login = (r) => { setRole(r); setView("overview"); setScreen("app"); };
  const logout = () => { setScreen("landing"); };

  const confirmBooking = (data) => { setConfirmedBooking(data); setBookingDoctor(null); setShowConfirm(true); toast("Appointment booked successfully."); };

  if (screen === "landing") return <><FontImport /><Landing goto={setScreen} /></>;
  if (screen === "login" || screen === "register") return <><FontImport /><AuthScreen mode={screen} goto={setScreen} onLogin={login} /></>;

  const renderPatient = () => {
    switch (view) {
      case "overview": return <PatientOverview setView={(v) => v === "telemedicine" ? setShowTelemed(true) : setView(v)} />;
      case "doctors": return <FindDoctors openBooking={setBookingDoctor} />;
      case "appointments": return <PatientAppointments />;
      case "records": return <MedicalTimeline />;
      case "prescriptions": return <PatientPrescriptions />;
      case "lab": return <PatientLab />;
      case "pharmacy": return <PharmacyDashboard toast={toast} />;
      case "bills": return <PatientBills toast={toast} />;
      case "family": return <FamilyMembers />;
      default: return null;
    }
  };
  const renderDoctor = () => {
    switch (view) {
      case "overview": return <DoctorOverview setView={setView} openPatient={setOpenPatientRecord} />;
      case "patients": return <DoctorPatients openPatient={setOpenPatientRecord} />;
      case "calendar": return <PatientAppointments />;
      case "records": return <DoctorPatients openPatient={setOpenPatientRecord} />;
      default: return null;
    }
  };
  const renderReceptionist = () => {
    switch (view) {
      case "overview": return <ReceptionistQueue toast={toast} />;
      case "queue": return <ReceptionistQueue toast={toast} />;
      case "checkin": return <QRCheckin toast={toast} />;
      case "appointments": return <PatientAppointments />;
      default: return null;
    }
  };
  const renderLab = () => <LabDashboard toast={toast} />;
  const renderPharmacist = () => <PharmacyDashboard toast={toast} />;
  const renderAdmin = () => {
    switch (view) {
      case "overview": return <AdminOverview />;
      case "analytics": return <AdminAnalytics />;
      case "departments": return <AdminDepartments />;
      case "beds": return <AdminBeds />;
      case "audit": return <AdminAudit />;
      default: return null;
    }
  };

  const content = { Patient: renderPatient, Doctor: renderDoctor, Receptionist: renderReceptionist, "Lab Staff": renderLab, Pharmacist: renderPharmacist, Admin: renderAdmin }[role]();

  return (
    <div className="font-body min-h-screen flex" style={{ background: COLORS.bg }}>
      <FontImport />
      <Sidebar role={role} view={view} setView={setView} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} onLogout={logout} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar role={role} setMobileOpen={setMobileOpen} notifOpen={notifOpen} setNotifOpen={setNotifOpen} dark={dark} setDark={setDark} />
        <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
        <main className="flex-1 p-4 lg:p-8 max-w-[1400px] w-full mx-auto">
          {content}
        </main>
        {role === "Patient" && (
          <button onClick={() => setShowAI(true)} className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-3 rounded-full text-white font-semibold text-sm shadow-lg hover:opacity-90" style={{ background: COLORS.navy }}>
            <Sparkles size={16} color="#5FE0CE" /> AI Health Assistant
          </button>
        )}
      </div>

      <BookingWizard open={!!bookingDoctor} onClose={() => setBookingDoctor(null)} doctor={bookingDoctor} onConfirm={confirmBooking} />
      <AppointmentConfirmed open={showConfirm} onClose={() => setShowConfirm(false)} data={confirmedBooking} />
      <PatientRecordModal patient={openPatientRecord} onClose={() => setOpenPatientRecord(null)} onPrescribe={(p) => { setRxPatient(p); setOpenPatientRecord(null); }} />
      <PrescriptionModal open={!!rxPatient} patient={rxPatient} onClose={() => setRxPatient(null)} toast={toast} />
      <AIAssistant open={showAI} onClose={() => setShowAI(false)} />
      {showTelemed && <Telemedicine onEnd={() => setShowTelemed(false)} />}
      <Toast toast={toastMsg} />
    </div>
  );
}
