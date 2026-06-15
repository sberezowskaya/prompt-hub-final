export async function GET() {
  return Response.json([
    { id: 1, title: "Креативный копирайтер", prompt: "Напиши пост для Instagram про летний отпуск...", tool: "ChatGPT", sphere: "Работа", likes: 45 },
    { id: 2, title: "Переводчик сленга", prompt: "Переведи текст на молодёжный сленг...", tool: "GigaChat", sphere: "Учёба", likes: 32 },
    { id: 3, title: "Генератор идей для видео", prompt: "Придумай 10 идей для TikTok на тему...", tool: "ChatGPT", sphere: "Досуг", likes: 67 },
    { id: 4, title: "Создатель изображений", prompt: "Нарисуй кота в космосе в стиле киберпанк...", tool: "Midjourney", sphere: "Досуг", likes: 89 },
    { id: 5, title: "Анализ резюме", prompt: "Проанализируй это резюме и дай рекомендации...", tool: "Claude", sphere: "Работа", likes: 23 },
    { id: 6, title: "Лечебная диета", prompt: "Составь меню на неделю для здорового питания...", tool: "ChatGPT", sphere: "Здоровье", likes: 56 },
  ]);
}