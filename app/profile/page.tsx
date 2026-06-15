"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SyntaxHighlightedEditor from "@/components/SyntaxHighlightedEditor";

interface Prompt {
  id: number;
  title: string;
  prompt: string;
  tool: string;
  sphere: string;
  conversionType: string;
  status: "private" | "moderation" | "published";
  likes: number;
  userId?: string;
}

// Готовые шаблоны
const templates = [
  { title: "Копирайтер для Instagram", prompt: "## Роль\nТы профессиональный копирайтер\n---\n## Задача\nНапиши пост для Instagram на тему: {{тема}}\n---\n## Тон\nДружелюбный и вовлекающий" },
  { title: "Аналитик данных", prompt: "## Контекст\nУ меня есть данные: {{данные}}\n---\n## Запрос\nПроанализируй и найди аномалии\n---\n## Формат ответа\n- Основные выводы\n- Рекомендации" },
  { title: "Переводчик сленга", prompt: "## Инструкция\nПереведи следующий текст на молодёжный сленг:\n---\n{{текст}}\n---\n## Требования\nИспользуй современные выражения" },
];

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [myPrompts, setMyPrompts] = useState<Prompt[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editMode, setEditMode] = useState<Prompt | null>(null);
  
  // Форма создания
  const [newTitle, setNewTitle] = useState("");
  const [newPrompt, setNewPrompt] = useState("");
  const [newTool, setNewTool] = useState("ChatGPT");
  const [newSphere, setNewSphere] = useState("Работа");
  
  // Редактирование профиля
  const [displayName, setDisplayName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
    } else {
      const userData = JSON.parse(stored);
      setUser(userData);
      setDisplayName(userData.displayName || userData.email.split("@")[0]);
    }
    
    fetch("/api/prompts")
      .then(res => res.json())
      .then(data => {
        setAllPrompts(data);
        const userPrompts = data.filter((p: Prompt) => p.userId === "current");
        setMyPrompts(userPrompts);
      });
    
    const favs = localStorage.getItem("favorites");
    if (favs) setFavorites(JSON.parse(favs));
  }, []);

  const saveProfile = () => {
    const updatedUser = { ...user, displayName };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    alert("✅ Профиль обновлён");
  };

  const applyTemplate = (template: typeof templates[0]) => {
    setNewTitle(template.title);
    setNewPrompt(template.prompt);
  };

  const savePrompt = () => {
    if (!newTitle || !newPrompt) {
      alert("Заполните заголовок и текст промпта");
      return;
    }
    const newId = Date.now();
    const promptData: Prompt = {
      id: newId,
      title: newTitle,
      prompt: newPrompt,
      tool: newTool,
      sphere: newSphere,
      conversionType: "txt2txt",
      status: "moderation",
      likes: 0,
      userId: "current",
    };
    setMyPrompts([promptData, ...myPrompts]);
    setAllPrompts([promptData, ...allPrompts]);
    setNewTitle("");
    setNewPrompt("");
    setShowCreateForm(false);
    alert("✅ Промпт отправлен на модерацию. Статус: 'на модерации'");
  };

  const updatePrompt = () => {
    if (!editMode) return;
    setMyPrompts(prev => prev.map(p => p.id === editMode.id ? editMode : p));
    setAllPrompts(prev => prev.map(p => p.id === editMode.id ? editMode : p));
    setEditMode(null);
    alert("✅ Промпт обновлён");
  };

  const deletePrompt = (id: number) => {
    if (confirm("Удалить промпт?")) {
      setMyPrompts(prev => prev.filter(p => p.id !== id));
      setAllPrompts(prev => prev.filter(p => p.id !== id));
    }
  };

  const getStatusText = (status: string) => {
    if (status === "private") return "🔒 Приватный";
    if (status === "moderation") return "⏳ На модерации";
    return "✅ Опубликован";
  };

  const favoritePrompts = allPrompts.filter(p => favorites.includes(p.id) && p.status === "published");

  if (!user) return <div style={{ textAlign: "center", padding: "3rem" }}>Загрузка...</div>;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 1rem" }}>
      {/* Вкладки */}
      <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid #e5e7eb", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button onClick={() => { setActiveTab("profile"); setShowCreateForm(false); setEditMode(null); }} style={{ ...tabStyle, background: activeTab === "profile" ? "#1e3a5f" : "transparent", color: activeTab === "profile" ? "white" : "#374151" }}>👤 Профиль</button>
        <button onClick={() => { setActiveTab("my"); setShowCreateForm(false); setEditMode(null); }} style={{ ...tabStyle, background: activeTab === "my" ? "#1e3a5f" : "transparent", color: activeTab === "my" ? "white" : "#374151" }}>📝 Мои промпты ({myPrompts.length})</button>
        <button onClick={() => { setActiveTab("favorites"); setShowCreateForm(false); setEditMode(null); }} style={{ ...tabStyle, background: activeTab === "favorites" ? "#1e3a5f" : "transparent", color: activeTab === "favorites" ? "white" : "#374151" }}>⭐ Избранное ({favorites.length})</button>
      </div>
      
      {/* Вкладка ПРОФИЛЬ */}
      {activeTab === "profile" && (
        <div style={{ background: "white", padding: "2rem", borderRadius: "0.5rem" }}>
          <h1>👤 Личный кабинет</h1>
          
          {!isEditing ? (
            <>
              <p><strong>Имя:</strong> {displayName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <button onClick={() => setIsEditing(true)} style={{ ...btnPrimary, background: "#22c55e", marginTop: "1rem" }}>✏️ Редактировать профиль</button>
            </>
          ) : (
            <div style={{ marginTop: "1rem" }}>
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem", border: "1px solid #ccc", borderRadius: "0.25rem" }} placeholder="Ваше имя" />
              <button onClick={saveProfile} style={{ ...btnPrimary, background: "#22c55e" }}>💾 Сохранить</button>
              <button onClick={() => setIsEditing(false)} style={{ ...btnPrimary, background: "#6b7280", marginLeft: "0.5rem" }}>Отмена</button>
            </div>
          )}
          
          <hr style={{ margin: "1.5rem 0" }} />
          
          <button onClick={() => setShowCreateForm(!showCreateForm)} style={{ ...btnPrimary, background: "#1e3a5f" }}>+ Создать новый промпт</button>
          
          {showCreateForm && (
            <div style={{ marginTop: "1.5rem", padding: "1.5rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem" }}>
              <h3 style={{ marginBottom: "1rem" }}>✨ Создание промпта</h3>
              
              {/* Готовые шаблоны */}
              <div style={{ marginBottom: "1rem" }}>
                <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>📋 Готовые шаблоны:</p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {templates.map((t, i) => (
                    <button key={i} onClick={() => applyTemplate(t)} style={{ ...btnPrimary, background: "#8b5cf6", fontSize: "0.8rem" }}>{t.title}</button>
                  ))}
                </div>
              </div>
              
              <input type="text" placeholder="Заголовок промпта" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem", border: "1px solid #ccc", borderRadius: "0.25rem" }} />
              
              <div style={{ marginBottom: "0.5rem" }}>
                <select value={newTool} onChange={(e) => setNewTool(e.target.value)} style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.25rem", marginRight: "0.5rem" }}>
                  <option>ChatGPT</option><option>GigaChat</option><option>Midjourney</option><option>Claude</option>
                </select>
                <select value={newSphere} onChange={(e) => setNewSphere(e.target.value)} style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.25rem" }}>
                  <option>Работа</option><option>Учёба</option><option>Досуг</option><option>Здоровье</option>
                </select>
              </div>
              
              <SyntaxHighlightedEditor value={newPrompt} onChange={setNewPrompt} placeholder="## Мой промпт\n---\n{{переменная}}\n→ действие" />
              
              <button onClick={savePrompt} style={{ ...btnPrimary, background: "#22c55e", marginTop: "1rem" }}>🚀 Отправить на модерацию</button>
            </div>
          )}
          
          <button onClick={() => { localStorage.removeItem("user"); router.push("/login"); }} style={{ ...btnPrimary, background: "#ef4444", marginTop: "2rem" }}>🚪 Выйти</button>
        </div>
      )}
      
      {/* Вкладка МОИ ПРОМПТЫ */}
      {activeTab === "my" && (
        <div>
          {myPrompts.length === 0 ? (
            <div style={{ background: "white", padding: "3rem", textAlign: "center", borderRadius: "0.5rem" }}>📝 У вас пока нет промптов. Создайте первый!</div>
          ) : (
            myPrompts.map(p => (
              <div key={p.id} style={{ background: "white", padding: "1.5rem", borderRadius: "0.5rem", marginBottom: "1rem" }}>
                {editMode?.id === p.id ? (
                  <>
                    <input type="text" value={editMode.title} onChange={(e) => setEditMode({ ...editMode, title: e.target.value })} style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }} />
                    <textarea value={editMode.prompt} onChange={(e) => setEditMode({ ...editMode, prompt: e.target.value })} rows={5} style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }} />
                    <button onClick={updatePrompt} style={{ ...btnPrimary, background: "#22c55e" }}>💾 Сохранить</button>
                    <button onClick={() => setEditMode(null)} style={{ ...btnPrimary, background: "#6b7280", marginLeft: "0.5rem" }}>Отмена</button>
                  </>
                ) : (
                  <>
                    <h3>{p.title}</h3>
                    <pre style={{ background: "#f3f4f6", padding: "0.5rem", borderRadius: "0.25rem", fontSize: "0.8rem", overflow: "auto" }}>{p.prompt.slice(0, 200)}...</pre>
                    <div style={{ marginTop: "0.5rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.8rem", background: "#e5e7eb", padding: "0.25rem 0.5rem", borderRadius: "0.25rem" }}>{p.tool}</span>
                      <span style={{ fontSize: "0.8rem", background: "#e5e7eb", padding: "0.25rem 0.5rem", borderRadius: "0.25rem" }}>{p.sphere}</span>
                      <span style={{ fontSize: "0.8rem", fontWeight: "bold" }}>{getStatusText(p.status)}</span>
                      <button onClick={() => setEditMode(p)} style={{ ...btnPrimary, background: "#3b82f6", fontSize: "0.8rem" }}>✏️ Редакт</button>
                      <button onClick={() => deletePrompt(p.id)} style={{ ...btnPrimary, background: "#ef4444", fontSize: "0.8rem" }}>🗑️ Удалить</button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}
      
      {/* Вкладка ИЗБРАННОЕ */}
      {activeTab === "favorites" && (
        <div>
          {favoritePrompts.length === 0 ? (
            <div style={{ background: "white", padding: "3rem", textAlign: "center", borderRadius: "0.5rem" }}>⭐ Нет избранных промптов. Перейдите в <a href="/catalog" style={{ color: "#1e3a5f" }}>Каталог</a></div>
          ) : (
            favoritePrompts.map(p => (
              <div key={p.id} style={{ background: "white", padding: "1.5rem", borderRadius: "0.5rem", marginBottom: "1rem" }}>
                <h3>{p.title}</h3>
                <p>{p.prompt.slice(0, 150)}...</p>
                <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>🔧 {p.tool} | 📁 {p.sphere} | ❤️ {p.likes}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const tabStyle = { padding: "0.75rem 1.5rem", border: "none", cursor: "pointer", borderRadius: "0.5rem 0.5rem 0 0", fontSize: "1rem" };
const btnPrimary = { padding: "0.5rem 1rem", border: "none", borderRadius: "0.5rem", cursor: "pointer", color: "white" };