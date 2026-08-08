import crypto from 'node:crypto';

const recent = globalThis.__qingduRecent || new Map();
const rates = globalThis.__qingduRates || new Map();
globalThis.__qingduRecent = recent;
globalThis.__qingduRates = rates;

const required = ['name','company','role','email','teamSize','scenario','budget','problem','date','time','timezone'];
const clean = (value, max = 2000) => String(value ?? '').trim().slice(0, max);
const escapeHtml = (s) => clean(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const escapeIcs = (s) => clean(s).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function makeIcs(data, bookingId) {
  const start = `${data.date.replaceAll('-','')}T${data.time.replace(':','')}00`;
  const [hh, mm] = data.time.split(':').map(Number);
  const endDate = new Date(`${data.date}T${data.time}:00`);
  endDate.setMinutes(endDate.getMinutes() + 45);
  const y = endDate.getFullYear();
  const m = String(endDate.getMonth()+1).padStart(2,'0');
  const d = String(endDate.getDate()).padStart(2,'0');
  const end = `${y}${m}${d}T${String(endDate.getHours()).padStart(2,'0')}${String(endDate.getMinutes()).padStart(2,'0')}00`;
  const stamp = new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
  return [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Qingdu Technology//ACUindex Demo Booking//CN','CALSCALE:GREGORIAN','METHOD:PUBLISH','BEGIN:VEVENT',
    `UID:${bookingId}@acuindex.cn`, `DTSTAMP:${stamp}`, `DTSTART;TZID=${escapeIcs(data.timezone)}:${start}`, `DTEND;TZID=${escapeIcs(data.timezone)}:${end}`,
    'SUMMARY:清度科技 / ACUindex 预约演示',
    `DESCRIPTION:${escapeIcs(`公司：${data.company}\n场景：${data.scenario}\n预约编号：${bookingId}\n会议说明：清度团队将在确认后补充线上会议链接。`)}`,
    'LOCATION:线上会议（链接待确认）','STATUS:TENTATIVE','END:VEVENT','END:VCALENDAR'
  ].join('\r\n');
}

async function sendResend(payload) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`Resend ${response.status}: ${await response.text()}`);
  return response.json();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'仅支持 POST。' });
  const ip = clean(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown', 120).split(',')[0];
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const attempts = (rates.get(ip) || []).filter(t => now - t < windowMs);
  if (attempts.length >= 5) return res.status(429).json({ ok:false, error:'提交过于频繁，请十分钟后重试。' });
  attempts.push(now); rates.set(ip, attempts);

  const raw = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  if (clean(raw.website)) return res.status(200).json({ ok:true, bookingId:'filtered', emailStatus:'filtered' });
  const data = {};
  for (const [k,v] of Object.entries(raw)) data[k] = clean(v, k === 'problem' || k === 'notes' ? 4000 : 300);
  const missing = required.filter(k => !data[k]);
  if (missing.length) return res.status(400).json({ ok:false, error:`缺少必填字段：${missing.join(', ')}` });
  if (!emailRe.test(data.email)) return res.status(400).json({ ok:false, error:'邮箱格式不正确。' });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || !/^\d{2}:\d{2}$/.test(data.time)) return res.status(400).json({ ok:false, error:'预约日期或时间格式不正确。' });

  const idem = clean(req.headers['idempotency-key'] || '', 120);
  const fingerprint = crypto.createHash('sha256').update(`${idem}|${data.email}|${data.date}|${data.time}|${data.company}`).digest('hex');
  const existing = recent.get(fingerprint);
  if (existing && now - existing.createdAt < windowMs) return res.status(200).json(existing.response);

  const bookingId = `QD-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const ics = makeIcs(data, bookingId);
  let emailStatus = 'not_configured';

  if (process.env.RESEND_API_KEY && process.env.BOOKING_TO_EMAIL && process.env.BOOKING_FROM_EMAIL) {
    const rows = Object.entries({
      '姓名':data.name,'公司':data.company,'职位':data.role,'邮箱':data.email,'手机号或微信':data.contact || '未填写','团队规模':data.teamSize,
      '主要场景':data.scenario,'预算区间':data.budget,'希望解决的问题':data.problem,'预约时间':`${data.date} ${data.time} ${data.timezone}`,'备注':data.notes || '无','预约编号':bookingId
    }).map(([k,v]) => `<tr><th style="text-align:left;padding:8px 12px;border-bottom:1px solid #ddd">${escapeHtml(k)}</th><td style="padding:8px 12px;border-bottom:1px solid #ddd">${escapeHtml(v)}</td></tr>`).join('');
    const attachment = [{ filename:`qingdu-demo-${bookingId}.ics`, content:Buffer.from(ics).toString('base64'), content_type:'text/calendar' }];
    await sendResend({
      from: process.env.BOOKING_FROM_EMAIL, to:[process.env.BOOKING_TO_EMAIL], reply_to:data.email,
      subject:`[清度预约] ${data.company} · ${data.name} · ${data.date} ${data.time}`,
      html:`<div style="font-family:Arial,'PingFang SC',sans-serif;color:#111"><h1>新的清度演示预约</h1><table style="border-collapse:collapse;width:100%">${rows}</table></div>`, attachments:attachment
    });
    await sendResend({
      from: process.env.BOOKING_FROM_EMAIL, to:[data.email],
      subject:`清度科技预约确认 · ${data.date} ${data.time}`,
      html:`<div style="font-family:Arial,'PingFang SC',sans-serif;color:#111;line-height:1.8"><h1>预约信息已收到</h1><p>${escapeHtml(data.name)}，你好：</p><p>清度团队已收到你关于 <strong>${escapeHtml(data.scenario)}</strong> 的演示预约。</p><p>预约时间：${escapeHtml(data.date)} ${escapeHtml(data.time)} ${escapeHtml(data.timezone)}<br>预约编号：${bookingId}</p><p>团队确认后将补充线上会议链接。ICS 日历文件已附在邮件中。</p></div>`, attachments:attachment
    });
    emailStatus = 'sent';
  }

  const response = { ok:true, bookingId, emailStatus, ics };
  recent.set(fingerprint, { createdAt:now, response });
  for (const [key, val] of recent) if (now - val.createdAt > windowMs) recent.delete(key);
  return res.status(200).json(response);
}
