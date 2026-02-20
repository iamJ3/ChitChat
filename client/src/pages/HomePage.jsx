import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FontStyle from "../lib/FontStyle";

/* ─── Global scroll-lock + hidden-scrollbar styles ──────────────────────── */
const GlobalStyles = () => (
  <style>{`
    html, body, #root {
      height: 100%;
      overflow: hidden;
    }
    .no-scroll::-webkit-scrollbar { display: none; }
    .no-scroll { -ms-overflow-style: none; scrollbar-width: none; }
    @keyframes pulseglow {
      0%, 100% { opacity: 0.5; transform: scale(1); }
      50%       { opacity: 1;   transform: scale(1.06); }
    }
    @keyframes spinslow    { to { transform: translate(-50%,-50%) rotate(360deg);  } }
    @keyframes spinreverse { to { transform: translate(-50%,-50%) rotate(-360deg); } }
    @keyframes floata { 0%,100%{transform:translateY(0)   rotate(20deg)}  50%{transform:translateY(-12px) rotate(22deg)}}
    @keyframes floatb { 0%,100%{transform:translateY(0)}                  50%{transform:translateY(-8px)}}
    @keyframes floatc { 0%,100%{transform:translateY(0)   rotate(-15deg)} 50%{transform:translateY(-10px) rotate(-17deg)}}
    .pulse-glow   { animation: pulseglow  4s ease-in-out infinite; }
    .spin-slow    { animation: spinslow   22s linear    infinite; }
    .spin-reverse { animation: spinreverse 17s linear    infinite; }
    .float-a      { animation: floata     5s ease-in-out infinite; }
    .float-b      { animation: floatb     4s ease-in-out infinite; }
    .float-c      { animation: floatc     6s ease-in-out infinite; }
  `}</style>
);

/* ─── Animated chat bubbles ──────────────────────────────────────────────── */
const chatMessages = [
  { id: 1, side: "left",  text: "Hey! How's your project going? 👋", delay: 0   },
  { id: 2, side: "right", text: "Really well, almost done! 🚀",       delay: 0.6 },
  { id: 3, side: "left",  text: "That's awesome, let me know!",        delay: 1.2 },
  { id: 4, side: "right", text: "Will do. Thanks for asking 🙌",       delay: 1.8 },
  { id: 5, side: "left",  text: "Talk soon!",                          delay: 2.4 },
];

