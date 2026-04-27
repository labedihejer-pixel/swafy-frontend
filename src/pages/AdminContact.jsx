// AdminContact.jsx — Version Finale Corrigée + Exit + Fichiers
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ زدنا هذا

/* ══════════════════════════════════════════════
   EMOJI DICTIONARY
══════════════════════════════════════════════ */
const EMOJI_DICT = [
  { words: ["smile","heureux","happy","joie","joy"], emoji: "😊" },
  { words: ["sad","triste","malheureux","unhappy","hzin"], emoji: "😢" },
  { words: ["haha","lol","laugh","rire","drole"], emoji: "😂" },
  { words: ["love","amour","coeur","heart"], emoji: "❤️" },
  { words: ["cool","swag"], emoji: "😎" },
  { words: ["think","pense","reflechir","hmm"], emoji: "🤔" },
  { words: ["angry","colere","fache"], emoji: "😠" },
  { words: ["surprise","choque","wow"], emoji: "😮" },
  { words: ["peur","scared","fear"], emoji: "😱" },
  { words: ["sick","malade"], emoji: "🤒" },
  { words: ["sleepy","fatigue","sommeil"], emoji: "😴" },
  { words: ["wink","clin"], emoji: "😉" },
  { words: ["kiss","bisou"], emoji: "😘" },
  { words: ["angel","ange"], emoji: "😇" },
  { words: ["devil","diable"], emoji: "😈" },
  { words: ["ok","yes"], emoji: "👍" },
  { words: ["non","no","nope"], emoji: "👎" },
  { words: ["clap","bravo","applause"], emoji: "👏" },
  { words: ["pray","merci","thanks"], emoji: "🙏" },
  { words: ["fire","feu","chaud"], emoji: "🔥" },
  { words: ["check","done","fait"], emoji: "✅" },
  { words: ["star","etoile"], emoji: "⭐" },
  { words: ["info","information"], emoji: "💡" },
  { words: ["warning","attention"], emoji: "⚠️" },
  { words: ["rocket","fusee","vite"], emoji: "🚀" },
  { words: ["party","fete","celebration"], emoji: "🎉" },
  { words: ["music","musique"], emoji: "🎵" },
  { words: ["phone","tel"], emoji: "📞" },
  { words: ["mail","email"], emoji: "📧" },
  { words: ["pin","epingle"], emoji: "📌" },
  { words: ["time","heure","horloge"], emoji: "⏰" },
  { words: ["money","argent"], emoji: "💰" },
  { words: ["computer","pc","ordinateur"], emoji: "💻" },
  { words: ["book","livre"], emoji: "📚" },
  { words: ["camera","photo"], emoji: "📷" },
  { words: ["car","voiture"], emoji: "🚗" },
  { words: ["food","manger","pizza"], emoji: "🍕" },
  { words: ["coffee","cafe"], emoji: "☕" },
  { words: ["sun","soleil"], emoji: "☀️" },
  { words: ["rain","pluie"], emoji: "🌧️" },
  { words: ["snow","neige"], emoji: "❄️" },
  { words: ["wave","salut","hi","hello"], emoji: "👋" },
  { words: ["muscle","fort","strong"], emoji: "💪" },
  { words: ["eyes","voir","look"], emoji: "👀" },
  { words: ["target","objectif"], emoji: "🎯" },
  { words: ["gift","cadeau"], emoji: "🎁" },
];

const convertToEmoji = (text) => {
  let result = text;
  EMOJI_DICT.forEach(({ words, emoji }) => {
    words.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      result = result.replace(regex, emoji);
    });
  });
  return result;
};

const getSuggestion = (text) => {
  if (!text.trim()) return null;
  const lastWord = text.trim().split(/\s+/).pop();
  if (lastWord.length < 2) return null;
  const found = EMOJI_DICT.find((e) =>
    e.words.some((w) => w.toLowerCase().startsWith(lastWord.toLowerCase()))
  );
  return found ? { emoji: found.emoji, word: lastWord } : null;
};

