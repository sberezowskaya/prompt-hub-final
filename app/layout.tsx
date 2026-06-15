import "./globals.css";

export const metadata = {
  title: "Prompt Hub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <nav style={{ background: "#1e3a5f", padding: "1rem", color: "white", display: "flex", gap: "1rem" }}>
          <a href="/" style={{ color: "white", textDecoration: "none" }}>PromptHub</a>
          <a href="/catalog" style={{ color: "white", textDecoration: "none" }}>Каталог</a>
          <a href="/profile" style={{ color: "white", textDecoration: "none" }}>Профиль</a>
          <a href="/login" style={{ color: "white", textDecoration: "none", marginLeft: "auto" }}>Вход</a>
        </nav>
        <main style={{ minHeight: "100vh", background: "#f3f4f6", padding: "2rem" }}>{children}</main>
      </body>
    </html>
  );
}