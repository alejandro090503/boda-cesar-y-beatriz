"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

const WA_NUMBER = "525514804577";
const BRIDE_GROOM = "César Vázquez Antonio y Beatriz Sanchez Lopez";
const RSVP_DEADLINE = "31 de agosto de 2026";

export default function RSVPSection() {
  const searchParams = useSearchParams();
  const rawPases = parseInt(searchParams.get("pases") ?? "1", 10);
  const pases = isNaN(rawPases) || rawPases < 1 || rawPases > 5 ? 1 : rawPases;

  const [nombres, setNombres] = useState<string[]>(Array(pases).fill(""));
  const [sent, setSent] = useState(false);

  const handleChange = (i: number, val: string) => {
    setNombres((prev) => {
      const next = [...prev];
      next[i] = val;
      return next;
    });
  };

  const handleConfirm = () => {
    const lista = nombres
      .map((n, i) => `${i + 1}. ${n || "(sin nombre)"}`)
      .join("\n");

    const acompanantesLine =
      pases === 1 ? "" : `\nMis acompañantes:\n${lista}`;

    const msg =
      `¡Hola! Con mucho gusto confirmo mi asistencia a la celebración de ${BRIDE_GROOM}. 🎉\n` +
      `✅ Asistiré con ${pases} pase${pases > 1 ? "s" : ""}.\n` +
      (pases === 1 ? `Nombre: ${nombres[0] || "(sin nombre)"}` : `Mis acompañantes:\n${lista}`) +
      `\n¡Nos vemos pronto! 💫`;

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    setSent(true);
  };

  const labels = ["Tu nombre", "Acompañante 2", "Acompañante 3", "Acompañante 4", "Acompañante 5"];

  return (
    <section
      id="rsvp"
      className="relative py-24 px-4 overflow-hidden"
      style={{ background: "var(--surface)" }}
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, var(--red), transparent)",
        }}
      />

      <div className="relative z-10 max-w-lg mx-auto text-center">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Confirmación de asistencia
        </motion.p>

        <motion.h2
          className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl text-white italic font-light mb-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          ¿Nos acompañas?
        </motion.h2>

        <motion.p
          className="text-sm mb-2 opacity-70"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.7 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {pases === 1
            ? "Tienes 1 pase asignado."
            : `Tienes ${pases} pases asignados.`}
        </motion.p>
        <motion.p
          className="text-xs mb-10 opacity-50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          Confirma antes del {RSVP_DEADLINE}
        </motion.p>

        {/* Form */}
        <motion.div
          className="card-glass p-8 text-left space-y-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {Array.from({ length: pases }).map((_, i) => (
            <div key={i}>
              <label
                className="block text-xs tracking-widest uppercase mb-2 opacity-60"
                style={{ fontFamily: "var(--sans)", color: "var(--gold)" }}
              >
                {labels[i] ?? `Acompañante ${i + 1}`}
              </label>
              <input
                type="text"
                value={nombres[i]}
                onChange={(e) => handleChange(i, e.target.value)}
                placeholder="Nombre completo"
                className="w-full bg-transparent border-b py-2 text-sm outline-none placeholder-opacity-30 text-white transition-colors"
                style={{
                  borderColor: "rgba(189,139,45,0.3)",
                  fontFamily: "var(--sans)",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--gold)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(189,139,45,0.3)")
                }
              />
            </div>
          ))}

          <motion.button
            onClick={handleConfirm}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 py-4 text-sm tracking-widest uppercase font-medium transition-all"
            style={{
              background: sent
                ? "rgba(189,139,45,0.15)"
                : "linear-gradient(135deg, var(--red), #a52e10)",
              color: sent ? "var(--gold)" : "var(--white)",
              border: sent ? "1px solid var(--gold)" : "none",
              fontFamily: "var(--sans)",
            }}
          >
            {sent ? "✓ Confirmado — ¡Gracias!" : "Confirmar asistencia vía WhatsApp"}
          </motion.button>

          {sent && (
            <p className="text-center text-xs opacity-50 mt-2">
              Se abrió WhatsApp con tu mensaje de confirmación.
            </p>
          )}
        </motion.div>

        {/* Links de pases */}
        <motion.div
          className="mt-10 text-left"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-xs tracking-widest uppercase opacity-50 mb-3" style={{ color: "var(--gold)" }}>
            Links por número de pases
          </p>
          <div className="space-y-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <p key={n} className="text-xs opacity-40 break-all" style={{ fontFamily: "monospace" }}>
                {typeof window !== "undefined"
                  ? `${window.location.origin}?pases=${n}`
                  : `[URL]?pases=${n}`}
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
