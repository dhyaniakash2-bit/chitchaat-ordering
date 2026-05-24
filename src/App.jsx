import { useState, useEffect, useRef } from "react";

const G = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --green:#1B5E16; --green2:#236B1D; --green-light:#E8F5E3;
  --gold:#D4821A; --gold-bg:#FEF3DC;
  --bg:#F2F2F2; --white:#FFFFFF;
  --text:#1A1A1A; --muted:#888; --border:#E5E5E5; --red:#D92B2B;
}
body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased}
button{cursor:pointer;font-family:'DM Sans',sans-serif}
input,textarea{font-family:'DM Sans',sans-serif}
`;

const BRANCHES = [
  { id:"bkk", name:"Sukhumvit 24", city:"Bangkok", addr:"Oakwood Residence, Sukhumvit 24, Phrom Phong", hours:"Daily 12pm-12am", lat:13.7287, lng:100.5697 },
  { id:"pty", name:"Terminal 21",  city:"Pattaya", addr:"Terminal 21 Shopping Mall, Pattaya",           hours:"Daily 10am-10pm", lat:12.9333, lng:100.8833 },
];

// Real food photos load on Vercel. In-preview: styled visual cards.
// To update: replace `url` values with your own food photography.
const FOOD_IMGS = {
  1:  { url:"https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop&auto=format", bg:"linear-gradient(160deg,#8B3A00 0%,#C85C00 45%,#E8901A 80%,#F5C060 100%)", icon:"🫓", label:"Paratha" },
  2:  { url:"https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop&auto=format", bg:"linear-gradient(160deg,#3D1F00 0%,#6B3A10 45%,#9B6030 80%,#C89060 100%)", icon:"🥐", label:"Naan" },
  3:  { url:"https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&auto=format", bg:"linear-gradient(160deg,#1A4A10 0%,#2D7A20 45%,#4AAA35 80%,#80CC60 100%)", icon:"🥬", label:"Chaat" },
  4:  { url:"https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400&h=300&fit=crop&auto=format", bg:"linear-gradient(160deg,#6B2800 0%,#A04010 45%,#D06828 80%,#E89848 100%)", icon:"🥟", label:"Samosa Chaat" },
  5:  { url:"https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop&auto=format", bg:"linear-gradient(160deg,#5A1800 0%,#8B2A10 45%,#B84A28 80%,#D87050 100%)", icon:"🥟", label:"Lamb Chaat" },
  6:  { url:"https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=300&fit=crop&auto=format", bg:"linear-gradient(160deg,#7A2200 0%,#B03800 45%,#D85818 80%,#F08040 100%)", icon:"🧆", label:"Samosa" },
  7:  { url:"https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop&auto=format", bg:"linear-gradient(160deg,#2A1800 0%,#503010 45%,#785030 80%,#A07858 100%)", icon:"🍔", label:"Vada Pav" },
  8:  { url:"https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=300&fit=crop&auto=format", bg:"linear-gradient(160deg,#7A3000 0%,#A85010 45%,#D07830 80%,#E8A060 100%)", icon:"🫔", label:"Kulcha" },
  9:  { url:"https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop&auto=format", bg:"linear-gradient(160deg,#8B1800 0%,#C03010 45%,#E05828 80%,#F08850 100%)", icon:"🌯", label:"Tikka Roll" },
  10: { url:"https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop&auto=format", bg:"linear-gradient(160deg,#401000 0%,#682A10 45%,#904828 80%,#B87050 100%)", icon:"🥪", label:"Paneer Roll" },
  11: { url:"https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop&auto=format", bg:"linear-gradient(160deg,#7A2800 0%,#A84010 45%,#D06828 80%,#E89048 100%)", icon:"🥪", label:"Sandwich" },
  12: { url:"https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop&auto=format", bg:"linear-gradient(160deg,#1A3000 0%,#2E5010 45%,#487030 80%,#709858 100%)", icon:"🫘", label:"Dal Bowl" },
  13: { url:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop&auto=format", bg:"linear-gradient(160deg,#8B2A00 0%,#C04800 45%,#E07018 80%,#F0A040 100%)", icon:"🍲", label:"Butter Chicken" },
  14: { url:"https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop&auto=format", bg:"linear-gradient(160deg,#A03000 0%,#D05010 45%,#F07830 80%,#F8A860 100%)", icon:"🍛", label:"Curry Bowl" },
  15: { url:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&auto=format", bg:"linear-gradient(160deg,#2A1500 0%,#4A2808 45%,#704020 80%,#9A6840 100%)", icon:"☕", label:"Chai" },
  16: { url:"https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop&auto=format", bg:"linear-gradient(160deg,#7A4800 0%,#A87020 45%,#C89840 80%,#E0C068 100%)", icon:"🥛", label:"Lassi" },
  17: { url:"https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&h=300&fit=crop&auto=format", bg:"linear-gradient(160deg,#A06000 0%,#D08A00 45%,#F0B010 80%,#F8D040 100%)", icon:"🥭", label:"Mango Lassi" },
  18: { url:"https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop&auto=format", bg:"linear-gradient(160deg,#004A30 0%,#007A50 45%,#20A870 80%,#50C898 100%)", icon:"🍋", label:"Lemonade" },
};

const MENU_SECTIONS = [
  { id:"promo", label:"Limited-Time Offer", items:[
    {id:1,  name:"Stuffed Aloo Paratha",       desc:"Spiced potato, butter, pickle",         price:180, badge:"NEW"},
    {id:8,  name:"Lamb & Chickpea Kulcha",     desc:"Spiced lamb, mint mayo, lettuce",       price:190, badge:"HOT"},
    {id:9,  name:"Sriracha Chicken Tikka Roll",desc:"Sriracha, Lacha Parantha, bold fusion", price:260, badge:"SPICY"},
    {id:14, name:"Butter Chicken Bowl",        desc:"Rich butter chicken over saffron rice", price:300, badge:"BESTSELLER"},
  ]},
  { id:"breakfast", label:"Breakfast", items:[
    {id:1, name:"Stuffed Aloo Paratha",          desc:"Whole wheat, spiced potato, butter & pickle",           price:180},
    {id:2, name:"Olive & Mushroom Stuffed Naan", desc:"Sauteed mushrooms, olive tapenade, mint mayo",          price:190},
    {id:3, name:"Masala Egg & Cheese Croissant", desc:"Spiced scrambled eggs, melted cheese, flaky croissant", price:200},
  ]},
  { id:"chaat", label:"Chaat & Snacks", items:[
    {id:3,  name:"Palak Patta Chaat",       desc:"Crispy spinach, yogurt, mint & tamarind",       price:150},
    {id:4,  name:"Potato Samosa Chaat",     desc:"Crushed samosa, tamarind, pomegranate, yogurt", price:160},
    {id:5,  name:"Lamb Mince Samosa Chaat", desc:"Spiced lamb, garlic mint sauce, yogurt",        price:180},
    {id:6,  name:"Potato Samosa (2 pcs)",   desc:"Flaky pastry, potato, mint & tamarind",         price:120},
    {id:7,  name:"Vada Pav",               desc:"Mumbai street burger, chutneys, fried chili",    price:130},
    {id:18, name:"Gun Powder Fries",        desc:"South Indian spice mix, sesame, curry leaves",  price:140},
  ]},
  { id:"rolls", label:"Rolls & Handhelds", items:[
    {id:9,  name:"Sriracha Chicken Tikka Roll",desc:"Spicy sriracha, chicken tikka, Lacha Parantha",price:260},
    {id:10, name:"Cottage Cheese Tikka Roll",  desc:"Paneer tikka, onion masala, whole wheat",      price:240},
    {id:11, name:"Bombay Grilled Sandwich",    desc:"Potato, capsicum, mint sauce, grilled crisp",  price:200},
  ]},
  { id:"bowls", label:"Rice Bowls", items:[
    {id:12, name:"Black Lentil Burrito Bowl", desc:"Slow-cooked dal, rice, sour cream, corn", price:280},
    {id:13, name:"Royal Butter Chicken Bowl", desc:"Rich butter chicken, rice, sour cream",   price:300},
  ]},
  { id:"drinks", label:"Beverages", items:[
    {id:15, name:"Adrak / Masala / Elachi Chai",desc:"Classic Indian tea, pick your spice",    price:90},
    {id:16, name:"Amritsari Sweet Lassi",       desc:"Thick yogurt drink, topped with nuts",   price:130},
    {id:17, name:"Mango Lassi",                 desc:"Yogurt blended with ripe mangoes",       price:120},
    {id:18, name:"Spiced Lemonade",             desc:"Indian spiced, tangy and refreshing",    price:100},
  ]},
];

const ALL_ITEMS = MENU_SECTIONS.flatMap(s => s.items);
const SECTION_LABELS = MENU_SECTIONS.map(s => s.label);
const DELIVERY_FEE = 45;

function FoodImg({ id, size=80, r=10 }) {
  const d = FOOD_IMGS[id] || FOOD_IMGS[1];
  const [err, setErr] = useState(false);
  const iconSz = size * 0.38;
  const fallback = (
    <div style={{ width:"100%", height:"100%", background:d.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3 }}>
      <span style={{ fontSize:iconSz, lineHeight:1 }}>{d.icon}</span>
      {size > 50 && <span style={{ fontSize:size*0.1, color:"rgba(255,255,255,0.75)", fontWeight:600, letterSpacing:"0.5px", textTransform:"uppercase", textAlign:"center", padding:"0 4px", lineHeight:1.2 }}>{d.label}</span>}
    </div>
  );
  return (
    <div style={{ width:size, height:size, borderRadius:r, flexShrink:0, overflow:"hidden", position:"relative" }}>
      {!err
        ? <img src={d.url} alt={d.label} onError={()=>setErr(true)} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} onLoad={e=>e.target.style.opacity=1}/>
        : fallback
      }
    </div>
  );
}

function BadgePill({ label }) {
  const m = { SPICY:["#FFF0E8","#C04000","#F0C0A0"], HOT:["#FFF0E8","#D92B2B","#F5B0B0"], BESTSELLER:["#E8F5E3","#1B5E16","#A0D890"], NEW:["#FFF8E1","#C07800","#F0D870"] };
  const [bg,col,bdr] = m[label]||["#F2F2F2","#888","#ddd"];
  return <div style={{ display:"inline-block", fontSize:"0.52rem", fontWeight:700, letterSpacing:"1px", background:bg, color:col, border:`1px solid ${bdr}`, borderRadius:4, padding:"2px 6px", marginBottom:4 }}>{label}</div>;
}

function HeroBanner() {
  const [s,setS] = useState(0);
  const [heroErrs,setHeroErrs] = useState({});
  const slides = [
    { img:"https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&h=420&fit=crop&auto=format", bg:"linear-gradient(135deg,#8B2A00 0%,#C04A00 40%,#E07820 70%,#F0A840 100%)", icon:"🍛", name:"Royal Butter Chicken Bowl", sub:"Rich, slow-cooked, deeply spiced", price:300 },
    { img:"https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=420&fit=crop&auto=format", bg:"linear-gradient(135deg,#0D3808 0%,#1E6010 40%,#388A28 70%,#60AA48 100%)", icon:"🥗", name:"Palak Patta Chaat", sub:"Crispy spinach, tangy sauces, yogurt", price:150 },
    { img:"https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=420&fit=crop&auto=format", bg:"linear-gradient(135deg,#6B1000 0%,#A82800 40%,#D04818 70%,#E87840 100%)", icon:"🌯", name:"Sriracha Chicken Tikka Roll", sub:"Fire-hot tikka, Lacha Parantha wrap", price:260 },
  ];
  useEffect(()=>{ const t=setInterval(()=>setS(p=>(p+1)%3),4000); return ()=>clearInterval(t); },[]);
  const sl=slides[s];
  const showFallback = heroErrs[s];
  return (
    <div style={{ position:"relative", height:215, overflow:"hidden", background:sl.bg }}>
      {!showFallback && (
        <img key={sl.img} src={sl.img} alt={sl.name}
          onError={()=>setHeroErrs(p=>({...p,[s]:true}))}
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", display:"block" }}
        />
      )}
      {showFallback && (
        <div style={{ position:"absolute", right:"-10px", top:"50%", transform:"translateY(-50%)", fontSize:100, lineHeight:1, opacity:0.35, filter:"blur(1px)" }}>{sl.icon}</div>
      )}
      <div style={{ position:"absolute", inset:0, background: showFallback
        ? "linear-gradient(135deg,rgba(0,0,0,0.15) 0%,transparent 100%)"
        : "linear-gradient(135deg,rgba(0,0,0,0.72) 0%,rgba(0,0,0,0.25) 55%,transparent 100%)"
      }}/>
      <div style={{ position:"absolute", inset:0, padding:"1.1rem 1.2rem", display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
        <div style={{ fontSize:"0.55rem", letterSpacing:"2.5px", textTransform:"uppercase", color:"rgba(255,255,255,0.75)", marginBottom:4, fontWeight:700 }}>FEATURED DISH</div>
        <div style={{ fontSize:"1.2rem", fontWeight:800, color:"#fff", lineHeight:1.15, marginBottom:3, textShadow:"0 1px 8px rgba(0,0,0,0.4)" }}>{sl.name}</div>
        <div style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.82)", marginBottom:10, textShadow:"0 1px 4px rgba(0,0,0,0.3)" }}>{sl.sub}</div>
        <div style={{ background:"rgba(0,0,0,0.28)", border:"1.5px solid rgba(255,255,255,0.4)", borderRadius:100, padding:"5px 16px", display:"inline-flex", alignItems:"center", gap:8, width:"fit-content", backdropFilter:"blur(4px)" }}>
          <span style={{ fontSize:"0.62rem", color:"rgba(255,255,255,0.8)", fontWeight:600 }}>STARTING</span>
          <span style={{ fontSize:"1rem", fontWeight:800, color:"#FFF176" }}>FROM ฿{sl.price}</span>
        </div>
      </div>
      <div style={{ position:"absolute", bottom:10, right:12, display:"flex", gap:5 }}>
        {slides.map((_,i)=><div key={i} onClick={()=>setS(i)} style={{ width:i===s?18:5, height:5, borderRadius:3, background:i===s?"#fff":"rgba(255,255,255,0.4)", transition:"all .3s", cursor:"pointer" }}/>)}
      </div>
    </div>
  );
}

function PromoCard({ item, onAdd }) {
  const [fl,setFl]=useState(false);
  const [imgErr,setImgErr]=useState(false);
  const d=FOOD_IMGS[item.id]||FOOD_IMGS[1];
  return (
    <div style={{ background:"#fff", borderRadius:12, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.07)" }}>
      <div style={{ height:128, position:"relative", background:d.bg, overflow:"hidden" }}>
        {!imgErr
          ? <img src={d.url} alt={item.name} onError={()=>setImgErr(true)} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
          : <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:5 }}>
              <span style={{ fontSize:46, lineHeight:1 }}>{d.icon}</span>
              <span style={{ fontSize:"0.6rem", color:"rgba(255,255,255,0.8)", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" }}>{d.label}</span>
            </div>
        }
        {item.badge && <div style={{ position:"absolute", top:7, left:7 }}><BadgePill label={item.badge}/></div>}
      </div>
      <div style={{ padding:"0.6rem 0.7rem 0.75rem" }}>
        <div style={{ fontWeight:600, fontSize:"0.83rem", lineHeight:1.25, marginBottom:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</div>
        <div style={{ fontSize:"0.7rem", color:"var(--muted)", marginBottom:7, lineHeight:1.35, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{item.desc}</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontWeight:700, fontSize:"0.88rem" }}>฿{item.price}</span>
          <button onClick={()=>{onAdd(item);setFl(true);setTimeout(()=>setFl(false),700)}} style={{ width:28, height:28, borderRadius:"50%", border:"none", background:fl?"var(--gold)":"var(--green)", color:"#fff", fontSize:"1.1rem", display:"flex", alignItems:"center", justifyContent:"center", transition:"background .2s" }}>{fl?"✓":"+"}</button>
        </div>
      </div>
    </div>
  );
}

function RowCard({ item, onAdd }) {
  const [fl,setFl]=useState(false);
  return (
    <div style={{ background:"#fff", borderRadius:12, padding:"0.9rem", display:"flex", gap:"0.8rem", alignItems:"center", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
      <FoodImg id={item.id} size={76} r={10}/>
      <div style={{ flex:1, minWidth:0 }}>
        {item.badge && <BadgePill label={item.badge}/>}
        <div style={{ fontWeight:600, fontSize:"0.87rem", lineHeight:1.25, marginBottom:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</div>
        <div style={{ fontSize:"0.72rem", color:"var(--muted)", lineHeight:1.4, marginBottom:7, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{item.desc}</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontWeight:700, fontSize:"0.9rem" }}>฿{item.price}</span>
          <button onClick={()=>{onAdd(item);setFl(true);setTimeout(()=>setFl(false),700)}} style={{ width:29, height:29, borderRadius:"50%", border:"none", background:fl?"var(--gold)":"var(--green)", color:"#fff", fontSize:"1.1rem", display:"flex", alignItems:"center", justifyContent:"center", transition:"background .2s" }}>{fl?"✓":"+"}</button>
        </div>
      </div>
    </div>
  );
}

function MapPicker({ branch, onConfirm, onBack }) {
  const [step, setStep]       = useState("map");    // map | detail
  const [locating, setLoc]    = useState(false);
  const [locErr, setLocErr]   = useState("");
  const [coords, setCoords]   = useState(null);
  const [mapSrc, setMapSrc]   = useState("");
  const [searchVal, setSearch]= useState("");
  const [detail, setDetail]   = useState({ floor:"", building:"", note:"" });
  const branchObj = BRANCHES.find(b => b.id === branch);
  const defLat = branchObj ? branchObj.lat : 13.7563;
  const defLng = branchObj ? branchObj.lng : 100.5018;

  const buildSrc = (lat, lng) =>
    `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;

  useEffect(() => {
    setMapSrc(buildSrc(defLat, defLng));
  }, []);

  const useMyLoc = () => {
    setLocErr("");
    if (!navigator.geolocation) { setLocErr("Geolocation not supported by your browser."); return; }
    setLoc(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        setMapSrc(buildSrc(lat, lng));
        setLoc(false);
      },
      err => {
        setLoc(false);
        if (err.code === 1) setLocErr("Location permission denied. Please allow location access in your browser and try again.");
        else setLocErr("Could not get your location. Please search manually below.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSearch = () => {
    if (!searchVal.trim()) return;
    const query = encodeURIComponent(searchVal + " Thailand");
    setMapSrc(`https://maps.google.com/maps?q=${query}&z=15&output=embed`);
    setCoords({ manual: true, label: searchVal });
  };

  const locationLabel = coords
    ? coords.manual
      ? coords.label
      : `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
    : null;

  if (step === "detail") return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <div style={{ background:"#fff", padding:"0.85rem 1rem", display:"flex", alignItems:"center", gap:"0.75rem", borderBottom:"1px solid var(--border)", position:"sticky", top:0, zIndex:50 }}>
        <button onClick={()=>setStep("map")} style={{ background:"none", border:"none", fontSize:"1.3rem", color:"var(--text)" }}>←</button>
        <div style={{ fontWeight:700, fontSize:"1rem" }}>Add Address Details</div>
      </div>
      <div style={{ padding:"1rem", display:"flex", flexDirection:"column", gap:"0.85rem" }}>
        <div style={{ background:"var(--green-light)", border:"1px solid #b8ddb0", borderRadius:10, padding:"0.75rem 0.9rem", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:"1.2rem" }}>📍</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:"0.7rem", fontWeight:700, color:"var(--green)", marginBottom:2 }}>LOCATION SET</div>
            <div style={{ fontSize:"0.78rem", color:"var(--text)", lineHeight:1.4 }}>{locationLabel || "Location selected"}</div>
          </div>
          <button onClick={()=>setStep("map")} style={{ background:"none", border:"none", color:"var(--green)", fontSize:"0.78rem", fontWeight:600, flexShrink:0 }}>Edit</button>
        </div>
        {[
          { key:"floor",    label:"Floor / Unit Number",       ph:"e.g. Floor 3, Room 302",           type:"input",    required:true  },
          { key:"building", label:"Building / Condo / House",  ph:"e.g. Oakwood Residence, Tower A",  type:"input",    required:false },
          { key:"note",     label:"Note to Rider (optional)",  ph:"e.g. Use side entrance, call first",type:"textarea", required:false },
        ].map(f=>(
          <div key={f.key}>
            <div style={{ fontSize:"0.63rem", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", color:"var(--muted)", marginBottom:5 }}>
              {f.label}{f.required && <span style={{color:"var(--red)"}}> *</span>}
            </div>
            {f.type==="textarea"
              ? <textarea placeholder={f.ph} value={detail[f.key]} onChange={e=>setDetail(p=>({...p,[f.key]:e.target.value}))} rows={3} style={{ width:"100%", padding:"0.65rem 0.8rem", border:"1.5px solid "+(detail[f.key]?"var(--green)":"var(--border)"), borderRadius:10, fontSize:"0.87rem", outline:"none", resize:"none", color:"var(--text)", transition:"border-color .2s" }}/>
              : <input placeholder={f.ph} value={detail[f.key]} onChange={e=>setDetail(p=>({...p,[f.key]:e.target.value}))} style={{ width:"100%", padding:"0.65rem 0.8rem", border:"1.5px solid "+(detail[f.key]?"var(--green)":"var(--border)"), borderRadius:10, fontSize:"0.87rem", outline:"none", color:"var(--text)", transition:"border-color .2s" }}/>
            }
          </div>
        ))}
        <button onClick={()=>onConfirm({ coords, locationLabel, ...detail })} disabled={!detail.floor} style={{ marginTop:"0.25rem", background:detail.floor?"var(--green)":"#ccc", color:"#fff", border:"none", padding:"0.92rem", borderRadius:100, fontWeight:700, fontSize:"0.95rem", transition:"background .2s" }}>
          Confirm Address →
        </button>
        {!detail.floor && <div style={{ fontSize:"0.72rem", color:"var(--muted)", textAlign:"center" }}>Floor / unit number is required to continue</div>}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ background:"#fff", padding:"0.85rem 1rem", display:"flex", alignItems:"center", gap:"0.75rem", borderBottom:"1px solid var(--border)" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", fontSize:"1.3rem", color:"var(--text)" }}>←</button>
        <div style={{ fontWeight:700, fontSize:"1rem" }}>Choose Your Location</div>
      </div>

      {/* Use my location */}
      <div style={{ background:"#fff", borderBottom:"1px solid var(--border)", padding:"0.75rem 1rem" }}>
        <button onClick={useMyLoc} disabled={locating} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:9, background:"var(--green-light)", border:"1.5px solid #b8ddb0", borderRadius:10, padding:"0.72rem", color:"var(--green)", fontWeight:700, fontSize:"0.88rem", transition:"opacity .2s", opacity:locating?0.7:1 }}>
          <span style={{ fontSize:"1.15rem" }}>{locating ? "⏳" : "🎯"}</span>
          {locating ? "Getting your location…" : "Use my current location"}
        </button>
        {locErr && <div style={{ marginTop:"0.55rem", fontSize:"0.75rem", color:"var(--red)", lineHeight:1.45, padding:"0.45rem 0.5rem", background:"#FFF0EE", borderRadius:7 }}>{locErr}</div>}
      </div>

      {/* Divider */}
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"0.65rem 1rem", background:"#fff", borderBottom:"1px solid var(--border)" }}>
        <div style={{ flex:1, height:1, background:"var(--border)" }}/>
        <span style={{ fontSize:"0.72rem", color:"var(--muted)", fontWeight:600 }}>OR SEARCH</span>
        <div style={{ flex:1, height:1, background:"var(--border)" }}/>
      </div>

      {/* Search */}
      <div style={{ background:"#fff", borderBottom:"1px solid var(--border)", padding:"0.75rem 1rem", display:"flex", gap:"0.5rem" }}>
        <div style={{ position:"relative", flex:1 }}>
          <span style={{ position:"absolute", left:"0.75rem", top:"50%", transform:"translateY(-50%)", fontSize:"0.9rem", pointerEvents:"none" }}>🔍</span>
          <input
            value={searchVal}
            onChange={e=>setSearch(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter") handleSearch(); }}
            placeholder="Area, street, building name…"
            style={{ width:"100%", padding:"0.65rem 0.9rem 0.65rem 2.3rem", border:"1.5px solid var(--border)", borderRadius:10, fontSize:"0.87rem", outline:"none", background:"var(--bg)", color:"var(--text)" }}
          />
        </div>
        <button onClick={handleSearch} style={{ background:"var(--green)", color:"#fff", border:"none", borderRadius:10, padding:"0 1rem", fontWeight:600, fontSize:"0.85rem", flexShrink:0 }}>Go</button>
      </div>

      {/* Google Maps iframe */}
      <div style={{ flex:1, position:"relative", minHeight:310 }}>
        {mapSrc && (
          <iframe
            key={mapSrc}
            src={mapSrc}
            width="100%"
            height="310"
            style={{ border:"none", display:"block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"rgba(255,255,255,0.92)", borderTop:"1px solid var(--border)", padding:"0.55rem 1rem", fontSize:"0.72rem", color:"var(--muted)", textAlign:"center" }}>
          Use the search above or tap "Use my location" — then confirm below
        </div>
      </div>

      {/* Confirm bar */}
      <div style={{ padding:"0.85rem 1rem", background:"#fff", borderTop:"1px solid var(--border)" }}>
        {coords || searchVal ? (
          <button onClick={()=>{ if (!coords && searchVal) setCoords({ manual:true, label:searchVal }); setStep("detail"); }} style={{ width:"100%", background:"var(--green)", color:"#fff", border:"none", padding:"0.9rem", borderRadius:100, fontWeight:700, fontSize:"0.95rem" }}>
            This is my location → Add Details
          </button>
        ) : (
          <div style={{ textAlign:"center", padding:"0.3rem", fontSize:"0.82rem", color:"var(--muted)" }}>
            Set your location above to continue
          </div>
        )}
      </div>
    </div>
  );
}

function Basket({ cart, onUpdate, onClear, branch, onBack, onNext, otype }) {
  const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const total = subtotal + (otype==="delivery" ? DELIVERY_FEE : 0);
  const cartIds = new Set(cart.map(i=>i.id));
  const upsell = ALL_ITEMS.filter(i=>!cartIds.has(i.id)).slice(0,12);

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", paddingBottom:100 }}>
      <div style={{ background:"#fff", padding:"0.85rem 1rem", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid var(--border)", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.7rem" }}>
          <button onClick={onBack} style={{ background:"none", border:"none", fontSize:"1.3rem", color:"var(--text)" }}>←</button>
          <div style={{ fontWeight:700, fontSize:"1rem" }}>Your Basket</div>
        </div>
        {cart.length>0 && <button onClick={onClear} style={{ background:"none", border:"none", color:"var(--muted)", fontSize:"0.78rem" }}>Clear all</button>}
      </div>

      <div style={{ padding:"0.9rem", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
        {cart.length===0 ? (
          <div style={{ background:"#fff", borderRadius:12, padding:"2.5rem", textAlign:"center" }}>
            <div style={{ fontSize:"2.5rem", marginBottom:"0.75rem" }}>🛒</div>
            <div style={{ fontWeight:600, marginBottom:4 }}>Your basket is empty</div>
            <div style={{ fontSize:"0.82rem", color:"var(--muted)" }}>Add something bold and spicy!</div>
            <button onClick={onBack} style={{ marginTop:"1rem", background:"var(--green)", color:"#fff", border:"none", padding:"0.65rem 1.5rem", borderRadius:100, fontWeight:600, fontSize:"0.85rem" }}>Browse Menu</button>
          </div>
        ) : (
          <>
            <div style={{ background:"#fff", borderRadius:12, overflow:"hidden" }}>
              {cart.map((item,idx)=>(
                <div key={item.id} style={{ display:"flex", alignItems:"center", gap:"0.8rem", padding:"0.85rem 0.9rem", borderBottom:idx<cart.length-1?"1px solid var(--border)":"none" }}>
                  <FoodImg id={item.id} size={54} r={8}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, fontSize:"0.87rem", marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</div>
                    <div style={{ fontSize:"0.78rem", color:"var(--muted)" }}>฿{item.price} each</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                    <button onClick={()=>onUpdate(item.id,-1)} style={{ width:28, height:28, borderRadius:"50%", border:"1.5px solid var(--border)", background:"#fff", fontWeight:700, fontSize:"1rem", display:"flex", alignItems:"center", justifyContent:"center", color:item.qty===1?"var(--red)":"var(--text)" }}>
                      {item.qty===1 ? "🗑" : "−"}
                    </button>
                    <span style={{ fontWeight:700, fontSize:"0.9rem", minWidth:20, textAlign:"center" }}>{item.qty}</span>
                    <button onClick={()=>onUpdate(item.id,1)} style={{ width:28, height:28, borderRadius:"50%", border:"none", background:"var(--green)", color:"#fff", fontWeight:700, fontSize:"1rem", display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
                  </div>
                  <div style={{ fontWeight:700, fontSize:"0.88rem", minWidth:50, textAlign:"right" }}>฿{(item.price*item.qty).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div style={{ background:"#fff", borderRadius:12, padding:"0.9rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.85rem", color:"var(--muted)", paddingBottom:"0.55rem", borderBottom:"1px solid var(--border)", marginBottom:"0.5rem" }}>
                <span>Subtotal ({cart.reduce((s,i)=>s+i.qty,0)} items)</span>
                <span style={{ color:"var(--text)", fontWeight:500 }}>฿{subtotal.toLocaleString()}</span>
              </div>
              {otype==="delivery" && (
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.85rem", color:"var(--muted)", paddingBottom:"0.55rem", borderBottom:"1px solid var(--border)", marginBottom:"0.6rem" }}>
                  <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                    Delivery fee
                    <span style={{ fontSize:"0.6rem", background:"var(--bg)", border:"1px solid var(--border)", borderRadius:4, padding:"1px 5px" }}>est.</span>
                  </span>
                  <span style={{ color:"var(--text)", fontWeight:500 }}>฿{DELIVERY_FEE}</span>
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"space-between", fontWeight:700, fontSize:"1rem" }}>
                <span>Total</span>
                <span style={{ color:"var(--green)" }}>฿{total.toLocaleString()}</span>
              </div>
              <div style={{ marginTop:"0.5rem", fontSize:"0.68rem", color:"var(--muted)" }}>* Delivery fee is an estimate. Final fee based on your exact location.</div>
            </div>

            {upsell.length>0 && (
              <div style={{ background:"#fff", borderRadius:12, padding:"0.9rem" }}>
                <div style={{ fontWeight:700, fontSize:"0.92rem", marginBottom:"0.75rem" }}>People also ordered 🔥</div>
                <div style={{ display:"flex", gap:"0.65rem", overflowX:"auto", paddingBottom:"0.3rem", scrollbarWidth:"none" }}>
                  {upsell.map(item=>{
                    const d=FOOD_IMGS[item.id]||FOOD_IMGS[1];
                    return (
                      <div key={item.id} style={{ flexShrink:0, width:125, borderRadius:10, border:"1px solid var(--border)", overflow:"hidden" }}>
                        <div style={{ height:78, background:d.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3, position:"relative", overflow:"hidden" }}>
                          <span style={{ fontSize:30, lineHeight:1 }}>{d.icon}</span>
                          <span style={{ fontSize:"0.52rem", color:"rgba(255,255,255,0.8)", fontWeight:700, letterSpacing:"0.5px", textTransform:"uppercase" }}>{d.label}</span>
                        </div>
                        <div style={{ padding:"0.5rem" }}>
                          <div style={{ fontSize:"0.7rem", fontWeight:600, lineHeight:1.25, marginBottom:5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</div>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                            <span style={{ fontSize:"0.78rem", fontWeight:700 }}>฿{item.price}</span>
                            <button onClick={()=>onUpdate(item.id,1,item)} style={{ width:24, height:24, borderRadius:"50%", border:"none", background:"var(--green)", color:"#fff", fontSize:"1rem", display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {cart.length>0 && (
        <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, padding:"0.75rem 1rem", zIndex:100 }}>
          <button onClick={onNext} style={{ width:"100%", background:"var(--green)", color:"#fff", border:"none", padding:"0.9rem 1.5rem", borderRadius:100, fontWeight:700, fontSize:"0.95rem", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 4px 20px rgba(27,94,22,0.35)" }}>
            <span>{otype==="delivery"?"Choose Delivery Address →":"Continue to Checkout →"}</span>
            <span style={{ background:"rgba(255,255,255,0.22)", borderRadius:100, padding:"3px 12px", fontSize:"0.88rem" }}>฿{total.toLocaleString()}</span>
          </button>
        </div>
      )}
    </div>
  );
}

function Checkout({ cart, address, branch, otype, onBack, onDone }) {
  const [name,setName]=useState("");
  const [phone,setPhone]=useState("");
  const [email,setEmail]=useState("");
  const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const delivFee = otype==="delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + delivFee;
  const branchObj = BRANCHES.find(b=>b.id===branch);
  const canPlace = name && phone;

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", paddingBottom:30 }}>
      <div style={{ background:"#fff", padding:"0.85rem 1rem", display:"flex", alignItems:"center", gap:"0.75rem", borderBottom:"1px solid var(--border)", position:"sticky", top:0, zIndex:50 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", fontSize:"1.3rem", color:"var(--text)" }}>←</button>
        <div style={{ fontWeight:700, fontSize:"1rem" }}>Confirm & Pay</div>
      </div>
      <div style={{ padding:"0.9rem", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
        <div style={{ background:"#fff", borderRadius:12, padding:"0.9rem" }}>
          <div style={{ fontSize:"0.63rem", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", color:"var(--muted)", marginBottom:"0.7rem" }}>
            {otype==="delivery" ? "DELIVERY ADDRESS" : "PICKUP FROM"}
          </div>
          {otype==="delivery" ? (
            <div style={{ display:"flex", gap:8 }}>
              <span style={{ fontSize:"1.1rem", marginTop:1 }}>📍</span>
              <div>
                <div style={{ fontSize:"0.87rem", fontWeight:600, marginBottom:2 }}>{address ? address.floor+(address.building?", "+address.building:"") : ""}</div>
                {address && address.note && <div style={{ fontSize:"0.75rem", color:"var(--muted)" }}>Note: {address.note}</div>}
                <button onClick={onBack} style={{ background:"none", border:"none", color:"var(--green)", fontSize:"0.78rem", fontWeight:600, padding:0, marginTop:3 }}>Change address</button>
              </div>
            </div>
          ) : (
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <span>🏬</span>
              <div>
                <div style={{ fontSize:"0.87rem", fontWeight:600 }}>{branchObj ? branchObj.name : ""}</div>
                <div style={{ fontSize:"0.75rem", color:"var(--muted)" }}>{branchObj ? branchObj.addr : ""}</div>
              </div>
            </div>
          )}
        </div>

        <div style={{ background:"#fff", borderRadius:12, padding:"0.9rem" }}>
          <div style={{ fontSize:"0.63rem", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", color:"var(--muted)", marginBottom:"0.75rem" }}>YOUR DETAILS</div>
          {[
            {v:name, sv:setName,  l:"Name",            p:"Priya Sharma",      req:true},
            {v:phone,sv:setPhone, l:"Phone",           p:"+66 xx xxx xxxx",   req:true},
            {v:email,sv:setEmail, l:"Email (optional)",p:"you@email.com",     req:false},
          ].map(f=>(
            <div key={f.l} style={{ marginBottom:"0.7rem" }}>
              <div style={{ fontSize:"0.63rem", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"var(--muted)", marginBottom:4 }}>
                {f.l}{f.req && <span style={{color:"var(--red)"}}> *</span>}
              </div>
              <input value={f.v} onChange={e=>f.sv(e.target.value)} placeholder={f.p} style={{ width:"100%", padding:"0.62rem 0.8rem", border:"1.5px solid "+(f.v?"var(--green)":"var(--border)"), borderRadius:9, fontSize:"0.87rem", outline:"none", color:"var(--text)" }}/>
            </div>
          ))}
        </div>

        <div style={{ background:"#fff", borderRadius:12, padding:"0.9rem" }}>
          <div style={{ fontSize:"0.63rem", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", color:"var(--muted)", marginBottom:"0.75rem" }}>ORDER SUMMARY</div>
          {cart.map(i=>(
            <div key={i.id} style={{ display:"flex", justifyContent:"space-between", fontSize:"0.83rem", padding:"0.3rem 0", borderBottom:"1px solid var(--border)", color:"var(--muted)" }}>
              <span>{i.name} x {i.qty}</span>
              <span style={{ color:"var(--text)", fontWeight:600 }}>฿{(i.price*i.qty).toLocaleString()}</span>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.83rem", padding:"0.45rem 0 0.3rem", color:"var(--muted)", borderBottom:"1px solid var(--border)" }}>
            <span>Subtotal</span><span style={{ color:"var(--text)" }}>฿{subtotal.toLocaleString()}</span>
          </div>
          {otype==="delivery" && (
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.83rem", padding:"0.3rem 0 0.45rem", color:"var(--muted)", borderBottom:"1px solid var(--border)" }}>
              <span>Delivery fee</span><span style={{ color:"var(--text)" }}>฿{delivFee}</span>
            </div>
          )}
          <div style={{ display:"flex", justifyContent:"space-between", fontWeight:700, fontSize:"1rem", paddingTop:"0.65rem" }}>
            <span>Total</span><span style={{ color:"var(--green)" }}>฿{total.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ background:"#FFF8E1", border:"1px solid #F0D870", borderRadius:8, padding:"0.6rem 0.9rem", fontSize:"0.72rem", color:"#7A5800" }}>
          Payment via Omise / PromptPay — to be connected before going live.
        </div>
        <button onClick={onDone} disabled={!canPlace} style={{ background:canPlace?"var(--green)":"#ccc", color:"#fff", border:"none", padding:"0.95rem", borderRadius:100, fontWeight:700, fontSize:"0.95rem" }}>
          Place Order — ฿{total.toLocaleString()}
        </button>
      </div>
    </div>
  );
}

function Success({ branch, onReset }) {
  const b = BRANCHES.find(x=>x.id===branch);
  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2rem", textAlign:"center" }}>
      <div style={{ fontSize:"3.5rem", marginBottom:"1rem" }}>🎉</div>
      <div style={{ fontSize:"0.65rem", letterSpacing:"3px", textTransform:"uppercase", color:"var(--green)", fontWeight:700, marginBottom:"0.4rem" }}>ORDER CONFIRMED</div>
      <div style={{ fontWeight:800, fontSize:"1.6rem", marginBottom:"0.5rem" }}>It's on its way!</div>
      <div style={{ color:"var(--muted)", fontSize:"0.85rem", lineHeight:1.65, marginBottom:"2rem" }}>
        Your order from Chit Chaat {b ? b.name : ""} is confirmed.<br/>Bold Punjabi flavours incoming!
      </div>
      <button onClick={onReset} style={{ background:"var(--green)", color:"#fff", border:"none", padding:"0.8rem 2.2rem", borderRadius:100, fontWeight:700, fontSize:"0.9rem" }}>Back to Menu</button>
    </div>
  );
}

export default function App() {
  const [page,setPage]       = useState("branch");
  const [branch,setBranch]   = useState(null);
  const [otype,setOtype]     = useState("delivery");
  const [activeSection,setAS]= useState(0);
  const [cart,setCart]       = useState([]);
  const [address,setAddress] = useState(null);

  const count    = cart.reduce((s,i)=>s+i.qty,0);
  const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);

  const addItem  = item => setCart(p=>{ const ex=p.find(c=>c.id===item.id); return ex?p.map(c=>c.id===item.id?{...c,qty:c.qty+1}:c):[...p,{...item,qty:1}]; });
  const updCart  = (id,d,newItem) => {
    if (newItem && !cart.find(c=>c.id===id)) { addItem(newItem); return; }
    setCart(p=>p.map(c=>c.id===id?{...c,qty:c.qty+d}:c).filter(c=>c.qty>0));
  };

  const branchObj  = BRANCHES.find(b=>b.id===branch);
  const activeSec  = MENU_SECTIONS[activeSection];

  if (page==="branch") return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0D2B0A,#1B5016 60%,#2A7020)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2rem" }}>
      <style>{G}</style>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:"2.5rem" }}>
        <div style={{ width:50, height:50, background:"rgba(255,255,255,0.15)", border:"2px solid rgba(255,255,255,0.3)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"0.95rem", color:"#fff", letterSpacing:1 }}>CC</div>
        <div>
          <div style={{ fontWeight:800, fontSize:"1.35rem", color:"#fff", letterSpacing:"2px", lineHeight:1 }}>CHIT CHAAT</div>
          <div style={{ fontSize:"0.58rem", letterSpacing:"2.5px", color:"rgba(255,255,255,0.5)", marginTop:3, textTransform:"uppercase" }}>Social · Spicy · Soulful</div>
        </div>
      </div>
      <div style={{ fontSize:"0.68rem", letterSpacing:"3px", textTransform:"uppercase", color:"rgba(255,255,255,0.55)", marginBottom:"1.25rem", fontWeight:600 }}>CHOOSE YOUR BRANCH</div>
      <div style={{ display:"flex", flexDirection:"column", gap:"0.85rem", width:"100%", maxWidth:380 }}>
        {BRANCHES.map(b=>(
          <button key={b.id} onClick={()=>{setBranch(b.id);setPage("home");}} style={{ background:"rgba(255,255,255,0.1)", border:"1.5px solid rgba(255,255,255,0.22)", borderRadius:14, padding:"1.2rem 1.4rem", textAlign:"left", color:"#fff", cursor:"pointer" }}>
            <div style={{ fontSize:"0.58rem", letterSpacing:"2px", textTransform:"uppercase", color:"#A8E890", fontWeight:700, marginBottom:4 }}>{b.city}</div>
            <div style={{ fontWeight:800, fontSize:"1.05rem", marginBottom:3 }}>{b.name}</div>
            <div style={{ fontSize:"0.78rem", color:"rgba(255,255,255,0.6)", lineHeight:1.45, marginBottom:6 }}>{b.addr}</div>
            <div style={{ fontSize:"0.72rem", color:"#A8E890", fontWeight:600 }}>🕐 {b.hours}</div>
          </button>
        ))}
      </div>
      <div style={{ marginTop:"2rem", color:"rgba(255,255,255,0.35)", fontSize:"0.72rem" }}>Dine in? Call +66 93-608-6623</div>
    </div>
  );

  if (page==="basket")   return <><style>{G}</style><Basket   cart={cart} onUpdate={updCart} onClear={()=>setCart([])} branch={branch} otype={otype} onBack={()=>setPage("home")} onNext={()=>setPage(otype==="delivery"?"address":"checkout")}/></>;
  if (page==="address")  return <><style>{G}</style><MapPicker branch={branch} onConfirm={addr=>{setAddress(addr);setPage("checkout");}} onBack={()=>setPage("basket")}/></>;
  if (page==="checkout") return <><style>{G}</style><Checkout  cart={cart} address={address} branch={branch} otype={otype} onBack={()=>setPage(otype==="delivery"?"address":"basket")} onDone={()=>setPage("success")}/></>;
  if (page==="success")  return <><style>{G}</style><Success   branch={branch} onReset={()=>{setCart([]);setAddress(null);setPage("home");}}/></>;

  return (
    <div style={{ maxWidth:430, margin:"0 auto", minHeight:"100vh", background:"var(--bg)", position:"relative" }}>
      <style>{G}</style>
      <div style={{ position:"sticky", top:0, zIndex:100, background:"#fff", borderBottom:"1px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.6rem 1rem" }}>
          <div style={{ display:"flex", gap:5, background:"var(--bg)", borderRadius:100, padding:3 }}>
            {["delivery","pickup"].map(t=>(
              <button key={t} onClick={()=>setOtype(t)} style={{ padding:"0.28rem 0.8rem", borderRadius:100, border:"none", background:otype===t?"var(--green)":"transparent", color:otype===t?"#fff":"var(--muted)", fontWeight:600, fontSize:"0.77rem", display:"flex", alignItems:"center", gap:4 }}>
                {t==="delivery"?"🛵 Delivery":"🏃 Pick up"}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <span style={{ fontSize:"0.77rem", fontWeight:600, color:"var(--muted)" }}>🇹🇭 TH ▾</span>
            <div style={{ width:29, height:29, borderRadius:"50%", background:"var(--green)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"0.8rem" }}>👤</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", padding:"0 1rem 0.55rem", gap:5 }}>
          <span style={{ fontSize:"0.85rem" }}>📍</span>
          <span style={{ fontSize:"0.77rem", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{branchObj ? branchObj.name+", "+branchObj.addr : ""}</span>
          <button onClick={()=>{setBranch(null);setPage("branch");}} style={{ background:"none", border:"none", color:"var(--green)", fontWeight:700, fontSize:"0.76rem", flexShrink:0 }}>Change</button>
        </div>
      </div>

      <HeroBanner/>

      <div style={{ background:"#fff", padding:"0.65rem 1rem", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.82rem", fontWeight:500 }}>
          🏬 {branchObj ? branchObj.name : ""}
          <button onClick={()=>{setBranch(null);setPage("branch");}} style={{ background:"none", border:"none", color:"var(--green)", fontWeight:700, fontSize:"0.8rem" }}>Change</button>
        </div>
        <span style={{ fontSize:"0.77rem", color:"var(--muted)" }}>ℹ More info</span>
      </div>

      <div style={{ background:"#fff", padding:"0.7rem 1rem", display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.5rem", marginBottom:6 }}>
        {[{icon:"🎁",label:"Promotions",sub:"No Promotions"},{icon:"🔄",label:"Re-order",sub:"No Order"},{icon:"⏳",label:"Ongoing",sub:"No Order"}].map(a=>(
          <div key={a.label} style={{ background:"var(--bg)", borderRadius:10, padding:"0.55rem 0.4rem", textAlign:"center" }}>
            <div style={{ fontSize:"1rem", marginBottom:2 }}>{a.icon}</div>
            <div style={{ fontSize:"0.7rem", fontWeight:600, marginBottom:1 }}>{a.label}</div>
            <div style={{ fontSize:"0.6rem", color:"var(--muted)" }}>{a.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background:"#fff", borderBottom:"1px solid var(--border)", position:"sticky", top:89, zIndex:90 }}>
        <div style={{ display:"flex", alignItems:"center" }}>
          <div style={{ padding:"0 0.7rem", color:"var(--muted)", fontSize:"0.95rem", flexShrink:0 }}>☰</div>
          <div style={{ display:"flex", overflowX:"auto", flex:1, scrollbarWidth:"none" }}>
            {SECTION_LABELS.map((l,i)=>(
              <button key={l} onClick={()=>setAS(i)} style={{ whiteSpace:"nowrap", padding:"0.68rem 0.85rem", border:"none", borderBottom:i===activeSection?"2.5px solid var(--green)":"2.5px solid transparent", background:"none", color:i===activeSection?"var(--green)":"var(--muted)", fontWeight:i===activeSection?700:500, fontSize:"0.79rem", flexShrink:0 }}>{l}</button>
            ))}
          </div>
          <div style={{ padding:"0 0.7rem", color:"var(--muted)", fontSize:"1rem", flexShrink:0 }}>🔍</div>
        </div>
      </div>

      <div style={{ padding:"0.85rem 0.85rem 6rem" }}>
        <div style={{ fontWeight:700, fontSize:"0.97rem", marginBottom:"0.8rem" }}>{activeSec.label}</div>
        {activeSection===0
          ? <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem" }}>{activeSec.items.map(item=><PromoCard key={item.id} item={item} onAdd={addItem}/>)}</div>
          : <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>{activeSec.items.map(item=><RowCard key={item.id} item={item} onAdd={addItem}/>)}</div>
        }
      </div>

      {count>0 && (
        <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, padding:"0.7rem 1rem", zIndex:150 }}>
          <button onClick={()=>setPage("basket")} style={{ width:"100%", background:"var(--green)", color:"#fff", border:"none", borderRadius:100, padding:"0.88rem 1.5rem", fontWeight:700, fontSize:"0.95rem", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 4px 20px rgba(27,94,22,0.4)" }}>
            <span style={{ background:"rgba(255,255,255,0.22)", borderRadius:"50%", width:24, height:24, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.72rem", fontWeight:800 }}>{count}</span>
            <span>View Basket</span>
            <span>฿{subtotal.toLocaleString()}</span>
          </button>
        </div>
      )}
    </div>
  );
}
