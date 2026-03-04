import { useState, useEffect, useCallback, useMemo } from "react";

// ═══ QUOTES DATABASE ═══
const Q = [
  {t:"Но поэзия — пресволочнейшая штуковина: существует — и ни в зуб ногой.",p:"m",s:"Юбилейное"},
  {t:"Ненавижу всяческую мертвечину! Обожаю всяческую жизнь!",p:"m",s:"Юбилейное"},
  {t:"Я хочу быть понят моей страной, а не буду понят — что ж, по родной стране пройду стороной, как проходит косой дождь.",p:"m",s:"Домой!"},
  {t:"В этой жизни помереть нетрудно — сделать жизнь значительно трудней.",p:"m",s:"Сергею Есенину"},
  {t:"Поэзия — вся! — езда в незнаемое.",p:"m",s:"Разговор с фининспектором"},
  {t:"Вот и жизнь пройдет, как прошли Азорские острова.",p:"m",s:"Мелкая философия"},
  {t:"Для веселия планета наша мало оборудована. Надо вырвать радость у грядущих дней.",p:"m",s:"Сергею Есенину"},
  {t:"Тот, кто постоянно ясен, тот, по-моему, просто глуп.",p:"m",s:"Домой!"},
  {t:"Поэзия — та же добыча радия. В грамм добыча, в год труды.",p:"m",s:"Разговор с фининспектором"},
  {t:"Я люблю вас, но живого, а не мумию.",p:"m",s:"Юбилейное"},
  {t:"Слово — полководец человечьей силы.",p:"m",s:"Сергею Есенину"},
  {t:"У меня, да и у вас, в запасе вечность. Что нам потерять часок-другой?!",p:"m",s:"Юбилейное"},
  {t:"Товарищ, верь: взойдет она, звезда пленительного счастья.",p:"p",s:"К Чаадаеву"},
  {t:"Пока свободою горим, пока сердца для чести живы, мой друг, отчизне посвятим души прекрасные порывы!",p:"p",s:"К Чаадаеву"},
  {t:"Блажен, кто знает сладострастье высоких мыслей и стихов!",p:"p",s:"Жуковскому"},
  {t:"Владыки! Вам венец и трон дает Закон — а не природа; стоите выше вы народа, но вечный выше вас Закон.",p:"p",s:"Вольность"},
  {t:"Его стихов пленительная сладость пройдет веков завистливую даль.",p:"p",s:"К портрету Жуковского"},
  {t:"Давайте пить и веселиться, давайте жизнию играть.",p:"p",s:"Добрый совет"},
  {t:"Любовь и тайная свобода внушали сердцу гимн простой.",p:"p",s:"К Н. Я. Плюсковой"},
  {t:"И неподкупный голос мой был эхо русского народа.",p:"p",s:"К Н. Я. Плюсковой"},
  {t:"Россия вспрянет ото сна, и на обломках самовластья напишут наши имена!",p:"p",s:"К Чаадаеву"},
  {t:"Кто раз любил, уж не полюбит вновь; кто счастье знал, уж не узнает счастья.",p:"p",s:"К ***"},
  {t:"Каждый пред Богом наг. Жалок, наг и убог.",p:"b",s:"Стихи под эпиграфом"},
  {t:"В каждой музыке Бах, в каждом из нас Бог.",p:"b",s:"Стихи под эпиграфом"},
  {t:"Переживи всех. Переживи вновь, словно они — снег, пляшущий снег снов.",p:"b",s:"Сонет"},
  {t:"Что из того, что мы не победили, что из того, что не вернулись мы?..",p:"b",s:"И вечный бой..."},
  {t:"А мы хотели просто уцелеть.",p:"b",s:"И вечный бой..."},
  {t:"Смерть — это только равнины. Жизнь — холмы, холмы.",p:"b",s:"Холмы"},
  {t:"С каждым днем я прожитым дышу уверенней и сладостней и чище.",p:"b",s:"Как Улисс"},
  {t:"Да будет мужественен твой путь, да будет он прям и прост.",p:"b",s:"Прощай, позабудь..."},
  {t:"Служи свое, опальная душа, короткие дела не совершая.",p:"b",s:"Зачем опять..."},
  {t:"От нынешней до будущей любви живи добрей, страдай неприхотливей.",p:"b",s:"Как Улисс"},
  {t:"Если крикнет рать святая: «Кинь ты Русь, живи в раю!» Я скажу: «Не надо рая, дайте родину мою».",p:"e",s:"Гой ты, Русь, моя родная"},
  {t:"Кого жалеть? Ведь каждый в мире странник — пройдет, зайдет и вновь оставит дом.",p:"e",s:"Отговорила роща золотая"},
  {t:"Быть поэтом — это значит то же, если правды жизни не нарушить, рубцевать себя по нежной коже, кровью чувств ласкать чужие души.",p:"e",s:"Быть поэтом"},
  {t:"Спит ковыль. Равнина дорогая, и свинцовой свежести полынь. Никакая родина другая не вольет мне в грудь мою теплынь.",p:"e",s:"Спит ковыль"},
  {t:"Грустная песня, ты — русская боль.",p:"e",s:"Чёрная, потом пропахшая выть!"},
  {t:"Не бродить, не мять в кустах багряных лебеды и не искать следа.",p:"e",s:"Не бродить, не мять..."},
  {t:"Я молюсь на алы зори, причащаюсь у ручья.",p:"e",s:"Я пастух"},
  {t:"Край ты мой заброшенный, край ты мой, пустырь. Сенокос некошеный, лес да монастырь.",p:"e",s:"Край ты мой заброшенный"},
  {t:"Пахнет яблоком и медом по церквам твой кроткий Спас.",p:"e",s:"Гой ты, Русь, моя родная"},
  {t:"Я покинул родимый дом, голубую оставил Русь.",p:"e",s:"Я покинул родимый дом"},
  {t:"Нам не дано предугадать, как слово наше отзовется, — и нам сочувствие дается, как нам дается благодать.",p:"t",s:"Нам не дано предугадать"},
  {t:"День пережит — и слава Богу!",p:"t",s:"Не рассуждай, не хлопочи"},
  {t:"Есть в осени первоначальной короткая, но дивная пора — прозрачный воздух, день хрустальный, и лучезарны вечера...",p:"t",s:"Есть в осени первоначальной"},
  {t:"О, как убийственно мы любим, как в буйной слепоте страстей мы то всего вернее губим, что сердцу нашему милей!",p:"t",s:"О, как убийственно мы любим"},
  {t:"Чему бы жизнь нас ни учила, но сердце верит в чудеса.",p:"t",s:"Чему бы жизнь нас ни учила"},
  {t:"Как души смотрят с высоты на ими брошенное тело...",p:"t",s:"Она сидела на полу"},
  {t:"Две силы есть — две роковые силы: одна есть Смерть, другая — Суд людской.",p:"t",s:"Две силы есть"},
  {t:"Не рассуждай, не хлопочи!.. Безумство ищет, глупость судит.",p:"t",s:"Не рассуждай, не хлопочи"},
  {t:"Пошли, Господь, свою отраду тому, кто в летний жар и зной, как бедный нищий, мимо саду, бредет по жесткой мостовой.",p:"t",s:"Пошли, Господь, свою отраду"},
];

