import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usePageTitle from "../usePageTitle";

/**
 * LOGIN PAGE — HR Onboarding System
 * Mapped to MSSQL DB Schema (tbl_CandidateMaster, tbl_UserMaster)
 *
 * DUMMY TEST DATA (use "Fill Test Data" button or copy manually):
 * ─────────────────────────────────────────────────────────────
 * CANDIDATE LOGIN:
 *   Candidate Code : CAND-A1B2C3
 *   Email          : rahul.sharma@gmail.com
 *
 * HR LOGIN (Custom):
 *   Username       : hr.admin
 *   Password       : HRAdmin@2024
 *
 * HR LOGIN (LDAP):
 *   Username       : jdoe
 *   Password       : (domain password — any value for demo)
 *
 * SIGN UP (dummy candidate):
 *   First Name     : Rahul
 *   Last Name      : Sharma
 *   Email          : rahul.sharma@gmail.com
 *   Phone          : 9876543210
 *   Password       : Test@1234
 *   Confirm        : Test@1234
 *   OTP            : any 6 digits e.g. 123456
 * ─────────────────────────────────────────────────────────────
 */

const DUMMY = {
  firstName : "Rahul",
  lastName  : "Sharma",
  email     : "rahul.sharma@gmail.com",
  phone     : "9876543210",
  password  : "Test@1234",
  confirm   : "Test@1234",
};

// Mock credentials for development testing
const MOCK_HR_CREDENTIALS = {
  "admin": { password: "admin123", role: "Admin", name: "Administrator" },
  "hruser": { password: "hr123", role: "HR User", name: "Sarah Johnson" },
  "secmgr": { password: "sec123", role: "Security Manager", name: "Rajesh Kumar" },
  "secexec": { password: "exec123", role: "Security Executive", name: "Priya Menon" }
};

