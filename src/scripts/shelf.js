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

const cards = [...document.querySelectorAll(".book[data-key]")];
const shelf = document.querySelector(".shelf");

function render() {
  const ranked = [];

  for (const card of cards) {
    const entry = readEntry(card.dataset.key);
    const link = card.querySelector(".book-link");
    const fill = card.querySelector(".fill");
    const pct = card.querySelector(".pct");
    const base = card.dataset.href;

    card.classList.remove("started", "unread");
    card.removeAttribute("title");

    if (!entry) {
      link.href = `${base}${card.dataset.start}/`;
      fill.style.width = "0";
      pct.textContent = "未读";
      card.classList.add("unread");
      ranked.push({ card, at: 0 });
      continue;
    }

    const ratio = Math.max(0, Math.min(1, entry.ratio ?? 0));
    const index = Number(entry.chapterIndex ?? 0);
    const total = Math.max(1, Number(entry.chapterTotal ?? 1));
    const fallback = (index + ratio) / total;
    const bookRatio = Math.max(0, Math.min(1, entry.bookProgress ?? fallback));
    const percent = Math.round(bookRatio * 100);
    const done = index >= total - 1 && ratio > 0.97;
    const anchor = done ? "" : `#b-${entry.anchor ?? 0}`;

    link.href = `${base}${entry.slug}/${anchor}`;
    fill.style.width = `${percent}%`;
    pct.textContent = done ? "读完" : `读到 ${percent}%`;
    card.classList.add("started");
    card.title = `继续：${entry.title ?? entry.slug}`;
    ranked.push({ card, at: entry.at ?? 0 });
  }

  ranked.sort((a, b) => b.at - a.at);
  for (const { card } of ranked) shelf.appendChild(card);
}

render();

window.addEventListener("pageshow", render);
window.addEventListener("focus", render);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") render();
});