// ═══ POET CONFIGS ═══
const PC = {
  m:{l:"В. В. Маяковский",tf:"'Dela Gothic One',sans-serif",qf:"'Playfair Display',serif",mf:"'Dela Gothic One',sans-serif",qs:"italic",qw:400,sz:"clamp(1.2rem,3.2vw,1.8rem)",lh:1.6,ls:"0.01em",
    pl:[{bg:"#D42B2B",a:"#FFD600",t:"#FFF"},{bg:"#1A1A2E",a:"#E94560",t:"#EAEAEA"},{bg:"#0D1117",a:"#FF6B35",t:"#F0E6D3"},{bg:"#2D1B4E",a:"#F2C744",t:"#F5F0E8"},{bg:"#1C1C1C",a:"#D42B2B",t:"#F5F5F0"}]},
  p:{l:"А. С. Пушкин",tf:"'Playfair Display',serif",qf:"'Cormorant Garamond',serif",mf:"'Cormorant Garamond',serif",qs:"normal",qw:400,sz:"clamp(1.15rem,2.8vw,1.65rem)",lh:1.85,ls:"0.02em",
    pl:[{bg:"#1B2A1B",a:"#D4A843",t:"#F5F0E0"},{bg:"#2C1810",a:"#C9956B",t:"#F5EDE3"},{bg:"#1E1E2E",a:"#C8AA6E",t:"#F0EBE0"},{bg:"#252015",a:"#D4A843",t:"#F5F0E0"}]},
  b:{l:"И. А. Бродский",tf:"'IBM Plex Mono',monospace",qf:"'IBM Plex Mono',monospace",mf:"'IBM Plex Mono',monospace",qs:"normal",qw:300,sz:"clamp(0.95rem,2.4vw,1.35rem)",lh:1.95,ls:"0.03em",
    pl:[{bg:"#0C0C14",a:"#6A7B99",t:"#C8CCD8"},{bg:"#10141C",a:"#7888A0",t:"#BCC4D4"},{bg:"#0E0E18",a:"#5C6E8A",t:"#B8C0D0"},{bg:"#12121E",a:"#8090A8",t:"#C4CCD8"}]},
  e:{l:"С. А. Есенин",tf:"'Lora',serif",qf:"'Lora',serif",mf:"'Cormorant Garamond',serif",qs:"italic",qw:400,sz:"clamp(1.1rem,2.8vw,1.55rem)",lh:1.8,ls:"0.015em",
    pl:[{bg:"#1E1A10",a:"#C8A96E",t:"#F0E8D4"},{bg:"#1A2E1A",a:"#A4BE7B",t:"#ECF0DC"},{bg:"#2E2418",a:"#D4A843",t:"#F5EDE0"},{bg:"#1C2820",a:"#B5A67D",t:"#EDE8DA"}]},
  t:{l:"Ф. И. Тютчев",tf:"'Cormorant Garamond',serif",qf:"'Cormorant Garamond',serif",mf:"'Cormorant Garamond',serif",qs:"normal",qw:300,sz:"clamp(1.15rem,3vw,1.65rem)",lh:1.85,ls:"0.025em",
    pl:[{bg:"#06080F",a:"#4A6A9D",t:"#C8D4E8"},{bg:"#08060F",a:"#6A5A9D",t:"#D0C8E8"},{bg:"#060A10",a:"#4A7A8D",t:"#C8DCE8"},{bg:"#0A0810",a:"#5A6AAD",t:"#CCD0E8"}]},
};