function ChatBubble({ msg }) {
  const isRight = msg.side === "right";
  return (
    <motion.div
      initial={{ opacity: 0, x: isRight ? 20 : -20, y: 8 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: msg.delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`flex ${isRight ? "justify-end" : "justify-start"} w-full`}
    >
      {!isRight && (
        <div
          className="w-7 h-7 rounded-full flex-shrink-0 mr-2 flex items-center justify-center text-xs font-bold"
          style={{ background: "linear-gradient(135deg,#22D3EE,#6366f1)", color: "#0F172A" }}
        >A</div>
      )}
      <div
        className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
        style={{
          maxWidth: "75%",
          background: isRight
            ? "linear-gradient(135deg, #22D3EE, #06b6d4)"
            : "rgba(255,255,255,0.07)",
          color: isRight ? "#0F172A" : "#F1F5F9",
          fontWeight: isRight ? 500 : 400,
          borderBottomRightRadius: isRight ? 4 : undefined,
          borderBottomLeftRadius: !isRight ? 4 : undefined,
          backdropFilter: "blur(8px)",
          border: !isRight ? "1px solid rgba(255,255,255,0.08)" : "none",
        }}
      >{msg.text}</div>
      {isRight && (
        <div
          className="w-7 h-7 rounded-full flex-shrink-0 ml-2 flex items-center justify-center text-xs font-bold"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff" }}
        >Y</div>
      )}
    </motion.div>
  );
}

/* ─── Right visual panel ─────────────────────────────────────────────────── */
function RightPanel({ mode }) {
  return (
    <div
      className="hidden md:flex w-1/2 relative flex-col items-center justify-center overflow-hidden flex-shrink-0"
      style={{ height: "100vh", background: "transparent", zIndex: 2 }}
    >
      {/* Left-edge fade */}
      <div className="absolute inset-y-0 left-0 pointer-events-none" style={{
        width: 200,
        background: "linear-gradient(to right, rgba(10,20,42,0.7), transparent)",
        zIndex: 10,
      }} />

      {/* Background ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 11 }}>
        <div className="absolute pulse-glow" style={{
          top: "12%", left: "18%", width: 380, height: 380, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 68%)",
        }} />
        <div className="absolute pulse-glow" style={{
          bottom: "14%", right: "12%", width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 68%)",
          animationDelay: "1.8s",
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle, rgba(34,211,238,0.18) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.2,
          maskImage: "linear-gradient(to left, rgba(0,0,0,1) 40%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 40%, transparent 100%)",
        }} />
      </div>

      {/* Decorative rings */}
      <div className="absolute spin-slow" style={{
        width: "min(520px, 70vw)", height: "min(520px, 70vw)",
        border: "1px solid rgba(34,211,238,0.07)", borderRadius: "50%",
        top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 12,
      }} />
      <div className="absolute spin-reverse" style={{
        width: "min(380px, 50vw)", height: "min(380px, 50vw)",
        border: "1px dashed rgba(34,211,238,0.1)", borderRadius: "50%",
        top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 12,
      }} />
      <div className="absolute" style={{
        width: "min(240px, 32vw)", height: "min(240px, 32vw)",
        border: "1px solid rgba(99,102,241,0.12)", borderRadius: "50%",
        top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 12,
      }} />

      {/* Floating shapes */}
      <div className="absolute float-a opacity-30" style={{
        top: "14%", right: "20%", width: 56, height: 56,
        background: "linear-gradient(135deg, #22D3EE, #6366f1)",
        borderRadius: "14px", transform: "rotate(20deg)", zIndex: 13,
      }} />
      <div className="absolute float-b opacity-20" style={{
        bottom: "22%", left: "16%", width: 38, height: 38,
        background: "linear-gradient(135deg, #6366f1, #22D3EE)",
        borderRadius: "50%", zIndex: 13,
      }} />
      <div className="absolute float-c opacity-25" style={{
        top: "62%", right: "14%", width: 24, height: 24,
        background: "#22D3EE", borderRadius: "6px",
        transform: "rotate(-15deg)", zIndex: 13,
      }} />
      <div className="absolute float-a opacity-15" style={{
        top: "28%", left: "12%", width: 18, height: 18,
        background: "#6366f1", borderRadius: "50%", zIndex: 13,
      }} />

      {/* Main content */}
      <div
        className="relative flex flex-col items-center text-center px-8 lg:px-10 w-full overflow-hidden"
        style={{ zIndex: 14, maxWidth: 460 }}
      >
        {/* Chat icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-6"
        >
          <div style={{
            position: "absolute", inset: -20, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)",
          }} />
          <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center" style={{
            background: "linear-gradient(135deg, rgba(34,211,238,0.2), rgba(99,102,241,0.2))",
            border: "1px solid rgba(34,211,238,0.3)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 40px rgba(34,211,238,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                stroke="#22D3EE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: "#22D3EE", boxShadow: "0 0 10px rgba(34,211,238,0.6)" }}>
            <div className="w-2 h-2 rounded-full bg-slate-900" />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-bold mb-3 leading-tight" style={{
            fontSize: "clamp(1.5rem, 2.5vw, 1.875rem)",
            color: "#F1F5F9", letterSpacing: "-0.025em",
          }}>
            {mode === "signup" ? "Start your conversation" : "Welcome back"}<br />
            <span style={{
              background: "linear-gradient(135deg, #22D3EE 0%, #818cf8 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              {mode === "signup" ? "today." : "again."}
            </span>
          </h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "#64748b" }}>
            {mode === "signup"
              ? "Join thousands of people having great conversations every day."
              : "Your conversations are waiting. Pick up right where you left off."}
          </p>
        </motion.div>

        {/* Chat preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="w-full flex flex-col gap-2 px-2"
        >
          {chatMessages.map((msg) => (
            <ChatBubble key={msg.id} msg={msg} />
          ))}
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2, duration: 0.6 }}
          className="flex flex-wrap gap-2 mt-6 justify-center"
        >
          {["Real-time sync", "Cross-platform"].map((feat) => (
            <span key={feat} className="text-xs px-3 py-1.5 rounded-full" style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#64748b",
              backdropFilter: "blur(8px)",
            }}>{feat}</span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Input field ────────────────────────────────────────────────────────── */
function Field({ label, type, value, onChange, error, placeholder, id }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} style={{
        color: error ? "#F87171" : focused ? "#22D3EE" : "#94A3B8",
        fontWeight: 500,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        fontSize: "0.68rem",
      }}>{label}</label>
      <div className="relative">
        <input
          id={id} type={type} value={value} onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full rounded-xl text-sm transition-all duration-200 outline-none"
          style={{
            padding: "0.7rem 1rem",
            background: "#263346",
            border: `1.5px solid ${error ? "#F87171" : focused ? "#22D3EE" : "rgba(255,255,255,0.07)"}`,
            color: "#F1F5F9",
            fontSize: "0.9rem",
            boxShadow: focused && !error ? "0 0 0 4px rgba(34,211,238,0.08)" : "none",
          }}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}
            style={{ color: "#F87171", fontSize: "0.72rem", marginTop: 1 }}
          >{error}</motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Submit button ──────────────────────────────────────────────────────── */
function SubmitButton({ children, onClick, loading }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      disabled={loading}
      className="w-full rounded-xl font-semibold text-sm relative overflow-hidden transition-all duration-200"
      style={{
        padding: "0.8rem",
        background: loading ? "rgba(34,211,238,0.5)" : "linear-gradient(135deg, #22D3EE 0%, #06b6d4 100%)",
        color: "#0F172A",
        border: "none",
        cursor: loading ? "not-allowed" : "pointer",
        boxShadow: "0 4px 24px rgba(34,211,238,0.25)",
        letterSpacing: "0.01em",
        fontFamily: "inherit",
      }}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block w-4 h-4 rounded-full border-2"
            style={{ borderColor: "#0F172A", borderTopColor: "transparent" }}
          />
          Please wait…
        </span>
      ) : children}
    </motion.button>
  );
}