/* ══════════════════════════════════════════════
   FAKE DATA
══════════════════════════════════════════════ */
const FAKE_CONTACTS = [
  {
    id: 1, name: "Ahmed Ben Ali", avatar: "A", preview: "Bonjour, j'ai une question...",
    time: "11:00", unread: 2, platform: "whatsapp",
    messages: [
      { id: 1, from: "them", text: "Bonjour, j'ai une question concernant l'inscription.", time: "11:00pm, June 24,2024" },
      { id: 2, from: "me",   text: "Bonjour Ahmed ! Je suis là pour vous aider 😊", time: "11:05pm, June 24,2024" },
      { id: 3, from: "them", text: "Merci ! Comment puis-je m'inscrire à l'événement ?", time: "11:10pm, June 24,2024" },
    ],
  },
  {
    id: 2, name: "Sara Meddeb", avatar: "S", preview: "Merci pour l'aide !",
    time: "10:30", unread: 0, platform: "email",
    messages: [
      { id: 1, from: "them", text: "Bonjour, est-ce que le live est disponible ?", time: "10:00am, June 24,2024" },
      { id: 2, from: "me",   text: "Oui bien sûr ! 👍", time: "10:15am, June 24,2024" },
      { id: 3, from: "them", text: "Merci pour l'aide ! ❤️", time: "10:30am, June 24,2024" },
    ],
  },
  {
    id: 3, name: "Mohamed Triki", avatar: "M", preview: "D'accord, je comprends.",
    time: "09:15", unread: 5, platform: "slack",
    messages: [
      { id: 1, from: "them", text: "Salut ! Y a-t-il une réunion aujourd'hui ?", time: "09:00am, June 24,2024" },
      { id: 2, from: "me",   text: "Oui, à 14h sur le canal général 🎯", time: "09:10am, June 24,2024" },
      { id: 3, from: "them", text: "D'accord, je comprends.", time: "09:15am, June 24,2024" },
    ],
  },
];

const LANGUAGES = [
  { code:"fr", flag:"🇫🇷", name:"Français" },
  { code:"ar", flag:"🇹🇳", name:"العربية" },
  { code:"en", flag:"🇬🇧", name:"English" },
  { code:"es", flag:"🇪🇸", name:"Español" },
  { code:"de", flag:"🇩🇪", name:"Deutsch" },
  { code:"it", flag:"🇮🇹", name:"Italiano" },
  { code:"pt", flag:"🇵🇹", name:"Português" },
  { code:"zh", flag:"🇨🇳", name:"中文" },
  { code:"ja", flag:"🇯🇵", name:"日本語" },
  { code:"ko", flag:"🇰🇷", name:"한국어" },
  { code:"ru", flag:"🇷🇺", name:"Русский" },
  { code:"tr", flag:"🇹🇷", name:"Türkçe" },
  { code:"nl", flag:"🇳🇱", name:"Nederlands" },
  { code:"pl", flag:"🇵🇱", name:"Polski" },
  { code:"sv", flag:"🇸🇪", name:"Svenska" },
];

const AVATAR_COLORS = ["#7c5cbf","#3b82f6","#22c55e","#f59e0b","#ef4444","#ec4899","#14b8a6"];
const QUICK_EMOJIS = ["😊","😂","❤️","👍","🔥","✅","🎉","😢","😎","🤔","👏","🙏","💡","🚀","⭐","😘","👋","💪","🎯","😍"];