// ═══ DECORATIONS ═══

// --- МАЯКОВСКИЙ: конструктивизм, лесенка, плакат, геометрия ---
function MayaD({a}){
  const shapes = useMemo(()=>Array.from({length:8},()=>({
    x:Math.random()*100, y:Math.random()*100,
    sz:Math.random()*40+15, rot:Math.random()*360,
    type:Math.floor(Math.random()*3), // 0=triangle, 1=rect, 2=diamond
    op:Math.random()*0.06+0.02, dur:Math.random()*30+20, del:Math.random()*5,
  })),[]);
  const stairs = useMemo(()=>Array.from({length:5},(_,i)=>({
    y:15+i*16, w:20+Math.random()*30, fromRight:Math.random()>0.5,
  })),[]);
  const slashes = useMemo(()=>Array.from({length:3},()=>({
    x:Math.random()*80+10, y:Math.random()*80+10,
    len:Math.random()*120+60, rot:-35+Math.random()*20,
    op:Math.random()*0.06+0.03,
  })),[]);
  return <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
    {/* corner brackets */}
    <div style={{position:"absolute",top:16,left:16,width:36,height:36,opacity:0.2,borderTop:"3px solid "+a,borderLeft:"3px solid "+a}}/>
    <div style={{position:"absolute",top:16,right:16,width:36,height:36,opacity:0.2,borderTop:"3px solid "+a,borderRight:"3px solid "+a}}/>
    <div style={{position:"absolute",bottom:16,left:16,width:36,height:36,opacity:0.2,borderBottom:"3px solid "+a,borderLeft:"3px solid "+a}}/>
    <div style={{position:"absolute",bottom:16,right:16,width:36,height:36,opacity:0.2,borderBottom:"3px solid "+a,borderRight:"3px solid "+a}}/>
    {/* лесенка-ступеньки */}
    {stairs.map((s,i)=><div key={"st"+i} style={{position:"absolute",top:s.y+"%",
      [s.fromRight?"right":"left"]:0, width:s.w+"%",height:3,background:a,opacity:0.04}}/>)}
    {/* diagonal slashes */}
    {slashes.map((s,i)=><div key={"sl"+i} style={{position:"absolute",left:s.x+"%",top:s.y+"%",
      width:s.len,height:2,background:a,opacity:s.op,transform:"rotate("+s.rot+"deg)",transformOrigin:"left center"}}/>)}
    {/* floating geometric shapes */}
    {shapes.map((s,i)=><div key={"sh"+i} style={{position:"absolute",left:s.x+"%",top:s.y+"%",
      width:s.type===0?0:s.sz, height:s.type===0?0:s.type===2?s.sz:s.sz*0.6,
      borderLeft:s.type===0?s.sz/2+"px solid transparent":undefined,
      borderRight:s.type===0?s.sz/2+"px solid transparent":undefined,
      borderBottom:s.type===0?s.sz*0.8+"px solid "+a:undefined,
      background:s.type!==0?a:undefined,
      opacity:s.op, transform:"rotate("+s.rot+"deg)",
      animation:"drift "+s.dur+"s ease-in-out "+s.del+"s infinite",
    }}/>)}
    {/* bold left accent bar */}
    <div style={{position:"absolute",left:0,top:"25%",bottom:"25%",width:5,background:a,opacity:0.1}}/>
    {/* random exclamation marks — Маяковский! */}
    {[0,1,2].map(i=><div key={"ex"+i} style={{position:"absolute",
      right:8+Math.random()*20+"%", top:10+i*30+Math.random()*10+"%",
      fontSize:Math.random()*20+14, fontFamily:"'Dela Gothic One',sans-serif",
      color:a, opacity:0.04+Math.random()*0.03, transform:"rotate("+(Math.random()*30-15)+"deg)",
    }}>!</div>)}
  </div>;
}

