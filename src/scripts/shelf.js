function readEntry(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const all = JSON.parse(raw);
    if (!all || typeof all !== "object") return null;
    const entries = Object.entries(all).map(([slug, entry]) => ({ slug, ...entry }));
    return entries.sort((a, b) => (b.at ?? 0) - (a.at ?? 0))[0] ?? null;
  } catch {
    return null;
  }
}

for (const card of document.querySelectorAll(".book[data-key]")) {
  const entry = readEntry(card.dataset.key);
  const link = card.querySelector(".book-link");
  const fill = card.querySelector(".fill");
  const pct = card.querySelector(".pct");
  const base = card.dataset.href;

  if (!entry) {
    link.href = `${base}${card.dataset.start}/`;
    card.classList.add("unread");
    continue;
  }

  const ratio = Math.max(0, Math.min(1, entry.ratio ?? 0));
  const percent = Math.round(ratio * 100);
  const done = ratio > 0.97;
  const anchor = ratio > 0.02 && !done ? `#b-${entry.anchor ?? 0}` : "";

  link.href = `${base}${entry.slug}/${anchor}`;
  fill.style.width = `${Math.max(4, percent)}%`;
  pct.textContent = done ? "读完" : `读到 ${percent}%`;
  card.classList.add("started");
  card.title = `继续：${entry.title ?? entry.slug}`;
}