const MOCK_CANDIDATE = {
  code: "CAND-A1B2C3",
  email: "rahul.sharma@email.com",
  name: "Rahul Sharma",
  refNumber: "MPI-REF-2026-0145"
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Poppins:wght@500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .root {
    min-height: 100vh;
    background: linear-gradient(150deg, #e3f0fd 0%, #f0f7ff 50%, #daeeff 100%);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Nunito', sans-serif;
    position: relative; overflow: hidden; padding: 24px;
  }

  .blob { position:absolute;border-radius:50%;opacity:0.1;animation:bfloat 9s ease-in-out infinite; }
  .b1{width:420px;height:420px;background:#1976d2;top:-140px;left:-110px;animation-delay:0s}
  .b2{width:320px;height:320px;background:#0d47a1;bottom:-90px;right:-70px;animation-delay:2.5s}
  .b3{width:200px;height:200px;background:#42a5f5;top:58%;left:6%;animation-delay:4s}
  .b4{width:130px;height:130px;background:#1e88e5;top:18%;right:10%;animation-delay:1.2s}
  @keyframes bfloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-18px) scale(1.04)}}

  .card {
    background:rgba(255,255,255,0.95);
    border-radius:22px;
    box-shadow:0 18px 56px rgba(25,118,210,0.13),0 3px 16px rgba(0,0,0,0.05);
    border:1px solid rgba(255,255,255,0.85);
    width:100%;max-width:458px;
    padding:34px 40px 42px;
    position:relative;z-index:10;
    animation:card-up 0.55s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes card-up{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}

  .logo{display:flex;align-items:center;justify-content:center;gap:9px;margin-bottom:4px}
  .logo-box{width:40px;height:40px;border-radius:11px;background:linear-gradient(135deg,#1e88e5,#1565c0);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 11px rgba(25,118,210,0.32)}
  .logo-box svg{width:21px;height:21px;fill:white}
  .logo-name{font-family:'Poppins',sans-serif;font-size:19px;font-weight:700;color:#1565c0}
  .logo-name em{color:#42a5f5;font-style:normal}
  .logo-sub{text-align:center;color:#90a4ae;font-size:12.5px;margin-bottom:22px}

  .tabs{display:flex;background:#eef4fb;border-radius:11px;padding:4px;gap:4px;margin-bottom:22px}
  .tab{flex:1;border:none;background:transparent;border-radius:8px;padding:9px 4px;font-family:'Nunito',sans-serif;font-size:13px;font-weight:700;color:#78909c;cursor:pointer;transition:all 0.22s ease}
  .tab.on{background:#fff;color:#1565c0;box-shadow:0 2px 7px rgba(25,118,210,0.14);transform:translateY(-1px)}
  .tab:hover:not(.on){color:#1976d2;background:rgba(255,255,255,0.45)}

  .section{animation:sec-in 0.28s ease both}
  @keyframes sec-in{from{opacity:0;transform:translateX(7px)}to{opacity:1;transform:translateX(0)}}

  .ftitle{font-family:'Poppins',sans-serif;font-size:18px;font-weight:600;color:#1a237e;margin-bottom:2px}
  .fdesc{font-size:12px;color:#90a4ae;margin-bottom:16px;line-height:1.5}

  .fg{margin-bottom:12px}
  .fl{display:block;font-size:11px;font-weight:700;color:#546e7a;margin-bottom:5px;letter-spacing:0.4px;text-transform:uppercase}
  .fw{position:relative}
  .fi{position:absolute;left:12px;top:50%;transform:translateY(-50%);width:14px;height:14px;color:#90a4ae;pointer-events:none}
  .inp{width:100%;padding:10px 13px 10px 38px;border:1.5px solid #dceaf6;border-radius:9px;font-family:'Nunito',sans-serif;font-size:13.5px;color:#263238;background:#f5faff;transition:all 0.18s ease;outline:none}
  .inp:focus{border-color:#42a5f5;background:#fff;box-shadow:0 0 0 3px rgba(66,165,245,0.11)}
  .inp::placeholder{color:#b0bec5}
  .inp.err-inp{border-color:#ef5350;background:#fff8f8}
  .inp.ok-inp{border-color:#66bb6a;background:#f5fff5}

  .row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .err-msg{font-size:11px;color:#e53935;margin-top:3px;font-weight:600}
  .db-hint{font-size:10.5px;color:#b0bec5;margin-top:2px;font-style:italic}

  .forgot{text-align:right;margin:-4px 0 11px}
  .forgot a{font-size:11.5px;color:#1e88e5;text-decoration:none;font-weight:700}
  .forgot a:hover{text-decoration:underline}

  .btn{width:100%;padding:12px;background:linear-gradient(135deg,#1e88e5,#1565c0);color:#fff;border:none;border-radius:11px;font-family:'Poppins',sans-serif;font-size:14px;font-weight:600;cursor:pointer;letter-spacing:0.2px;transition:all 0.22s cubic-bezier(0.4,0,0.2,1);box-shadow:0 4px 13px rgba(25,118,210,0.32);display:flex;align-items:center;justify-content:center;gap:7px}
  .btn:hover{transform:translateY(-2px);box-shadow:0 7px 22px rgba(25,118,210,0.38)}
  .btn:active{transform:scale(0.98)}

  .btn-ghost{width:100%;padding:11px;background:transparent;color:#1565c0;border:1.5px solid #90caf9;border-radius:11px;font-family:'Poppins',sans-serif;font-size:13.5px;font-weight:600;cursor:pointer;transition:all 0.2s ease;margin-top:8px}
  .btn-ghost:hover{background:#e3f0fd}

  .back-btn{background:none;border:none;color:#1e88e5;font-weight:700;font-family:'Nunito',sans-serif;font-size:12px;cursor:pointer;padding:0;display:inline-flex;align-items:center;gap:3px;margin-bottom:12px}
  .back-btn:hover{color:#1565c0}

  .switch{text-align:center;font-size:12.5px;color:#78909c;margin-top:14px}
  .switch button{background:none;border:none;color:#1e88e5;font-weight:700;font-family:'Nunito',sans-serif;font-size:12.5px;cursor:pointer;padding:0 2px}
  .switch button:hover{color:#1565c0;text-decoration:underline}

  /* dummy data banner */
  .dummy-banner{background:linear-gradient(135deg,#e8f5e9,#f1f8e9);border:1px solid #a5d6a7;border-radius:10px;padding:10px 13px;margin-bottom:14px}
  .dummy-banner-title{font-size:11.5px;font-weight:800;color:#2e7d32;margin-bottom:5px;display:flex;align-items:center;gap:5px}
  .dummy-row{display:flex;justify-content:space-between;font-size:11px;margin-bottom:2px}
  .dummy-key{color:#546e7a;font-weight:700}
  .dummy-val{color:#1565c0;font-weight:700;font-family:'Poppins',sans-serif;font-size:10.5px}

  /* login type */
  .lt-row{display:flex;gap:8px;margin-bottom:12px}
  .lt-btn{flex:1;padding:8px;border-radius:9px;border:1.5px solid #dceaf6;background:#f5faff;font-family:'Nunito',sans-serif;font-size:12.5px;font-weight:700;color:#78909c;cursor:pointer;transition:all 0.2s ease}
  .lt-btn.on{border-color:#1976d2;background:#e3f0fd;color:#1565c0}
  .lt-btn:hover:not(.on){border-color:#90caf9}

  .ldap-box{background:#fff8e1;border:1px solid #ffe082;border-radius:9px;padding:8px 12px;font-size:11.5px;color:#f57f17;font-weight:600;margin-bottom:12px;line-height:1.5}

  .role-row{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:13px}
  .chip{font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:20px;border:1px solid}
  .c-admin{background:#e8eaf6;color:#3949ab;border-color:#9fa8da}
  .c-hr{background:#e3f2fd;color:#1565c0;border-color:#90caf9}
  .c-sm{background:#fce4ec;color:#c62828;border-color:#f48fb1}
  .c-se{background:#e8f5e9;color:#2e7d32;border-color:#a5d6a7}

  /* stepper */
  .stepper{display:flex;align-items:center;margin-bottom:20px}
  .s-item{display:flex;flex-direction:column;align-items:center;flex:1}
  .s-dot{width:27px;height:27px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11.5px;font-weight:700;font-family:'Poppins',sans-serif;transition:all 0.28s ease;z-index:1}
  .s-dot.done{background:#1976d2;color:#fff}
  .s-dot.active{background:#1565c0;color:#fff;box-shadow:0 0 0 4px rgba(25,118,210,0.18)}
  .s-dot.idle{background:#e0ecf8;color:#90a4ae}
  .s-lbl{font-size:9.5px;font-weight:700;margin-top:4px;color:#90a4ae;letter-spacing:0.3px}
  .s-lbl.done{color:#1976d2}
  .s-lbl.active{color:#1565c0}
  .s-line{flex:1;height:2px;background:#e0ecf8;margin-top:-14px;z-index:0;transition:background 0.28s}
  .s-line.done{background:#1976d2}

  /* method cards */
  .method-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:16px}
  .mcard{border:1.5px solid #dceaf6;border-radius:11px;padding:14px 8px;text-align:center;cursor:pointer;transition:all 0.2s ease;background:#f5faff}
  .mcard.on{border-color:#1976d2;background:#e3f0fd;box-shadow:0 0 0 3px rgba(25,118,210,0.09)}
  .mcard:hover:not(.on){border-color:#90caf9;background:#f0f7ff}
  .mcard svg{width:24px;height:24px;margin:0 auto 7px;display:block}
  .mcard-lbl{font-size:12.5px;font-weight:700;color:#37474f}
  .mcard-sub{font-size:10.5px;color:#90a4ae;margin-top:2px;word-break:break-all}
  .mcard.on .mcard-lbl{color:#1565c0}

  /* otp */
  .otp-row{display:flex;gap:7px;justify-content:center;margin:16px 0}
  .obox{width:48px;height:54px;border:1.5px solid #dceaf6;border-radius:11px;text-align:center;font-size:21px;font-weight:700;font-family:'Poppins',sans-serif;color:#1565c0;background:#f5faff;outline:none;transition:all 0.18s ease;caret-color:#1976d2}
  .obox:focus{border-color:#1976d2;background:#fff;box-shadow:0 0 0 3px rgba(25,118,210,0.11);transform:translateY(-2px)}
  .obox.has{border-color:#42a5f5;background:#e3f2fd}

  .sent-ok{background:#e8f5e9;border:1px solid #a5d6a7;border-radius:9px;padding:9px 13px;display:flex;align-items:center;gap:7px;font-size:12px;color:#2e7d32;font-weight:600;margin-bottom:4px}
  .sent-ok svg{width:15px;height:15px;flex-shrink:0}

  .resend-bar{display:flex;align-items:center;justify-content:space-between;margin:5px 0 14px;font-size:12px}
  .timer-txt{color:#90a4ae}
  .resend-btn{background:none;border:none;color:#1e88e5;font-weight:700;font-family:'Nunito',sans-serif;font-size:12px;cursor:pointer;padding:0}
  .resend-btn:disabled{color:#b0bec5;cursor:not-allowed}
  .resend-btn:not(:disabled):hover{color:#1565c0;text-decoration:underline}

  /* success */
  .succ{text-align:center;padding:6px 0;animation:sec-in 0.35s ease both}
  .succ-ring{width:62px;height:62px;border-radius:50%;margin:0 auto 14px;background:linear-gradient(135deg,#e8f5e9,#c8e6c9);display:flex;align-items:center;justify-content:center;border:2px solid #a5d6a7;animation:pop 0.38s cubic-bezier(0.16,1,0.3,1) both}
  @keyframes pop{from{transform:scale(0.5);opacity:0}to{transform:scale(1);opacity:1}}
  .succ-ring svg{width:30px;height:30px;stroke:#388e3c;fill:none;stroke-width:2.5}
  .db-status-box{background:#e3f0fd;border-radius:9px;padding:9px 13px;font-size:11.5px;color:#1565c0;font-weight:700;margin-bottom:18px;text-align:left;line-height:1.8}

  /* toast */
  .toast{position:fixed;bottom:26px;left:50%;transform:translateX(-50%);padding:10px 20px;border-radius:11px;font-size:13px;font-weight:700;z-index:200;white-space:nowrap;animation:toast-in 0.25s ease both}
  .toast.err{background:#ffebee;color:#c62828;border:1px solid #ef9a9a}
  .toast.ok{background:#e8f5e9;color:#2e7d32;border:1px solid #a5d6a7}
  @keyframes toast-in{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}

  .divider{display:flex;align-items:center;gap:8px;margin:10px 0;color:#b0bec5;font-size:11px;font-weight:700}
  .divider::before,.divider::after{content:'';flex:1;height:1px;background:#e0ecf8}

  .link-row{display:flex;gap:0}
  .link-row .inp{border-radius:9px 0 0 9px;border-right:none}
  .link-go{padding:0 14px;border:1.5px solid #1976d2;border-radius:0 9px 9px 0;background:#1976d2;color:#fff;font-family:'Nunito',sans-serif;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;transition:background 0.2s}
  .link-go:hover{background:#1565c0}

  /* demo credentials card */
  .demo-card{background:#f5f5f5;border:1px solid #e0e0e0;border-radius:10px;padding:12px 14px;margin-top:16px;position:relative}
  .demo-badge{position:absolute;top:8px;right:8px;font-size:9px;font-weight:800;color:#666;background:#e0e0e0;padding:2px 7px;border-radius:10px;letter-spacing:0.5px}
  .demo-title{font-size:11px;font-weight:800;color:#424242;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.3px}
  .demo-section{margin-bottom:10px}
  .demo-section:last-child{margin-bottom:0}
  .demo-subtitle{font-size:10px;font-weight:700;color:#666;margin-bottom:4px}
  .demo-table{width:100%;border-collapse:collapse}
  .demo-table td{padding:3px 0;font-size:11px}
  .demo-table td:first-child{color:#757575;font-weight:600;padding-right:12px;width:40%}
  .demo-table td:nth-child(2){color:#424242;font-family:'Courier New',monospace;font-size:10.5px;font-weight:600}
  .demo-table td:last-child{color:#424242;font-family:'Courier New',monospace;font-size:10.5px;font-weight:600}
  .demo-link{color:#1976d2;font-family:'Courier New',monospace;font-size:9.5px;word-break:break-all;display:block}
  .demo-simple{color:#424242;font-family:'Courier New',monospace;font-size:10.5px;margin-top:2px}
`;

/* icons */
const IUser   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IMail   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const ILock   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IPhone  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IHash   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>;
const ILink   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
const IShield = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const ISend   = () => <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:15,height:15}}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>;
const ICheck  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IWand   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:13,height:13}}><path d="m15 4-1 1"/><path d="m4 15 1-1"/><path d="m14.5 9.5-9.5 9.5"/><path d="M9 4v1"/><path d="M4 9h1"/><path d="m5 5 .5.5"/><path d="m19 9 .5.5"/><path d="m9 19 .5.5"/></svg>;
const Logo    = () => <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>;

const STEPS = ["Details", "Verify", "Done"];

export default function LoginPage() {
  usePageTitle("Login | MTL HR Onboard");
  const navigate = useNavigate();
  
  const [tab,       setTab]       = useState("candidate");
  const [mode,      setMode]      = useState("login");
  const [step,      setStep]      = useState(1);
  const [loginType, setLoginType] = useState("Custom");
  const [otpMethod, setOtpMethod] = useState("email");
  const [otp,       setOtp]       = useState(["","","","","",""]);
  const [timer,     setTimer]     = useState(0);
  const [toast,     setToast]     = useState({ msg:"", type:"" });
  const [errors,    setErrors]    = useState({});

  // candidate login
  const [cCode,  setCCode]  = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cLink,  setCLink]  = useState("");

  // hr login
  const [hrUser, setHrUser] = useState("");
  const [hrPass, setHrPass] = useState("");

  // signup
  const [sig, setSig] = useState({ firstName:"", lastName:"", email:"", phone:"", password:"", confirm:"" });

  const otpRefs = useRef([]);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const toast$ = (msg, type="err") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:"", type:"" }), 3200);
  };

  const resetAll = (t = "candidate") => {
    setTab(t); setMode("login"); setStep(1);
    setLoginType("Custom"); setOtp(["","","","","",""]); setTimer(0);
    setCCode(""); setCEmail(""); setCLink("");
    setHrUser(""); setHrPass("");
    setSig({ firstName:"", lastName:"", email:"", phone:"", password:"", confirm:"" });
    setErrors({});
  };

  // fill dummy data with one click
  const fillDummy = () => {
    if (tab === "candidate") {
      setCCode(MOCK_CANDIDATE.code);
      setCEmail(MOCK_CANDIDATE.email);
      toast$("Test data filled! Click Access Portal →", "ok");
    } else if (tab === "hr") {
      setHrUser("hruser");
      setHrPass("hr123");
      toast$("Test data filled! Click Sign In →", "ok");
    } else {
      setSig({ ...DUMMY });
      setErrors({});
      toast$("Test data filled! Click Continue →", "ok");
    }
  };

  // validate signup step 1
  const validateSig = () => {
    const e = {};
    if (!sig.firstName.trim()) e.firstName = "Required";
    if (!sig.lastName.trim())  e.lastName  = "Required";
    if (!sig.email.trim() || !/\S+@\S+\.\S+/.test(sig.email)) e.email = "Enter a valid email";
    if (sig.phone.replace(/\D/g,"").length < 10) e.phone = "Enter a valid 10-digit number";
    if (sig.password.length < 6) e.password = "Min 6 characters";
    if (sig.password !== sig.confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignupNext = () => {
    if (validateSig()) setStep(2);
  };

  const sendOtp = () => {
    setOtp(["","","","","",""]); setTimer(30); setStep(3);
    toast$(`OTP sent to your ${otpMethod === "email" ? "email" : "phone"}!`, "ok");
    setTimeout(() => otpRefs.current[0]?.focus(), 280);
  };

  const handleOtpKey = (e, i) => {
    if (e.key === "Backspace") {
      const n = [...otp]; n[i] = ""; setOtp(n);
      if (i > 0) otpRefs.current[i - 1]?.focus(); return;
    }
    const v = e.key.replace(/\D/g,"");
    if (v) {
      const n = [...otp]; n[i] = v; setOtp(n);
      if (i < 5) otpRefs.current[i + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const p = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    if (p.length === 6) { setOtp(p.split("")); otpRefs.current[5]?.focus(); }
  };

  const verifyOtp = () => {
    if (otp.join("").length < 6) { toast$("Enter the complete 6-digit OTP"); return; }
    setStep(4);
  };

  const stepNum = step === 1 ? 0 : step < 4 ? 1 : 2;
  const mEmail  = sig.email ? sig.email.replace(/(.{2}).*(@.*)/, "$1***$2") : "your email";
  const mPhone  = sig.phone ? "***-***-" + sig.phone.replace(/\D/g,"").slice(-4) : "your phone";

  const F = ({ field, label, type="text", placeholder, icon, hint }) => (
    <div className="fg">
      <label className="fl">{label}</label>
      <div className="fw">
        <span className="fi">{icon}</span>
        <input
          className={`inp ${errors[field] ? "err-inp" : sig[field] ? "ok-inp" : ""}`}
          type={type}
          placeholder={placeholder}
          value={sig[field]}
          onChange={e => {
            setSig(s => ({ ...s, [field]: e.target.value }));
            if (errors[field]) setErrors(er => ({ ...er, [field]: "" }));
          }}
        />
      </div>
      {errors[field] && <div className="err-msg">⚠ {errors[field]}</div>}
      {hint && !errors[field] && <div className="db-hint">{hint}</div>}
    </div>
  );

  return (
    <>
      <style>{css}</style>
      <div className="root">
        <div className="blob b1"/><div className="blob b2"/>
        <div className="blob b3"/><div className="blob b4"/>

        <div className="card">
          <div className="logo">
            <div className="logo-box"><Logo /></div>
            <div className="logo-name">HR<em>Board</em></div>
          </div>
          <div className="logo-sub">Employee Onboarding Portal</div>

          {/* ═══ LOGIN MODE ═══ */}
          {mode === "login" && (
            <>
              <div className="tabs">
                <button className={`tab${tab==="candidate"?" on":""}`} onClick={() => resetAll("candidate")}>
                  Candidate Access
                </button>
                <button className={`tab${tab==="hr"?" on":""}`} onClick={() => resetAll("hr")}>
                  HR / Staff Login
                </button>
              </div>

              {/* ── CANDIDATE ── */}
              {tab === "candidate" && (
                <div className="section">
                  <div className="ftitle">Candidate Access</div>
                  <div className="fdesc">Enter your Candidate Code &amp; Email — or paste your Unique Link sent by HR.</div>

                  <div className="fg">
                    <label className="fl">Candidate Code</label>
                    <div className="fw">
                      <span className="fi"><IHash /></span>
                      <input className="inp" placeholder="e.g. CAND-A1B2C3"
                        value={cCode} onChange={e => setCCode(e.target.value)} />
                    </div>
                    <div className="db-hint">tbl_CandidateMaster → CandidateCode</div>
                  </div>

                  <div className="fg">
                    <label className="fl">Registered Email</label>
                    <div className="fw">
                      <span className="fi"><IMail /></span>
                      <input className="inp" type="email" placeholder="rahul.sharma@email.com"
                        value={cEmail} onChange={e => setCEmail(e.target.value)} />
                    </div>
                    <div className="db-hint">tbl_CandidateMaster → Email</div>
                  </div>

                  <div className="divider">OR paste your Unique Link</div>

                  <div className="fg">
                    <label className="fl">Unique Onboarding Link</label>
                    <div className="link-row">
                      <div className="fw" style={{flex:1}}>
                        <span className="fi"><ILink /></span>
                        <input className="inp" placeholder="https://hrboard.app/onboard?ref=..."
                          value={cLink} onChange={e => setCLink(e.target.value)} />
                      </div>
                      <button type="button" className="link-go"
                        onClick={() => toast$("Opening onboarding form…","ok")}>Open →</button>
                    </div>
                    <div className="db-hint">tbl_CandidateMaster → UniqueLink</div>
                  </div>

                  <button type="button" className="btn-ghost" style={{marginBottom:0}} onClick={fillDummy}>
                    <IWand /> Fill with Test Data
                  </button>

                  <button className="btn"
                    onClick={() => {
                      // TODO: Replace with POST /api/auth/candidate
                      if (!cCode && !cLink) { toast$("Enter Candidate Code or paste Unique Link"); return; }
                      
                      // Check for valid candidate code + email
                      if (cCode === MOCK_CANDIDATE.code && cEmail === MOCK_CANDIDATE.email) {
                        localStorage.setItem('candidateAuth', JSON.stringify({
                          code: MOCK_CANDIDATE.code,
                          name: MOCK_CANDIDATE.name,
                          refNumber: MOCK_CANDIDATE.refNumber
                        }));
                        navigate('/candidate/dashboard');
                        return;
                      }
                      
                      // Check for unique link
                      if (cLink && cLink.includes(MOCK_CANDIDATE.code)) {
                        localStorage.setItem('candidateAuth', JSON.stringify({
                          code: MOCK_CANDIDATE.code,
                          name: MOCK_CANDIDATE.name,
                          refNumber: MOCK_CANDIDATE.refNumber
                        }));
                        navigate('/candidate/dashboard');
                        return;
                      }
                      
                      toast$("Candidate not found");
                    }}>
                    Access My Onboarding Portal
                  </button>
                  <div className="switch">
                    New candidate? <button onClick={() => { setMode("signup"); setStep(1); setErrors({}); }}>Create account</button>
                  </div>
                </div>
              )}

              {/* ── HR LOGIN ── */}
              {tab === "hr" && (
                <div className="section">
                  <div className="ftitle">HR &amp; Staff Login</div>
                  <div className="fdesc">Access based on your assigned role in the system.</div>

                  <div className="role-row">
                    <span className="chip c-admin">Admin</span>
                    <span className="chip c-hr">HR User</span>
                    <span className="chip c-sm">Security Manager</span>
                    <span className="chip c-se">Security Executive</span>
                  </div>

                  <div className="fl" style={{marginBottom:6}}>Login Type</div>
                  <div className="lt-row">
                    <button type="button" className={`lt-btn${loginType==="Custom"?" on":""}`} onClick={() => setLoginType("Custom")}>Custom (Local)</button>
                    <button type="button" className={`lt-btn${loginType==="LDAP"?" on":""}`} onClick={() => setLoginType("LDAP")}>LDAP (Domain)</button>
                  </div>

                  {loginType === "LDAP" && (
                    <div className="ldap-box">
                      ⚡ LDAP: password is verified by domain controller. PasswordHash = NULL in tbl_UserMaster.
                    </div>
                  )}

                  <div className="fg">
                    <label className="fl">Username</label>
                    <div className="fw">
                      <span className="fi"><IUser /></span>
                      <input className="inp" placeholder="e.g. hruser"
                        value={hrUser} onChange={e => setHrUser(e.target.value)} />
                    </div>
                    <div className="db-hint">tbl_UserMaster → Username</div>
                  </div>

                  <div className="fg">
                    <label className="fl">{loginType === "LDAP" ? "Domain Password" : "Password"}</label>
                    <div className="fw">
                      <span className="fi"><ILock /></span>
                      <input className="inp" type="password"
                        placeholder={loginType === "LDAP" ? "Your domain/AD password" : "Enter your password"}
                        value={hrPass} onChange={e => setHrPass(e.target.value)} />
                    </div>
                    <div className="db-hint">{loginType === "LDAP" ? "PasswordHash = NULL (LDAP auth)" : "tbl_UserMaster → PasswordHash"}</div>
                  </div>

                  <button type="button" className="btn-ghost" style={{marginBottom:8,marginTop:0}} onClick={fillDummy}>
                    <IWand /> Fill with Test Data
                  </button>

                  <div className="forgot"><a href="#">Forgot password?</a></div>
                  <button className="btn"
                    onClick={() => {
                      // TODO: Replace with POST /api/auth/login
                      if (!hrUser) { toast$("Enter your username"); return; }
                      if (!hrPass) { toast$("Enter your password"); return; }
                      
                      // Check mock credentials
                      const cred = MOCK_HR_CREDENTIALS[hrUser.toLowerCase()];
                      if (cred && cred.password === hrPass) {
                        localStorage.setItem('hrAuth', JSON.stringify({
                          username: hrUser,
                          role: cred.role,
                          name: cred.name
                        }));
                        navigate('/hr/dashboard');
                      } else {
                        toast$("Invalid username or password");
                      }
                    }}>
                    <IShield style={{width:14,height:14,stroke:"white",fill:"none",strokeWidth:2}}/>
                    Sign In as {loginType === "LDAP" ? "Staff (LDAP)" : "Staff"}
                  </button>
                </div>
              )}
            </>
          )}

          {/* ═══ SIGNUP MODE ═══ */}
          {mode === "signup" && (
            <div className="section" key={`sg${step}`}>

              {step < 4 && (
                <div className="stepper">
                  {STEPS.map((s, i) => (
                    <div key={s} style={{display:"contents"}}>
                      <div className="s-item">
                        <div className={`s-dot ${i < stepNum?"done":i===stepNum?"active":"idle"}`}>
                          {i < stepNum ? <ICheck /> : i+1}
                        </div>
                        <div className={`s-lbl ${i < stepNum?"done":i===stepNum?"active":""}`}>{s}</div>
                      </div>
                      {i < STEPS.length-1 && <div className={`s-line ${i < stepNum?"done":""}`}/>}
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 1 — Details */}
              {step === 1 && (
                <>
                  <button className="back-btn" onClick={() => resetAll("candidate")}>← Back to Login</button>
                  <div className="ftitle">Create Candidate Account</div>
                  <div className="fdesc">Saves to tbl_CandidateMaster. HR sends your Unique Link after review.</div>

                  {/* fill dummy button */}
                  <button type="button" className="btn-ghost" style={{marginBottom:12,marginTop:0}} onClick={fillDummy}>
                    <IWand /> Fill with Test Data
                  </button>

                  <div className="row2">
                    <F field="firstName" label="First Name" placeholder="Rahul" icon={<IUser />} hint="→ FirstName" />
                    <F field="lastName"  label="Last Name"  placeholder="Sharma" icon={<IUser />} hint="→ LastName" />
                  </div>
                  <F field="email"    label="Email Address"  type="email"    placeholder="rahul.sharma@gmail.com" icon={<IMail />}  hint="→ Email" />
                  <F field="phone"    label="Phone Number"   type="tel"      placeholder="9876543210"             icon={<IPhone />} hint="→ Phone" />
                  <div className="row2">
                    <F field="password" label="Password" type="password" placeholder="Test@1234" icon={<ILock />} />
                    <F field="confirm"  label="Confirm"  type="password" placeholder="Test@1234" icon={<ILock />} />
                  </div>

                  <button className="btn" onClick={handleSignupNext}>
                    Continue to Verification →
                  </button>
                </>
              )}

              {/* STEP 2 — Choose OTP Method */}
              {step === 2 && (
                <>
                  <button className="back-btn" onClick={() => setStep(1)}>← Back</button>
                  <div className="ftitle">Verify Your Identity</div>
                  <div className="fdesc">Choose where to send your one-time password</div>
                  <div className="method-grid">
                    <div className={`mcard${otpMethod==="email"?" on":""}`} onClick={() => setOtpMethod("email")}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={otpMethod==="email"?"#1565c0":"#90a4ae"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                      <div className="mcard-lbl">Via Email</div>
                      <div className="mcard-sub">{mEmail}</div>
                    </div>
                    <div className={`mcard${otpMethod==="phone"?" on":""}`} onClick={() => setOtpMethod("phone")}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={otpMethod==="phone"?"#1565c0":"#90a4ae"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      <div className="mcard-lbl">Via Phone</div>
                      <div className="mcard-sub">{mPhone}</div>
                    </div>
                  </div>
                  <button className="btn" onClick={sendOtp}><ISend /> Send OTP</button>
                </>
              )}

              {/* STEP 3 — OTP Entry */}
              {step === 3 && (
                <>
                  <button className="back-btn" onClick={() => setStep(2)}>← Change method</button>
                  <div className="ftitle">Enter OTP</div>
                  <div className="fdesc">Enter the 6-digit code · <strong style={{color:"#1565c0"}}>Use any 6 digits for demo</strong></div>

                  <div className="sent-ok">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#388e3c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:15,height:15}}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    OTP sent to {otpMethod === "email" ? mEmail : mPhone}
                  </div>

                  <div className="otp-row" onPaste={handlePaste}>
                    {otp.map((v, i) => (
                      <input key={i} ref={el => otpRefs.current[i] = el}
                        className={`obox${v?" has":""}`}
                        type="text" inputMode="numeric" maxLength={1}
                        value={v} onChange={() => {}}
                        onKeyDown={e => handleOtpKey(e, i)} />
                    ))}
                  </div>

                  <div className="resend-bar">
                    <span className="timer-txt">{timer > 0 ? `Resend in ${timer}s` : "Didn't receive code?"}</span>
                    <button className="resend-btn" disabled={timer > 0} onClick={sendOtp}>Resend OTP</button>
                  </div>

                  <button className="btn" onClick={verifyOtp}>Verify &amp; Create Account</button>
                </>
              )}

              {/* STEP 4 — Success */}
              {step === 4 && (
                <div className="succ">
                  <div className="succ-ring"><ICheck /></div>
                  <div style={{fontFamily:"Poppins",fontSize:18,fontWeight:600,color:"#1a237e",marginBottom:5}}>Account Created!</div>
                  <div style={{color:"#546e7a",fontSize:13,marginBottom:8}}>
                    Welcome, <strong style={{color:"#1565c0"}}>{sig.firstName} {sig.lastName}</strong>!
                  </div>
                  <div className="db-status-box">
                    📋 tbl_CandidateMaster record created<br/>
                    Name &nbsp;→ {sig.firstName} {sig.lastName}<br/>
                    Email &nbsp;→ {sig.email}<br/>
                    Phone &nbsp;→ {sig.phone}<br/>
                    Status → <em>Pending</em><br/>
                    UniqueLink → <em>Generated by HR after approval</em>
                  </div>
                  <button className="btn" onClick={() => resetAll("candidate")}>Go to Login</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Demo Credentials Card - Only in Development */}
        {import.meta.env.DEV && mode === "login" && (
          <div className="demo-card">
            <div className="demo-badge">DEMO ONLY</div>
            <div className="demo-title">Demo Credentials</div>
            
            {tab === "hr" && (
              <div className="demo-section">
                <div className="demo-subtitle">HR Staff logins (for Staff Login tab):</div>
                <table className="demo-table">
                  <tbody>
                    <tr><td>Admin</td><td>admin</td><td>admin123</td></tr>
                    <tr><td>HR User</td><td>hruser</td><td>hr123</td></tr>
                    <tr><td>Security Manager</td><td>secmgr</td><td>sec123</td></tr>
                    <tr><td>Security Executive</td><td>secexec</td><td>exec123</td></tr>
                  </tbody>
                </table>
              </div>
            )}
            
            {tab === "candidate" && (
              <>
                <div className="demo-section">
                  <div className="demo-subtitle">Candidate login (for Candidate Access tab):</div>
                  <div style={{paddingLeft:'4px'}}>
                    <div style={{fontSize:'10px',color:'#666',marginBottom:'2px'}}>Candidate Code: <span className="demo-simple" style={{display:'inline'}}>CAND-A1B2C3</span></div>
                    <div style={{fontSize:'10px',color:'#666',marginBottom:'2px'}}>Email: <span className="demo-simple" style={{display:'inline'}}>rahul.sharma@email.com</span></div>
                  </div>
                </div>
                <div className="demo-section">
                  <div className="demo-subtitle">Or Unique Link:</div>
                  <div className="demo-link">https://hrboard.app/onboard?ref=CAND-A1B2C3</div>
                </div>
              </>
            )}
          </div>
        )}

        {toast.msg && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
      </div>
    </>
  );
}