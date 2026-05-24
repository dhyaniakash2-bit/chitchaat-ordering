import { useState, useEffect, useRef, useCallback } from "react";

const G = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --green:#1B5E16;--green2:#236B1D;--green-light:#E8F5E3;
  --gold:#D4821A;--bg:#F2F2F2;--white:#fff;
  --text:#1A1A1A;--muted:#888;--border:#E5E5E5;--red:#D92B2B;
}
body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased}
button{cursor:pointer;font-family:'DM Sans',sans-serif}
input,textarea{font-family:'DM Sans',sans-serif}
.hide-scroll{scrollbar-width:none}-webkit-scrollbar{display:none}
`;

const BRANCHES = [
  {id:"bkk",name:"Sukhumvit 24",city:"Bangkok",addr:"Oakwood Residence, Sukhumvit 24, Phrom Phong",hours:"Daily 12pm–12am",lat:13.7287,lng:100.5697},
  {id:"pty",name:"Terminal 21",city:"Pattaya",addr:"Terminal 21 Shopping Mall, Pattaya",hours:"Daily 10am–10pm",lat:12.9333,lng:100.8833},
];

const FOOD_IMGS = {
  1:{url:"https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop&auto=format",bg:"linear-gradient(160deg,#8B3A00,#C85C00,#E8901A)",icon:"🫓",label:"Paratha"},
  2:{url:"https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop&auto=format",bg:"linear-gradient(160deg,#3D1F00,#6B3A10,#C07840)",icon:"🥐",label:"Naan"},
  3:{url:"https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&auto=format",bg:"linear-gradient(160deg,#1A4A10,#2D7A20,#4AAA35)",icon:"🥬",label:"Chaat"},
  4:{url:"https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400&h=300&fit=crop&auto=format",bg:"linear-gradient(160deg,#6B2800,#A04010,#E08030)",icon:"🥟",label:"Samosa Chaat"},
  5:{url:"https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop&auto=format",bg:"linear-gradient(160deg,#5A1800,#8B2A10,#D87050)",icon:"🥟",label:"Lamb Chaat"},
  6:{url:"https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=300&fit=crop&auto=format",bg:"linear-gradient(160deg,#7A2200,#B03800,#F08040)",icon:"🧆",label:"Samosa"},
  7:{url:"https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop&auto=format",bg:"linear-gradient(160deg,#2A1800,#503010,#A07858)",icon:"🍔",label:"Vada Pav"},
  8:{url:"https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=300&fit=crop&auto=format",bg:"linear-gradient(160deg,#7A3000,#A85010,#E8A060)",icon:"🫔",label:"Kulcha"},
  9:{url:"https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop&auto=format",bg:"linear-gradient(160deg,#8B1800,#C03010,#F08850)",icon:"🌯",label:"Tikka Roll"},
  10:{url:"https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop&auto=format",bg:"linear-gradient(160deg,#401000,#682A10,#B87050)",icon:"🥪",label:"Paneer Roll"},
  11:{url:"https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop&auto=format",bg:"linear-gradient(160deg,#7A2800,#A84010,#E89048)",icon:"🥪",label:"Sandwich"},
  12:{url:"https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop&auto=format",bg:"linear-gradient(160deg,#1A3000,#2E5010,#709858)",icon:"🫘",label:"Dal Bowl"},
  13:{url:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop&auto=format",bg:"linear-gradient(160deg,#8B2A00,#C04800,#F0A040)",icon:"🍲",label:"Butter Chicken"},
  14:{url:"https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop&auto=format",bg:"linear-gradient(160deg,#A03000,#D05010,#F8A860)",icon:"🍛",label:"Curry Bowl"},
  15:{url:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&auto=format",bg:"linear-gradient(160deg,#2A1500,#4A2808,#9A6840)",icon:"☕",label:"Chai"},
  16:{url:"https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop&auto=format",bg:"linear-gradient(160deg,#7A4800,#A87020,#E0C068)",icon:"🥛",label:"Lassi"},
  17:{url:"https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&h=300&fit=crop&auto=format",bg:"linear-gradient(160deg,#A06000,#D08A00,#F8D040)",icon:"🥭",label:"Mango Lassi"},
  18:{url:"https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop&auto=format",bg:"linear-gradient(160deg,#004A30,#007A50,#50C898)",icon:"🍋",label:"Lemonade"},
};

const MENU_SECTIONS = [
  {id:"promo",label:"Limited-Time Offer",items:[
    {id:1,name:"Stuffed Aloo Paratha",desc:"Whole wheat flatbread stuffed with spiced mashed potatoes, pan-grilled with butter and served with butter and pickle",price:180,badge:"NEW",veg:true},
    {id:8,name:"Lamb & Chickpea Kulcha",desc:"Stuffed kulcha bread filled with spiced lamb and chickpeas, pickled onion, mint mayo, lettuce",price:190,badge:"HOT",veg:false},
    {id:9,name:"Sriracha Chicken Tikka Roll",desc:"Juicy chicken tikka tossed in spicy sriracha sauce, wrapped in flaky whole wheat Lacha Parantha",price:260,badge:"SPICY",veg:false},
    {id:14,name:"Royal Butter Chicken Bowl",desc:"Rich butter chicken served over rice with sour cream, cucumber salad, corn salad as toppings",price:300,badge:"BESTSELLER",veg:false},
  ]},
  {id:"breakfast",label:"Breakfast",items:[
    {id:1,name:"Stuffed Aloo Paratha",desc:"Whole wheat flatbread stuffed with spiced mashed potatoes, pan-grilled with butter and served with butter and pickle for a comforting, homestyle start",price:180,veg:true},
    {id:2,name:"Olive & Mushroom Stuffed Naan",desc:"Soft naan filled with a savory mix of sautéed mushrooms, finished with olive tapenade, served with mint mayo",price:190,veg:true},
    {id:3,name:"Masala Scrambled Egg & Cheese Croissant",desc:"Flaky croissant stuffed with spiced Indian-style scrambled eggs and melted cheese for a rich, indulgent breakfast option",price:200,veg:false},
  ]},
  {id:"chaat",label:"Chaat & Snacks",items:[
    {id:3,name:"Palak Patta Chaat",desc:"Crispy spinach leaves topped with yogurt, mint sauce, tamarind sauce and spices for a refreshing, crunchy experience",price:150,veg:true},
    {id:4,name:"Potato Samosa Chaat",desc:"Crushed flaky potato dumpling topped with tangy tamarind & mint sauce, yogurt, pomegranate seeds and spices",price:160,veg:true},
    {id:5,name:"Lamb Mince Samosa Chaat",desc:"Flaky samosas filled with spiced lamb mince, served chaat-style with bold garlic & mint sauce, pomegranate and creamy yogurt",price:180,veg:false},
    {id:6,name:"Potato Samosa (2 pcs)",desc:"Deep fried flaky pastry filled with potato and served with mint & tamarind sauce",price:120,veg:true},
    {id:7,name:"Vada Pav",desc:"Mumbai's iconic street burger — spiced potato fritter tucked in a bun with chutneys and fried chili",price:130,veg:true},
    {id:18,name:"Gun Powder Fries",desc:"Crispy fries tossed in South Indian spice mix made with lentil, dried red chilly, sesame, curry leaves, garlic & cumin",price:140,veg:true},
  ]},
  {id:"rolls",label:"Rolls & Handhelds",items:[
    {id:9,name:"Sriracha Chicken Tikka Roll",desc:"Juicy chicken tikka tossed in spicy sriracha sauce, wrapped in flaky whole wheat Lacha Parantha for a bold fusion flavor",price:260,veg:false},
    {id:10,name:"Cottage Cheese Tikka Roll",desc:"Char grilled paneer tikka wrapped in flaky whole wheat bread with onion & tomato masala sauce and fresh garnishes",price:240,veg:true},
    {id:11,name:"Bombay Grilled Sandwich",desc:"Classic layered sandwich with mashed potato, capsicum, onion, tomato, mint sauce, and spices, grilled to crisp perfection",price:200,veg:true},
  ]},
  {id:"bowls",label:"Rice Bowls",items:[
    {id:12,name:"Black Lentil Burrito Bowl",desc:"Hearty bowl with slow-cooked black lentils, rice, sour cream, cucumber salad, corn salad as toppings and zesty sauces",price:280,veg:true},
    {id:13,name:"Royal Butter Chicken Bowl",desc:"Rich butter chicken served over rice with sour cream, cucumber salad, corn salad as toppings",price:300,veg:false},
  ]},
  {id:"combos",label:"Combos",items:[
    {id:15,name:"Bun Maska + Chai",desc:"A comforting pairing of buttery bun with classic Indian tea",price:150,veg:true},
    {id:7,name:"Vada Pav + Special Coffee",desc:"Street-style favorite paired with a rich, signature Chit Chaat coffee",price:200,veg:true},
    {id:17,name:"Butter Chicken Bowl + Sweet Lassi",desc:"Indulgent butter chicken bowl balanced with a creamy, sweet Amritsari lassi",price:390,veg:false},
  ]},
  {id:"desserts",label:"Desserts",items:[
    {id:16,name:"Chocolate Tea Brownie",desc:"Rich chocolate brownie infused with subtle tea notes for a unique, indulgent finish",price:130,veg:true},
    {id:17,name:"Cranberry & Rice Pudding",desc:"Creamy rice pudding with tangy cranberry accents for a balanced dessert",price:120,veg:true},
    {id:18,name:"Blueberry & Nuts Bircher Muesli",desc:"Chilled oat-based dessert with blueberries and nuts for a light, wholesome sweet option",price:130,veg:true},
  ]},
  {id:"drinks",label:"Beverages",items:[
    {id:15,name:"Adrak Chai",desc:"Classic Indian tea brewed with fresh ginger for a warming, spicy kick",price:90,veg:true},
    {id:15,name:"Masala Chai",desc:"Traditional tea infused with aromatic Indian spices",price:90,veg:true},
    {id:15,name:"Elachi Chai",desc:"Fragrant tea flavored with cardamom for a smooth, soothing taste",price:90,veg:true},
    {id:16,name:"Amritsari Sweet Lassi",desc:"Thick, creamy yogurt drink sweetened and topped with nuts ⚠ Contains nuts",price:130,veg:true},
    {id:17,name:"Mango Lassi",desc:"Refreshing yogurt drink blended with ripe mangoes",price:120,veg:true},
    {id:18,name:"Spiced Lemonade",desc:"Cooling lemonade enhanced with Indian spices for a tangy, refreshing twist",price:100,veg:true},
  ]},
];

const ALL_ITEMS = MENU_SECTIONS.flatMap(s=>s.items.map(i=>({...i,section:s.label})));
const DELIVERY_FEE = 45;

// ── helpers ──────────────────────────────────────────────
function FoodImg({id,size=80,r=10}){
  const d=FOOD_IMGS[id]||FOOD_IMGS[1];
  const [err,setErr]=useState(false);
  return(
    <div style={{width:size,height:size,borderRadius:r,flexShrink:0,overflow:"hidden",position:"relative"}}>
      {!err
        ?<img src={d.url} alt={d.label} onError={()=>setErr(true)} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
        :<div style={{width:"100%",height:"100%",background:d.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3}}>
          <span style={{fontSize:size*0.36,lineHeight:1}}>{d.icon}</span>
          {size>50&&<span style={{fontSize:size*0.1,color:"rgba(255,255,255,0.8)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>{d.label}</span>}
        </div>
      }
    </div>
  );
}

function Badge({label}){
  const m={SPICY:["#FFF0E8","#C04000","#F0C0A0"],HOT:["#FFF0E8","#D92B2B","#F5B0B0"],BESTSELLER:["#E8F5E3","#1B5E16","#A0D890"],NEW:["#FFF8E1","#C07800","#F0D870"]};
  const [bg,col,bdr]=m[label]||["#F2F2F2","#888","#ddd"];
  return <span style={{display:"inline-block",fontSize:"0.52rem",fontWeight:700,letterSpacing:"1px",background:bg,color:col,border:`1px solid ${bdr}`,borderRadius:4,padding:"2px 6px"}}>{label}</span>;
}

function VegDot({veg}){
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:"0.6rem",fontWeight:700,color:veg?"var(--green)":"var(--red)"}}>
      <span style={{width:10,height:10,borderRadius:2,border:`1.5px solid ${veg?"var(--green)":"var(--red)"}`,display:"inline-flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{width:5,height:5,borderRadius:"50%",background:veg?"var(--green)":"var(--red)"}}/>
      </span>
      {veg?"Veg":"Non-Veg"}
    </span>
  );
}

// ── Hero ──────────────────────────────────────────────────
function HeroBanner(){
  const [s,setS]=useState(0);
  const [errs,setErrs]=useState({});
  const slides=[
    {img:"https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&h=420&fit=crop&auto=format",bg:"linear-gradient(135deg,#8B2A00,#C04A00,#F0A840)",icon:"🍛",name:"Royal Butter Chicken Bowl",sub:"Rich, slow-cooked, deeply spiced",price:300},
    {img:"https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=420&fit=crop&auto=format",bg:"linear-gradient(135deg,#0D3808,#1E6010,#60AA48)",icon:"🥗",name:"Palak Patta Chaat",sub:"Crispy spinach, tangy sauces, yogurt",price:150},
    {img:"https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=420&fit=crop&auto=format",bg:"linear-gradient(135deg,#6B1000,#A82800,#E87840)",icon:"🌯",name:"Sriracha Chicken Tikka Roll",sub:"Fire-hot tikka, Lacha Parantha wrap",price:260},
  ];
  useEffect(()=>{const t=setInterval(()=>setS(p=>(p+1)%3),4500);return()=>clearInterval(t);},[]);
  const sl=slides[s];
  return(
    <div style={{position:"relative",height:210,overflow:"hidden",background:sl.bg}}>
      {!errs[s]&&<img key={sl.img} src={sl.img} alt={sl.name} onError={()=>setErrs(p=>({...p,[s]:true}))} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>}
      {errs[s]&&<div style={{position:"absolute",right:-10,top:"50%",transform:"translateY(-50%)",fontSize:90,opacity:0.3,filter:"blur(1px)"}}>{sl.icon}</div>}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(0,0,0,0.72) 0%,rgba(0,0,0,0.2) 60%,transparent 100%)"}}/>
      <div style={{position:"absolute",inset:0,padding:"1rem 1.2rem",display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
        <div style={{fontSize:"0.52rem",letterSpacing:"2.5px",textTransform:"uppercase",color:"rgba(255,255,255,0.7)",marginBottom:4,fontWeight:700}}>FEATURED</div>
        <div style={{fontSize:"1.2rem",fontWeight:800,color:"#fff",lineHeight:1.15,marginBottom:3,textShadow:"0 1px 8px rgba(0,0,0,0.4)"}}>{sl.name}</div>
        <div style={{fontSize:"0.73rem",color:"rgba(255,255,255,0.8)",marginBottom:10}}>{sl.sub}</div>
        <div style={{background:"rgba(0,0,0,0.3)",border:"1.5px solid rgba(255,255,255,0.4)",borderRadius:100,padding:"4px 14px",display:"inline-flex",alignItems:"center",gap:8,width:"fit-content",backdropFilter:"blur(4px)"}}>
          <span style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.8)",fontWeight:600}}>FROM</span>
          <span style={{fontSize:"0.95rem",fontWeight:800,color:"#FFF176"}}>฿{sl.price}</span>
        </div>
      </div>
      <div style={{position:"absolute",bottom:9,right:12,display:"flex",gap:5}}>
        {slides.map((_,i)=><div key={i} onClick={()=>setS(i)} style={{width:i===s?16:5,height:5,borderRadius:3,background:i===s?"#fff":"rgba(255,255,255,0.4)",transition:"all .3s",cursor:"pointer"}}/>)}
      </div>
    </div>
  );
}

// ── Product Modal ─────────────────────────────────────────
function ProductModal({item,onClose,onAdd,cartQty}){
  const [qty,setQty]=useState(1);
  const d=FOOD_IMGS[item.id]||FOOD_IMGS[1];
  const [imgErr,setImgErr]=useState(false);
  const handleAdd=()=>{
    for(let i=0;i<qty;i++) onAdd(item);
    onClose();
  };
  return(
    <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.55)"}}/>
      <div style={{position:"relative",background:"#fff",borderRadius:"20px 20px 0 0",overflow:"hidden",maxHeight:"88vh",display:"flex",flexDirection:"column"}}>
        {/* Image */}
        <div style={{height:220,background:d.bg,flexShrink:0,position:"relative",overflow:"hidden"}}>
          {!imgErr
            ?<img src={d.url} alt={item.name} onError={()=>setImgErr(true)} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            :<div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
              <span style={{fontSize:72}}>{d.icon}</span>
              <span style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.8)",fontWeight:700,textTransform:"uppercase",letterSpacing:"1px"}}>{d.label}</span>
            </div>
          }
          <button onClick={onClose} style={{position:"absolute",top:12,right:12,width:32,height:32,borderRadius:"50%",background:"rgba(0,0,0,0.45)",border:"none",color:"#fff",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          {item.badge&&<div style={{position:"absolute",top:12,left:12}}><Badge label={item.badge}/></div>}
        </div>
        {/* Content */}
        <div style={{padding:"1.2rem",overflowY:"auto",flex:1}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:6}}>
            <div style={{flex:1,paddingRight:8}}>
              <div style={{fontWeight:700,fontSize:"1.05rem",lineHeight:1.25,marginBottom:5}}>{item.name}</div>
              {item.veg!==undefined&&<VegDot veg={item.veg}/>}
            </div>
            <div style={{fontWeight:800,fontSize:"1.15rem",color:"var(--green)",flexShrink:0}}>฿{item.price}</div>
          </div>
          <p style={{fontSize:"0.83rem",color:"var(--muted)",lineHeight:1.6,marginBottom:"1.25rem"}}>{item.desc}</p>
          {/* Qty selector */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--bg)",borderRadius:12,padding:"0.75rem 1rem",marginBottom:"1rem"}}>
            <span style={{fontSize:"0.85rem",fontWeight:600}}>Quantity</span>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{width:30,height:30,borderRadius:"50%",border:"1.5px solid var(--border)",background:"#fff",fontWeight:700,fontSize:"1.1rem",display:"flex",alignItems:"center",justifyContent:"center",color:qty===1?"var(--muted)":"var(--text)"}}>−</button>
              <span style={{fontWeight:700,fontSize:"1rem",minWidth:20,textAlign:"center"}}>{qty}</span>
              <button onClick={()=>setQty(q=>q+1)} style={{width:30,height:30,borderRadius:"50%",border:"none",background:"var(--green)",color:"#fff",fontWeight:700,fontSize:"1.1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
            </div>
          </div>
          {cartQty>0&&<div style={{fontSize:"0.75rem",color:"var(--green)",textAlign:"center",marginBottom:"0.75rem",fontWeight:600}}>Already {cartQty} in your basket</div>}
        </div>
        {/* Add button */}
        <div style={{padding:"0.9rem 1rem 1.25rem",borderTop:"1px solid var(--border)",background:"#fff"}}>
          <button onClick={handleAdd} style={{width:"100%",background:"var(--green)",color:"#fff",border:"none",padding:"0.92rem",borderRadius:100,fontWeight:700,fontSize:"0.95rem",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 4px 16px rgba(27,94,22,0.3)"}}>
            <span>Add {qty} to Basket</span>
            <span style={{background:"rgba(255,255,255,0.2)",borderRadius:100,padding:"2px 12px"}}>฿{(item.price*qty).toLocaleString()}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Auth Modal ────────────────────────────────────────────
function AuthModal({onClose,onLogin}){
  const [step,setStep]=useState("phone"); // phone | otp | done
  const [phone,setPhone]=useState("");
  const [otp,setOtp]=useState(["","","","","",""]);
  const [sending,setSending]=useState(false);
  const [verifying,setVerifying]=useState(false);
  const [err,setErr]=useState("");
  const otpRefs=useRef([]);

  const sendOtp=()=>{
    if(phone.replace(/\s/g,"").length<9){setErr("Enter a valid phone number");return;}
    setErr("");setSending(true);
    setTimeout(()=>{setSending(false);setStep("otp");},1200);
  };

  const handleOtpChange=(i,val)=>{
    if(!/^\d*$/.test(val))return;
    const next=[...otp];next[i]=val.slice(-1);setOtp(next);
    if(val&&i<5)otpRefs.current[i+1]?.focus();
  };

  const handleOtpKey=(i,e)=>{
    if(e.key==="Backspace"&&!otp[i]&&i>0){otpRefs.current[i-1]?.focus();}
  };

  const verify=()=>{
    const code=otp.join("");
    if(code.length<6){setErr("Enter the 6-digit code");return;}
    setErr("");setVerifying(true);
    setTimeout(()=>{setVerifying(false);onLogin(phone);onClose();},1000);
  };

  return(
    <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.55)"}}/>
      <div style={{position:"relative",background:"#fff",borderRadius:"20px 20px 0 0",padding:"1.5rem 1.25rem 2rem"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem"}}>
          <div>
            <div style={{fontWeight:800,fontSize:"1.1rem"}}>{step==="phone"?"Sign in / Sign up":"Verify your number"}</div>
            <div style={{fontSize:"0.78rem",color:"var(--muted)",marginTop:3}}>{step==="phone"?"We'll send you a one-time code":`Code sent to ${phone}`}</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"var(--muted)",fontSize:"1.1rem",padding:4}}>✕</button>
        </div>

        {step==="phone"&&(
          <>
            <div style={{fontSize:"0.63rem",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"var(--muted)",marginBottom:6}}>PHONE NUMBER</div>
            <div style={{display:"flex",gap:"0.5rem",marginBottom:err?"0.5rem":"1.25rem"}}>
              <div style={{background:"var(--bg)",border:"1.5px solid var(--border)",borderRadius:10,padding:"0.65rem 0.8rem",fontWeight:600,fontSize:"0.88rem",flexShrink:0}}>🇹🇭 +66</div>
              <input value={phone} onChange={e=>setPhone(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")sendOtp();}} placeholder="xx xxx xxxx" style={{flex:1,padding:"0.65rem 0.8rem",border:"1.5px solid var(--border)",borderRadius:10,fontSize:"0.88rem",outline:"none",color:"var(--text)"}}/>
            </div>
            {err&&<div style={{fontSize:"0.75rem",color:"var(--red)",marginBottom:"0.75rem"}}>{err}</div>}
            <button onClick={sendOtp} disabled={sending} style={{width:"100%",background:"var(--green)",color:"#fff",border:"none",padding:"0.9rem",borderRadius:100,fontWeight:700,fontSize:"0.9rem",opacity:sending?0.7:1}}>
              {sending?"Sending code…":"Send OTP"}
            </button>
            <div style={{textAlign:"center",fontSize:"0.72rem",color:"var(--muted)",marginTop:"1rem",lineHeight:1.5}}>By continuing you agree to our Terms & Privacy Policy.</div>
          </>
        )}

        {step==="otp"&&(
          <>
            <div style={{display:"flex",gap:"0.5rem",justifyContent:"center",marginBottom:"1.25rem"}}>
              {otp.map((v,i)=>(
                <input key={i} ref={el=>otpRefs.current[i]=el} value={v} onChange={e=>handleOtpChange(i,e.target.value)} onKeyDown={e=>handleOtpKey(i,e)} maxLength={1} inputMode="numeric"
                  style={{width:44,height:52,textAlign:"center",fontSize:"1.4rem",fontWeight:700,border:`2px solid ${v?"var(--green)":"var(--border)"}`,borderRadius:10,outline:"none",color:"var(--text)",background:v?"var(--green-light)":"#fff",transition:"all .2s"}}/>
              ))}
            </div>
            {err&&<div style={{fontSize:"0.75rem",color:"var(--red)",marginBottom:"0.75rem",textAlign:"center"}}>{err}</div>}
            <button onClick={verify} disabled={verifying} style={{width:"100%",background:"var(--green)",color:"#fff",border:"none",padding:"0.9rem",borderRadius:100,fontWeight:700,fontSize:"0.9rem",opacity:verifying?0.7:1,marginBottom:"0.85rem"}}>
              {verifying?"Verifying…":"Verify & Continue"}
            </button>
            <button onClick={()=>{setStep("phone");setOtp(["","","","","",""]);setErr("");}} style={{width:"100%",background:"none",border:"none",color:"var(--muted)",fontSize:"0.82rem",padding:"0.4rem"}}>← Change number</button>
          </>
        )}
      </div>
    </div>
  );
}

// ── MenuItem (extracted so hooks are legal) ──────────────
function MenuItem({item, onOpen, inCart}){
  const d = FOOD_IMGS[item.id] || FOOD_IMGS[1];
  const [imgErr, setImgErr] = useState(false);
  return(
    <div onClick={onOpen} style={{background:"#fff",borderRadius:12,padding:"0.9rem",display:"flex",gap:"0.8rem",alignItems:"center",boxShadow:"0 1px 3px rgba(0,0,0,0.06)",cursor:"pointer"}}>
      <div style={{width:76,height:76,borderRadius:10,flexShrink:0,overflow:"hidden",background:d.bg,position:"relative"}}>
        {!imgErr
          ?<img src={d.url} alt={item.name} onError={()=>setImgErr(true)} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          :<div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2}}>
            <span style={{fontSize:28}}>{d.icon}</span>
            <span style={{fontSize:"0.5rem",color:"rgba(255,255,255,0.8)",fontWeight:700,textTransform:"uppercase"}}>{d.label}</span>
          </div>
        }
        {inCart>0&&<div style={{position:"absolute",top:4,right:4,background:"var(--green)",color:"#fff",borderRadius:"50%",width:18,height:18,fontSize:"0.6rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{inCart}</div>}
      </div>
      <div style={{flex:1,minWidth:0}}>
        {item.badge&&<div style={{marginBottom:3}}><Badge label={item.badge}/></div>}
        {item.veg!==undefined&&<div style={{marginBottom:3}}><VegDot veg={item.veg}/></div>}
        <div style={{fontWeight:600,fontSize:"0.87rem",lineHeight:1.25,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
        <div style={{fontSize:"0.72rem",color:"var(--muted)",lineHeight:1.4,marginBottom:6,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{item.desc}</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontWeight:700,fontSize:"0.9rem"}}>฿{item.price}</span>
          <button onClick={e=>{e.stopPropagation();onOpen();}} style={{width:29,height:29,borderRadius:"50%",border:"none",background:"var(--green)",color:"#fff",fontSize:"1.1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
        </div>
      </div>
    </div>
  );
}

// ── Map Picker ────────────────────────────────────────────
function MapPicker({branch,onConfirm,onBack}){
  const [step,setStep]=useState("map");
  const [locating,setLoc]=useState(false);
  const [locErr,setLocErr]=useState("");
  const [coords,setCoords]=useState(null);
  const [mapSrc,setMapSrc]=useState("");
  const [searchVal,setSearch]=useState("");
  const [detail,setDetail]=useState({floor:"",building:"",note:""});
  const branchObj=BRANCHES.find(b=>b.id===branch);
  const defLat=branchObj?branchObj.lat:13.7563,defLng=branchObj?branchObj.lng:100.5018;
  const buildSrc=(lat,lng)=>`https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  useEffect(()=>{setMapSrc(buildSrc(defLat,defLng));},[]);
  const useMyLoc=()=>{
    setLocErr("");if(!navigator.geolocation){setLocErr("Geolocation not supported.");return;}
    setLoc(true);
    navigator.geolocation.getCurrentPosition(
      p=>{const{latitude:lat,longitude:lng}=p.coords;setCoords({lat,lng});setMapSrc(buildSrc(lat,lng));setLoc(false);},
      e=>{setLoc(false);setLocErr(e.code===1?"Location permission denied. Please allow access and try again.":"Could not get location. Search manually below.");},
      {enableHighAccuracy:true,timeout:10000}
    );
  };
  const handleSearch=()=>{if(!searchVal.trim())return;setMapSrc(`https://maps.google.com/maps?q=${encodeURIComponent(searchVal+" Thailand")}&z=15&output=embed`);setCoords({manual:true,label:searchVal});};
  const locationLabel=coords?(coords.manual?coords.label:`${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`):null;

  const Header=({title,back})=>(
    <div style={{background:"#fff",padding:"0.85rem 1rem",display:"flex",alignItems:"center",gap:"0.75rem",borderBottom:"1px solid var(--border)",position:"sticky",top:0,zIndex:50}}>
      <button onClick={back} style={{background:"none",border:"none",fontSize:"1.3rem",color:"var(--text)"}}>←</button>
      <div style={{fontWeight:700,fontSize:"1rem"}}>{title}</div>
    </div>
  );

  if(step==="detail") return(
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
      <Header title="Add Address Details" back={()=>setStep("map")}/>
      <div style={{padding:"1rem",display:"flex",flexDirection:"column",gap:"0.85rem"}}>
        <div style={{background:"var(--green-light)",border:"1px solid #b8ddb0",borderRadius:10,padding:"0.75rem 0.9rem",display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:"1.2rem"}}>📍</span>
          <div style={{flex:1}}>
            <div style={{fontSize:"0.7rem",fontWeight:700,color:"var(--green)",marginBottom:2}}>LOCATION SET</div>
            <div style={{fontSize:"0.78rem",color:"var(--text)",lineHeight:1.4}}>{locationLabel||"Location selected"}</div>
          </div>
          <button onClick={()=>setStep("map")} style={{background:"none",border:"none",color:"var(--green)",fontSize:"0.78rem",fontWeight:600}}>Edit</button>
        </div>
        {[{key:"floor",label:"Floor / Unit Number",ph:"e.g. Floor 3, Room 302",type:"input",req:true},{key:"building",label:"Building / Condo",ph:"e.g. Oakwood Residence, Tower A",type:"input"},{key:"note",label:"Note to Rider",ph:"e.g. Use side entrance, call on arrival",type:"textarea"}].map(f=>(
          <div key={f.key}>
            <div style={{fontSize:"0.63rem",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"var(--muted)",marginBottom:5}}>{f.label}{f.req&&<span style={{color:"var(--red)"}}> *</span>}</div>
            {f.type==="textarea"
              ?<textarea placeholder={f.ph} value={detail[f.key]} onChange={e=>setDetail(p=>({...p,[f.key]:e.target.value}))} rows={3} style={{width:"100%",padding:"0.65rem 0.8rem",border:"1.5px solid "+(detail[f.key]?"var(--green)":"var(--border)"),borderRadius:10,fontSize:"0.87rem",outline:"none",resize:"none",color:"var(--text)"}}/>
              :<input placeholder={f.ph} value={detail[f.key]} onChange={e=>setDetail(p=>({...p,[f.key]:e.target.value}))} style={{width:"100%",padding:"0.65rem 0.8rem",border:"1.5px solid "+(detail[f.key]?"var(--green)":"var(--border)"),borderRadius:10,fontSize:"0.87rem",outline:"none",color:"var(--text)"}}/>
            }
          </div>
        ))}
        <button onClick={()=>onConfirm({coords,locationLabel,...detail})} disabled={!detail.floor} style={{background:detail.floor?"var(--green)":"#ccc",color:"#fff",border:"none",padding:"0.92rem",borderRadius:100,fontWeight:700,fontSize:"0.95rem"}}>Confirm Address →</button>
        {!detail.floor&&<div style={{fontSize:"0.72rem",color:"var(--muted)",textAlign:"center"}}>Floor / unit number is required</div>}
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",flexDirection:"column"}}>
      <Header title="Choose Your Location" back={onBack}/>
      <div style={{background:"#fff",borderBottom:"1px solid var(--border)",padding:"0.75rem 1rem"}}>
        <button onClick={useMyLoc} disabled={locating} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:9,background:"var(--green-light)",border:"1.5px solid #b8ddb0",borderRadius:10,padding:"0.72rem",color:"var(--green)",fontWeight:700,fontSize:"0.88rem",opacity:locating?0.7:1}}>
          <span style={{fontSize:"1.15rem"}}>{locating?"⏳":"🎯"}</span>{locating?"Getting your location…":"Use my current location"}
        </button>
        {locErr&&<div style={{marginTop:"0.55rem",fontSize:"0.75rem",color:"var(--red)",lineHeight:1.45,padding:"0.45rem 0.5rem",background:"#FFF0EE",borderRadius:7}}>{locErr}</div>}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"0.6rem 1rem",background:"#fff",borderBottom:"1px solid var(--border)"}}>
        <div style={{flex:1,height:1,background:"var(--border)"}}/>
        <span style={{fontSize:"0.72rem",color:"var(--muted)",fontWeight:600}}>OR SEARCH</span>
        <div style={{flex:1,height:1,background:"var(--border)"}}/>
      </div>
      <div style={{background:"#fff",borderBottom:"1px solid var(--border)",padding:"0.75rem 1rem",display:"flex",gap:"0.5rem"}}>
        <input value={searchVal} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")handleSearch();}} placeholder="Area, street, building…" style={{flex:1,padding:"0.65rem 0.9rem",border:"1.5px solid var(--border)",borderRadius:10,fontSize:"0.87rem",outline:"none",background:"var(--bg)"}}/>
        <button onClick={handleSearch} style={{background:"var(--green)",color:"#fff",border:"none",borderRadius:10,padding:"0 1rem",fontWeight:600,fontSize:"0.85rem"}}>Go</button>
      </div>
      <div style={{flex:1,minHeight:300,position:"relative"}}>
        {mapSrc&&<iframe key={mapSrc} src={mapSrc} width="100%" height="300" style={{border:"none",display:"block"}} allowFullScreen loading="lazy"/>}
        <div style={{position:"absolute",bottom:0,left:0,right:0,background:"rgba(255,255,255,0.92)",borderTop:"1px solid var(--border)",padding:"0.5rem 1rem",fontSize:"0.72rem",color:"var(--muted)",textAlign:"center"}}>Search or use current location, then confirm below</div>
      </div>
      <div style={{padding:"0.85rem 1rem",background:"#fff",borderTop:"1px solid var(--border)"}}>
        {(coords||searchVal)
          ?<button onClick={()=>{if(!coords&&searchVal)setCoords({manual:true,label:searchVal});setStep("detail");}} style={{width:"100%",background:"var(--green)",color:"#fff",border:"none",padding:"0.9rem",borderRadius:100,fontWeight:700,fontSize:"0.95rem"}}>This is my location → Add Details</button>
          :<div style={{textAlign:"center",padding:"0.3rem",fontSize:"0.82rem",color:"var(--muted)"}}>Set your location above to continue</div>
        }
      </div>
    </div>
  );
}

