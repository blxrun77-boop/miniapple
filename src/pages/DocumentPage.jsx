import { useState } from 'react'
import PageShell from '../components/PageShell.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import {
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Building2,
  Check,
  Globe2,
  FileCheck2,
  Landmark,
  BadgeCheck,
  SearchCheck,
  ArrowUpRight
} from 'lucide-react'

const OFFICIAL_COMPANY_REGISTRY_URL = 'https://find-and-update.company-information.service.gov.uk/company/10549229'
const COMPANY_NUMBER = '10549229'

export default function DocumentPage() {
  const { lang } = useLanguage()
  const [copied, setCopied] = useState(false)
  const registryUrl = OFFICIAL_COMPANY_REGISTRY_URL

  const copyRegistryLink = () => {
    navigator.clipboard.writeText(registryUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <PageShell title={lang === 'en' ? 'Official Company Register' : 'Официальный реестр компании'}>
      <div className="space-y-4 pb-6">
        {/* HERO BADGE & DIRECT LINK */}
        <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-r from-[#211a08] via-[#15122e] to-[#081330] p-4 sm:p-5 shadow-[0_0_30px_rgba(251,191,36,0.15)] space-y-4">
          <div className="flex items-start gap-3.5">
            <Landmark size={28} className="text-slate-400 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded-md bg-amber-950 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-300 border border-amber-400/40">
                  GOV.UK Companies House
                </span>
                <span className="flex items-center gap-1 rounded-md bg-emerald-950/90 px-2 py-0.5 text-[10px] font-extrabold uppercase text-emerald-300 border border-emerald-400/40">
                  <CheckCircle2 size={11} />
                  {lang === 'en' ? 'Active & Verified' : 'Активная компания'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1.5 leading-snug">
                {lang === 'en'
                  ? 'Official UK Government Company Registration'
                  : 'Официальная государственная регистрация (Великобритания)'}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {lang === 'en'
                  ? 'All registration data, legal status, and company records are officially registered and publicly accessible in the UK Companies House government database.'
                  : 'Все регистрационные сведения, актуальный юридический статус и выписки официально внесены в государственный реестр Великобритании Companies House.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1">
            <a
              href={registryUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 px-4 py-2.5 text-xs font-black text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.4)] transition hover:opacity-95 active:scale-95 shrink-0"
            >
              <Globe2 size={16} />
              <span>{lang === 'en' ? 'Open in GOV.UK Companies House' : 'Открыть в реестре GOV.UK'}</span>
              <ArrowUpRight size={15} />
            </a>

            <button
              onClick={copyRegistryLink}
              className="flex items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-950/80 px-3.5 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-900 active:scale-95 transition"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? (lang === 'en' ? 'Link Copied!' : 'Ссылка скопирована!') : (lang === 'en' ? 'Copy Registry Link' : 'Скопировать ссылку')}</span>
            </button>
          </div>
        </div>

        {/* OFFICIAL REGISTRY SNAPSHOT CARD */}
        <div className="rounded-2xl border border-cyan-400/30 bg-[#09122c] p-4 sm:p-5 shadow-[0_0_25px_rgba(56,189,248,0.12)] space-y-4">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <span className="font-black text-sm text-cyan-300 flex items-center gap-2">
              <SearchCheck size={18} />
              {lang === 'en' ? 'Registry Record & Company Verification' : 'Сведения из государственного реестра'}
            </span>
            <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              #{COMPANY_NUMBER}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
            <div className="rounded-xl border border-cyan-500/25 bg-black/40 p-3.5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                {lang === 'en' ? 'Company Number' : 'Номер в реестре (Company Number):'}
              </span>
              <div className="flex items-center justify-between">
                <span className="text-cyan-200 font-black font-mono text-sm">{COMPANY_NUMBER}</span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <BadgeCheck size={14} /> {lang === 'en' ? 'Verified' : 'Проверено'}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-cyan-500/25 bg-black/40 p-3.5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                {lang === 'en' ? 'Jurisdiction & Authority' : 'Юрисдикция и регистрирующий орган:'}
              </span>
              <span className="text-white font-bold text-xs block">
                Companies House, United Kingdom (GOV.UK)
              </span>
            </div>

            <div className="rounded-xl border border-cyan-500/25 bg-black/40 p-3.5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                {lang === 'en' ? 'Company Status' : 'Статус компании:'}
              </span>
              <span className="text-emerald-300 font-black text-xs flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                {lang === 'en' ? 'Active / In Good Standing' : 'Active (Действующая / Активна)'}
              </span>
            </div>

            <div className="rounded-xl border border-cyan-500/25 bg-black/40 p-3.5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                {lang === 'en' ? 'Full Public Register Link' : 'Прямая ссылка в реестре:'}
              </span>
              <a
                href={registryUrl}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-300 font-mono text-[11px] truncate block hover:underline hover:text-cyan-200"
              >
                service.gov.uk/company/{COMPANY_NUMBER}
              </a>
            </div>
          </div>

          {/* WHAT IS INCLUDED IN REGISTRY */}
          <div className="rounded-xl border border-slate-800 bg-[#060c20] p-3.5 space-y-2 text-xs">
            <p className="font-bold text-white flex items-center gap-1.5">
              <FileCheck2 size={15} className="text-amber-400" />
              {lang === 'en' ? 'What you can verify in the official registry:' : 'Что доступно в официальном реестре:'}
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 text-[11px]">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>{lang === 'en' ? 'Company overview and active legal status' : 'Сводка компании и актуальный юридический статус'}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>{lang === 'en' ? 'Official filing history & incorporation date' : 'История подачи отчетов и дата регистрации'}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>{lang === 'en' ? 'Nature of business (SIC codes)' : 'Виды экономической деятельности (SIC)'}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>{lang === 'en' ? 'Registered office address and officers' : 'Официальный юридический адрес и сведения'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* LEGAL DETAILS & VERIFICATION SUMMARY */}
        <div className="rounded-2xl border border-slate-800 bg-[#09122c]/80 p-4 space-y-3 text-xs">
          <h4 className="font-bold text-white flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            {lang === 'en' ? 'Legal Verification & Transparency' : 'Юридическая прозрачность и гарантии'}
          </h4>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {lang === 'en'
              ? 'Mediabuy Lab operates in compliance with international standards for digital goods, media buying agency services, and educational programs.'
              : 'Mediabuy Lab соблюдает международные стандарты предоставления цифровых товаров, поставки фарм-аккаунтов, проведения практического обучения и запуска рекламных кампаний под ключ.'}
          </p>

          <div className="rounded-xl border border-cyan-500/20 bg-black/40 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">UK Registry URL:</span>
              <span className="text-cyan-300 font-mono font-bold break-all">{registryUrl}</span>
            </div>
            <a
              href={registryUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-cyan-400/20 px-3 py-1.5 text-xs font-bold text-cyan-200 border border-cyan-400/40 hover:bg-cyan-400/30 transition shrink-0"
            >
              <span>{lang === 'en' ? 'Verify Record' : 'Проверить'}</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
