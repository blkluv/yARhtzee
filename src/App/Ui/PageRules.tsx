import * as React from "react";
import { Dice } from "./Dice";

export const PageRules = () => (
  <div style={styles.container}>
    <div style={styles.header}>
      <h1 style={styles.title}>🎲 DICE 🎲</h1>
      <div style={styles.subtitle}>#1 Trending AR Dice Game</div>
    </div>

    <div style={styles.diceRow}>
      <Dice value={1} style={styles.dice} />
      <Dice value={2} style={styles.dice} />
      <Dice value={3} style={styles.dice} />
      <Dice value={4} style={styles.dice} />
      <Dice value={6} style={styles.dice} />
    </div>

    <div style={styles.card}>
      <p style={styles.tagline}>
        <span style={styles.emoji}>✨</span> The coolest{" "}
        <a href="https://en.wikipedia.org/wiki/Yahtzee" style={styles.link}>
          DICE
        </a>{" "}
        in augmented reality <span style={styles.emoji}>✨</span>
      </p>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📜 Game Rules</h2>
        <ul style={styles.rulesList}>
          <li style={styles.ruleItem}>🎯 Make combinations with 5 dice</li>
          <li style={styles.ruleItem}>🔄 Roll dice, then get two re-rolls</li>
          <li style={styles.ruleItem}>🏆 Choose highest-scoring combination</li>
          <li style={styles.ruleItem}>⏱️ 13 rounds to fill your scorecard</li>
          <li style={styles.ruleItem}>🔥 Compete to beat your high score!</li>
        </ul>
      </div>

      <div style={styles.badge}>NEW</div>
    </div>

    <div style={styles.footer}>
      <p style={styles.footerText}>Shake your phone to roll in AR!</p>
      <p style={styles.footerText}>📱👉🎲👈📱</p>
    </div>
  </div>
);

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f5f5f7",
    minHeight: "100vh",
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#1c1c1e",
    margin: "10px 0",
    textShadow: "1px 1px 3px rgba(0,0,0,0.1)",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#ff2d55",
    fontWeight: "600",
    backgroundColor: "rgba(255,45,85,0.1)",
    padding: "5px 10px",
    borderRadius: "20px",
    display: "inline-block",
  },
  diceRow: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    margin: "20px 0",
  },
  dice: {
    width: "50px",
    height: "50px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "25px",
    width: "90%",
    maxWidth: "500px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
    position: "relative",
    marginBottom: "30px",
  },
  badge: {
    position: "absolute",
    top: "-10px",
    right: "20px",
    backgroundColor: "#ff2d55",
    color: "white",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "bold",
  },
  tagline: {
    textAlign: "center",
    fontSize: "1.1rem",
    color: "#636366",
    margin: "0 0 20px 0",
    lineHeight: "1.5",
  },
  emoji: {
    fontSize: "1.3rem",
  },
  link: {
    color: "#007aff",
    textDecoration: "none",
    fontWeight: "600",
  },
  section: {
    marginTop: "15px",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    color: "#1c1c1e",
    margin: "0 0 15px 0",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  rulesList: {
    paddingLeft: "20px",
    margin: "0",
  },
  ruleItem: {
    marginBottom: "12px",
    fontSize: "1rem",
    lineHeight: "1.5",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  footer: {
    textAlign: "center",
    marginTop: "auto",
    padding: "20px",
  },
  footerText: {
    margin: "5px 0",
    color: "#8e8e93",
    fontSize: "0.9rem",
  },
} as const;