// ── Basket ────────────────────────────────────────────────
function Basket({cart,onUpdate,onClear,onOpenProduct,branch,onBack,onNext,otype}){
  const subtotal=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const total=subtotal+(otype==="delivery"?DELIVERY_FEE:0);
  const cartIds=new Set(cart.map(i=>i.id));
  const upsell=ALL_ITEMS.filter(i=>!cartIds.has(i.id)).slice(0,12);
  return(
    <div style={{minHeight:"100vh",background:"var(--bg)",paddingBottom:100}}>
      <div style={{background:"#fff",padding:"0.85rem 1rem",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid var(--border)",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.7rem"}}>
          <button onClick={onBack} style={{background:"none",border:"none",fontSize:"1.3rem",color:"var(--text)"}}>←</button>
          <div style={{fontWeight:700,fontSize:"1rem"}}>Your Basket</div>
        </div>
        {cart.length>0&&<button onClick={onClear} style={{background:"none",border:"none",color:"var(--muted)",fontSize:"0.78rem"}}>Clear all</button>}
      </div>
      <div style={{padding:"0.9rem",display:"flex",flexDirection:"column",gap:"0.75rem"}}>
        {cart.length===0?(
          <div style={{background:"#fff",borderRadius:12,padding:"2.5rem",textAlign:"center"}}>
            <div style={{fontSize:"2.5rem",marginBottom:"0.75rem"}}>🛒</div>
            <div style={{fontWeight:600,marginBottom:4}}>Your basket is empty</div>
            <div style={{fontSize:"0.82rem",color:"var(--muted)"}}>Add something bold and spicy!</div>
            <button onClick={onBack} style={{marginTop:"1rem",background:"var(--green)",color:"#fff",border:"none",padding:"0.65rem 1.5rem",borderRadius:100,fontWeight:600,fontSize:"0.85rem"}}>Browse Menu</button>
          </div>
        ):(
          <>
            <div style={{background:"#fff",borderRadius:12,overflow:"hidden"}}>
              {cart.map((item,idx)=>(
                <div key={item.id+idx} style={{display:"flex",alignItems:"center",gap:"0.8rem",padding:"0.85rem 0.9rem",borderBottom:idx<cart.length-1?"1px solid var(--border)":"none",cursor:"pointer"}} onClick={()=>onOpenProduct(item)}>
                  <FoodImg id={item.id} size={52} r={8}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:"0.87rem",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                    <div style={{fontSize:"0.75rem",color:"var(--muted)"}}>฿{item.price} each</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}} onClick={e=>e.stopPropagation()}>
                    <button onClick={()=>onUpdate(item.id,-1)} style={{width:27,height:27,borderRadius:"50%",border:"1.5px solid var(--border)",background:"#fff",fontWeight:700,fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center",color:item.qty===1?"var(--red)":"var(--text)"}}>{item.qty===1?"🗑":"−"}</button>
                    <span style={{fontWeight:700,fontSize:"0.9rem",minWidth:18,textAlign:"center"}}>{item.qty}</span>
                    <button onClick={()=>onUpdate(item.id,1)} style={{width:27,height:27,borderRadius:"50%",border:"none",background:"var(--green)",color:"#fff",fontWeight:700,fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                  </div>
                  <div style={{fontWeight:700,fontSize:"0.88rem",minWidth:48,textAlign:"right"}}>฿{(item.price*item.qty).toLocaleString()}</div>
                </div>
              ))}
            </div>
            <div style={{background:"#fff",borderRadius:12,padding:"0.9rem"}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.84rem",color:"var(--muted)",paddingBottom:"0.5rem",borderBottom:"1px solid var(--border)",marginBottom:"0.5rem"}}>
                <span>Subtotal ({cart.reduce((s,i)=>s+i.qty,0)} items)</span>
                <span style={{color:"var(--text)",fontWeight:500}}>฿{subtotal.toLocaleString()}</span>
              </div>
              {otype==="delivery"&&(
                <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.84rem",color:"var(--muted)",paddingBottom:"0.5rem",borderBottom:"1px solid var(--border)",marginBottom:"0.6rem"}}>
                  <span style={{display:"flex",alignItems:"center",gap:5}}>Delivery fee <span style={{fontSize:"0.6rem",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:4,padding:"1px 5px"}}>est.</span></span>
                  <span style={{color:"var(--text)",fontWeight:500}}>฿{DELIVERY_FEE}</span>
                </div>
              )}
              <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:"1rem"}}>
                <span>Total</span><span style={{color:"var(--green)"}}>฿{total.toLocaleString()}</span>
              </div>
              <div style={{marginTop:"0.5rem",fontSize:"0.68rem",color:"var(--muted)"}}>* Delivery fee is an estimate. Final fee based on your exact location.</div>
            </div>
            {upsell.length>0&&(
              <div style={{background:"#fff",borderRadius:12,padding:"0.9rem"}}>
                <div style={{fontWeight:700,fontSize:"0.92rem",marginBottom:"0.75rem"}}>People also ordered 🔥</div>
                <div style={{display:"flex",gap:"0.65rem",overflowX:"auto",paddingBottom:"0.3rem",scrollbarWidth:"none"}}>
                  {upsell.map((item,i)=>{const d=FOOD_IMGS[item.id]||FOOD_IMGS[1];return(
                    <div key={i} style={{flexShrink:0,width:120,borderRadius:10,border:"1px solid var(--border)",overflow:"hidden",cursor:"pointer"}} onClick={()=>onOpenProduct(item)}>
                      <div style={{height:75,background:d.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2}}>
                        <span style={{fontSize:28}}>{d.icon}</span>
                        <span style={{fontSize:"0.5rem",color:"rgba(255,255,255,0.8)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>{d.label}</span>
                      </div>
                      <div style={{padding:"0.45rem 0.5rem"}}>
                        <div style={{fontSize:"0.68rem",fontWeight:600,lineHeight:1.2,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <span style={{fontSize:"0.75rem",fontWeight:700}}>฿{item.price}</span>
                          <button onClick={e=>{e.stopPropagation();onOpenProduct(item);}} style={{width:22,height:22,borderRadius:"50%",border:"none",background:"var(--green)",color:"#fff",fontSize:"0.9rem",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                        </div>
                      </div>
                    </div>
                  );})}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {cart.length>0&&(
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,padding:"0.75rem 1rem",zIndex:100}}>
          <button onClick={onNext} style={{width:"100%",background:"var(--green)",color:"#fff",border:"none",padding:"0.9rem 1.5rem",borderRadius:100,fontWeight:700,fontSize:"0.95rem",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 4px 20px rgba(27,94,22,0.35)"}}>
            <span>{otype==="delivery"?"Choose Delivery Address →":"Continue to Checkout →"}</span>
            <span style={{background:"rgba(255,255,255,0.22)",borderRadius:100,padding:"3px 12px",fontSize:"0.88rem"}}>฿{total.toLocaleString()}</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ── Checkout ──────────────────────────────────────────────
function Checkout({cart,address,branch,otype,onBack,onDone}){
  const [name,setName]=useState("");const [phone,setPhone]=useState("");const [email,setEmail]=useState("");
  const subtotal=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const delivFee=otype==="delivery"?DELIVERY_FEE:0;
  const total=subtotal+delivFee;
  const branchObj=BRANCHES.find(b=>b.id===branch);
  const canPlace=name&&phone;
  return(
    <div style={{minHeight:"100vh",background:"var(--bg)",paddingBottom:30}}>
      <div style={{background:"#fff",padding:"0.85rem 1rem",display:"flex",alignItems:"center",gap:"0.75rem",borderBottom:"1px solid var(--border)",position:"sticky",top:0,zIndex:50}}>
        <button onClick={onBack} style={{background:"none",border:"none",fontSize:"1.3rem",color:"var(--text)"}}>←</button>
        <div style={{fontWeight:700,fontSize:"1rem"}}>Confirm & Pay</div>
      </div>
      <div style={{padding:"0.9rem",display:"flex",flexDirection:"column",gap:"0.75rem"}}>
        <div style={{background:"#fff",borderRadius:12,padding:"0.9rem"}}>
          <div style={{fontSize:"0.63rem",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"var(--muted)",marginBottom:"0.7rem"}}>{otype==="delivery"?"DELIVERY ADDRESS":"PICKUP FROM"}</div>
          {otype==="delivery"?(
            <div style={{display:"flex",gap:8}}>
              <span style={{fontSize:"1.1rem",marginTop:1}}>📍</span>
              <div>
                <div style={{fontSize:"0.87rem",fontWeight:600,marginBottom:2}}>{address?address.floor+(address.building?", "+address.building:""):""}</div>
                {address?.note&&<div style={{fontSize:"0.75rem",color:"var(--muted)"}}>Note: {address.note}</div>}
                <button onClick={onBack} style={{background:"none",border:"none",color:"var(--green)",fontSize:"0.78rem",fontWeight:600,padding:0,marginTop:3}}>Change address</button>
              </div>
            </div>
          ):(
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span>🏬</span>
              <div>
                <div style={{fontSize:"0.87rem",fontWeight:600}}>{branchObj?.name}</div>
                <div style={{fontSize:"0.75rem",color:"var(--muted)"}}>{branchObj?.addr}</div>
              </div>
            </div>
          )}
        </div>
        <div style={{background:"#fff",borderRadius:12,padding:"0.9rem"}}>
          <div style={{fontSize:"0.63rem",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"var(--muted)",marginBottom:"0.75rem"}}>YOUR DETAILS</div>
          {[{v:name,sv:setName,l:"Name",p:"Your name",req:true},{v:phone,sv:setPhone,l:"Phone",p:"+66 xx xxx xxxx",req:true},{v:email,sv:setEmail,l:"Email (optional)",p:"you@email.com"}].map(f=>(
            <div key={f.l} style={{marginBottom:"0.7rem"}}>
              <div style={{fontSize:"0.63rem",fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:"var(--muted)",marginBottom:4}}>{f.l}{f.req&&<span style={{color:"var(--red)"}}> *</span>}</div>
              <input value={f.v} onChange={e=>f.sv(e.target.value)} placeholder={f.p} style={{width:"100%",padding:"0.62rem 0.8rem",border:"1.5px solid "+(f.v?"var(--green)":"var(--border)"),borderRadius:9,fontSize:"0.87rem",outline:"none",color:"var(--text)"}}/>
            </div>
          ))}
        </div>
        <div style={{background:"#fff",borderRadius:12,padding:"0.9rem"}}>
          <div style={{fontSize:"0.63rem",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"var(--muted)",marginBottom:"0.75rem"}}>ORDER SUMMARY</div>
          {cart.map(i=>(
            <div key={i.id} style={{display:"flex",justifyContent:"space-between",fontSize:"0.83rem",padding:"0.3rem 0",borderBottom:"1px solid var(--border)",color:"var(--muted)"}}>
              <span>{i.name} x {i.qty}</span><span style={{color:"var(--text)",fontWeight:600}}>฿{(i.price*i.qty).toLocaleString()}</span>
            </div>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.83rem",padding:"0.45rem 0 0.3rem",color:"var(--muted)",borderBottom:"1px solid var(--border)"}}>
            <span>Subtotal</span><span style={{color:"var(--text)"}}>฿{subtotal.toLocaleString()}</span>
          </div>
          {otype==="delivery"&&<div style={{display:"flex",justifyContent:"space-between",fontSize:"0.83rem",padding:"0.3rem 0 0.45rem",color:"var(--muted)",borderBottom:"1px solid var(--border)"}}><span>Delivery fee</span><span>฿{delivFee}</span></div>}
          <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:"1rem",paddingTop:"0.65rem"}}><span>Total</span><span style={{color:"var(--green)"}}>฿{total.toLocaleString()}</span></div>
        </div>
        <div style={{background:"#FFF8E1",border:"1px solid #F0D870",borderRadius:8,padding:"0.6rem 0.9rem",fontSize:"0.72rem",color:"#7A5800"}}>Payment via Omise / PromptPay — to be connected before going live.</div>
        <button onClick={onDone} disabled={!canPlace} style={{background:canPlace?"var(--green)":"#ccc",color:"#fff",border:"none",padding:"0.95rem",borderRadius:100,fontWeight:700,fontSize:"0.95rem"}}>Place Order — ฿{total.toLocaleString()}</button>
      </div>
    </div>
  );
}

function Success({branch,onReset}){
  const b=BRANCHES.find(x=>x.id===branch);
  return(
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem",textAlign:"center"}}>
      <div style={{fontSize:"3.5rem",marginBottom:"1rem"}}>🎉</div>
      <div style={{fontSize:"0.65rem",letterSpacing:"3px",textTransform:"uppercase",color:"var(--green)",fontWeight:700,marginBottom:"0.4rem"}}>ORDER CONFIRMED</div>
      <div style={{fontWeight:800,fontSize:"1.6rem",marginBottom:"0.5rem"}}>It's on its way!</div>
      <div style={{color:"var(--muted)",fontSize:"0.85rem",lineHeight:1.65,marginBottom:"2rem"}}>Your order from Chit Chaat {b?.name} is confirmed.<br/>Bold Punjabi flavours incoming!</div>
      <button onClick={onReset} style={{background:"var(--green)",color:"#fff",border:"none",padding:"0.8rem 2.2rem",borderRadius:100,fontWeight:700,fontSize:"0.9rem"}}>Back to Menu</button>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────
export default function App(){
  const [page,setPage]       = useState("branch");
  const [branch,setBranch]   = useState(null);
  const [otype,setOtype]     = useState("delivery");
  const [cart,setCart]       = useState([]);
  const [address,setAddress] = useState(null);
  const [productModal,setProductModal] = useState(null); // item or null
  const [authModal,setAuthModal]       = useState(false);
  const [user,setUser]                 = useState(null);  // {phone}
  const [search,setSearch]             = useState("");
  const [searchFocus,setSearchFocus]   = useState(false);
  const sectionRefs = useRef({});
  const [activeSection,setActiveSection] = useState("promo");
  const menuScrollRef = useRef(null);

  const count    = cart.reduce((s,i)=>s+i.qty,0);
  const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const branchObj = BRANCHES.find(b=>b.id===branch);

  const addItem = item => setCart(p=>{const ex=p.find(c=>c.id===item.id);return ex?p.map(c=>c.id===item.id?{...c,qty:c.qty+1}:c):[...p,{...item,qty:1}];});
  const updCart = (id,d)=> setCart(p=>p.map(c=>c.id===id?{...c,qty:c.qty+d}:c).filter(c=>c.qty>0));
  const cartQty = id => cart.find(c=>c.id===id)?.qty||0;

  // scroll spy
  useEffect(()=>{
    if(page!=="home") return;
    const el=menuScrollRef.current;
    if(!el) return;
    const onScroll=()=>{
      const scrollTop=el.scrollTop+200;
      let active="promo";
      MENU_SECTIONS.forEach(s=>{
        const ref=sectionRefs.current[s.id];
        if(ref&&ref.offsetTop<=scrollTop) active=s.id;
      });
      setActiveSection(active);
    };
    el.addEventListener("scroll",onScroll,{passive:true});
    return()=>el.removeEventListener("scroll",onScroll);
  },[page]);

  const scrollToSection = id => {
    const ref=sectionRefs.current[id];
    if(ref&&menuScrollRef.current) menuScrollRef.current.scrollTo({top:ref.offsetTop-120,behavior:"smooth"});
    setSearch("");setSearchFocus(false);
  };

  // search results
  const searchResults = search.trim().length>1
    ? ALL_ITEMS.filter(i=>i.name.toLowerCase().includes(search.toLowerCase())||i.desc.toLowerCase().includes(search.toLowerCase()))
    : [];

  // pages
  if(page==="branch") return(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0D2B0A,#1B5016 60%,#2A7020)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem"}}>
      <style>{G}</style>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"2.5rem"}}>
        <div style={{width:50,height:50,background:"rgba(255,255,255,0.15)",border:"2px solid rgba(255,255,255,0.3)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"0.95rem",color:"#fff",letterSpacing:1}}>CC</div>
        <div>
          <div style={{fontWeight:800,fontSize:"1.35rem",color:"#fff",letterSpacing:"2px",lineHeight:1}}>CHIT CHAAT</div>
          <div style={{fontSize:"0.58rem",letterSpacing:"2.5px",color:"rgba(255,255,255,0.5)",marginTop:3,textTransform:"uppercase"}}>Social · Spicy · Soulful</div>
        </div>
      </div>
      <div style={{fontSize:"0.68rem",letterSpacing:"3px",textTransform:"uppercase",color:"rgba(255,255,255,0.55)",marginBottom:"1.25rem",fontWeight:600}}>CHOOSE YOUR BRANCH</div>
      <div style={{display:"flex",flexDirection:"column",gap:"0.85rem",width:"100%",maxWidth:380}}>
        {BRANCHES.map(b=>(
          <button key={b.id} onClick={()=>{setBranch(b.id);setPage("home");}} style={{background:"rgba(255,255,255,0.1)",border:"1.5px solid rgba(255,255,255,0.22)",borderRadius:14,padding:"1.2rem 1.4rem",textAlign:"left",color:"#fff",cursor:"pointer"}}>
            <div style={{fontSize:"0.58rem",letterSpacing:"2px",textTransform:"uppercase",color:"#A8E890",fontWeight:700,marginBottom:4}}>{b.city}</div>
            <div style={{fontWeight:800,fontSize:"1.05rem",marginBottom:3}}>{b.name}</div>
            <div style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.6)",lineHeight:1.45,marginBottom:6}}>{b.addr}</div>
            <div style={{fontSize:"0.72rem",color:"#A8E890",fontWeight:600}}>🕐 {b.hours}</div>
          </button>
        ))}
      </div>
    </div>
  );

  if(page==="basket")   return(<><style>{G}</style><Basket cart={cart} onUpdate={updCart} onClear={()=>setCart([])} onOpenProduct={setProductModal} branch={branch} otype={otype} onBack={()=>setPage("home")} onNext={()=>setPage(otype==="delivery"?"address":"checkout")}/>{productModal&&<ProductModal item={productModal} onClose={()=>setProductModal(null)} onAdd={addItem} cartQty={cartQty(productModal.id)}/>}</>);
  if(page==="address")  return(<><style>{G}</style><MapPicker branch={branch} onConfirm={addr=>{setAddress(addr);setPage("checkout");}} onBack={()=>setPage("basket")}/></>);
  if(page==="checkout") return(<><style>{G}</style><Checkout cart={cart} address={address} branch={branch} otype={otype} onBack={()=>setPage(otype==="delivery"?"address":"basket")} onDone={()=>setPage("success")}/></>);
  if(page==="success")  return(<><style>{G}</style><Success branch={branch} onReset={()=>{setCart([]);setAddress(null);setPage("home");}}/></>);

  // ── HOME
  return(
    <div style={{maxWidth:430,margin:"0 auto",height:"100vh",display:"flex",flexDirection:"column",background:"var(--bg)",position:"relative",overflow:"hidden"}}>
      <style>{G}</style>

      {/* MODALS */}
      {productModal&&<ProductModal item={productModal} onClose={()=>setProductModal(null)} onAdd={addItem} cartQty={cartQty(productModal.id)}/>}
      {authModal&&<AuthModal onClose={()=>setAuthModal(false)} onLogin={p=>setUser({phone:p})}/>}

      {/* TOP BAR */}
      <div style={{background:"#fff",borderBottom:"1px solid var(--border)",flexShrink:0}}>
        {/* Row 1: order type + account */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.6rem 1rem"}}>
          <div style={{display:"flex",gap:4,background:"var(--bg)",borderRadius:100,padding:3}}>
            {["delivery","pickup"].map(t=>(
              <button key={t} onClick={()=>setOtype(t)} style={{padding:"0.28rem 0.75rem",borderRadius:100,border:"none",background:otype===t?"var(--green)":"transparent",color:otype===t?"#fff":"var(--muted)",fontWeight:600,fontSize:"0.77rem",display:"flex",alignItems:"center",gap:4}}>
                {t==="delivery"?"🛵 Delivery":"🏃 Pick up"}
              </button>
            ))}
          </div>
          <button onClick={()=>setAuthModal(true)} style={{display:"flex",alignItems:"center",gap:6,background:user?"var(--green-light)":"var(--bg)",border:user?"1.5px solid #b8ddb0":"1.5px solid var(--border)",borderRadius:100,padding:"0.3rem 0.75rem",color:user?"var(--green)":"var(--muted)",fontWeight:600,fontSize:"0.78rem",gap:6}}>
            <span>👤</span>
            <span>{user?`+66${user.phone.slice(-8)}`:"Sign in"}</span>
          </button>
        </div>
        {/* Row 2: location */}
        <div style={{display:"flex",alignItems:"center",padding:"0 1rem 0.55rem",gap:5}}>
          <span style={{fontSize:"0.85rem"}}>📍</span>
          <span style={{fontSize:"0.77rem",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{branchObj?`${branchObj.name}, ${branchObj.addr}`:""}</span>
          <button onClick={()=>{setBranch(null);setPage("branch");}} style={{background:"none",border:"none",color:"var(--green)",fontWeight:700,fontSize:"0.76rem",flexShrink:0}}>Change</button>
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div ref={menuScrollRef} style={{flex:1,overflowY:"auto",scrollbarWidth:"none"}}>
        <HeroBanner/>

        {/* SEARCH */}
        <div style={{background:"#fff",padding:"0.75rem 1rem",borderBottom:"1px solid var(--border)",position:"sticky",top:0,zIndex:80}}>
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:"0.75rem",top:"50%",transform:"translateY(-50%)",fontSize:"0.9rem",pointerEvents:"none"}}>🔍</span>
            <input
              value={search}
              onChange={e=>setSearch(e.target.value)}
              onFocus={()=>setSearchFocus(true)}
              onBlur={()=>setTimeout(()=>setSearchFocus(false),150)}
              placeholder="Search dishes…"
              style={{width:"100%",padding:"0.62rem 0.9rem 0.62rem 2.3rem",border:"1.5px solid "+(searchFocus?"var(--green)":"var(--border)"),borderRadius:100,fontSize:"0.87rem",outline:"none",background:"var(--bg)",color:"var(--text)",transition:"border-color .2s"}}
            />
            {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:"0.75rem",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"var(--muted)",fontSize:"1rem",cursor:"pointer"}}>✕</button>}
          </div>
          {/* Search results dropdown */}
          {search.trim().length>1&&(
            <div style={{position:"absolute",left:"1rem",right:"1rem",background:"#fff",border:"1px solid var(--border)",borderRadius:12,boxShadow:"0 6px 24px rgba(0,0,0,0.1)",zIndex:200,maxHeight:280,overflowY:"auto",marginTop:6}}>
              {searchResults.length===0
                ?<div style={{padding:"1.2rem",textAlign:"center",color:"var(--muted)",fontSize:"0.84rem"}}>No dishes found for "{search}"</div>
                :searchResults.map((item,i)=>{
                  const d=FOOD_IMGS[item.id]||FOOD_IMGS[1];
                  return(
                    <div key={i} onClick={()=>{setSearch("");setProductModal(item);}} style={{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.7rem 0.9rem",borderBottom:i<searchResults.length-1?"1px solid var(--border)":"none",cursor:"pointer"}}>
                      <div style={{width:42,height:42,borderRadius:8,background:d.bg,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{d.icon}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:600,fontSize:"0.85rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                        <div style={{fontSize:"0.7rem",color:"var(--muted)"}}>{item.section} · ฿{item.price}</div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          )}
        </div>

        {/* CATEGORY JUMP BAR */}
        <div style={{background:"#fff",borderBottom:"1px solid var(--border)",position:"sticky",top:57,zIndex:70}}>
          <div style={{display:"flex",overflowX:"auto",scrollbarWidth:"none",padding:"0 0.5rem"}}>
            {MENU_SECTIONS.map(s=>(
              <button key={s.id} onClick={()=>scrollToSection(s.id)} style={{whiteSpace:"nowrap",padding:"0.65rem 0.85rem",border:"none",borderBottom:activeSection===s.id?"2.5px solid var(--green)":"2.5px solid transparent",background:"none",color:activeSection===s.id?"var(--green)":"var(--muted)",fontWeight:activeSection===s.id?700:500,fontSize:"0.79rem",flexShrink:0,transition:"color .18s"}}>{s.label}</button>
            ))}
          </div>
        </div>

        {/* ALL MENU SECTIONS — vertical scroll */}
        <div style={{padding:"0 0.85rem 6rem"}}>
          {MENU_SECTIONS.map(sec=>(
            <div key={sec.id} ref={el=>sectionRefs.current[sec.id]=el} style={{paddingTop:"1.25rem"}}>
              <div style={{fontWeight:800,fontSize:"1rem",marginBottom:"0.85rem",color:"var(--text)"}}>{sec.label}</div>
              <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
                {sec.items.map((item,i)=>(
                  <MenuItem key={i} item={item} onOpen={()=>setProductModal(item)} inCart={cartQty(item.id)}/>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BASKET BAR — fixed so it's always visible */}
      {count>0&&(
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,padding:"0.7rem 1rem",zIndex:400,pointerEvents:"all"}}>
          <button onClick={()=>setPage("basket")} style={{width:"100%",background:"var(--green)",color:"#fff",border:"none",borderRadius:100,padding:"0.88rem 1.5rem",fontWeight:700,fontSize:"0.95rem",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 4px 24px rgba(27,94,22,0.5)"}}>
            <span style={{background:"rgba(255,255,255,0.22)",borderRadius:"50%",width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.72rem",fontWeight:800}}>{count}</span>
            <span>View Basket</span>
            <span>฿{subtotal.toLocaleString()}</span>
          </button>
        </div>
      )}
    </div>
  );
}
