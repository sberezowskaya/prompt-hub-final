"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify({ email }));
    router.push("/profile");
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", background: "white", padding: "2rem", borderRadius: "0.5rem" }}>
      <h1>Вход</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }} />
        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }} />
        <button type="submit" style={{ background: "#1e3a5f", color: "white", padding: "0.5rem", width: "100%", border: "none", cursor: "pointer" }}>Войти</button>
      </form>
    </div>
  );
}