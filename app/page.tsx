"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    fetch("/api/prompts")
      .then(res => res.json())
      .then(setPrompts);
  }, []);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem" }}>Prompt Hub</h1>
      <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
        {prompts.map((p: any) => (
          <div key={p.id} style={{ background: "white", padding: "1rem", borderRadius: "0.5rem" }}>
            <h3>{p.title}</h3>
            <p>{p.prompt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}