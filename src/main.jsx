import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Heart, Play, Pause, RotateCcw, Minus, Plus, Settings2, Maximize, Clock3, Trophy } from "lucide-react";
import "./styles.css";

const fmt = (n) => `${Math.floor(n / 60).toString().padStart(2, "0")}:${(n % 60).toString().padStart(2, "0")}`;

function App() {
  const [lula, setLula] = useState(0);
  const [bolsonaro, setBolsonaro] = useState(0);
  const [seconds, setSeconds] = useState(300);
  const [running, setRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [redPoints, setRedPoints] = useState(1);
  const [whitePoints, setWhitePoints] = useState(1);
  const [target, setTarget] = useState(0);
  const [history, setHistory] = useState([]);
  const total = lula + bolsonaro;
  const leader = lula === bolsonaro ? "Empate" : lula > bolsonaro ? "Lula na frente" : "Bolsonaro na frente";
  const diff = Math.abs(lula - bolsonaro);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setSeconds(s => {
      if (s <= 1) { setRunning(false); return 0; }
      return s - 1;
    }), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  function add(side, amount, label) {
    if (side === "lula") setLula(v => Math.max(0, v + amount));
    else setBolsonaro(v => Math.max(0, v + amount));
    if (amount > 0) {
      setHistory(h => [{ id: Date.now(), side, amount, label }, ...h].slice(0, 5));
      if (navigator.vibrate) navigator.vibrate(25);
    }
  }
  function reset() {
    if (!confirm("Zerar placar e reiniciar o cronômetro?")) return;
    setLula(0); setBolsonaro(0); setSeconds(300); setRunning(false); setHistory([]);
  }
  async function fullscreen() {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
      else await document.exitFullscreen?.();
    } catch {}
  }

  return <main className="app">
    <header className="topbar">
      <div className="brand-mark">🌹</div>
      <div className="brand-copy"><strong>DUELO LIVE</strong><span>PLACAR INTERATIVO</span></div>
      <button className="icon-button" onClick={() => setShowSettings(v => !v)} aria-label="Configurações"><Settings2 size={20}/></button>
      <button className="icon-button" onClick={fullscreen} aria-label="Tela cheia"><Maximize size={19}/></button>
    </header>

    <section className="versus">
      <div className="versus-side red-side">
        <div className="rose">🌹</div>
        <span className="side-label">ROSA VERMELHA</span>
        <h2>LULA</h2>
        <div className="score">{lula}</div>
        <small>{lula === 1 ? "ponto" : "pontos"}</small>
      </div>
      <div className="versus-center"><span>VS</span><div className="bolt">⚡</div></div>
      <div className="versus-side white-side">
        <div className="rose">🤍🌹</div>
        <span className="side-label">ROSA BRANCA</span>
        <h2>BOLSONARO</h2>
        <div className="score">{bolsonaro}</div>
        <small>{bolsonaro === 1 ? "ponto" : "pontos"}</small>
      </div>
    </section>

    <section className="status-row">
      <div><span className="mini-label">TOTAL DE PONTOS</span><strong>{total}</strong></div>
      <div className="status-divider"/>
      <div><span className="mini-label">DIFERENÇA</span><strong>{diff}</strong></div>
      <div className={`leader-pill ${lula === bolsonaro ? "tie" : lula > bolsonaro ? "red-pill" : "blue-pill"}`}>{leader.toUpperCase()}</div>
    </section>

    <section className="timer-card">
      <div className="timer-title"><Clock3 size={17}/> TEMPO DE LIVE</div>
      <div className={`timer ${seconds === 0 ? "finished" : ""}`}>{fmt(seconds)}</div>
      <div className="timer-actions">
        <button className="primary-button" onClick={() => setRunning(v => !v)} disabled={seconds === 0}>
          {running ? <Pause size={17} fill="currentColor"/> : <Play size={17} fill="currentColor"/>}{running ? "Pausar" : "Iniciar"}
        </button>
        <button className="secondary-button" onClick={() => { setRunning(false); setSeconds(300); }}>5 min</button>
        <button className="secondary-button" onClick={() => { setRunning(false); setSeconds(600); }}>10 min</button>
      </div>
    </section>

    {showSettings && <section className="settings-card">
      <h3><Settings2 size={17}/> Configurar pontos por rosa</h3>
      <div className="setting-line"><label>🌹 Rosa vermelha → Lula</label><div className="stepper"><button onClick={() => setRedPoints(v => Math.max(1, v-1))}>−</button><b>{redPoints}</b><button onClick={() => setRedPoints(v => Math.min(99, v+1))}>+</button></div></div>
      <div className="setting-line"><label>🤍 Rosa branca → Bolsonaro</label><div className="stepper"><button onClick={() => setWhitePoints(v => Math.max(1, v-1))}>−</button><b>{whitePoints}</b><button onClick={() => setWhitePoints(v => Math.min(99, v+1))}>+</button></div></div>
      <p>O placar é manual: quando aparecer um presente na live, toque no botão correspondente.</p>
    </section>}

    <section className="gift-actions">
      <div className="section-heading"><span>REGISTRAR PRESENTE</span><small>Toque quando chegar uma rosa</small></div>
      <button className="gift-button red-gift" onClick={() => add("lula", redPoints, "Rosa vermelha")}>
        <span className="gift-emoji">🌹</span><span className="gift-text"><b>ROSA VERMELHA</b><small>+{redPoints} {redPoints === 1 ? "ponto" : "pontos"} para Lula</small></span><span className="add-circle"><Plus size={22}/></span>
      </button>
      <button className="gift-button white-gift" onClick={() => add("bolsonaro", whitePoints, "Rosa branca")}>
        <span className="gift-emoji">🤍🌹</span><span className="gift-text"><b>ROSA BRANCA</b><small>+{whitePoints} {whitePoints === 1 ? "ponto" : "pontos"} para Bolsonaro</small></span><span className="add-circle"><Plus size={22}/></span>
      </button>
    </section>

    <section className="manual-controls">
      <div className="section-heading"><span>AJUSTE MANUAL</span><small>Corrija se tocar errado</small></div>
      <div className="adjust-row">
        <button onClick={() => add("lula", -1)}><Minus size={15}/> Lula −1</button>
        <button onClick={() => add("lula", 1)}><Plus size={15}/> Lula +1</button>
        <button onClick={() => add("bolsonaro", -1)}><Minus size={15}/> Bolsonaro −1</button>
        <button onClick={() => add("bolsonaro", 1)}><Plus size={15}/> Bolsonaro +1</button>
      </div>
    </section>

    <section className="history-card">
      <div className="history-title"><span><Heart size={16}/> ÚLTIMOS PRESENTES</span><span className="live-dot">● AO VIVO</span></div>
      {history.length === 0 ? <div className="empty-history">Os presentes registrados aparecerão aqui.</div> : history.map(item => <div className="history-item" key={item.id}><span>{item.side === "lula" ? "🌹" : "🤍🌹"} {item.label}</span><b className={item.side === "lula" ? "red-text" : "blue-text"}>+{item.amount}</b></div>)}
    </section>

    <footer><button className="reset-button" onClick={reset}><RotateCcw size={16}/> Zerar tudo</button><p>Feito para usar pelo celular • Não precisa conectar a API do TikTok</p></footer>
  </main>;
}

createRoot(document.getElementById("root")).render(<App />);