// --- ПУШКИН: перо, росчерки, классические орнаменты ---
function PushD({a}){
  const ornaments = useMemo(()=>{
    const syms = ["\u2766","\u2767","\u2619","\u2735","\u273B","\u2726","\u2727"];
    return Array.from({length:6},()=>({
      sym:syms[Math.floor(Math.random()*syms.length)],
      x:Math.random()*80+10, y:Math.random()*80+10,
      sz:Math.random()*14+10, op:Math.random()*0.06+0.03,
      rot:Math.random()*40-20,
    }));
  },[]);
  const quillStrokes = useMemo(()=>Array.from({length:4},()=>({
    x:Math.random()*70+15, y:Math.random()*70+15,
    w:Math.random()*80+40, curve:Math.random()*20-10,
    op:Math.random()*0.04+0.02,
  })),[]);
  const r=<div style={{display:"flex",gap:24,opacity:0.08,color:a,fontSize:14,fontFamily:"serif"}}>
    <span>{"\u2666"}</span><span>{"\u2014"}</span><span>{"\u2735"}</span><span>{"\u2014"}</span><span>{"\u2666"}</span>
  </div>;
  return <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
    <div style={{position:"absolute",top:40,left:"50%",transform:"translateX(-50%)"}}>{r}</div>
    <div style={{position:"absolute",bottom:40,left:"50%",transform:"translateX(-50%)"}}>{r}</div>
    {/* side gilded lines */}
    <div style={{position:"absolute",left:24,top:"18%",bottom:"18%",width:1,background:"linear-gradient(transparent,"+a+"44,"+a+"44,transparent)"}}/>
    <div style={{position:"absolute",right:24,top:"18%",bottom:"18%",width:1,background:"linear-gradient(transparent,"+a+"44,"+a+"44,transparent)"}}/>
    {/* scattered classical ornaments */}
    {ornaments.map((o,i)=><div key={"orn"+i} style={{position:"absolute",left:o.x+"%",top:o.y+"%",
      fontSize:o.sz,color:a,opacity:o.op,fontFamily:"serif",
      transform:"rotate("+o.rot+"deg)",
      animation:"subtleBreathe "+(4+Math.random()*3)+"s ease-in-out "+(Math.random()*3)+"s infinite",
    }}>{o.sym}</div>)}
    {/* quill-like curved strokes */}
    {quillStrokes.map((s,i)=><svg key={"qs"+i} style={{position:"absolute",left:s.x+"%",top:s.y+"%",overflow:"visible",opacity:s.op}}
      width={s.w} height="20">
      <path d={`M0,10 Q${s.w/2},${10+s.curve} ${s.w},10`} stroke={a} fill="none" strokeWidth="0.8"/>
    </svg>)}
    {/* subtle golden glow */}
    <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
      width:"40vmin",height:"40vmin",borderRadius:"50%",
      background:"radial-gradient(circle,"+a+"06 0%,transparent 70%)"}}/>
  </div>;
}

