# 归一批量｜作品原创证明档案库（全套代码）

本项目是一个 **Astro 静态站点**（GitHub Dark 风格），用于联盟“归一批量”的 **作品原创证明档案库**：
- 全站中文
- 仅展示记录与证据（图片/文字）
- **不提供下载按钮/下载链接**
- 后台使用 **Decap CMS**（/admin）在浏览器里维护工作室、作品、证据
- 可部署在 Netlify（app.netlify.com）

---

## 1. 本地运行

要求：Node.js >= 18

```bash
npm install
npm run dev
```

浏览器打开：`http://localhost:4321`

> CMS 本地模式（可选）：需要 netlify dev 才能使用 `local_backend: true`。

---

## 2. 内容在哪里改（后台写入的就是这些文件）

- 联盟信息：`src/content/site/settings.json`
- 工作室：`src/content/studios/*.md`（只公开 name + focus）
- 作品：`src/content/projects/*.md`
  - `proofStatement`：原创声明（markdown）
  - `techNotes`：技术说明（markdown，可选）
  - `evidence`：证据记录（image/text）

上传图片会放到：`public/uploads/`

---

## 3. Netlify 部署（推荐步骤）

1) 把整个项目推到 GitHub 仓库（main 分支）
2) 在 Netlify 新建站点，连接该仓库
3) Build 设置（netlify.toml 已写好）：
   - Build command：`npm run build`
   - Publish directory：`dist`

4) 开启后台登录（用于 /admin）
   - Netlify UI：Project configuration > Identity > Enable Identity
   - Registration：建议选择 Invite only
   - 然后启用 Git Gateway：Project configuration > Identity > Services > Git Gateway > Enable

5) 访问后台：
   - `https://你的站点域名/admin/`

> 说明：Decap CMS 使用 `git-gateway` 后端，会把内容修改提交回 Git 仓库，然后触发站点自动构建。

---

## 4. “阅读次数（可选）”功能

作品页右侧有“阅读次数”，使用 Netlify Functions + Netlify Blobs：
- 函数：`/.netlify/functions/views`
- 存储：Netlify Blobs store `views`

如果你不想要阅读次数：
- 删除 `netlify/functions/views.ts`
- 并在 `src/pages/p/[slug].astro` 删除对应 fetch 调用与 UI 字段即可。

---

## 5. 重要原则：不提供下载

本项目默认：
- 页面不显示任何下载按钮/下载链接
- 图片证据仅在线预览（灯箱）
- 文字证据仅在线阅读

（浏览器层面的“另存为/截图”无法 100% 禁止，这属于 Web 客观边界，但站内不会提供下载入口。）



## 6. 说明：日期与 Markdown 渲染

- YAML 前言中的 `YYYY-MM-DD` 在某些解析器下会被当作 Date 对象；本项目已在 content schema 中兼容 string/Date。
- `proofStatement / techNotes / evidence.body` 使用 Markdown 编写，页面通过 `marked` 渲染为 HTML。

---

## 🔄 重新开始（清空旧配置）— Netlify 上操作

> 适用于你之前把 Identity / Git Gateway / 用户 / 邀请搞乱了，想“一次清干净再来”。

### 1) Netlify：删除旧 Identity 实例（会清空所有 Identity 用户）
Netlify 站点控制台：
- Project configuration → Identity
- 拉到最下面 **Danger zone**
- 点击 **Delete Identity instance**

### 2) Netlify：重新启用 Identity + Git Gateway
- Project configuration → Identity → 重新启用
- Identity → Registration：建议改成 **Invite only**
- Identity → Services → **Enable Git Gateway**

### 3) 站点里两个入口的区别（非常重要）
- **/admin/**：Decap CMS（只负责“内容管理”，不负责邮箱确认）
- **/login/**：Netlify Identity Widget（只用于“邀请/确认邮箱/设置密码/首次激活”）

⚠️ 不要把登录页放在 /admin/ 下面（例如 /admin/login），否则会与 CMS 的路由冲突导致 config.yml 加载失败。

### 4) 正确的首次激活流程（不会再遇到 Email not confirmed）
1. Identity → Invite users → 邀请你的邮箱
2. 打开邮件链接后，如果地址栏带 token（例如 `#invite_token=...`）
   - 把它放到本站的 **/login/** 下：
   - 例如：`https://你的域名/login/#invite_token=...`
3. 在弹窗里设置密码/完成确认
4. 然后访问：`https://你的域名/admin/` 用邮箱+密码登录 CMS