/* ══════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════ */
export default function AdminContact() {
  const navigate = useNavigate(); // ✅ للخروج
  const fileInputRef = useRef(null); // ✅ لرفع الملفات
  
  const [view, setView]               = useState("chat");
  const [contacts, setContacts]       = useState(FAKE_CONTACTS);
  const [selected, setSelected]       = useState(FAKE_CONTACTS[0]);
  const [search, setSearch]           = useState("");
  const [msg, setMsg]                 = useState("");
  const [showEmoji, setShowEmoji]     = useState(false);
  const [activePlatform, setActivePlatform] = useState("slack");
  const [suggestion, setSuggestion]   = useState(null);

  const [settings, setSettings] = useState({
    powerSaving:   true,
    checkTyping:   false,
    checkSpelling: true,
    autoCorrect:   false,
    showSticker:   true,
    replaceEmoji:  false,
    replyMessage:  true,
    replaceEmoji2: false,
  });

  const [showNewChat, setShowNewChat]         = useState(false);
  const [newChatName, setNewChatName]         = useState("");
  const [newChatPlatform, setNewChatPlatform] = useState("whatsapp");

  const [langSearch, setLangSearch]       = useState("");
  const [selectedLang, setSelectedLang]   = useState(LANGUAGES[0]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages]);

  const handleMsgChange = (val) => {
    setMsg(val);
    setSuggestion(getSuggestion(val));
  };

  const sendMessage = () => {
    if (!msg.trim()) return;
    const finalText = settings.replaceEmoji ? convertToEmoji(msg) : msg;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("fr-FR", { hour:"2-digit", minute:"2-digit" }) +
      ", " + now.toLocaleDateString("fr-FR", { day:"numeric", month:"long", year:"numeric" });

    const updated = contacts.map((c) =>
      c.id === selected.id
        ? { ...c, preview: finalText, messages: [...c.messages, { id: Date.now(), from:"me", text: finalText, time: timeStr }] }
        : c
    );
    setContacts(updated);
    setSelected(updated.find((c) => c.id === selected.id));
    setMsg("");
    setSuggestion(null);
    setShowEmoji(false);
  };

  // ✅ وظيفة رفع الملفات (PDF, Images, Dossiers)
  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileNames = Array.from(files).map(f => f.name).join(", ");
    
    // نختار أيقونة حسب نوع الملف
    const firstFile = files[0];
    let icon = "📁";
    if (firstFile.type.startsWith("image/")) icon = "🖼️";
    else if (firstFile.type === "application/pdf") icon = "📄";
    else if (firstFile.type.includes("zip") || firstFile.type.includes("rar")) icon = "🗜️";

    const now = new Date();
    const timeStr = now.toLocaleTimeString("fr-FR", { hour:"2-digit", minute:"2-digit" }) +
      ", " + now.toLocaleDateString("fr-FR", { day:"numeric", month:"long", year:"numeric" });

    const finalText = `${icon} ${files.length > 1 ? files.length + " fichiers" : "Fichier"} : ${fileNames}`;

    const updated = contacts.map((c) =>
      c.id === selected.id
        ? { ...c, preview: finalText, messages: [...c.messages, { id: Date.now(), from:"me", text: finalText, time: timeStr }] }
        : c
    );
    setContacts(updated);
    setSelected(updated.find((c) => c.id === selected.id));
    
    // نفرغ الـ input باش نقدر نرفع نفس الملف مرة أخرى
    e.target.value = "";
  };

  const insertSuggestion = () => {
    if (!suggestion) return;
    const words = msg.trim().split(/\s+/);
    words[words.length - 1] = suggestion.emoji;
    setMsg(words.join(" ") + " ");
    setSuggestion(null);
  };

  const createNewChat = () => {
    if (!newChatName.trim()) return;
    const nc = {
      id: Date.now(), name: newChatName,
      avatar: newChatName.charAt(0).toUpperCase(),
      preview: "Nouveau chat", time: "maintenant", unread: 0,
      platform: newChatPlatform, messages: [],
    };
    setContacts((p) => [nc, ...p]);
    setSelected(nc);
    setView("chat");
    setShowNewChat(false);
    setNewChatName("");
  };

  const toggleSetting = (key) => setSettings((p) => ({ ...p, [key]: !p[key] }));

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredLangs = LANGUAGES.filter((l) =>
    l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  const platformIcon = (p) =>
    ({ whatsapp:"💬", email:"📧", slack:"🟣", telegram:"✈️" }[p] || "💬");

  const openWhatsApp = () => window.open("https://web.whatsapp.com","_blank");
  const openEmail    = () => window.open("mailto:","_blank");
  const openSlack    = () => window.open("https://slack.com","_blank");

  const selectedIdx = contacts.findIndex((c) => c.id === selected?.id);

  const S = {
    wrap:{ display:"flex", height:"100vh", fontFamily:"'Poppins',sans-serif", background:"#f0edf8", overflow:"hidden" },

    rail:{ width:60, background:"#1a1a2e", display:"flex", flexDirection:"column", alignItems:"center",
      paddingTop:14, gap:4, zIndex:10, paddingBottom:12 },
    railBtn:(active)=>({ width:42,height:42,borderRadius:"50%",border:"none",cursor:"pointer",
      display:"flex",alignItems:"center",justifyContent:"center",
      background:active?"rgba(124,92,191,.4)":"transparent",
      boxShadow:active?"0 0 0 2px #7c5cbf":"none", transition:"all .2s" }),
    railAdd:{ width:38,height:38,borderRadius:"50%",border:"2px dashed rgba(255,255,255,.3)",
      background:"transparent",color:"#fff",fontSize:22,cursor:"pointer",
      display:"flex",alignItems:"center",justifyContent:"center",marginBottom:4 },

    sidebar:{ width:300, background:"#fff", borderRight:"1px solid #ece8f5",
      display:"flex", flexDirection:"column", overflow:"hidden" },
    sHead:{ padding:"18px 18px 12px", borderBottom:"1px solid #f0edf8" },
    sTitle:{ fontSize:22, fontWeight:700, color:"#1a1a2e", marginBottom:10 },
    sSearch:{ display:"flex", alignItems:"center", background:"#f5f3fc", borderRadius:12, padding:"7px 12px", gap:8 },
    sInput:{ border:"none", background:"transparent", outline:"none", fontSize:13, color:"#333", width:"100%" },

    contactItem:(active)=>({ display:"flex", alignItems:"center", padding:"11px 16px", gap:10, cursor:"pointer",
      background:active?"#f0edf8":"transparent",
      borderLeft:active?"3px solid #7c5cbf":"3px solid transparent", transition:"background .2s" }),
    av:(color)=>({ width:42,height:42,borderRadius:"50%",flexShrink:0,background:color,color:"#fff",
      display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:700 }),
    cName:{ fontSize:13, fontWeight:600, color:"#1a1a2e" },
    cPrev:{ fontSize:12, color:"#999", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:155 },
    cTime:{ fontSize:11, color:"#bbb" },
    badge:{ background:"#7c5cbf", color:"#fff", borderRadius:99, fontSize:10, fontWeight:700, padding:"1px 6px" },
    exitBtn:{ margin:"0 16px 16px", padding:"11px",
      background:"linear-gradient(135deg,#ef4444,#dc2626)", border:"none", borderRadius:14,
      color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer",
      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
      boxShadow:"0 4px 12px rgba(239,68,68,.3)" },

    chat:{ flex:1, display:"flex", flexDirection:"column", background:"#f8f7fc" },
    chatTop:{ padding:"13px 22px", background:"#fff", borderBottom:"1px solid #ece8f5",
      display:"flex", alignItems:"center", gap:12 },
    chatName:{ fontSize:15, fontWeight:700, color:"#1a1a2e" },
    chatSub:{ fontSize:11, color:"#999" },
    topIcons:{ marginLeft:"auto", display:"flex", gap:6 },
    topIconBtn:{ width:38,height:38,borderRadius:"50%",border:"none",cursor:"pointer",
      display:"flex",alignItems:"center",justifyContent:"center",
      background:"#f5f3fc", transition:"background .2s" },

    msgs:{ flex:1, overflowY:"auto", padding:"20px 28px", display:"flex", flexDirection:"column", gap:4 },
    tsLabel:{ textAlign:"center", fontSize:11, color:"#bbb", margin:"10px 0 6px", fontWeight:500 },
    bubble:(me)=>({ maxWidth:"58%", padding:"11px 15px",
      borderRadius:me?"18px 18px 4px 18px":"18px 18px 18px 4px",
      background:me?"#dcd0f5":"#fff", color:"#1a1a2e", fontSize:14, lineHeight:1.5,
      alignSelf:me?"flex-end":"flex-start", boxShadow:"0 2px 8px rgba(0,0,0,.06)",
      animation:"fadeUp .3s ease" }),
    msgRow:(me)=>({ display:"flex", alignItems:"flex-end", gap:8, flexDirection:me?"row-reverse":"row" }),
    avMsg:(color)=>({ width:34,height:34,borderRadius:"50%",background:color||"#7c5cbf",color:"#fff",
      display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,flexShrink:0 }),

    inputBar:{ padding:"12px 22px", background:"#fff", borderTop:"1px solid #ece8f5",
      display:"flex", flexDirection:"column", gap:8 },
    inputWrap:{ display:"flex", alignItems:"center", background:"#f5f3fc",
      borderRadius:16, padding:"9px 14px", gap:10 },
    textIn:{ flex:1, border:"none", background:"transparent", outline:"none", fontSize:14, color:"#333" },
    iconBtn:{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:"#888", padding:4, borderRadius:8 },
    sendBtn:{ width:40,height:40,borderRadius:"50%",
      background:"linear-gradient(135deg,#7c5cbf,#5a3fa0)",border:"none",color:"#fff",
      display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",
      boxShadow:"0 4px 12px rgba(124,92,191,.4)" },

    suggestionBar:{ display:"flex", alignItems:"center", gap:8, padding:"0 4px" },
    suggPill:{ display:"inline-flex", alignItems:"center", gap:6, background:"#f0edf8",
      borderRadius:20, padding:"4px 12px", fontSize:13, color:"#7c5cbf", fontWeight:600,
      cursor:"pointer", border:"1px solid #dcd0f5", transition:"all .2s" },
    suggDismiss:{ background:"none", border:"none", color:"#bbb", cursor:"pointer", fontSize:13, padding:"0 4px" },

    emojiBox:{ background:"#fff", borderRadius:14, padding:10, boxShadow:"0 8px 30px rgba(0,0,0,.12)",
      display:"flex", flexWrap:"wrap", gap:4, maxWidth:300 },
    emojiBtn:{ fontSize:22, background:"none", border:"none", cursor:"pointer", borderRadius:8, padding:4 },

    settingsWrap:{ flex:1, overflowY:"auto", padding:"28px 36px", background:"#f8f7fc" },
    settingsTitle:{ fontSize:24, fontWeight:800, color:"#1a1a2e", marginBottom:24 },
    section:{ marginBottom:24 },
    secTitle:{ fontSize:12, fontWeight:700, color:"#7c5cbf", marginBottom:8,
      textTransform:"uppercase", letterSpacing:1 },
    row:{ display:"flex", alignItems:"center", justifyContent:"space-between",
      background:"#fff", borderRadius:14, padding:"13px 18px", marginBottom:7,
      boxShadow:"0 2px 8px rgba(0,0,0,.04)" },
    rowLabel:{ fontSize:13, color:"#333" },
    rowSub:{ fontSize:11, color:"#aaa", marginTop:2 },
    toggle:(on)=>({ width:46,height:25,borderRadius:13,
      background:on?"#22c55e":"#ef4444",position:"relative",
      cursor:"pointer",transition:"background .3s",border:"none",flexShrink:0 }),
    toggleDot:(on)=>({ position:"absolute",top:3,left:on?24:3,width:19,height:19,
      borderRadius:"50%",background:"#fff",transition:"left .3s",
      boxShadow:"0 1px 4px rgba(0,0,0,.2)" }),

    langCard:{ background:"#fff", borderRadius:16, padding:"14px 18px", boxShadow:"0 2px 8px rgba(0,0,0,.06)" },
    langSearch:{ display:"flex", alignItems:"center", gap:8, background:"#f5f3fc",
      borderRadius:12, padding:"7px 12px", marginBottom:10 },
    langGrid:{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6, maxHeight:200, overflowY:"auto" },
    langItem:(active)=>({ display:"flex",flexDirection:"column",alignItems:"center",padding:"8px 4px",
      borderRadius:10,cursor:"pointer",
      background:active?"#f0edf8":"#fafafa",
      border:active?"2px solid #7c5cbf":"2px solid transparent", transition:"all .2s" }),

    overlay:{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:999 },
    modal:(w)=>({ background:"#fff", borderRadius:22, padding:32, width:w||420,
      boxShadow:"0 20px 60px rgba(0,0,0,.2)", maxHeight:"90vh", overflowY:"auto", position:"relative" }),
    modalTitle:{ fontSize:19, fontWeight:800, color:"#1a1a2e", marginBottom:20, textAlign:"center" },
    modalClose:{ position:"absolute",top:14,right:16,background:"none",border:"none",
      fontSize:20,cursor:"pointer",color:"#999" },
    platformGrid:{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 },
    platformBtn:(active)=>({ display:"flex",flexDirection:"column",alignItems:"center",gap:6,
      padding:"14px 8px",borderRadius:14,
      border:active?"2px solid #7c5cbf":"2px solid #ece8f5",
      cursor:"pointer", background:active?"#f0edf8":"#fafafa", transition:"all .2s" }),
    fi:{ width:"100%", border:"1.5px solid #ece8f5", borderRadius:10, padding:"10px 14px",
      fontSize:13, color:"#333", outline:"none", background:"#fafafa", marginTop:4 },
    label:{ fontSize:12, fontWeight:600, color:"#666" },
    saveBtn:{ width:"100%",padding:"12px",background:"linear-gradient(135deg,#7c5cbf,#5a3fa0)",
      border:"none",borderRadius:12,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",marginTop:16,
      boxShadow:"0 4px 14px rgba(124,92,191,.35)" },
  };

  const Toggle = ({ on, onToggle }) => (
    <button style={S.toggle(on)} onClick={onToggle}>
      <div style={S.toggleDot(on)} />
    </button>
  );

  return (
    <>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(124,92,191,.3);border-radius:4px}
        button:hover{opacity:.85}
      `}</style>

      {/* ✅ Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: "none" }} 
        multiple 
        accept="image/*,application/pdf,.doc,.docx,.txt,.zip,.rar"
        onChange={handleFileSelect} 
      />

      <div style={S.wrap}>

        {/* ══ RAIL ══ */}
        <div style={S.rail}>
          <button style={S.railAdd} title="Nouveau chat" onClick={() => setShowNewChat(true)}>+</button>

          {[
            { key:"slack",     src:"https://cdn.simpleicons.org/slack",           action: openSlack },
            { key:"linkedin",  src:"https://cdn.simpleicons.org/linkedin/0A66C2", action:()=>window.open("https://linkedin.com","_blank") },
            { key:"twitter",   src:"https://cdn.simpleicons.org/x/ffffff",        action:()=>window.open("https://twitter.com","_blank") },
            { key:"telegram",  src:"https://cdn.simpleicons.org/telegram",        action:()=>window.open("https://web.telegram.org","_blank") },
            { key:"whatsapp",  src:"https://cdn.simpleicons.org/whatsapp",        action: openWhatsApp },
            { key:"instagram", src:"https://cdn.simpleicons.org/instagram",       action:()=>window.open("https://instagram.com","_blank") },
          ].map((p) => (
            <button key={p.key} style={S.railBtn(activePlatform===p.key)} title={p.key}
              onClick={()=>{ setActivePlatform(p.key); p.action(); }}>
              <img src={p.src} alt={p.key} style={{width:24,height:24}} />
            </button>
          ))}

          <button style={S.railBtn(activePlatform==="email")} title="Email"
            onClick={()=>{ setActivePlatform("email"); openEmail(); }}>
            📧
          </button>

          <div style={{flex:1}}/>

          <button style={S.railBtn(view==="settings")} title="Paramètres"
            onClick={()=>setView(view==="settings"?"chat":"settings")}>
            ⚙️
          </button>
        </div>

        {/* ══ SIDEBAR ══ */}
        <div style={S.sidebar}>
          <div style={S.sHead}>
            <div style={S.sTitle}>Chats</div>
            <div style={S.sSearch}>
              <span style={{color:"#bbb",fontSize:13}}>🔍</span>
              <input style={S.sInput} placeholder="Search Chats"
                value={search} onChange={(e)=>setSearch(e.target.value)}/>
            </div>
          </div>

          <div style={{flex:1,overflowY:"auto"}}>
            {filteredContacts.map((c,i)=>(
              <div key={c.id} style={S.contactItem(selected?.id===c.id)}
                onClick={()=>{ setSelected(c); setView("chat"); }}>
                <div style={S.av(AVATAR_COLORS[i%AVATAR_COLORS.length])}>{c.avatar}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <span style={S.cName}>{c.name}</span>
                    <span style={{fontSize:11}}>{platformIcon(c.platform)}</span>
                  </div>
                  <div style={S.cPrev}>{c.preview}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
                  <span style={S.cTime}>{c.time}</span>
                  {c.unread>0 && <span style={S.badge}>{c.unread}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* ✅ زر الخروج يرجع لصفحة Login */}
          <button style={S.exitBtn} onClick={() => navigate("/")}>
            🚪 Exit
          </button>
        </div>

        {/* ══ CHAT ══ */}
        {view==="chat" && selected && (
          <div style={S.chat}>

           {/* Top bar */}
            <div style={S.chatTop}>
              <div style={{
                ...S.av(AVATAR_COLORS[selectedIdx % AVATAR_COLORS.length]),
                width: 40, height: 40, fontSize: 15
              }}>
                {selected.avatar}
              </div>
              <div>
                <div style={S.chatName}>{selected.name}</div>
                <div style={S.chatSub}>
                  {platformIcon(selected.platform)} {selected.platform}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={S.msgs}>
              {selected.messages.map((m,i)=>{
                const isMe = m.from==="me";
                const showTime = i===0 || selected.messages[i-1]?.time!==m.time;
                return (
                  <div key={m.id}>
                    {showTime && <div style={S.tsLabel}>{m.time}</div>}
                    <div style={S.msgRow(isMe)}>
                      {!isMe && (
                        <div style={S.avMsg(AVATAR_COLORS[selectedIdx%AVATAR_COLORS.length])}>
                          {selected.avatar}
                        </div>
                      )}
                      <div style={S.bubble(isMe)}>{m.text}</div>
                      {isMe && <div style={S.avMsg("#7c5cbf")}>A</div>}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef}/>
            </div>

            {/* Suggestion emoji */}
            {suggestion && (
              <div style={{padding:"0 22px 4px"}}>
                <div style={S.suggestionBar}>
                  <span style={{fontSize:12,color:"#aaa"}}>Suggestion :</span>
                  <span style={S.suggPill} onClick={insertSuggestion}>
                    {suggestion.emoji} Insérer
                  </span>
                  <button style={S.suggDismiss} onClick={()=>setSuggestion(null)}>✕</button>
                </div>
              </div>
            )}

            {/* Quick emoji picker */}
            {showEmoji && (
              <div style={{padding:"0 22px 6px"}}>
                <div style={S.emojiBox}>
                  {QUICK_EMOJIS.map((e)=>(
                    <button key={e} style={S.emojiBtn}
                      onClick={()=>setMsg((p)=>p+e)}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div style={S.inputBar}>
              <div style={S.inputWrap}>
                {/* ✅ زر إرفاق الملفات */}
                <button style={S.iconBtn} title="Joindre un fichier (PDF, Image...)" 
                  onClick={() => fileInputRef.current?.click()}>📎</button>
                <button style={S.iconBtn} title="Image">🖼️</button>
                <input style={S.textIn}
                  placeholder="Write your message...."
                  value={msg}
                  onChange={(e)=>handleMsgChange(e.target.value)}
                  onKeyDown={(e)=>e.key==="Enter"&&sendMessage()}/>
                <button style={S.iconBtn} title="Emoji"
                  onClick={()=>setShowEmoji(!showEmoji)}>😊</button>
                <button style={S.sendBtn} onClick={sendMessage}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </button>
              </div>

              {settings.replaceEmoji && (
                <div style={{fontSize:11,color:"#7c5cbf",paddingLeft:4,display:"flex",alignItems:"center",gap:4}}>
                  <span>✨</span>
                  <span>Remplacement emoji automatique activé — tapez "happy", "sad", "fire"...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ SETTINGS ══ */}
        {view==="settings" && (
          <div style={S.settingsWrap}>
            <div style={S.settingsTitle}>⚙️ Settings</div>

            <div style={S.section}>
              <div style={S.secTitle}>Power management</div>
              <div style={S.row}>
                <span style={S.rowLabel}>Power saving mode</span>
                <Toggle on={settings.powerSaving} onToggle={()=>toggleSetting("powerSaving")}/>
              </div>
            </div>

            <div style={S.section}>
              <div style={S.secTitle}>Spelling &amp; Grammar</div>
              {[
                {key:"checkTyping",   label:"Check Grammar with typing"},
                {key:"checkSpelling", label:"Check Grammar with spelling"},
                {key:"autoCorrect",   label:"Correct spelling automatically"},
              ].map((r)=>(
                <div key={r.key} style={S.row}>
                  <span style={S.rowLabel}>{r.label}</span>
                  <Toggle on={settings[r.key]} onToggle={()=>toggleSetting(r.key)}/>
                </div>
              ))}
            </div>

            <div style={S.section}>
              <div style={S.secTitle}>Emoji</div>
              <div style={S.row}>
                <span style={S.rowLabel}>Show Sticker sidebar</span>
                <Toggle on={settings.showSticker} onToggle={()=>toggleSetting("showSticker")}/>
              </div>
              <div style={{
                ...S.row,
                flexDirection:"column",
                alignItems:"flex-start",
                gap:10,
                background: settings.replaceEmoji ? "#f0fdf4" : "#fff",
                border: settings.replaceEmoji ? "1.5px solid #22c55e" : "1.5px solid transparent",
              }}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
                  <div>
                    <div style={S.rowLabel}>Replace emoji Automatically</div>
                    <div style={S.rowSub}>
                      {settings.replaceEmoji
                        ? "✅ Activé — les mots sont convertis en emoji à l'envoi"
                        : "❌ Désactivé — vous pouvez utiliser les suggestions manuelles"}
                    </div>
                  </div>
                  <Toggle on={settings.replaceEmoji} onToggle={()=>toggleSetting("replaceEmoji")}/>
                </div>
                {settings.replaceEmoji && (
                  <div style={{
                    background:"#f0edf8", borderRadius:10, padding:"10px 14px",
                    width:"100%", display:"flex", flexWrap:"wrap", gap:8,
                  }}>
                    <span style={{fontSize:11,color:"#7c5cbf",fontWeight:700,width:"100%",marginBottom:4}}>
                      Exemples de mots reconnus :
                    </span>
                    {[
                      ["happy","😊"],["sad","😢"],["love","❤️"],["fire","🔥"],
                      ["ok","👍"],["thanks","🙏"],["party","🎉"],["wow","😮"],
                    ].map(([w,e])=>(
                      <span key={w} style={{
                        background:"#fff", borderRadius:20, padding:"3px 10px",
                        fontSize:12, color:"#555", border:"1px solid #dcd0f5",
                        display:"flex", alignItems:"center", gap:4,
                      }}>
                        <span style={{color:"#999"}}>{w}</span>
                        <span>→</span>
                        <span>{e}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={S.section}>
              <div style={S.secTitle}>Force Touch Button</div>
              {[
                {key:"replyMessage",  label:"Reply to message"},
                {key:"replaceEmoji2", label:"Replace emoji automatically"},
              ].map((r)=>(
                <div key={r.key} style={S.row}>
                  <span style={S.rowLabel}>{r.label}</span>
                  <Toggle on={settings[r.key]} onToggle={()=>toggleSetting(r.key)}/>
                </div>
              ))}
            </div>

            <div style={S.section}>
              <div style={S.secTitle}>🌐 Language</div>
              <div style={S.langCard}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <span style={{fontSize:26}}>{selectedLang.flag}</span>
                  <div>
                    <div style={{fontWeight:700,color:"#1a1a2e",fontSize:14}}>{selectedLang.name}</div>
                    <div style={{fontSize:11,color:"#999"}}>{selectedLang.code.toUpperCase()} — Langue sélectionnée</div>
                  </div>
                </div>
                <div style={S.langSearch}>
                  <span style={{color:"#bbb",fontSize:13}}>🔍</span>
                  <input
                    style={{border:"none",background:"transparent",outline:"none",fontSize:13,color:"#333",width:"100%"}}
                    placeholder="Rechercher une langue..."
                    value={langSearch}
                    onChange={(e)=>setLangSearch(e.target.value)}/>
                </div>
                <div style={S.langGrid}>
                  {filteredLangs.map((l)=>(
                    <div key={l.code} style={S.langItem(selectedLang.code===l.code)}
                      onClick={()=>setSelectedLang(l)}>
                      <span style={{fontSize:20}}>{l.flag}</span>
                      <span style={{fontSize:10,fontWeight:600,color:"#333",textAlign:"center"}}>{l.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══ NEW CHAT MODAL ══ */}
      {showNewChat && (
        <div style={S.overlay} onClick={(e)=>e.target===e.currentTarget&&setShowNewChat(false)}>
          <div style={S.modal(400)}>
            <div style={S.modalTitle}>💬 Nouveau Chat</div>
            <button style={S.modalClose} onClick={()=>setShowNewChat(false)}>✕</button>

            <div style={{marginBottom:14}}>
              <div style={S.label}>Nom du contact</div>
              <input style={S.fi} placeholder="Ex : Sara Meddeb"
                value={newChatName} onChange={(e)=>setNewChatName(e.target.value)}/>
            </div>

            <div style={{marginBottom:16}}>
              <div style={S.label}>Plateforme</div>
              <div style={{...S.platformGrid, marginTop:8}}>
                {[
                  {key:"whatsapp",  src:"https://cdn.simpleicons.org/whatsapp",        label:"WhatsApp"},
                  {key:"email",     emoji:"📧",                                         label:"Email"},
                  {key:"slack",     src:"https://cdn.simpleicons.org/slack",            label:"Slack"},
                  {key:"telegram",  src:"https://cdn.simpleicons.org/telegram",         label:"Telegram"},
                  {key:"instagram", src:"https://cdn.simpleicons.org/instagram",        label:"Instagram"},
                  {key:"twitter",   src:"https://cdn.simpleicons.org/x/000000",         label:"X"},
                ].map((p)=>(
                  <button key={p.key} style={S.platformBtn(newChatPlatform===p.key)}
                    onClick={()=>setNewChatPlatform(p.key)}>
                    {p.src
                      ? <img src={p.src} alt={p.label} style={{width:32,height:32}}/>
                      : <span style={{fontSize:32}}>{p.emoji}</span>}
                    <span style={{fontSize:10,fontWeight:600,color:"#333"}}>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button style={S.saveBtn} onClick={createNewChat}>
              ✅ Créer le chat
            </button>
          </div>
        </div>
      )}
    </>
  );
}