// --- БРОДСКИЙ: пишущая машинка, нумерация строк, зачёркивания ---
function BrodD({a}){
  const lineNums = useMemo(()=>Array.from({length:12},(_,i)=>({
    y:8+i*7.5, num:Math.floor(Math.random()*200)+1, op:Math.random()*0.06+0.02,
  })),[]);
  const redactions = useMemo(()=>Array.from({length:3},()=>({
    x:15+Math.random()*60, y:Math.random()*80+10,
    w:Math.random()*60+30, op:Math.random()*0.04+0.02,
  })),[]);
  const footnotes = useMemo(()=>Array.from({length:2},(_,i)=>({
    x:Math.random()*60+20, y:75+i*10+Math.random()*5,
    mark:Math.floor(Math.random()*9)+1,
  })),[]);
  const typoChars = useMemo(()=>{
    const chars = "абвгдежзиклмнопрстуфхцчшщэюя".split("");
    return Array.from({length:5},()=>({
      ch:chars[Math.floor(Math.random()*chars.length)],
      x:Math.random()*90+5, y:Math.random()*90+5,
      op:Math.random()*0.03+0.01, sz:Math.random()*10+8,
    }));
  },[]);
  return <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
    {/* horizontal ruled lines */}
    {[20,30,40,50,60,70,80].map((y,i)=><div key={"rl"+i} style={{position:"absolute",left:"8%",right:"8%",top:y+"%",height:1,background:a,opacity:0.025}}/>)}
    {/* left margin line */}
    <div style={{position:"absolute",left:"10%",top:"10%",bottom:"10%",width:1,background:a,opacity:0.06}}/>
    {/* line numbers */}
    {lineNums.map((l,i)=><div key={"ln"+i} style={{position:"absolute",left:"5%",top:l.y+"%",
      fontFamily:"'IBM Plex Mono',monospace",fontSize:8,color:a,opacity:l.op,letterSpacing:1,
    }}>{String(l.num).padStart(3,"\u2007")}</div>)}
    {/* redacted bars — зачёркивания */}
    {redactions.map((r,i)=><div key={"rd"+i} style={{position:"absolute",left:r.x+"%",top:r.y+"%",
      width:r.w,height:2,background:a,opacity:r.op}}/>)}
    {/* footnote markers */}
    {footnotes.map((f,i)=><div key={"fn"+i} style={{position:"absolute",left:f.x+"%",top:f.y+"%",
      fontFamily:"'IBM Plex Mono',monospace",fontSize:7,color:a,opacity:0.05,
    }}>{f.mark})</div>)}
    {/* ghost letters — typewriter residue */}
    {typoChars.map((t,i)=><div key={"tc"+i} style={{position:"absolute",left:t.x+"%",top:t.y+"%",
      fontFamily:"'IBM Plex Mono',monospace",fontSize:t.sz,color:a,opacity:t.op,
    }}>{t.ch}</div>)}
    {/* asterisks */}
    <div style={{position:"absolute",top:44,right:32,fontSize:10,opacity:0.08,color:a,fontFamily:"monospace",letterSpacing:4}}>* * *</div>
    {/* blinking cursor */}
    <div style={{position:"absolute",bottom:"18%",right:"15%",width:8,height:2,background:a,opacity:0.1,
      animation:"twinkle 1s step-end infinite"}}/>
  </div>;
}

// --- ЕСЕНИН: берёзы, листья, колосья, природа ---
function EsenD({a}){
  const leaves = useMemo(()=>Array.from({length:8},()=>({
    x:Math.random()*100, y:Math.random()*100,
    sz:Math.random()*12+6, rot:Math.random()*360,
    op:Math.random()*0.06+0.02, dur:Math.random()*20+15, del:Math.random()*8,
    drift:Math.random()*60-30,
  })),[]);
  const birchMarks = useMemo(()=>Array.from({length:5},()=>({
    x:Math.random()>0.5 ? Math.random()*15 : 85+Math.random()*15,
    y:Math.random()*70+15, w:Math.random()*3+1, h:Math.random()*15+5, op:Math.random()*0.04+0.01,
  })),[]);
  const ripples = useMemo(()=>Array.from({length:3},()=>({
    x:Math.random()*80+10, y:60+Math.random()*30,
    sz:Math.random()*80+40, op:Math.random()*0.03+0.01,
  })),[]);
  return <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
    {/* warm diffuse glow */}
    <div style={{position:"absolute",top:"35%",left:"50%",transform:"translate(-50%,-50%)",
      width:"130vw",height:"130vh",borderRadius:"50%",
      background:"radial-gradient(ellipse,"+a+"0A 0%,transparent 60%)"}}/>
    {/* horizon line */}
    <div style={{position:"absolute",bottom:"25%",left:"10%",right:"10%",height:1,
      background:"linear-gradient(90deg,transparent,"+a+"25,"+a+"30,"+a+"25,transparent)"}}/>
    {/* floating leaves */}
    {leaves.map((l,i)=><svg key={"lf"+i} style={{position:"absolute",left:l.x+"%",top:l.y+"%",
      opacity:l.op, animation:"leafFall "+l.dur+"s ease-in-out "+l.del+"s infinite",
      transform:"rotate("+l.rot+"deg)"}} width={l.sz} height={l.sz*1.4} viewBox="0 0 20 28">
      <path d="M10,0 Q18,10 10,28 Q2,10 10,0 Z" fill={a} opacity="0.6"/>
      <path d="M10,2 L10,24" stroke={a} strokeWidth="0.5" opacity="0.4"/>
    </svg>)}
    {/* birch bark marks on sides */}
    {birchMarks.map((b,i)=><div key={"bk"+i} style={{position:"absolute",left:b.x+"%",top:b.y+"%",
      width:b.w,height:b.h,background:a,opacity:b.op,borderRadius:1}}/>)}
    {/* water ripples */}
    {ripples.map((r,i)=><div key={"rp"+i} style={{position:"absolute",left:r.x+"%",top:r.y+"%",
      width:r.sz,height:r.sz*0.3,borderRadius:"50%",
      border:"1px solid "+a,opacity:r.op,transform:"translateX(-50%)"}}/>)}
    {/* grain/wheat accent */}
    <div style={{position:"absolute",bottom:"12%",right:"8%",fontSize:18,color:a,opacity:0.04,
      fontFamily:"serif",transform:"rotate(-10deg)"}}>{"~"}</div>
  </div>;
}