/* ─── Left auth panel ────────────────────────────────────────────────────── */
function LeftPanel({ mode, setMode }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);

  const isSignup = mode === "signup";

  function validate() {
    const e = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address";
    if (password.length < 8) e.password = "Minimum 8 characters required";
    if (isSignup && confirm !== password) e.confirm = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1600));
    setLoading(false);
    setDone(true);
  }

  function switchMode(m) {
    setMode(m);
    setErrors({});
    setConfirm("");
    setDone(false);
  }

  return (
    <div
      className="w-full md:w-1/2 flex flex-col items-center justify-center relative flex-shrink-0 overflow-hidden"
      style={{ height: "100vh", background: "transparent", zIndex: 2 }}
    >
      {/* Right-edge vignette */}
      <div className="absolute inset-y-0 right-0 pointer-events-none hidden md:block" style={{
        width: 180,
        background: "linear-gradient(to right, transparent, rgba(10,20,42,0.6))",
        zIndex: 10,
      }} />
      {/* Top corner glow */}
      <div className="absolute top-0 right-0 pointer-events-none" style={{
        width: 300, height: 300,
        background: "radial-gradient(circle at top right, rgba(34,211,238,0.05) 0%, transparent 65%)",
      }} />

      {/*
        The inner scroll wrapper lets the form scroll on very short viewports
        (e.g. landscape mobile) while hiding the scrollbar.
      */}
      <div
        className="no-scroll w-full flex flex-col items-center"
        style={{
          overflowY: "auto",
          maxHeight: "100vh",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex flex-col"
          style={{
            maxWidth: 420,
            padding: "clamp(1.5rem, 4vh, 2.5rem) clamp(1.25rem, 5vw, 2rem)",
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2.5"
            style={{ marginBottom: "clamp(1.5rem, 4vh, 2.5rem)" }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{
              background: "linear-gradient(135deg, rgba(34,211,238,0.18), rgba(99,102,241,0.15))",
              border: "1px solid rgba(34,211,238,0.25)",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-semibold text-base" style={{ color: "#F1F5F9", letterSpacing: "-0.01em" }}>
              ChatSpace
            </span>
          </motion.div>

          {/* Mode toggle */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex rounded-xl p-1"
            style={{
              background: "#1E293B",
              border: "1px solid rgba(255,255,255,0.06)",
              marginBottom: "clamp(1.25rem, 3vh, 2rem)",
            }}
          >
            {[{ key: "signin", label: "Sign in" }, { key: "signup", label: "Sign up" }].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => switchMode(key)}
                className="flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-200"
                style={{
                  background: mode === key ? "#263346" : "transparent",
                  color: mode === key ? "#F1F5F9" : "#64748b",
                  border: mode === key ? "1px solid rgba(255,255,255,0.09)" : "1px solid transparent",
                  cursor: "pointer",
                  boxShadow: mode === key ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
                  fontFamily: "inherit",
                }}
              >{label}</button>
            ))}
          </motion.div>

          {/* Heading */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              style={{ marginBottom: "clamp(1rem, 2.5vh, 1.75rem)" }}
            >
              <h1 className="font-bold" style={{
                fontSize: "clamp(1.3rem, 3vw, 1.6rem)",
                color: "#F1F5F9",
                letterSpacing: "-0.025em",
                lineHeight: 1.2,
                marginBottom: "0.375rem",
              }}>
                {isSignup ? "Create your account" : "Welcome back"}
              </h1>
              <p className="text-sm" style={{ color: "#64748b" }}>
                {isSignup
                  ? "Join the conversation — it only takes a moment."
                  : "Sign in to continue your conversations."}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Form / Success */}
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col items-center text-center py-8 gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(52,211,153,0.12)",
                    border: "1.5px solid rgba(52,211,153,0.35)",
                    boxShadow: "0 0 30px rgba(52,211,153,0.12)",
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#34D399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
                <div>
                  <p className="font-semibold text-lg mb-1" style={{ color: "#F1F5F9" }}>
                    {isSignup ? "You're all set!" : "Welcome back!"}
                  </p>
                  <p className="text-sm" style={{ color: "#64748b" }}>
                    {isSignup ? "Your account is ready. Enter chat space →" : "Loading your conversations…"}
                  </p>
                </div>
                <button
                  onClick={() => { setDone(false); setEmail(""); setPassword(""); setConfirm(""); }}
                  className="text-xs mt-2 transition-colors duration-200"
                  style={{ color: "#22D3EE", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                >← Back to sign in</button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
                style={{ gap: "clamp(0.6rem, 1.5vh, 1rem)" }}
              >
                <Field label="Email address" id="email" type="email"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  error={errors.email} placeholder="you@example.com"
                />
                <Field label="Password" id="password" type="password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  error={errors.password} placeholder="At least 8 characters"
                />
                <AnimatePresence>
                  {isSignup && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <Field label="Confirm password" id="confirm" type="password"
                        value={confirm} onChange={(e) => setConfirm(e.target.value)}
                        error={errors.confirm} placeholder="Repeat your password"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isSignup && (
                  <div className="flex justify-end" style={{ marginTop: "-0.25rem" }}>
                    <button
                      className="text-xs transition-colors duration-200"
                      style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                      onMouseEnter={(e) => e.target.style.color = "#22D3EE"}
                      onMouseLeave={(e) => e.target.style.color = "#64748b"}
                    >Forgot password?</button>
                  </div>
                )}

                <div style={{ marginTop: "0.25rem" }}>
                  <SubmitButton onClick={handleSubmit} loading={loading}>
                    {isSignup ? "Create account →" : "Sign in →"}
                  </SubmitButton>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <span className="text-xs" style={{ color: "#334155" }}>or</span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                </div>

                <button
                  className="w-full rounded-xl text-sm font-medium flex items-center justify-center gap-2.5 transition-all duration-200"
                  style={{
                    padding: "0.75rem",
                    background: "transparent",
                    border: "1.5px solid rgba(255,255,255,0.08)",
                    color: "#94A3B8",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(34,211,238,0.25)";
                    e.currentTarget.style.color = "#F1F5F9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "#94A3B8";
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer switch */}
          {!done && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-sm"
              style={{ color: "#64748b", marginTop: "clamp(1rem, 2.5vh, 1.75rem)" }}
            >
              {isSignup ? "Already have an account? " : "Don't have an account? "}
              <button
                onClick={() => switchMode(isSignup ? "signin" : "signup")}
                className="font-medium transition-colors duration-200"
                style={{ color: "#22D3EE", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
              >
                {isSignup ? "Sign in" : "Create one"}
              </button>
            </motion.p>
          )}

          {/* Legal */}
          <p className="text-center text-xs" style={{
            color: "#334155",
            marginTop: "clamp(0.75rem, 2vh, 2rem)",
          }}>
            By continuing, you agree to our{" "}
            <span style={{ color: "#475569", cursor: "pointer" }}>Terms</span> &{" "}
            <span style={{ color: "#475569", cursor: "pointer" }}>Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Root ───────────────────────────────────────────────────────────────── */
export default function HomePage() {
  const [mode, setMode] = useState("signin");

  return (
    <>
      <GlobalStyles />
      <FontStyle />
      <div
        className="flex w-full"
        style={{
          height: "100vh",
          overflow: "hidden",
          background:
            "linear-gradient(110deg, #0F172A 0%, #0F172A 42%, #0d1e3a 58%, #0e2347 78%, #091929 100%)",
          position: "relative",
        }}
      >
        {/* Shared mid-seam glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 480, height: "100vh",
            background:
              "radial-gradient(ellipse 240px 55% at 50% 50%, rgba(34,211,238,0.055) 0%, transparent 100%)",
            zIndex: 1,
          }}
        />

        <LeftPanel mode={mode} setMode={setMode} />
        <RightPanel mode={mode} />
      </div>
    </>
  );
}