import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Layout,
  BookOpen,
  Users,
  Globe,
  Terminal as TerminalIcon,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Play,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { cn } from "@/lib/utils";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
  useVerifyEmailMutation,
  useLogoutUserMutation
} from "@/features/api/authApi";
import { useGetCoursesQuery, useEnrollInCourseMutation, useGetEnrolledCoursesQuery } from "@/features/api/courseApi";
import { toast } from "sonner";

export default function HeroSection() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState("overview");

  // TERMINAL STATE
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { type: "ascii", content: "┌──────────────────────────────────────────────┐" },
    { type: "ascii", content: "│  KAI COSMIC TERMINAL // LEARN HUB ACADEMIC   │" },
    { type: "ascii", content: "└──────────────────────────────────────────────┘" },
    { type: "success", content: ">> KAI COSMIC // LEARN HUB OS v2.4.0_STABLE" },
    { type: "ascii", content: " " },
    { type: "success", content: "[ OK ] Initializing Academic Kernel..." },
    { type: "success", content: "[ OK ] Establishing Secure Student Link..." },
    { type: "success", content: "[ OK ] Syncing Course Database..." },
    { type: "success", content: "[ OK ] Terminal Session OS_2.4.0 Active." },
    { type: "ascii", content: " " },
    { type: "system", content: "Welcome back. Type 'help' to begin your session." },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalLogRef = useRef(null);

  // API MUTATIONS
  const [loginUser] = useLoginUserMutation();
  const [registerUser] = useRegisterUserMutation();
  const [verifyEmail] = useVerifyEmailMutation();
  const [logoutUser] = useLogoutUserMutation();
  const [enrollInCourse] = useEnrollInCourseMutation();
  const { data: coursesData } = useGetCoursesQuery();
  const { data: enrolledData } = useGetEnrolledCoursesQuery(undefined, { skip: !user });

  const isEnrolled = (courseId) => {
    return enrolledData?.courses?.some(c => c._id === courseId);
  };

  const scrollToBottom = () => {
    if (terminalLogRef.current) {
      terminalLogRef.current.scrollTop = terminalLogRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const addLog = (type, content) => {
    setHistory((prev) => [...prev, { type, content, time: new Date().toLocaleTimeString() }]);
  };

  const handleCommand = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const cmd = input.trim();
    const [action, ...args] = cmd.toLowerCase().split(" ");

    addLog("user", cmd);
    setInput("");
    setIsProcessing(true);

    // Command Logic
    try {
      switch (action) {
        case "help":
          addLog("system", "Available Commands:");
          addLog("system", "  signup <email> <pass>  - Create account");
          addLog("system", "  verify <email> <otp>   - Verify your account");
          addLog("system", "  login <email> <pass>   - Authenticate session");
          addLog("system", "  courses                - List all active units");
          addLog("system", "  enroll <id>            - Enroll in a course");
          addLog("system", "  start <id>             - Open course player");
          addLog("system", "  whoami                 - Show current session");
          addLog("system", "  logout                 - Terminate session");
          addLog("system", "  clear                  - Wipe terminal log");
          break;

        case "clear":
          setHistory([]);
          break;

        case "whoami":
          if (user) {
            addLog("success", `Active Session: ${user.email} (${user.role})`);
          } else {
            addLog("error", "No active session found. Please login.");
          }
          break;

        case "courses":
        case "ls":
          if (coursesData?.courses) {
            addLog("system", "Fetching academic database...");
            coursesData.courses.forEach(c => {
              const enrolled = isEnrolled(c._id);
              addLog("system", `> [${c._id.slice(-4)}] ${c.title || 'Untitled'} - ${enrolled ? 'ENROLLED' : (c.coursePrice === 0 ? 'FREE' : 'PREMIUM')}`);
            });
          } else {
            addLog("error", "Could not reach course database.");
          }
          break;

        case "signup":
        case "create":
        case "register":
          if (args.length < 2) {
            addLog("error", "Usage: signup <email> <password>");
          } else {
            addLog("system", "Registering account...");
            const res = await registerUser({ email: args[0], password: args[1] }).unwrap();
            if (res.success) {
              addLog("success", "Registration successful. OTP sent to email.");
              addLog("system", "Run 'verify <email> <otp>' to complete.");
            }
          }
          break;

        case "verify":
          if (args.length < 2) {
            addLog("error", "Usage: verify <email> <otp>");
          } else {
            addLog("system", "Verifying credentials...");
            const res = await verifyEmail({ email: args[0], otp: args[1] }).unwrap();
            if (res.success) {
              addLog("success", "Account verified successfully! You can now login.");
            }
          }
          break;

        case "login":
          if (args.length < 2) {
            addLog("error", "Usage: login <email> <password>");
          } else {
            addLog("system", "Authenticating...");
            const res = await loginUser({ email: args[0], password: args[1] }).unwrap();
            if (res.success) {
              addLog("success", `Welcome back, ${res.user.name || 'Student'}. Session established.`);
              toast.success("Logged in via terminal!");
            }
          }
          break;

        case "enroll":
          if (!user) {
            addLog("error", "Unauthorized. Please login first.");
          } else if (args.length < 1) {
            addLog("error", "Usage: enroll <id_or_title>");
          } else {
            const searchTerm = args.join(" ").toLowerCase();
            const course = coursesData?.courses.find(c =>
              c._id.endsWith(searchTerm) ||
              c.title.toLowerCase().includes(searchTerm)
            );
            if (!course) {
              addLog("error", "Course not found. Use 'courses' to see available units.");
            } else if (isEnrolled(course._id)) {
              addLog("system", `You are already enrolled in: ${course.title}`);
              addLog("system", `Type 'start ${course._id.slice(-4)}' to continue.`);
            } else {
              addLog("system", `Requesting enrollment for: ${course.title}`);
              const res = await enrollInCourse(course._id).unwrap();
              if (res.success) {
                addLog("success", `Enrollment confirmed for ${course.title}!`);
                addLog("system", `Type 'start ${course._id.slice(-4)}' to begin learning.`);
                toast.success("Enrolled successfully!");
              }
            }
          }
          break;

        case "logout":
          await logoutUser().unwrap();
          addLog("system", "Session terminated. Goodbye.");
          break;

        case "start":
        case "open":
          if (!user) {
            addLog("error", "Unauthorized. Please login first.");
          } else if (args.length < 1) {
            addLog("error", "Usage: start <id_or_title>");
          } else {
            const searchTerm = args.join(" ").toLowerCase();
            const course = coursesData?.courses.find(c =>
              c._id.endsWith(searchTerm) ||
              c.title.toLowerCase().includes(searchTerm)
            );
            if (!course) {
              addLog("error", "Course not found in database.");
            } else if (!isEnrolled(course._id)) {
              addLog("error", "You must enroll in this course first.");
              addLog("system", `Type 'enroll ${course._id.slice(-4)}' to register.`);
            } else {
              addLog("success", `Launching ${course.title}...`);
              setTimeout(() => navigate(`/learn/${course._id}`), 1000);
            }
          }
          break;

        default:
          // Try to match against course titles if it's not a recognized command
          const autoMatch = coursesData?.courses.find(c =>
            c.title.toLowerCase().includes(cmd.toLowerCase())
          );
          if (autoMatch) {
            const enrolled = isEnrolled(autoMatch._id);
            addLog("system", `Unit Found: ${autoMatch.title}`);
            if (enrolled) {
              addLog("system", `You are already enrolled. Type 'start ${autoMatch._id.slice(-4)}' to resume.`);
            } else {
              addLog("system", `Type 'enroll ${autoMatch._id.slice(-4)}' to get started.`);
            }
          } else {
            addLog("error", `Command not recognized: ${action}. Type 'help' for assistance.`);
          }
          break;
      }
    } catch (err) {
      addLog("error", err?.data?.message || "Execution failed. Check connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="relative min-h-screen bg-[#0A0A0A] pt-32 pb-20 overflow-hidden px-4">

      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1400px]">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 blur-[120px] rounded-full opacity-60" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.03] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto text-center">

        {/* TOP BADGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-md mb-10"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/50">
            LearnHub OS 2.0
          </span>
        </motion.div>

        {/* MAIN HEADING */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[0.9] text-white">
            Engineering
            <br />
            <span className="bg-gradient-to-r from-white via-white to-white/20 bg-clip-text text-transparent italic font-medium">excellence.</span>
          </h1>

          <p className="text-sm sm:text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed font-medium">
            The modern workspace for polytechnic students. Built to manage lectures, notes, and academic success in one clean interface.
          </p>

          {/* DEVELOPER CREDITS - MOVED TO HERO */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-col items-center gap-4 py-6"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/10"> <span className="text-primary ml-2">EKTA</span></p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {[
                { name: "KaiCosmic", link: "https://instagram.com/kaicosmic" },
                { name: "Abhinandan", link: "https://instagram.com/abhinandan" },
                { name: "Rehan", link: "https://instagram.com/rehan" }
              ].map((dev, i) => (
                <a
                  key={i}
                  href={dev.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                    <FaInstagram className="w-3.5 h-3.5 text-white/20 group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">{dev.name}</span>
                </a>
              ))}
            </div>
          </motion.div>

        </motion.div>

        {/* BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
        >
          <button
            onClick={() => navigate("/courses")}
            className="h-12 md:h-14 px-8 md:px-10 rounded-full bg-white text-black text-sm font-black hover:bg-white/90 transition-all flex items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-95"
          >
            Explore Courses
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate(user ? "/profile" : "/login")}
            className="h-12 md:h-14 px-8 md:px-10 rounded-full border border-white/10 bg-white/[0.03] text-white text-sm font-bold hover:bg-white/10 transition-all backdrop-blur-xl"
          >
            {user ? "View Profile" : "Student Login"}
          </button>
        </motion.div>

        {/* DASHBOARD PREVIEW (PERSPECTIVE) */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 relative max-w-5xl mx-auto"
          style={{ perspective: "2000px" }}
        >
          <div
            className="relative rounded-[1.5rem] md:rounded-[2rem] border border-white/[0.06] bg-[#0C0C0C] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] transition-all duration-700"
            style={{
              transform: typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : 'rotateX(5deg)'
            }}
          >
            {/* WINDOW TOP BAR */}
            <div className="h-12 border-b border-white/[0.05] bg-white/[0.02] flex items-center px-4 md:px-6 gap-2">
              <div className="flex gap-1.5 mr-2 md:mr-4">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/20 border border-red-500/30" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/20 border border-green-500/30" />
              </div>
              <div className="h-6 w-px bg-white/5 mx-1 md:mx-2" />
              <div className="flex gap-3 md:gap-6 ml-2 md:ml-4 overflow-x-auto no-scrollbar">
                {["terminal", "overview", "schedule"].map((tab) => (
                  <div
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "text-[9px] md:text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all pb-1 whitespace-nowrap",
                      activeTab === tab ? "text-white border-b border-primary" : "text-white/20 hover:text-white/40"
                    )}
                  >
                    {tab}
                  </div>
                ))}
              </div>
              <div className="ml-auto hidden sm:flex items-center gap-4">
                <div className="w-24 md:w-32 h-6 md:h-7 rounded-lg bg-white/5 border border-white/5 flex items-center px-3 gap-2">
                  <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full border border-white/20" />
                  <div className="w-12 md:w-16 h-1 rounded-full bg-white/10" />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row">
              {/* MINI SIDEBAR */}
              <div className="w-full md:w-16 border-b md:border-b-0 md:border-r border-white/[0.05] bg-white/[0.01] flex md:flex-col items-center py-2 md:py-8 gap-5 md:gap-8 justify-center md:justify-start px-4 md:px-0">
                {[Layout, TerminalIcon, Users, Globe].map((Icon, i) => (
                  <Icon
                    key={i}
                    onClick={() => {
                      if (i === 0) setActiveTab("overview");
                      if (i === 1) setActiveTab("terminal");
                    }}
                    className={`w-4 h-4 md:w-5 md:h-5 ${(i === 0 && activeTab === 'overview') ||
                      (i === 1 && activeTab === 'terminal')
                      ? 'text-primary' : 'text-white/10 hover:text-white/30'
                      } transition-colors cursor-pointer`}
                  />
                ))}
              </div>

              {/* CONTENT AREA */}
              <div className="flex-1 p-4 sm:p-6 md:p-10 text-left min-h-[320px] md:min-h-[450px] relative">
                <AnimatePresence mode="wait">
                  {activeTab === "overview" && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="h-full flex flex-col"
                    >
                      {user ? (
                        <div className="space-y-5 md:space-y-10">
                          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                            <div className="space-y-1 min-w-0">
                              <p className="text-[8px] md:text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] md:tracking-[0.4em]">Student ID: {user._id?.slice(-8)}</p>
                              <div className="flex flex-wrap items-center gap-2 mt-1 md:mt-2">
                                <h2 className="text-lg sm:text-xl md:text-3xl font-black text-white truncate">Welcome back, {user.name || 'Student'}</h2>
                                <div className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[7px] md:text-[8px] font-bold text-primary uppercase tracking-widest animate-pulse shrink-0">Active</div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="flex -space-x-2">
                                {enrolledData?.courses?.slice(0, 3).map((c, i) => (
                                  <div key={i} className="w-7 h-7 rounded-full border-2 border-[#0C0C0C] bg-white/5 flex items-center justify-center overflow-hidden">
                                    <img src={c.thumbnail} className="w-full h-full object-cover opacity-50" alt="" />
                                  </div>
                                ))}
                                {enrolledData?.courses?.length > 3 && (
                                  <div className="w-7 h-7 rounded-full border-2 border-[#0C0C0C] bg-white/5 flex items-center justify-center text-[8px] font-bold text-white/40">
                                    +{enrolledData.courses.length - 3}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
                            {enrolledData?.courses?.length > 0 ? (
                              enrolledData.courses.slice(0, 3).map((item, i) => (
                                <div
                                  key={i}
                                  onClick={() => navigate(`/learn/${item._id}`)}
                                  className="p-4 md:p-6 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/5 transition-all group relative overflow-hidden cursor-pointer active:scale-95"
                                >
                                  <div className="absolute top-0 right-0 p-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                                  </div>
                                  <Play className="w-4 h-4 text-primary mb-3" />
                                  <div>
                                    <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Resume Unit</p>
                                    <p className="text-xs font-bold mt-1 text-white truncate">{item.title}</p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div
                                onClick={() => setActiveTab("terminal")}
                                className="col-span-full p-6 md:p-8 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer hover:bg-white/[0.02] transition-all"
                              >
                                <BookOpen className="w-7 h-7 text-white/10" />
                                <div>
                                  <p className="text-sm text-white/60 font-bold">No active enrollments</p>
                                  <p className="text-[9px] text-white/20 uppercase tracking-widest mt-1">Use 'enroll' in terminal to begin</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-6 md:py-10">
                          <div className="relative">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/5 flex items-center justify-center">
                              <TerminalIcon className="w-6 h-6 md:w-8 md:h-8 text-white/10" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#0C0C0C] border border-white/5 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            </div>
                          </div>

                          <div className="space-y-2 px-2">
                            <h3 className="text-lg md:text-xl font-black text-white">Identity Required</h3>
                            <p className="text-[11px] md:text-xs text-white/40 max-w-[220px] mx-auto leading-relaxed">
                              Authenticate to access your academic workspace.
                            </p>
                          </div>

                          <div className="flex flex-col gap-3 w-full max-w-[220px] md:max-w-[260px]">
                            <button
                              onClick={() => navigate("/login")}
                              className="h-11 rounded-lg bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                              <ChevronRight className="w-3 h-3" />
                              Login
                            </button>
                            <button
                              onClick={() => navigate("/login")}
                              className="h-11 rounded-lg border border-white/10 bg-white/[0.03] text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                              <ChevronRight className="w-3 h-3" />
                              Create Account
                            </button>
                            <p className="text-[8px] text-white/20 uppercase tracking-widest text-center mt-1">
                              Or use terminal commands
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "terminal" && (
                    <motion.div
                      key="terminal"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="bg-[#050505] rounded-xl border border-white/5 p-3 sm:p-4 md:p-6 font-mono text-[9px] sm:text-[10px] md:text-xs leading-relaxed flex flex-col h-[300px] sm:h-[350px] md:h-[400px]"
                    >
                      <div className="flex items-center gap-2 text-white/40 mb-4 border-b border-white/5 pb-2 shrink-0">
                        <TerminalIcon className="w-3 h-3 text-primary" />
                        <span>learnhub@academic: ~ (session: os_2)</span>
                      </div>

                      <div
                        ref={terminalLogRef}
                        className="flex-1 overflow-y-auto pr-2 no-scrollbar space-y-1 scroll-smooth"
                      >
                        {history.map((log, i) => (
                          <div key={i} className="flex gap-3">
                            {log.type === "user" ? (
                              <span className="text-primary shrink-0">$</span>
                            ) : log.type === "success" ? (
                              <CheckCircle2 className="w-3 h-3 text-green-500 mt-1 shrink-0" />
                            ) : log.type === "error" ? (
                              <AlertCircle className="w-3 h-3 text-red-500 mt-1 shrink-0" />
                            ) : log.type === "ascii" ? (
                              <div className="w-0 h-0" />
                            ) : (
                              <div className="w-1.5 h-1.5 rounded-full bg-white/10 mt-1.5 shrink-0" />
                            )}
                            <span className={cn(
                              "break-all",
                              log.type === "success" ? "text-green-500" :
                                log.type === "error" ? "text-red-400" :
                                  log.type === "user" ? "text-white" : "text-white/40"
                            )}>
                              {log.content}
                            </span>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleCommand} className="mt-4 flex items-center gap-2 border-t border-white/5 pt-4 shrink-0">
                        <ChevronRight className="w-4 h-4 text-primary" />
                        <input
                          autoFocus
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder={isProcessing ? "Executing..." : "Enter command..."}
                          className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/10"
                          disabled={isProcessing}
                        />
                        {isProcessing && <Loader2 className="w-3 h-3 text-primary animate-spin" />}
                      </form>
                    </motion.div>
                  )}

                  {activeTab === "schedule" && (
                    <motion.div
                      key="schedule"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center h-full text-center space-y-4"
                    >
                      <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-white/10 animate-spin" />
                      </div>
                      <p className="text-white/20 text-xs italic">Syncing with department server...</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* LIGHT SOURCE REFLECTION */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
        </motion.div>

      </div>
    </section>
  );
}