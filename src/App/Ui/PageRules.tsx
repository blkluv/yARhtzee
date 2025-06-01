import * as React from "react";
import { Dice } from "./Dice";

export const PageRules = () => (
  <div style={styles.container}>
    {/* Header with viral-worthy title */}
    <div style={styles.header}>
      <h1 style={styles.title}>🎲 DICE OR DARE 🎲</h1>
      <div style={styles.subtitle}>#1 TRENDING AR GAME RN 🔥</div>
    </div>

    {/* Dice display with extra ✨spice✨ */}
    <div style={styles.diceRow}>
      <Dice value={1} style={styles.dice} />
      <Dice value={2} style={styles.dice} />
      <Dice value={3} style={styles.dice} />
      <Dice value={4} style={styles.dice} />
      <div style={{ position: "relative" }}>
        <Dice value={6} style={styles.dice} />
        <div style={styles.fireEmoji}>🔥</div>
      </div>
    </div>

    {/* Main card with that TikTok aesthetic */}
    <div style={styles.card}>
      <p style={styles.tagline}>
        <span style={styles.emoji}>✨</span> The most LIT{" "}
        <a href="https://en.wikipedia.org/wiki/Yahtzee" style={styles.link}>
          dice game
        </a>{" "}
        in AR rn 💯 <span style={styles.emoji}>✨</span>
      </p>

      {/* Rules section - short n sweet */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📜 HOW TO PLAY (it's easy fr)</h2>
        <ul style={styles.rulesList}>
          <li style={styles.ruleItem}>🎯 Roll 5 dice = make combos</li>
          <li style={styles.ruleItem}>🔄 Get 2 re-rolls (no cap!)</li>
          <li style={styles.ruleItem}>🏆 Pick your best combo (big brain time)</li>
          <li style={styles.ruleItem}>⏱️ 13 rounds = flex your high score</li>
          <li style={styles.ruleItem}>🔥 Beat your friends = ultimate flex</li>
        </ul>
      </div>

      {/* Fixed mobile button - no more disappearing! */}
      <button style={styles.startButton}>
        🚀 START PLAYING 🎲
      </button>

      <div style={styles.badge}>NEW</div>
      <div style={styles.viralBadge}>VIRAL ON TT</div>
    </div>

    {/* Footer with AR call-to-action */}
    <div style={styles.footer}>
      <p style={styles.footerText}>Shake your phone like it's a Polaroid 📸</p>
      <p style={styles.footerText}>AR mode = next level 🤯</p>
      <div style={styles.socialIcons}>
        <span style={styles.icon}>📱</span>
        <span style={styles.icon}>📸</span>
        <span style={styles.icon}>🎥</span>
      </div>
    </div>
  </div>
);

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#fafafa",
    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    overflowX: "hidden",
  },
  header: {
    textAlign: "center",
    marginBottom: "15px",
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: "900",
    color: "#000",
    margin: "10px 0",
    background: "linear-gradient(45deg, #ff4d4d, #f9cb28)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#fff",
    fontWeight: "700",
    backgroundColor: "#000",
    padding: "6px 12px",
    borderRadius: "20px",
    display: "inline-block",
    border: "2px solid #f9cb28",
  },
  diceRow: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    margin: "15px 0 25px",
    flexWrap: "wrap",
  },
  dice: {
    width: "45px",
    height: "45px",
    boxShadow: "0 4px 15px rgba(249, 203, 40, 0.3)",
    border: "2px solid #fff",
  },
  fireEmoji: {
    position: "absolute",
    top: "-15px",
    right: "-10px",
    fontSize: "1.2rem",
    animation: "pulse 1.5s infinite",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "25px",
    padding: "22px",
    width: "92%",
    maxWidth: "500px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    position: "relative",
    marginBottom: "20px",
    border: "1px solid #f0f0f0",
  },
  badge: {
    position: "absolute",
    top: "-10px",
    right: "20px",
    backgroundColor: "#ff2d55",
    color: "white",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "800",
    transform: "rotate(5deg)",
  },
  viralBadge: {
    position: "absolute",
    top: "15px",
    left: "-15px",
    backgroundColor: "#000",
    color: "#f9cb28",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "800",
    transform: "rotate(-5deg)",
    border: "1px solid #f9cb28",
  },
  tagline: {
    textAlign: "center",
    fontSize: "1.1rem",
    color: "#333",
    margin: "0 0 18px 0",
    lineHeight: "1.5",
    fontWeight: "500",
  },
  emoji: {
    fontSize: "1.3rem",
    verticalAlign: "middle",
  },
  link: {
    color: "#0066ff",
    textDecoration: "none",
    fontWeight: "700",
    background: "linear-gradient(45deg, #0066ff, #00ccff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  section: {
    marginTop: "18px",
  },
  sectionTitle: {
    fontSize: "1.4rem",
    color: "#000",
    margin: "0 0 15px 0",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "800",
  },
  rulesList: {
    paddingLeft: "5px",
    margin: "0",
  },
  ruleItem: {
    marginBottom: "14px",
    fontSize: "1rem",
    lineHeight: "1.5",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "500",
  },
  startButton: {
    width: "100%",
    padding: "16px",
    marginTop: "20px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    fontSize: "1.1rem",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    position: "sticky",
    bottom: "20px",
    zIndex: "100",
  },
  footer: {
    textAlign: "center",
    marginTop: "auto",
    padding: "15px 20px 25px",
  },
  footerText: {
    margin: "6px 0",
    color: "#666",
    fontSize: "0.95rem",
    fontWeight: "500",
  },
  socialIcons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "15px",
  },
  icon: {
    fontSize: "1.4rem",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  "@keyframes pulse": {
    "0%": { transform: "scale(1)" },
    "50%": { transform: "scale(1.2)" },
    "100%": { transform: "scale(1)" },
  },
} as const;