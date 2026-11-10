# 书架

两本专业书中文译本的入口页，发布在 GitHub Pages：`/library/`。

- 一本书一个站：`/pain-zh/`、`/te-zh/`。
- 书架读取各站存在 localStorage 里的阅读进度（键 `pain:progress:v1`、`te:progress:v1`），点击封面直接回到上次的位置。
- 新增书：在 `src/data/books.js` 加一条（id、标题、封面、`href`、`storeKey`、`start`），把封面放进 `public/covers/`。

```bash
npm ci
npm run build
npx astro preview
```