// --- ТЮТЧЕВ: космос, созвездия, лунные фазы, вечность ---
function TyutD({a}){
  const stars=useMemo(()=>Array.from({length:50},()=>({
    x:Math.random()*100, y:Math.random()*100,
    sz:Math.random()*1.8+0.4, op:Math.random()*0.2+0.03,
    dur:Math.random()*4+3, del:Math.random()*5,
  })),[]);
  // constellation lines connecting some stars
  const constellations=useMemo(()=>{
    const pts=Array.from({length:6},()=>({x:20+Math.random()*60,y:10+Math.random()*40}));
    const lines=[];
    for(let i=0;i<pts.length-1;i++){
      if(Math.random()>0.3) lines.push({x1:pts[i].x,y1:pts[i].y,x2:pts[i+1].x,y2:pts[i+1].y});
    }
    return lines;
  },[]);
  const moonPhase=useMemo(()=>Math.floor(Math.random()*4),[]);  // 0-3
  const nebulae=useMemo(()=>Array.from({length:2},()=>({
    x:Math.random()*80+10, y:Math.random()*60+10,
    sz:Math.random()*30+20, hue:Math.random()>0.5?"blue":"purple",
  })),[]);
  return <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
    {/* deep space glow */}
    <div style={{position:"absolute",top:"20%",left:"60%",width:"50vw",height:"50vh",borderRadius:"50%",
      background:"radial-gradient(ellipse,"+a+"0A 0%,transparent 60%)",transform:"translate(-50%,-50%)"}}/>
    {/* nebula clouds */}
    {nebulae.map((n,i)=><div key={"nb"+i} style={{position:"absolute",left:n.x+"%",top:n.y+"%",
      width:n.sz+"vmin",height:n.sz*0.6+"vmin",borderRadius:"50%",
      background:"radial-gradient(ellipse,"+a+"06 0%,transparent 70%)",
      transform:"rotate("+(Math.random()*40-20)+"deg)",animation:"drift 40s ease-in-out infinite"}}/>)}
    {/* stars */}
    {stars.map((s,i)=><div key={"st"+i} style={{position:"absolute",borderRadius:"50%",background:"#FFF",
      left:s.x+"%",top:s.y+"%",width:s.sz,height:s.sz,opacity:s.op,
      animation:"twinkle "+s.dur+"s ease-in-out "+s.del+"s infinite alternate"}}/>)}
    {/* constellation lines */}
    <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",overflow:"visible"}}>
      {constellations.map((c,i)=><line key={"cl"+i} x1={c.x1+"%"} y1={c.y1+"%"} x2={c.x2+"%"} y2={c.y2+"%"}
        stroke={a} strokeWidth="0.5" opacity="0.06"/>)}
    </svg>
    {/* moon phase */}
    <div style={{position:"absolute",top:"8%",right:"10%"}}>
      <svg width="24" height="24" viewBox="0 0 24 24" style={{opacity:0.08}}>
        <circle cx="12" cy="12" r="10" fill={moonPhase===0?"none":a} stroke={a} strokeWidth="0.5"/>
        {moonPhase===1&&<circle cx="8" cy="12" r="10" fill={stars[0]?"#000":"#050505"}/>}
        {moonPhase===2&&<rect x="12" y="2" width="10" height="20" fill="#000" opacity="0.9"/>}
        {moonPhase===3&&<circle cx="16" cy="12" r="10" fill="#000" opacity="0.9"/>}
      </svg>
    </div>
    {/* infinity symbol — вечность */}
    <div style={{position:"absolute",bottom:"10%",left:"50%",transform:"translateX(-50%)",
      fontSize:20,color:a,opacity:0.04,fontFamily:"serif"}}>{"\u221E"}</div>
  </div>;
}

const DM={m:MayaD,p:PushD,b:BrodD,e:EsenD,t:TyutD};

function Pts({pid,a}){
  const items=useMemo(()=>{const n=pid==="t"?0:pid==="b"?6:12;return Array.from({length:n},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,sz:pid==="m"?Math.random()*3+1.5:Math.random()*2.5+1,dur:Math.random()*25+12,del:Math.random()*8,op:pid==="m"?Math.random()*0.12+0.04:Math.random()*0.08+0.02}))},[pid]);
  if(!items.length)return null;
  return <>{items.map(p=><div key={p.id} style={{position:"absolute",pointerEvents:"none",left:p.x+"%",top:p.y+"%",width:pid==="b"?p.sz*3:p.sz,height:pid==="b"?1:p.sz,backgroundColor:a,opacity:p.op,animation:"drift "+p.dur+"s ease-in-out "+p.del+"s infinite",borderRadius:pid==="m"?"0":"50%",transform:pid==="m"?"rotate(45deg)":undefined}}/>)}</>;
}

