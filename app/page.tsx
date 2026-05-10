"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import RSVPSection from "./components/RSVPSection";

/* ─── CONSTANTES ─────────────────────────────────── */
const WEDDING_DATE = new Date("2026-10-10T12:00:00");
const PHOTOS = [
  "https://bsjoelxktbvlavfoozhk.supabase.co/storage/v1/object/public/fotos-clientes/24d5f105-a8bb-4380-9c6a-5693be6e3574/1778295047864-4.jpg",
  "https://bsjoelxktbvlavfoozhk.supabase.co/storage/v1/object/public/fotos-clientes/24d5f105-a8bb-4380-9c6a-5693be6e3574/1778295158161-0.jpg",
  "https://bsjoelxktbvlavfoozhk.supabase.co/storage/v1/object/public/fotos-clientes/24d5f105-a8bb-4380-9c6a-5693be6e3574/1778295179657-0.jpg",
  "https://bsjoelxktbvlavfoozhk.supabase.co/storage/v1/object/public/fotos-clientes/24d5f105-a8bb-4380-9c6a-5693be6e3574/1778295190928-0.png",
  "https://bsjoelxktbvlavfoozhk.supabase.co/storage/v1/object/public/fotos-clientes/24d5f105-a8bb-4380-9c6a-5693be6e3574/1778295205989-0.jpg",
];
const WAZE_URL = "https://waze.com/ul/h9g8be6zvh";
const MAPS_URL = "https://maps.app.goo.gl/NHi1ea6x7MUjkop5A";

/* ─── COUNTDOWN ──────────────────────────────────── */
function useCountdown(target: Date) {
  const [diff, setDiff] = useState(() => target.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setDiff(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  const total = Math.max(0, diff);
  return {
    days: Math.floor(total / 86400000),
    hours: Math.floor((total % 86400000) / 3600000),
    minutes: Math.floor((total % 3600000) / 60000),
    seconds: Math.floor((total % 60000) / 1000),
  };
}

/* ─── PARTICLES ──────────────────────────────────── */
function Particles() {
  useEffect(() => {
    const container = document.getElementById("particles");
    if (!container) return;
    const particles: HTMLElement[] = [];

    if (!document.getElementById("fall-style")) {
      const style = document.createElement("style");
      style.id = "fall-style";
      style.textContent = `@keyframes fall{0%{transform:translateY(-30px) rotate(0deg);opacity:0}10%{opacity:.7}90%{opacity:.4}100%{transform:translateY(110vh) rotate(360deg);opacity:0}}`;
      document.head.appendChild(style);
    }

    const spawn = () => {
      const el = document.createElement("div");
      const isSpark = Math.random() > 0.45;
      el.className = `particle ${isSpark ? "particle--spark" : "particle--line"}`;
      el.style.left = Math.random() * 100 + "vw";
      const dur = (Math.random() * 8 + 6).toFixed(1);
      const delay = (Math.random() * 4).toFixed(1);
      el.style.animation = `fall ${dur}s linear ${delay}s infinite`;
      container.appendChild(el);
      particles.push(el);
      if (particles.length > 45) particles.shift()?.remove();
    };

    const id = setInterval(spawn, 350);
    return () => { clearInterval(id); particles.forEach(p => p.remove()); };
  }, []);

  return <div id="particles" aria-hidden />;
}

/* ─── LOADER ─────────────────────────────────────── */
function Loader({ onDone }: { onDone: () => void }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { const t = setTimeout(onDone, 2000); return () => clearTimeout(t); }, []);
  return (
    <div
      id="loader"
      onClick={onDone}
      style={{ cursor: "pointer" }}
      title="Toca para abrir"
    >
      <div className="loader-mono">C <span className="amp">&</span> B</div>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", letterSpacing: "0.5em", textTransform: "uppercase", color: "var(--beige)", opacity: 0.5 }}>
        10 · 10 · 2026
      </p>
      <div className="loader-bar" />
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--beige)", opacity: 0.25, marginTop: "8px" }}>
        toca para abrir
      </p>
    </div>
  );
}

/* ─── SECTION ANIMATION WRAPPER ──────────────────── */
function FadeSection({ children, className = "", id, style }: {
  children: React.ReactNode; className?: string; id?: string; style?: React.CSSProperties;
}) {
  return (
    <motion.section id={id} className={className} style={style}
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.section>
  );
}

