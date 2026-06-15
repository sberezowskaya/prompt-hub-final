"use client";
import { useEffect, useState } from "react";

interface Prompt {
  id: number;
  title: string;
  prompt: string;
  tool: string;
  sphere: string;
  likes: number;
}

export default function Catalog() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filterTool, setFilterTool] = useState("");
  const [filterSphere, setFilterSphere] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/prompts")
      .then(res => res.json())
      .then(setPrompts);
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (id: number) => {
    let newFavs;
    if (favorites.includes(id)) {
      newFavs = favorites.filter(f => f !== id);
    } else {
      newFavs = [...favorites, id];
    }
    setFavorites(newFavs);
    localStorage.setItem("favorites", JSON.stringify(newFavs));
  };

  const filtered = prompts.filter(p => {
    if (filterTool && p.tool !== filterTool) return false;
    if (filterSphere && p.sphere !== filterSphere) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const tools = [...new Set(prompts.map(p => p.tool))];
  const spheres = [...new Set(prompts.map(p => p.sphere))];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }} role="main" aria-labelledby="catalog-title">
      <h1 id="catalog-title" style={{ fontSize: "2rem", marginBottom: "1rem" }}>📚 Каталог промптов</h1>
      
      <label htmlFor="search-input" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}>Поиск</label>
      <input
        id="search-input"
        type="text"
        placeholder="🔍 Поиск по названию..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Поиск промптов"
        style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem", border: "1px solid #ccc", borderRadius: "0.5rem" }}
      />
      
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <label htmlFor="tool-filter" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}>Фильтр по инструменту</label>
        <select id="tool-filter" value={filterTool} onChange={(e) => setFilterTool(e.target.value)} aria-label="Фильтр по инструменту" style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.5rem" }}>
          <option value="">Все инструменты</option>
          {tools.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        
        <label htmlFor="sphere-filter" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}>Фильтр по сфере</label>
        <select id="sphere-filter" value={filterSphere} onChange={(e) => setFilterSphere(e.target.value)} aria-label="Фильтр по сфере" style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.5rem" }}>
          <option value="">Все сферы</option>
          {spheres.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        
        <button onClick={() => { setFilterTool(""); setFilterSphere(""); setSearch(""); }} aria-label="Сбросить все фильтры" style={{ padding: "0.5rem 1rem", background: "#6b7280", color: "white", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}>
          Сбросить
        </button>
      </div>
      
      <div style={{ display: "grid", gap: "1rem" }} role="list" aria-label="Список промптов">
        {filtered.map((p) => (
          <article key={p.id} style={{ background: "white", padding: "1.5rem", borderRadius: "0.5rem", position: "relative" }} role="listitem">
            <button
              onClick={() => toggleFavorite(p.id)}
              aria-label={favorites.includes(p.id) ? "Удалить из избранного" : "Добавить в избранное"}
              style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "none", border: "none", fontSize: "1.8rem", cursor: "pointer" }}
            >
              {favorites.includes(p.id) ? "⭐" : "☆"}
            </button>
            <h3 style={{ marginBottom: "0.5rem", paddingRight: "2rem" }}>{p.title}</h3>
            <p style={{ color: "#4b5563", marginBottom: "0.5rem" }}>{p.prompt}</p>
            <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", color: "#6b7280" }}>
              <span>🔧 {p.tool}</span>
              <span>📁 {p.sphere}</span>
              <span>❤️ {p.likes} лайков</span>
            </div>
          </article>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <p style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }} role="status">😔 Промптов не найдено</p>
      )}
    </div>
  );
}