# 兵法研读室 · 孙子十三篇

十三篇原文、叶玉麟译文、字词注释、古注和研读图谱。读者可匿名阅读，浏览器本地保存进度。使用同一邮箱登录后可跨设备续读。

## 本地构建

使用 Node.js 22，执行 `npm ci` 和 `node scripts/build-vercel.mjs`。网页输出在 `dist/client`。Vercel 根据 `vercel.json` 运行该构建，并将 `api/[resource].js` 部署为函数。阅读页使用 hash 路由，句子和段落链接可以直接打开。

## 邮箱注册与进度

Vercel 函数仅向原站的三个读者 API 转发请求。两站共用同一套邮箱身份与 D1 阅读记录，因此此部署依赖原站的账户服务。原站的 ChatGPT 登录仍由原站处理。匿名进度存在各域名自己的浏览器存储中。

1. 在 Supabase 建立项目并启用 Email，允许新用户注册；把 Magic Link 邮件模板改为含 `{{ .Token }}` 的验证码。若项目使用 Confirm signup 模板，也给首次注册邮件加入验证码。
2. 在 Supabase 配置能向普通读者投递邮件的自定义 SMTP，并验证发件人。SMTP 密码只填在供应商后台。
3. 在原站的运行环境设置 `SUPABASE_URL` 与 `SUPABASE_PUBLISHABLE_KEY`，部署后用非项目成员的邮箱实际收信并验证。换一个浏览器以同一邮箱登录，检查已读标记和续读段落。
4. 注册通过后，将此源码推送到 GitHub，再将对应分支导入 Vercel，框架选 Other。发布后检查公开网址、深层阅读链接、收信登录与跨站账户进度。

参考：[验证码邮件](https://supabase.com/docs/guides/auth/auth-email-passwordless)、[自定义 SMTP](https://supabase.com/docs/guides/auth/auth-smtp)。