/* ─── COUNTDOWN BLOCK ────────────────────────────── */
function CountBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-[family-name:var(--font-display)] text-5xl sm:text-7xl font-light leading-none" style={{ color: "var(--white)" }}>
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[9px] tracking-widest uppercase opacity-50" style={{ fontFamily: "var(--font-sans)", color: "var(--beige)" }}>
        {label}
      </span>
    </div>
  );
}

/* ─── MAIN PAGE ───────────────────────────────────── */
export default function WeddingPage() {
  const [loaded, setLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE);

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <Particles />

      <main style={{ display: loaded ? "block" : "none" }}>

        {/* ══ HERO ══════════════════════════════════ */}
        <section ref={heroRef} className="relative h-screen overflow-hidden flex items-end" style={{ background: "#000" }}>
          <motion.div className="absolute inset-0" style={{ y: heroY, opacity: heroOpacity }}>
            <img src={PHOTOS[0]} alt="César y Beatriz" className="w-full h-full object-cover" style={{ filter: "brightness(0.42)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #000 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.1) 100%)" }} />
          </motion.div>

          {/* Línea roja superior */}
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(to right, transparent, var(--red), transparent)" }} />

          <div className="relative z-10 w-full text-center pb-16 sm:pb-24 px-4">
            <motion.p className="eyebrow mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.4, duration: 0.7 }}>
              Te invitamos a nuestra boda
            </motion.p>
            <motion.h1
              className="font-[family-name:var(--font-script)] leading-none mb-6"
              style={{ fontSize: "clamp(64px,14vw,140px)", color: "var(--white)" }}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              César{" "}<span style={{ color: "var(--gold)", fontSize: "0.55em" }}>&</span>{" "}Beatriz
            </motion.h1>
            <motion.div className="flex flex-col items-center gap-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.9, duration: 0.7 }}>
              <p className="font-[family-name:var(--font-display)] italic text-xl sm:text-2xl font-light" style={{ color: "var(--beige)" }}>
                Sábado, 10 de octubre de 2026
              </p>
              <p className="text-xs tracking-widest uppercase opacity-60" style={{ fontFamily: "var(--font-sans)", color: "var(--beige)" }}>
                Tapaxco · El Oro · Estado de México
              </p>
            </motion.div>
            <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
              <div className="w-px h-10 mx-auto" style={{ background: "linear-gradient(to bottom, var(--gold), transparent)" }} />
            </motion.div>
          </div>
        </section>

        {/* ══ COUNTDOWN ═════════════════════════════ */}
        <FadeSection id="countdown" className="py-20 px-4 text-center" style={{ background: "var(--surface)" }}>
          <p className="eyebrow">Faltan</p>
          <div className="flex items-center justify-center gap-4 sm:gap-12 mt-2">
            <CountBlock value={days} label="días" />
            <span className="text-3xl font-light opacity-30" style={{ color: "var(--gold)" }}>:</span>
            <CountBlock value={hours} label="horas" />
            <span className="text-3xl font-light opacity-30" style={{ color: "var(--gold)" }}>:</span>
            <CountBlock value={minutes} label="min" />
            <span className="text-3xl font-light opacity-30" style={{ color: "var(--gold)" }}>:</span>
            <CountBlock value={seconds} label="seg" />
          </div>
          <div className="hairline mt-8"><span>♥</span></div>
        </FadeSection>

        {/* ══ CEREMONY ══════════════════════════════ */}
        <FadeSection id="ceremony" className="py-24 px-4" style={{ background: "#000" }}>
          <div className="max-w-4xl mx-auto text-center">
            <p className="eyebrow">Nuestro gran día</p>
            <h2 className="font-[family-name:var(--font-display)] italic font-light mb-14" style={{ fontSize: "clamp(32px,5vw,56px)", color: "var(--white)" }}>
              Ceremonia & Celebración
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: "✝", color: "var(--gold)", eyeColor: "var(--gold)", label: "Ceremonia religiosa", time: "12:00 pm", place: "Parroquia Santa María de Guadalupe, Tapaxco", link: WAZE_URL, linkLabel: "Waze" },
                { icon: "♡", color: "var(--red)", eyeColor: "var(--red)", label: "Ceremonia civil", time: "2:00 pm", place: "Parroquia Santa María de Guadalupe, Tapaxco", link: WAZE_URL, linkLabel: "Waze" },
                { icon: "★", color: "var(--gold)", eyeColor: "var(--gold)", label: "Recepción", time: "3:30 pm", place: "Auditorio de la Concepción II, Tapaxco", link: MAPS_URL, linkLabel: "Maps" },
              ].map((c, i) => (
                <motion.div key={i} className="card-glass p-8 text-center" style={i === 1 ? { borderColor: "rgba(201,60,24,0.3)" } : {}}
                  whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
                  <div className="text-3xl mb-4" style={{ fontFamily: "var(--font-script)", color: c.color }}>{c.icon}</div>
                  <p className="eyebrow" style={{ marginBottom: "8px", color: c.eyeColor }}>{c.label}</p>
                  <p className="font-[family-name:var(--font-display)] text-4xl italic font-light mb-3" style={{ color: "var(--white)" }}>{c.time}</p>
                  <p className="text-sm opacity-60 mb-2" style={{ fontFamily: "var(--font-sans)" }}>{c.place}</p>
                  <a href={c.link} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs tracking-widest uppercase mt-4 transition-opacity hover:opacity-80"
                    style={{ color: c.color, fontFamily: "var(--font-sans)" }}>
                    <span>→</span> Abrir en {c.linkLabel}
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeSection>

        {/* ══ FAMILY ════════════════════════════════ */}
        <FadeSection id="family" className="py-24 px-4 text-center" style={{ background: "var(--surface2)" }}>
          <div className="max-w-3xl mx-auto">
            <p className="eyebrow">Con amor de nuestras familias</p>
            <h2 className="font-[family-name:var(--font-display)] italic font-light mb-14" style={{ fontSize: "clamp(28px,4vw,48px)", color: "var(--white)" }}>
              Quienes hacen posible este día
            </h2>
            <div className="grid sm:grid-cols-2 gap-10 mb-14">
              <div>
                <p className="eyebrow" style={{ marginBottom: "16px" }}>Padres del novio</p>
                <p className="font-[family-name:var(--font-display)] text-xl font-light italic leading-relaxed" style={{ color: "var(--beige)" }}>Andrés Vázquez Montes de Oca</p>
                <div className="my-2 mx-auto" style={{ width: "40px", height: "1px", background: "rgba(189,139,45,0.3)" }} />
                <p className="font-[family-name:var(--font-display)] text-xl font-light italic leading-relaxed" style={{ color: "var(--beige)" }}>Lucía Antonio Martínez</p>
              </div>
              <div>
                <p className="eyebrow" style={{ marginBottom: "16px" }}>Padres de la novia</p>
                <p className="font-[family-name:var(--font-display)] text-xl font-light italic leading-relaxed" style={{ color: "var(--beige)" }}>Juan Sánchez Hipólito</p>
                <div className="my-2 mx-auto" style={{ width: "40px", height: "1px", background: "rgba(189,139,45,0.3)" }} />
                <p className="font-[family-name:var(--font-display)] text-xl font-light italic leading-relaxed" style={{ color: "var(--beige)" }}>Julieta López Flores</p>
              </div>
            </div>
            <div className="hairline"><span>✦</span></div>
            <div className="mt-8">
              <p className="eyebrow" style={{ marginBottom: "16px" }}>Padrinos de velación</p>
              <p className="font-[family-name:var(--font-display)] text-xl font-light italic" style={{ color: "var(--beige)" }}>José Guadalupe Antonio Martínez</p>
              <div className="my-2 mx-auto" style={{ width: "40px", height: "1px", background: "rgba(189,139,45,0.3)" }} />
              <p className="font-[family-name:var(--font-display)] text-xl font-light italic" style={{ color: "var(--beige)" }}>Mercedes Martínez González</p>
            </div>
          </div>
        </FadeSection>

        {/* ══ ITINERARIO ════════════════════════════ */}
        <FadeSection id="itinerary" className="py-24 px-4" style={{ background: "#000" }}>
          <div className="max-w-xl mx-auto text-center">
            <p className="eyebrow">El gran día</p>
            <h2 className="font-[family-name:var(--font-display)] italic font-light mb-14" style={{ fontSize: "clamp(28px,4vw,48px)", color: "var(--white)" }}>
              Itinerario
            </h2>
            <div className="space-y-8">
              {[
                { time: "12:00 pm", label: "Ceremonia religiosa", sub: "Parroquia Santa María de Guadalupe", color: "var(--gold)" },
                { time: "2:00 pm", label: "Ceremonia civil", sub: "Mismo lugar", color: "var(--red)" },
                { time: "3:30 pm", label: "Recepción", sub: "Auditorio de la Concepción II", color: "var(--gold)" },
                { time: "8:30 pm", label: "Brindis", sub: "¡Salud!", color: "var(--gold)" },
                { time: "∞", label: "Despedida", sub: "Hasta que el cuerpo aguante 😁", color: "var(--beige)" },
              ].map((item, i) => (
                <motion.div key={i} className="flex items-start gap-5 text-left"
                  initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: i * 0.08 }}>
                  <div className="flex-none w-24 text-right pt-1">
                    <span className="font-[family-name:var(--font-display)] text-2xl italic font-light" style={{ color: item.color }}>{item.time}</span>
                  </div>
                  <div className="flex-none flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full border-2 mt-2" style={{ borderColor: item.color, background: "#000" }} />
                    {i < 4 && <div className="w-px flex-1 mt-1" style={{ background: "rgba(189,139,45,0.2)", minHeight: "32px" }} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-[family-name:var(--font-display)] text-lg font-medium italic" style={{ color: "var(--white)" }}>{item.label}</p>
                    <p className="text-sm opacity-50 mt-0.5" style={{ fontFamily: "var(--font-sans)", color: "var(--beige)" }}>{item.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeSection>

        {/* ══ GALLERY ═══════════════════════════════ */}
        <section id="gallery" className="py-24 px-4" style={{ background: "var(--surface)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="eyebrow">Nuestra historia</p>
              <h2 className="font-[family-name:var(--font-display)] italic font-light" style={{ fontSize: "clamp(28px,4vw,48px)", color: "var(--white)" }}>
                Momentos
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PHOTOS.map((src, i) => (
                <motion.div key={i} className={`overflow-hidden ${i === 0 ? "row-span-2" : ""}`}
                  initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: i * 0.08 }}
                  whileHover={{ scale: 1.02 }}>
                  <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover"
                    style={{ aspectRatio: i === 0 ? "3/4" : "4/3", filter: "brightness(0.88)" }} loading="lazy" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ DRESSCODE ═════════════════════════════ */}
        <FadeSection id="dresscode" className="py-24 px-4 text-center" style={{ background: "#000" }}>
          <div className="max-w-xl mx-auto">
            <p className="eyebrow">Vestimenta</p>
            <h2 className="font-[family-name:var(--font-display)] italic font-light mb-4" style={{ fontSize: "clamp(28px,4vw,48px)", color: "var(--white)" }}>
              Código de vestimenta
            </h2>
            <p className="font-[family-name:var(--font-display)] text-2xl italic mb-10" style={{ color: "var(--gold)" }}>Formal</p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="card-glass p-6" style={{ borderColor: "rgba(201,60,24,0.3)" }}>
                <p className="text-xs tracking-widest uppercase mb-4 opacity-60" style={{ fontFamily: "var(--font-sans)", color: "var(--red)" }}>Evitar</p>
                <div className="flex gap-3 justify-center">
                  {[{ hex: "#ff0000", label: "Rojo" }, { hex: "#FFFFFF", label: "Blanco" }].map(c => (
                    <div key={c.hex} className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full border" style={{ background: c.hex, borderColor: "rgba(255,255,255,0.2)" }} />
                      <span className="text-xs opacity-40" style={{ fontFamily: "monospace" }}>{c.label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs opacity-40 mt-4" style={{ fontFamily: "var(--font-sans)" }}>Reservados para los novios</p>
              </div>
              <div className="card-glass p-6">
                <p className="text-xs tracking-widest uppercase mb-4 opacity-60" style={{ fontFamily: "var(--font-sans)", color: "var(--gold)" }}>Paleta del evento</p>
                <div className="flex gap-3 justify-center">
                  {[{ hex: "#000000", label: "Negro" }, { hex: "#bd8b2d", label: "Dorado" }, { hex: "#D4C5B2", label: "Beige" }].map(c => (
                    <div key={c.hex} className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full border" style={{ background: c.hex, borderColor: "rgba(189,139,45,0.4)" }} />
                      <span className="text-xs opacity-40" style={{ fontFamily: "monospace" }}>{c.label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs opacity-40 mt-4" style={{ fontFamily: "var(--font-sans)" }}>Armonizan con la celebración</p>
              </div>
            </div>
          </div>
        </FadeSection>

        {/* ══ MESA DE REGALOS ═══════════════════════ */}
        <FadeSection id="gifts" className="py-24 px-4 text-center" style={{ background: "var(--surface2)" }}>
          <div className="max-w-2xl mx-auto">
            <p className="eyebrow">Obsequios</p>
            <h2 className="font-[family-name:var(--font-display)] italic font-light mb-4" style={{ fontSize: "clamp(28px,4vw,48px)", color: "var(--white)" }}>
              Mesa de regalos
            </h2>
            <p className="text-sm opacity-60 mb-12" style={{ fontFamily: "var(--font-sans)", color: "var(--beige)" }}>
              Tu presencia es nuestro mejor regalo. Si deseas hacernos un obsequio, con mucho amor te compartimos estas opciones.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="card-glass p-8 text-center">
                <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(189,139,45,0.1)", border: "1px solid rgba(189,139,45,0.3)" }}>
                  <span style={{ fontSize: "20px" }}>💳</span>
                </div>
                <p className="eyebrow" style={{ marginBottom: "8px" }}>Mercado Pago</p>
                <p className="font-[family-name:var(--font-display)] text-lg italic font-light mb-1" style={{ color: "var(--white)" }}>Beatriz Sanchez Lopez</p>
                <div className="mt-3 p-3 rounded" style={{ background: "rgba(189,139,45,0.06)", border: "1px solid rgba(189,139,45,0.15)" }}>
                  <p className="text-xs opacity-60 mb-1" style={{ fontFamily: "var(--font-sans)" }}>Número de cuenta</p>
                  <p className="text-base tracking-wider font-medium select-all" style={{ fontFamily: "monospace", color: "var(--gold)" }}>
                    5428 7851 7478 8124
                  </p>
                </div>
              </div>
              <div className="card-glass p-8 text-center" style={{ borderColor: "rgba(201,60,24,0.25)" }}>
                <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(201,60,24,0.1)", border: "1px solid rgba(201,60,24,0.3)" }}>
                  <span style={{ fontSize: "20px" }}>✉️</span>
                </div>
                <p className="eyebrow" style={{ marginBottom: "8px", color: "var(--red)" }}>Lluvia de sobres</p>
                <p className="font-[family-name:var(--font-display)] text-xl italic font-light" style={{ color: "var(--white)" }}>
                  ¡También contaremos con urna de sobres en el evento!
                </p>
                <p className="text-sm opacity-50 mt-4" style={{ fontFamily: "var(--font-sans)" }}>Tu gesto de amor nos llena de alegría.</p>
              </div>
            </div>
          </div>
        </FadeSection>

        {/* ══ RSVP ══════════════════════════════════ */}
        <Suspense fallback={
          <div className="py-24 text-center">
            <span className="text-sm tracking-widest uppercase opacity-50" style={{ color: "var(--gold)" }}>Cargando confirmación…</span>
          </div>
        }>
          <RSVPSection />
        </Suspense>

        {/* ══ FOOTER ════════════════════════════════ */}
        <footer className="py-16 text-center px-4" style={{ background: "#000", borderTop: "1px solid rgba(189,139,45,0.1)" }}>
          <p className="font-[family-name:var(--font-script)] mb-4" style={{ fontSize: "clamp(48px,8vw,80px)", color: "var(--white)" }}>
            C <span style={{ color: "var(--gold)", fontSize: "0.55em" }}>&</span> B
          </p>
          <p className="text-xs tracking-widest uppercase opacity-40" style={{ fontFamily: "var(--font-sans)", color: "var(--beige)" }}>
            10 · 10 · 2026 · Tapaxco, Estado de México
          </p>
          <div className="hairline mt-8 max-w-xs mx-auto"><span>♥</span></div>
          <p className="text-xs opacity-20 mt-4" style={{ fontFamily: "var(--font-sans)", color: "var(--beige)" }}>
            Con amor · @elysium.invitaciones
          </p>
        </footer>

      </main>
    </>
  );
}