// ═══ DAILY QUOTE LOGIC ═══
const STORAGE_KEY = "strokhu_daily";

function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function getSavedQuote() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.date === getTodayString()) return data;
    return null;
  } catch { return null; }
}

function saveQuote(quoteIndex, paletteIndex) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      date: getTodayString(),
      qi: quoteIndex,
      pi: paletteIndex,
    }));
  } catch {}
}

function pickRandom() {
  const qi = Math.floor(Math.random() * Q.length);
  const poet = PC[Q[qi].p];
  const pi = Math.floor(Math.random() * poet.pl.length);
  return { qi, pi };
}

// ═══ GLOBAL STYLES ═══
const globalCSS = `
  @keyframes twinkle {
    0% { opacity: 0.03; }
    100% { opacity: 0.18; }
  }
  @keyframes drift {
    0%, 100% { transform: translate(0, 0); }
    33% { transform: translate(8px, -12px); }
    66% { transform: translate(-6px, 8px); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.03); }
    50% { box-shadow: 0 0 40px rgba(255,255,255,0.06); }
  }
  @keyframes subtleBreathe {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.7; }
  }
  @keyframes leafFall {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(8px) rotate(15deg) translateX(5px); }
    50% { transform: translateY(16px) rotate(-5deg) translateX(-3px); }
    75% { transform: translateY(8px) rotate(10deg) translateX(4px); }
  }
  @keyframes bgTransition {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes quoteReveal {
    from { opacity: 0; transform: translateY(20px); filter: blur(4px); }
    to { opacity: 1; transform: translateY(0); filter: blur(0); }
  }
  @keyframes metaReveal {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes homeExit {
    to { opacity: 0; transform: scale(0.96); filter: blur(6px); }
  }
`;

// ═══ HOME SCREEN ═══
function HomeScreen({ onRequest, alreadyUsed, savedQuote }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "#050505", color: "#e8e8e8",
      fontFamily: "'Cormorant Garamond', serif",
    }}>
      {/* subtle background ornament */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "60vmin", height: "60vmin", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.015) 0%, transparent 70%)",
        pointerEvents: "none",
      }}/>

      <div style={{
        textAlign: "center", zIndex: 1,
        animation: "fadeInUp 1s ease-out",
      }}>
        {/* top ornament */}
        <div style={{
          fontSize: 14, letterSpacing: 12, opacity: 0.15,
          marginBottom: 40, color: "#aaa",
        }}>
          {"  \u2022  "}
        </div>

        <h1 style={{
          fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
          fontWeight: 300,
          letterSpacing: "0.08em",
          lineHeight: 1.4,
          marginBottom: 12,
          color: "#d4d0c8",
        }}>
          Строчку, будьте добры
        </h1>

        <p style={{
          fontSize: "clamp(0.85rem, 2vw, 1.05rem)",
          fontWeight: 300,
          opacity: 0.3,
          letterSpacing: "0.04em",
          marginBottom: 60,
          fontStyle: "italic",
        }}>
          одна цитата — один день
        </p>

        {alreadyUsed ? (
          <div style={{ animation: "fadeIn 0.6s ease-out" }}>
            <button
              onClick={() => onRequest(savedQuote)}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                background: "none",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#b0a890",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                fontWeight: 400,
                fontStyle: "italic",
                padding: "16px 44px",
                borderRadius: 2,
                cursor: "pointer",
                letterSpacing: "0.05em",
                transition: "all 0.3s ease",
                opacity: hovered ? 0.9 : 0.6,
              }}
            >
              вспомнить сегодняшнюю
            </button>
            <p style={{
              marginTop: 24,
              fontSize: "0.8rem",
              opacity: 0.2,
              fontStyle: "italic",
            }}>
              приходите завтра за новой строчкой
            </p>
          </div>
        ) : (
          <button
            onClick={() => onRequest(null)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255," + (hovered ? "0.25" : "0.12") + ")",
              color: hovered ? "#fff" : "#d4d0c8",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
              fontWeight: 400,
              padding: "18px 52px",
              borderRadius: 2,
              cursor: "pointer",
              letterSpacing: "0.06em",
              transition: "all 0.4s ease",
              animation: "pulseGlow 4s ease-in-out infinite",
            }}
          >
            строчку, будьте добры
          </button>
        )}

        {/* bottom ornament */}
        <div style={{
          fontSize: 14, letterSpacing: 12, opacity: 0.15,
          marginTop: 60, color: "#aaa",
        }}>
          {"  \u2022  "}
        </div>
      </div>
    </div>
  );
}

