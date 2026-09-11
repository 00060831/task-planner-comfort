const quickSteps = [
  "Добавьте задачу короткой фразой",
  "Отметьте важное тегом 🔴",
  "Переносите несрочное в Someday"
];

export default function HomePage() {
  return (
    <main className="container">
      <h1>Task Planner Comfort</h1>
      <p>Codespaces-ready минимальная версия запущена.</p>
      <ul>
        {quickSteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>
      <p>
        Если React/Node не запускается, откройте
        {" "}
        <a href="/fallback.html">fallback.html</a>.
      </p>
    </main>
  );
}
