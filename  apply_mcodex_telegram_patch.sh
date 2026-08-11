#!/usr/bin/env bash
set -euo pipefail

if [ ! -f "server.ts" ] || [ ! -f "src/pages/AdminPage.jsx" ]; then
  echo "Откройте терминал в корне проекта mcodex-pro (там, где server.ts)." >&2
  exit 1
fi

mkdir -p src/components
cat > src/components/TelegramPostBuilder.jsx <<'COMPONENT_EOF'
import { useEffect, useState } from 'react'
import { Eye, Sparkles, Upload } from 'lucide-react'

export default function TelegramPostBuilder({
  lang,
  channelId,
  channelTitle,
  setChannelTitle,
  postText,
  setPostText,
  postTextEn,
  setPostTextEn,
  buttons,
  addPostButton,
  updatePostButton,
  deletePostButton,
  postImageFile,
  setPostImageFile,
  postImagePreviewUrl,
  scheduleChoice,
  setScheduleChoice,
  scheduleAt,
  setScheduleAt,
  createPostDraft,
  publishDraftNow,
  scheduleDraft,
  previewResult,
  getButtonClass,
}) {
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    if (!postImageFile) {
      setImagePreview('')
      return undefined
    }
    const url = URL.createObjectURL(postImageFile)
    setImagePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [postImageFile])

  const escapeHtml = (value) => String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

  const telegramHtml = (value) => escapeHtml(value).replace(
    /&lt;(\/?)((?:b|strong|i|em|u|s|code|pre|blockquote))(.*?)&gt;/gi,
    '<$1$2$3>'
  )

  const text = lang === 'en' ? (postTextEn || postText) : (postText || postTextEn)
  const previewHtml = `${channelTitle ? `<b>${telegramHtml(channelTitle)}</b><br/><br/>` : ''}${telegramHtml(text).replace(/\n/g, '<br/>')}`
  const previewImage = imagePreview || postImagePreviewUrl || previewResult?.previewImageUrl

  return (
    <section className="rounded-[28px] border border-cyan-400/30 bg-[#08152d] p-4 sm:p-5 shadow-2xl">
      <div className="flex items-center justify-between gap-3 mb-5">
        <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
          <Sparkles size={19} className="text-cyan-300" />
          {lang === 'en' ? 'Telegram Channel Post Builder' : 'Создание поста в Telegram канал'}
        </h3>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-300">BOT API STYLE</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-5">
        <div className="space-y-4">
          <div className="rounded-2xl border border-cyan-500/25 bg-[#061225] p-4">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">{lang === 'en' ? 'Target public channel' : 'Публичный канал назначения'}</div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-cyan-500/20 bg-[#020b18] px-3 py-3">
              <div>
                <div className="text-sm font-bold text-white">Mediabuy Lab — Public Channel</div>
                <div className="text-[11px] text-slate-400">@mediabuy_lab · chat ID {channelId || '-1002061825930'}</div>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold text-emerald-300">PUBLIC</span>
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-500/25 bg-[#061225] p-4">
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-slate-400">{lang === 'en' ? 'Channel header' : 'Заголовок канала'}</label>
            <input value={channelTitle} onChange={(e) => setChannelTitle(e.target.value)} className="w-full rounded-xl border border-cyan-500/25 bg-[#020b18] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-cyan-500/25 bg-[#061225] p-4">
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-slate-400">Текст поста (RU)</label>
              <textarea value={postText} onChange={(e) => setPostText(e.target.value)} rows={10} className="w-full resize-y rounded-xl border border-cyan-500/20 bg-[#020b18] px-3 py-2.5 text-sm leading-6 text-white outline-none focus:border-cyan-300" placeholder={'🔥 <b>Новое предложение</b>\n\nОписание поста...'} />
            </div>
            <div className="rounded-2xl border border-indigo-500/25 bg-[#071229] p-4">
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-slate-400">Текст поста (EN)</label>
              <textarea value={postTextEn} onChange={(e) => setPostTextEn(e.target.value)} rows={10} className="w-full resize-y rounded-xl border border-indigo-500/20 bg-[#020b18] px-3 py-2.5 text-sm leading-6 text-white outline-none focus:border-indigo-300" placeholder={'🔥 <b>New offer</b>\n\nPost description...'} />
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-500/25 bg-[#061225] p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div><div className="text-sm font-bold text-white">Inline-кнопки и цвета</div><div className="text-[10px] text-slate-500">success · primary · danger · default</div></div>
              <button onClick={addPostButton} className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300">+ Добавить кнопку</button>
            </div>
            <div className="space-y-3">
              {buttons.map((btn, idx) => (
                <div key={btn.id ?? idx} className="rounded-2xl border border-slate-700/70 bg-[#020b18] p-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input value={btn.text} onChange={(e) => updatePostButton(btn.id ?? idx, { text: e.target.value })} placeholder="Текст кнопки (RU)" className="rounded-xl border border-cyan-500/20 bg-[#010710] px-3 py-2 text-xs text-white" />
                    <input value={btn.text_en || ''} onChange={(e) => updatePostButton(btn.id ?? idx, { text_en: e.target.value })} placeholder="Button text (EN)" className="rounded-xl border border-cyan-500/20 bg-[#010710] px-3 py-2 text-xs text-white" />
                    <input value={btn.url || ''} onChange={(e) => updatePostButton(btn.id ?? idx, { url: e.target.value })} placeholder={btn.is_web_app ? 'Mini App URL' : 'https://...'} className="rounded-xl border border-cyan-500/20 bg-[#010710] px-3 py-2 text-xs text-white" />
                    <select value={btn.style || 'default'} onChange={(e) => updatePostButton(btn.id ?? idx, { style: e.target.value })} className="rounded-xl border border-cyan-500/20 bg-[#010710] px-3 py-2 text-xs text-white">
                      <option value="success">🟢 Green (success)</option><option value="primary">🔵 Blue (primary)</option><option value="danger">🔴 Red (danger)</option><option value="default">⚪ Gray (default)</option>
                    </select>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <label className="flex items-center gap-2 text-[11px] font-semibold text-cyan-300"><input type="checkbox" checked={!!btn.is_web_app} onChange={(e) => updatePostButton(btn.id ?? idx, { is_web_app: e.target.checked })} />Открывает Web App</label>
                    <button onClick={() => deletePostButton(btn.id ?? idx)} className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[11px] font-bold text-rose-300">Удалить</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
            <div className="rounded-2xl border border-cyan-500/25 bg-[#061225] p-4">
              <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Изображение поста</div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <label className="cursor-pointer rounded-xl bg-cyan-500 px-4 py-2 text-xs font-black text-slate-950"><Upload size={14} className="inline mr-1" /> Выберите файл<input type="file" accept="image/*" className="hidden" onChange={(e) => setPostImageFile(e.target.files?.[0] || null)} /></label>
                <span className="text-xs text-slate-400">{postImageFile?.name || 'Файл не выбран'}</span>
                {postImageFile && <button onClick={() => setPostImageFile(null)} className="text-[11px] font-bold text-rose-300">× убрать</button>}
              </div>
            </div>
            <div className="rounded-2xl border border-cyan-500/25 bg-[#061225] p-4">
              <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Время публикации</div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button onClick={() => { setScheduleChoice('now'); setScheduleAt('') }} className={`rounded-xl px-3 py-2 text-xs font-bold ${scheduleChoice === 'now' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>Сейчас</button>
                <button onClick={() => setScheduleChoice('pick')} className={`rounded-xl px-3 py-2 text-xs font-bold ${scheduleChoice === 'pick' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>Запланировать</button>
                {scheduleChoice === 'pick' && <input type="datetime-local" value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)} className="rounded-xl border border-slate-700 bg-[#020b18] px-2.5 py-2 text-xs text-white" />}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={createPostDraft} className="rounded-2xl bg-cyan-500 px-5 py-2.5 text-sm font-black text-slate-950"><Eye size={15} className="inline mr-1" /> Создать драфт</button>
            {previewResult?.token && !previewResult?.published && <><button onClick={publishDraftNow} className="rounded-2xl bg-emerald-500 px-5 py-2.5 text-sm font-black text-white">Опубликовать сейчас</button><button onClick={scheduleDraft} className="rounded-2xl bg-amber-500 px-5 py-2.5 text-sm font-black text-slate-950">Запланировать</button></>}
            {previewResult?.published && previewResult?.post_url && <a href={previewResult.post_url} target="_blank" rel="noreferrer" className="rounded-2xl bg-blue-500 px-5 py-2.5 text-sm font-black text-white">Открыть опубликованный пост</a>}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-700 bg-[#18232e] p-4 sm:p-5 shadow-xl">
          <div className="mb-3 flex items-center gap-3 border-b border-slate-600/60 pb-3"><div className="h-11 w-11 rounded-full bg-cyan-500 flex items-center justify-center text-sm font-black text-white">ML</div><div><div className="text-sm font-bold text-white">Mediabuy Lab</div><div className="text-[10px] text-slate-400">@mediabuy_lab · Public channel</div></div></div>
          <div className="overflow-hidden rounded-2xl border border-slate-600 bg-[#202f3d]">
            {previewImage ? <img src={previewImage} alt="Telegram post preview" className="h-52 w-full object-cover" /> : <div className="flex h-52 items-center justify-center bg-gradient-to-br from-orange-400 via-fuchsia-500 to-blue-500 text-sm font-black text-white">ИЗОБРАЖЕНИЕ ПОСТА</div>}
            <div className="p-4"><div className="text-[13px] leading-5 text-white" dangerouslySetInnerHTML={{ __html: previewHtml }} /><div className="mt-3 space-y-2">{buttons.filter((b) => b.text || b.text_en).map((b, i) => <div key={i} className={`flex min-h-9 items-center justify-center rounded-xl px-3 py-2 ${getButtonClass(b.style)}`}><span className="text-xs font-black">{lang === 'en' ? (b.text_en || b.text) : b.text}</span>{b.is_web_app && <span className="ml-2 rounded bg-black/20 px-1.5 py-0.5 text-[8px] font-black">MINI APP</span>}</div>)}</div></div>
          </div>
          <div className="mt-3 text-[10px] text-slate-500">Telegram Bot API · channel: -1002061825930 · InlineKeyboardButton styles: success / danger / primary</div>
        </div>
      </div>
    </section>
  )
}
COMPONENT_EOF

python3 - <<'PY'
from pathlib import Path
import re, shutil, time
ROOT=Path.cwd()
S=ROOT/'server.ts'; A=ROOT/'src/pages/AdminPage.jsx'

def must_replace(path, old, new, count=1):
    s=path.read_text()
    if old not in s: raise RuntimeError(f'pattern missing: {path} :: {old[:100]}')
    path.write_text(s.replace(old,new,count))

def must_regex(path, pattern, repl, count=1):
    s=path.read_text(); ns,n=re.subn(pattern,repl,s,count=count,flags=re.M|re.S)
    if n!=count: raise RuntimeError(f'regex missing/count mismatch {n}: {pattern[:100]}')
    path.write_text(ns)

# backup
stamp=time.strftime('%Y%m%d-%H%M%S')
for p in (S,A): shutil.copy2(p, p.with_suffix(p.suffix+'.bak-'+stamp))

# SERVER
s=S.read_text()
s=s.replace("""interface Article {\n  id: number;\n  title: string;\n  image_url: string;\n  target_url: string;\n  sort_order: number;\n  is_active: boolean;\n  has_en_version: boolean;\n  title_en?: string | null;\n  image_url_en?: string | null;\n  target_url_en?: string | null;\n}""", """interface Article {\n  id: number;\n  title: string;\n  image_url: string;\n  target_url: string;\n  sort_order: number;\n  is_active: boolean;\n  has_en_version: boolean;\n  title_en?: string | null;\n  image_url_en?: string | null;\n  target_url_en?: string | null;\n  telegram_chat_id?: string | null;\n  telegram_message_id?: number | null;\n  telegram_chat_id_en?: string | null;\n  telegram_message_id_en?: number | null;\n}""")
s=s.replace("""interface AdminPostDraft {\n  token: string;\n  user_id: number;\n  chat_id: number;\n  text: string;\n  text_en?: string | null;\n  image_url?: string | null;\n  buttons: Array<{ text: string; text_en?: string | null; url: string }>;\n  channel_title?: string | null;\n  scheduleAt?: string;\n  previewLanguage?: SupportedLanguage;\n  state?: string;\n  tempButton?: { text?: string; url?: string; style?: string } | null;\n}""", """interface AdminPostDraft {\n  token: string;\n  user_id: number;\n  chat_id: number;\n  text: string;\n  text_en?: string | null;\n  image_url?: string | null;\n  buttons: Array<{ text: string; text_en?: string | null; url: string; style?: string; is_web_app?: boolean }>;\n  channel_title?: string | null;\n  scheduleAt?: string;\n  previewLanguage?: SupportedLanguage;\n  state?: string;\n  tempButton?: { text?: string; url?: string; style?: string } | null;\n}""")
# fixed public target
must_replace(S,"""app.get('/api/admin/channel-id', requireAdmin, (req, res) => {\n  const channelId = process.env.PUBLIC_CHANNEL_CHAT_ID || process.env.TELEGRAM_CHANNEL_CHAT_ID || process.env.TELEGRAM_CHANNEL_ID || process.env.ADMIN_CHANNEL_ID || '-1002061825930';\n  res.json({ channel_id: channelId });\n});""", """app.get('/api/admin/channel-id', requireAdmin, (req, res) => {\n  res.json({ channel_id: '-1002061825930' });\n});""")
# preserve style + web app flags
must_replace(S,"""draft.buttons = parsed.map((b: any) => ({ text: b.text || '', text_en: b.text_en || null, url: b.url || '', ...(b.style ? { style: b.style } : {}) }));""", """draft.buttons = parsed.map((b: any) => ({\n              text: b.text || '',\n              text_en: b.text_en || null,\n              url: b.url || '',\n              style: b.style || 'default',\n              is_web_app: Boolean(b.is_web_app),\n            }));""")
# public channel sender
must_replace(S,"""async function sendChannelPost(botToken: string, draft: AdminPostDraft, overrideChannelId?: string) {\n  const channelChatId = overrideChannelId || process.env.PUBLIC_CHANNEL_CHAT_ID || process.env.TELEGRAM_CHANNEL_CHAT_ID || process.env.TELEGRAM_CHANNEL_ID || process.env.ADMIN_CHANNEL_ID;\n  if (!channelChatId) {\n    throw new Error('Channel chat ID is not configured in environment variables');\n  }\n\n  const replyMarkup: any = {\n    inline_keyboard: draft.buttons.map((btn) => [{ text: btn.text, url: btn.url, style: (btn as any).style || 'primary' }]),\n  };""", """async function sendChannelPost(botToken: string, draft: AdminPostDraft, overrideChannelId?: string) {\n  const channelChatId = '-1002061825930';\n  const replyMarkup: any = {\n    inline_keyboard: draft.buttons\n      .filter((btn) => btn.text && (btn.url || btn.is_web_app))\n      .map((btn) => {\n        const button: any = { text: btn.text, style: btn.style || 'default' };\n        if (btn.is_web_app) {\n          const webAppUrl = btn.url || process.env.MINI_APP_URL || '';\n          if (webAppUrl) button.web_app = { url: webAppUrl };\n          else button.url = process.env.MINI_APP_FALLBACK_URL || 'https://t.me/mediabuy_lab';\n        } else {\n          button.url = btn.url;\n        }\n        return [button];\n      }),\n  };""")
# return Telegram result
must_replace(S,"""    if (!data.ok) {\n      throw new Error(`Telegram sendPhoto failed: ${JSON.stringify(data)}`);\n    }\n  } else if (draft.image_url && draft.image_url.startsWith('http')) {""", """    if (!data.ok) {\n      throw new Error(`Telegram sendPhoto failed: ${JSON.stringify(data)}`);\n    }\n    return data.result;\n  } else if (draft.image_url && draft.image_url.startsWith('http')) {""")
must_replace(S,"""    if (!data.ok) {\n      throw new Error(`Telegram sendPhoto failed: ${JSON.stringify(data)}`);\n    }\n  } else {\n    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`,""", """    if (!data.ok) {\n      throw new Error(`Telegram sendPhoto failed: ${JSON.stringify(data)}`);\n    }\n    return data.result;\n  } else {\n    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`,""")
must_replace(S,"""    if (!data.ok) {\n      throw new Error(`Telegram sendMessage failed: ${JSON.stringify(data)}`);\n    }\n  }\n}\n\nfunction formatScheduleForDisplay""", """    if (!data.ok) {\n      throw new Error(`Telegram sendMessage failed: ${JSON.stringify(data)}`);\n    }\n    return data.result;\n  }\n}\n\nfunction formatScheduleForDisplay""")
# publish returns URL/id
must_replace(S,"""    if (publishNow === '1' && !draft.scheduleAt) {\n      await sendChannelPost(botToken, draft, channel_chat_id);\n      delete adminPostDrafts[token];\n      return res.json({ ok: true, published: true });\n    }""", """    if (publishNow === '1' && !draft.scheduleAt) {\n      const telegramMessage = await sendChannelPost(botToken, draft, '-1002061825930');\n      delete adminPostDrafts[token];\n      return res.json({\n        ok: true,\n        published: true,\n        channel_chat_id: '-1002061825930',\n        message_id: telegramMessage?.message_id || null,\n        post_url: telegramMessage?.message_id ? `https://t.me/mediabuy_lab/${telegramMessage.message_id}` : null,\n      });\n    }""")
# article extra metadata
must_replace(S,"""    image_url_en: req.body.image_url_en || null,\n    target_url_en: req.body.target_url_en || null,\n  };""", """    image_url_en: req.body.image_url_en || null,\n    target_url_en: req.body.target_url_en || null,\n    telegram_chat_id: req.body.telegram_chat_id || null,\n    telegram_message_id: req.body.telegram_message_id ? Number(req.body.telegram_message_id) : null,\n    telegram_chat_id_en: req.body.telegram_chat_id_en || null,\n    telegram_message_id_en: req.body.telegram_message_id_en ? Number(req.body.telegram_message_id_en) : null,\n  };""")
# fix pre-existing unmatched else
s=s.replace("""        return;\n      }\n      } else if (callbackData.startsWith('admin_post_publish:')) {""", """        return;\n      } else if (callbackData.startsWith('admin_post_publish:')) {""",1)
# image replacement endpoint
marker="""app.delete('/api/admin/articles/:id', requireAdmin, (req, res) => {\n  const id = Number(req.params.id);\n  articles = articles.filter((a) => a.id !== id);\n  res.json({ ok: true });\n});\n\n// Admin Home Settings"""
endpoint="""app.delete('/api/admin/articles/:id', requireAdmin, (req, res) => {\n  const id = Number(req.params.id);\n  articles = articles.filter((a) => a.id !== id);\n  res.json({ ok: true });\n});\n\nfunction parseTelegramPostUrl(value: string): { chatId: string; messageId: number } | null {\n  const match = String(value || '').trim().match(/^https?:\\/\\/(?:www\\.)?t\\.me\\/(?:c\\/(\\d+)|([A-Za-z0-9_]+))\\/(\\d+)(?:\\?.*)?$/i);\n  if (!match) return null;\n  const messageId = Number(match[3]);\n  if (!Number.isFinite(messageId) || messageId <= 0) return null;\n  return { chatId: match[1] ? `-100${match[1]}` : '-1002061825930', messageId };\n}\n\napp.post('/api/admin/articles/:id/telegram-image', requireAdmin, upload.single('image'), async (req, res) => {\n  let tempPath: string | null = req.file?.path || null;\n  try {\n    const article = articles.find((a) => a.id === Number(req.params.id));\n    if (!article) return res.status(404).json({ ok: false, detail: 'Article not found' });\n    if (!req.file) return res.status(400).json({ ok: false, detail: 'Image file is required' });\n    const language = req.body.language === 'en' ? 'en' : 'ru';\n    const targetUrl = language === 'en' ? article.target_url_en : article.target_url;\n    const parsed = parseTelegramPostUrl(targetUrl || '');\n    if (!parsed) return res.status(400).json({ ok: false, detail: 'Target URL must be like https://t.me/mediabuy_lab/123' });\n    const botToken = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;\n    if (!botToken) return res.status(500).json({ ok: false, detail: 'Bot token not configured' });\n\n    const formData = new FormData();\n    formData.append('chat_id', parsed.chatId);\n    formData.append('message_id', String(parsed.messageId));\n    formData.append('media', JSON.stringify({ type: 'photo', media: 'attach://telegram_photo' }));\n    formData.append('telegram_photo', fs.createReadStream(req.file.path));\n    const headers = (formData as any).getHeaders ? (formData as any).getHeaders() : {};\n    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/editMessageMedia`, { method: 'POST', headers, body: formData });\n    const data = (await tgRes.json()) as any;\n    if (!data.ok) throw new Error(`Telegram editMessageMedia failed: ${JSON.stringify(data)}`);\n\n    const destDir = path.join(uploadsDir, 'home');\n    fs.mkdirSync(destDir, { recursive: true });\n    const ext = path.extname(req.file.originalname) || '.jpg';\n    const fileName = `article-${article.id}-${language}-${Date.now()}${ext}`;\n    const destPath = path.join(destDir, fileName);\n    fs.renameSync(req.file.path, destPath);\n    tempPath = null;\n    const localUrl = `/uploads/home/${fileName}`;\n    if (language === 'en') {\n      article.image_url_en = localUrl;\n      article.telegram_chat_id_en = parsed.chatId;\n      article.telegram_message_id_en = parsed.messageId;\n    } else {\n      article.image_url = localUrl;\n      article.telegram_chat_id = parsed.chatId;\n      article.telegram_message_id = parsed.messageId;\n    }\n    res.json({ ok: true, article, image_url: localUrl, chat_id: parsed.chatId, message_id: parsed.messageId });\n  } catch (err: any) {\n    console.error('Telegram showcase image replacement failed:', err);\n    res.status(500).json({ ok: false, detail: err?.message || 'Failed to replace Telegram post image' });\n  } finally {\n    if (tempPath && fs.existsSync(tempPath)) { try { fs.unlinkSync(tempPath); } catch {} }\n  }\n});\n\n// Admin Home Settings"""
if marker not in s: raise RuntimeError('article marker missing')
s=s.replace(marker,endpoint,1)
S.write_text(s)

# ADMIN
s=A.read_text()
# import component
must_replace(A,"""import PageShell from '../components/PageShell.jsx'""", """import PageShell from '../components/PageShell.jsx'\nimport TelegramPostBuilder from '../components/TelegramPostBuilder.jsx'""")
# state
must_replace(A,"""  const [articles, setArticles] = useState([])\n  const [orders, setOrders] = useState([])""", """  const [articles, setArticles] = useState([])\n  const [orders, setOrders] = useState([])\n  const [articleImageUploadingId, setArticleImageUploadingId] = useState(null)""")
# publish result
must_replace(A,"""      if (res.data && res.data.ok) {\n        showStatus(lang === 'en' ? 'Published' : 'Опубликовано', 'success')\n        setPreviewResult(null)\n      } else {""", """      if (res.data && res.data.ok) {\n        setPreviewResult({ ...previewResult, published: true, post_url: res.data.post_url, message_id: res.data.message_id })\n        showStatus(lang === 'en' ? 'Опубликовано в public channel' : 'Опубликовано в public channel', 'success')\n      } else {""")
# article image handler before delete
must_replace(A,"""  const deleteArticle = async (id) => {""", """  const replaceArticleTelegramImage = async (article, file, language = 'ru') => {\n    if (!file) return\n    setArticleImageUploadingId(`${article.id}:${language}`)\n    try {\n      const form = new FormData()\n      form.append('image', file)\n      form.append('language', language)\n      const { data } = await api.post(`/admin/articles/${article.id}/telegram-image`, form)\n      if (data?.article) setArticles(prev => prev.map(a => a.id === article.id ? data.article : a))\n      showStatus(lang === 'en' ? 'Telegram + showcase image replaced' : 'Фото в Telegram и на витрине заменено', 'success')\n    } catch (err) {\n      const detail = err?.response?.data?.detail || ''\n      showStatus((lang === 'en' ? 'Image replacement failed' : 'Ошибка замены изображения') + (detail ? `: ${detail}` : ''), 'error')\n    } finally {\n      setArticleImageUploadingId(null)\n    }\n  }\n\n  const deleteArticle = async (id) => {""")
# article UI insert
must_replace(A,"""                    {art.has_en_version && (\n                      <div className=\"p-2 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-1.5\">""", """                    <div className=\"flex flex-wrap items-center gap-2 pt-1\">\n                      <label className=\"cursor-pointer flex items-center gap-1 rounded-lg border border-cyan-400/40 bg-cyan-950/40 px-3 py-1.5 text-[11px] font-bold text-cyan-300\">\n                        <Upload size={12} /> {articleImageUploadingId === `${art.id}:ru` ? 'Загрузка…' : 'Заменить фото TG + витрины'}\n                        <input type=\"file\" accept=\"image/*\" className=\"hidden\" disabled={articleImageUploadingId === `${art.id}:ru`} onChange={(e) => { const file = e.target.files?.[0]; if (file) replaceArticleTelegramImage(art, file, 'ru'); e.target.value = '' }} />\n                      </label>\n                      {art.target_url && <a href={art.target_url} target=\"_blank\" rel=\"noreferrer\" className=\"rounded-lg border border-slate-600 bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-slate-300\">Telegram ↗</a>}\n                    </div>\n\n                    {art.has_en_version && (\n                      <div className=\"p-2 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-1.5\">""")
# replace create-post tab with component
start=s.index("        {/* CREATE POST TAB */}")
end=s.rfind("\n    </PageShell>")
component="""        {/* CREATE POST TAB */}\n        {activeTab === 'create_post' && (\n          <TelegramPostBuilder\n            lang={lang}\n            channelId={channelId}\n            channelTitle={channelTitle}\n            setChannelTitle={setChannelTitle}\n            postText={postText}\n            setPostText={setPostText}\n            postTextEn={postTextEn}\n            setPostTextEn={setPostTextEn}\n            buttons={buttons}\n            addPostButton={addPostButton}\n            updatePostButton={updatePostButton}\n            deletePostButton={deletePostButton}\n            postImageFile={postImageFile}\n            setPostImageFile={setPostImageFile}\n            postImagePreviewUrl=\"\"\n            scheduleChoice={scheduleChoice}\n            setScheduleChoice={setScheduleChoice}\n            scheduleAt={scheduleAt}\n            setScheduleAt={setScheduleAt}\n            createPostDraft={createPostDraft}\n            publishDraftNow={publishDraftNow}\n            scheduleDraft={scheduleDraft}\n            previewResult={previewResult}\n            getButtonClass={getButtonClass}\n          />\n        )}\n"""
s=s[:start]+component+s[end:]
A.write_text(s)

# env
E=ROOT/'.env'; es=E.read_text() if E.exists() else ''
if re.search(r'^PUBLIC_CHANNEL_CHAT_ID=.*$',es,re.M): es=re.sub(r'^PUBLIC_CHANNEL_CHAT_ID=.*$','PUBLIC_CHANNEL_CHAT_ID=-1002061825930',es,flags=re.M)
else: es=es.rstrip()+"\nPUBLIC_CHANNEL_CHAT_ID=-1002061825930\n"
E.write_text(es)
print('OK')

PY

echo ""
echo "PATCH OK"
echo "1) npm install"
echo "2) npm run build"
echo "3) npm run dev"