// ═══ QUOTE SCREEN ═══
function QuoteScreen({ quote, poet, palette, onBack }) {
  const D = DM[quote.p];

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: palette.bg,
      color: palette.t,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      animation: "bgTransition 0.8s ease-out",
      overflow: "hidden",
    }}>
      {/* poet-specific decorations */}
      {D && <D a={palette.a} />}
      <Pts pid={quote.p} a={palette.a} />

      {/* content */}
      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 680, width: "90%",
        padding: "40px 24px",
        textAlign: "center",
      }}>
        {/* poet name */}
        <div style={{
          fontFamily: poet.tf,
          fontSize: quote.p === "m" ? "clamp(0.7rem, 2vw, 0.9rem)" : "clamp(0.8rem, 2.2vw, 1rem)",
          fontWeight: quote.p === "b" ? 300 : 400,
          letterSpacing: quote.p === "m" ? "0.2em" : quote.p === "b" ? "0.15em" : "0.1em",
          textTransform: quote.p === "m" ? "uppercase" : "none",
          color: palette.a,
          opacity: 0.85,
          marginBottom: quote.p === "b" ? 40 : 32,
          animation: "metaReveal 0.8s ease-out 0.2s both",
        }}>
          {poet.l}
        </div>

        {/* the quote */}
        <blockquote style={{
          fontFamily: poet.qf,
          fontSize: poet.sz,
          fontWeight: poet.qw,
          fontStyle: poet.qs,
          lineHeight: poet.lh,
          letterSpacing: poet.ls,
          color: palette.t,
          margin: 0,
          padding: 0,
          animation: "quoteReveal 1s ease-out 0.5s both",
        }}>
          {quote.p === "m" && <span style={{ color: palette.a, opacity: 0.5, marginRight: 8 }}>{"\u00AB"}</span>}
          {quote.t}
          {quote.p === "m" && <span style={{ color: palette.a, opacity: 0.5, marginLeft: 8 }}>{"\u00BB"}</span>}
        </blockquote>

        {/* source */}
        <div style={{
          fontFamily: poet.mf,
          fontSize: "clamp(0.7rem, 1.8vw, 0.85rem)",
          fontWeight: 300,
          fontStyle: quote.p === "e" ? "italic" : "normal",
          color: palette.a,
          opacity: 0.45,
          marginTop: quote.p === "b" ? 40 : 28,
          letterSpacing: quote.p === "b" ? "0.08em" : "0.04em",
          animation: "metaReveal 0.8s ease-out 0.9s both",
        }}>
          {quote.p === "b" ? `// ${quote.s}` : `\u2014 ${quote.s}`}
        </div>
      </div>

      {/* back button */}
      <button
        onClick={onBack}
        style={{
          position: "absolute",
          bottom: 32,
          background: "none",
          border: "none",
          color: palette.a,
          opacity: 0.25,
          fontFamily: poet.mf,
          fontSize: "0.75rem",
          letterSpacing: "0.08em",
          cursor: "pointer",
          padding: "8px 16px",
          transition: "opacity 0.3s",
          animation: "fadeIn 1s ease-out 1.2s both",
          zIndex: 10,
        }}
        onMouseEnter={e => e.target.style.opacity = 0.5}
        onMouseLeave={e => e.target.style.opacity = 0.25}
      >
        {"\u2190"}
      </button>
    </div>
  );
}

// ═══ MAIN APP ═══
export default function App() {
  const [screen, setScreen] = useState("home"); // "home" | "quote"
  const [currentQuote, setCurrentQuote] = useState(null);
  const [exiting, setExiting] = useState(false);

  const saved = useMemo(() => getSavedQuote(), []);
  const alreadyUsed = saved !== null;

  const handleRequest = useCallback((savedData) => {
    let qi, pi;

    if (savedData) {
      // re-show today's quote
      qi = savedData.qi;
      pi = savedData.pi;
    } else {
      // pick new
      const pick = pickRandom();
      qi = pick.qi;
      pi = pick.pi;
      saveQuote(qi, pi);
    }

    const quote = Q[qi];
    const poet = PC[quote.p];
    const palette = poet.pl[pi % poet.pl.length];

    setCurrentQuote({ quote, poet, palette });

    // animate out home, then show quote
    setExiting(true);
    setTimeout(() => {
      setScreen("quote");
      setExiting(false);
    }, 500);
  }, []);

  const handleBack = useCallback(() => {
    setScreen("home");
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", background: "#050505" }}>
      <style>{globalCSS}</style>

      {screen === "home" && (
        <div style={{
          animation: exiting ? "homeExit 0.5s ease-in forwards" : undefined,
        }}>
          <HomeScreen
            onRequest={handleRequest}
            alreadyUsed={alreadyUsed}
            savedQuote={saved}
          />
        </div>
      )}

      {screen === "quote" && currentQuote && (
        <QuoteScreen
          quote={currentQuote.quote}
          poet={currentQuote.poet}
          palette={currentQuote.palette}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
