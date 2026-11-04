'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const S = window.HUB_STRATEGY, D = window.HUB_WEEKS, M = window.HUB_MEDIA, C = window.HUB_SHARE_CONFIG ?? {};
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const nl = value => esc(value).replaceAll('\n','<br>');
  const date = value => /^\d{4}-\d{2}-\d{2}$/.test(value ?? '') ? value.replaceAll('-','.') : '待确认';
  // Only controlled relative assets or credential-free HTTPS addresses are rendered.
  function safeURL(value, asset = false) {
    if (typeof value !== 'string' || !value.trim() || /[\x00-\x20\\]/.test(value)) return null;
    if (asset && /^(?:\.\/)?assets\/[a-zA-Z0-9._\/-]+$/.test(value) && !value.split('/').includes('..')) return value;
    try {
      const u = new URL(value);
      if (u.protocol !== 'https:' || u.username || u.password) return null;
      if (/^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(u.hostname)) return null;
      if ([...u.searchParams.keys()].some(k=> /token|signature|sig|credential|secret|authorization/i.test(k))) return null;
      if (/(^|\.)github\.com$/.test(u.hostname) && /\/(blob|tree)\//.test(u.pathname) && asset) return null;
      return u.href;
    } catch { return null; }
  }
  const iconPaths = {
    pulse:'<path d="M2 13h5l3-9 4 17 3-10 2 2h3"/>',
    people:'<circle cx="8" cy="7" r="3"/><path d="M2 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m2 4a5 5 0 0 1 4 4v3"/>',
    compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6z"/>',
    video:'<rect x="2" y="5" width="20" height="14" rx="3"/><path d="m10 9 5 3-5 3z"/>',
    image:'<rect x="2" y="3" width="20" height="18" rx="3"/><circle cx="8" cy="9" r="1.5"/><path d="m3 18 5-5 4 4 4-6 5 7"/>',
    link:'<path d="M9 15l6-6m-6-3 2-2a5 5 0 0 1 7 7l-2 2M8 11l-2 2a5 5 0 0 0 7 7l2-2"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] ?? iconPaths.image}</svg>`;
  const details = (title, body, cls='mini-details') => `<details class="${cls}"><summary>${esc(title)}</summary>${body}</details>`;
  const configuredPreviewURL = () => safeURL(C.livePreviewUrl);

  function renderStrategy() {
    return `<div class="hero"><div><p class="kicker">${esc(S.eyebrow)}</p><h1 id="direction-title">${nl(S.headline)}</h1><p class="lead">${esc(S.lead)}</p><div class="hero-footer"><span>长期方向 · 不随每日进展改变</span><a href="#current">直接看本周进展 ↓</a></div></div><div class="hero-side"><h2>企业是主体，线上与线下相互反馈</h2><div class="space-pair"><div class="space-item"><strong>线上经营空间</strong><span>信息、关系、探索<br>决策与协作</span></div><span class="space-arrow" aria-label="双向连接">⇄</span><div class="space-item"><strong>线下经营活动</strong><span>交易、履约<br>真实经营结果</span></div></div><p class="enterprise"><b>企业自身空间 ↔ 外部生态空间</b><br>保留经营主权，在清楚的边界内连接伙伴。</p><p class="hero-quote">${esc(S.promise)}</p></div></div>
    <div class="alive-section"><div class="minor-heading"><h2>什么是“活的系统”？</h2><span>不只是画面变化，而是三个层次</span></div><div class="alive-grid">${S.alive.map(a=>`<article class="alive-card"><div class="alive-top"><span class="icon-box">${icon(a.icon)}</span><span class="index">${esc(a.n)}</span></div><p class="kicker">${esc(a.eyebrow)}</p><h3>${nl(a.title)}</h3><p class="body">${esc(a.body)}</p>${details('进一步说明',`<p>${esc(a.detail)}</p>`)}</article>`).join('')}</div></div>
    <article class="ecology"><div><p class="kicker">企业与生态，不可分割</p><h2>${nl(S.ecology.title)}</h2></div><div><p class="body">${esc(S.ecology.body)}</p><div class="flow-line" aria-label="经营与生态的反馈循环">${S.ecology.steps.map((x,i)=>`${i?'<span class="flow-arrow" aria-hidden="true">→</span>':''}<span class="flow-step">${esc(x)}</span>`).join('')}<span class="flow-arrow" aria-label="回到真实经营需求">↺</span></div>${details('为什么伙伴愿意进来',`<p>${esc(S.ecology.detail)}</p>`)}</div></article>
    <article class="governance"><div class="intro"><div><p class="kicker">基础设施的核心设计</p><h2>${esc(S.governance.title)}</h2></div><p>${esc(S.governance.body)}</p></div><div class="relations">${S.governance.relations.map(r=>`<section class="relation"><h3>${esc(r.name)}</h3><strong>${esc(r.rule)}</strong><p>${esc(r.text)}</p></section>`).join('')}</div><p class="closing">${esc(S.governance.closing)}</p>${details('产品与组织如何共同成长',`<p>${esc(S.governance.org)}</p><p>${esc(S.spaceNote)}</p>`)}</article><p class="strategy-boundary">${esc(S.boundary)}</p>`;
  }
  function renderRoadmap() {
    return `<div class="section-heading"><div><p class="kicker">方向不变，以高频使用和反馈推进</p><h2 id="roadmap-title">两个月，逐步形成完整 Demo</h2></div><span class="soft-label">2026年11月—12月</span></div><div class="month-grid">${S.months.map(m=>`<article class="month"><div class="month-number">${esc(m.month)}<small>月 · ${esc(m.phase)}</small></div><div><h3>${esc(m.title)}</h3><p>${esc(m.text)}</p><span class="outcome">${esc(m.result)}</span></div></article>`).join('')}</div><p class="iteration">${esc(S.iteration)}</p>`;
  }
  function weekTasks(w) {
    return `<article class="work-panel"><p class="work-top">${esc(w.summary)}</p>${(w.tasks??[]).map((t,i)=>`<section class="task"><span class="task-no">0${i+1}</span><div><div class="task-header"><h3>${esc(t.title)}</h3><span>${esc(t.state)}</span></div><p>${esc(t.detail)}</p></div></section>`).join('')}<p class="task-note">${esc(w.taskNote??'')}</p><div class="checkpoint"><strong>下次看什么 <span class="when">${w.next.date?date(w.next.date):'具体日期待确认'}</span></strong><p>${esc(w.next.deliverable)}</p><p>${esc(w.next.condition)}</p></div></article>`;
  }
  function attention(w) {
    const decisions=w.decisions??[];
    return `<aside class="attention-panel"><h3>希望得到的使用反馈</h3><p class="hint">先亲手用，或先看一段实际操作。</p>${(w.feedbackAsks??[]).map(q=>`<p class="feedback-question">${esc(q)}</p>`).join('')}<div class="decision-block"><h4>需要一起判断</h4>${decisions.length?decisions.slice(0,2).map(d=>`<p><b>${esc(d.title)}</b></p><p>${esc(d.request??d.text)}</p>${d.due?`<p>最晚需要确认：${date(d.due)}</p>`:''}`).join(''):'<p>本次暂无已确认的决策事项。涉及以下变化时，再单独说明选择、影响和建议。</p>'}<div class="decision-categories"><span>战略取舍</span><span>市场优先级</span><span>资源投入</span><span>关键节点调整</span></div></div><p class="delegation">具体研发组织与日常执行，由项目负责人在已确认的范围内安排。</p></aside>`;
  }
  function records(w) {
    const result=(w.results??[]).length?w.results.map(r=>`<p>${esc(r.text??r.summary)}</p>`).join(''):'<p>等待本轮开发完成并确认可展示后，补入实际成果与尚未完成的部分。</p>';
    const feedback=(w.feedback??[]).length?w.feedback.map(f=>`<p>${date(f.date)} · ${esc(f.original??f.text)}</p>`).join(''):'<p>尚未记录本轮使用反馈。未回复不代表已经认可。</p>';
    return details('展开计划、实际结果与反馈',`<div class="records-body"><h4>本周原计划</h4><p>${w.planConfirmed?esc(w.originalPlan?.summary??'已确认，具体内容见任务记录。'):'具体周计划尚待确认；不会用后来完成的事情倒过来改写原承诺。'}</p><h4>实际结果</h4>${result}<p>${esc(w.reviewText)}</p><h4>收到的反馈</h4>${feedback}<h4>下一周</h4><p>${esc(w.nextWeek?.summary??'根据这周的实际结果和反馈共同制定，不自动新增交付承诺。')}</p><h4>记录更新时间</h4><p>页面内容整理：${date(w.lastContentUpdatedAt)}。${w.lastCheckedAt?'开发资料核查：'+date(w.lastCheckedAt)+'。':'本轮开发资料尚未重新核查。'}</p>${(w.addenda??[]).map(a=>`<p>后续补记 · ${date(a.date)}：${esc(a.text)}</p>`).join('')}</div>`,'week-records');
  }
  const placeholder=(kind,title,note)=>`<div class="media-placeholder"><div>${icon(kind)}<strong>${esc(title)}</strong><p>${esc(note)}</p></div></div>`;
  function isApproved(batch,item){return batch?.approval==='approved' && item?.approved===true;}
  function renderMedia(w, archive=false) {
    const batch=M?.batches?.[w.id]??{},v=batch.video??{title:'看一段真实的操作过程',caption:'视频准备好后，在这里直接播放。'};
    const live = !archive ? configuredPreviewURL() : null;
    const liveFrame = live ? '<iframe class="live-preview-iframe" title="当前产品版本可操作预览" src="' + esc(live) + '" loading="eager" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>' : null;
    const src=isApproved(batch,v)?safeURL(v.src,true):null;
    const poster=src?safeURL(v.poster,true):null, captions=src?safeURL(v.captions,true):null;
    const vid=liveFrame?liveFrame:src?`<video controls playsinline preload="none"${poster?` poster="${esc(poster)}"`:''} aria-label="${esc(live?'当前版本可操作预览':v.title)}" data-player="${esc(w.id)}"><source src="${esc(src)}" type="${/\.webm(?:\?|$)/i.test(src)?'video/webm':'video/mp4'}">${captions?`<track kind="captions" src="${esc(captions)}" srclang="zh" label="中文" default>`:''}<p>浏览器不能直接播放，<a href="${esc(src)}" target="_blank" rel="noopener noreferrer">打开视频文件</a>。</p></video><div class="media-error" role="status" hidden>视频暂时无法播放，请稍后再试。<br><a href="${esc(src)}" target="_blank" rel="noopener noreferrer">打开视频文件</a></div>`:(archive?placeholder('video','待补充本轮操作视频','收到并确认后，在本页直接播放'):placeholder('link','等待配置当前版本','在 share-config.js 填写 livePreviewUrl'));
    return `<div class="media-stage"><div class="video-frame">${vid}</div><div class="video-side"><p class="kicker">${live?'直接体验当前版本':'用一段操作，把变化看清楚'}</p><h3>${esc(live?'当前版本实时预览':v.title)}</h3><p class="body">${esc(live?'直接在这里点击、输入和体验当前 Cloudflare 版本。':v.caption)}</p><span class="video-state">${live?'实时预览已接入':src?`真实操作记录 · ${batch.capturedAt?date(batch.capturedAt.slice(0,10)):'拍摄日期见补充记录'}`:'当前预览尚未接入'}</span><p class="player-note">可直接在这里体验当前版本，也可以在新窗口打开。建议使用电脑端操作。</p>${src&&v.transcript?details('查看操作文字说明',`<p>${esc(v.transcript)}</p>`,'transcript'):''}</div></div>`;
  }
  function renderCurrent(w){return `<div class="section-heading"><div><p class="kicker">${esc(w.label)} · 本周做具体的事</p><h2 id="current-title">${esc(w.title)}</h2></div><span class="pill warning"><span class="dot"></span>${esc(w.status)}</span></div><div class="current-layout">${weekTasks(w)}${attention(w)}</div>${records(w)}`;}
  function summary(w){return [`决策中枢｜${w.label}`,`方向：一个经营主体，两个经营空间。以经营决策为起点，建设人、AI与企业协同经营的基础设施。`,`11月：用标明的演示数据做出可操作的核心交互初版。`,`12月：接入真实经营场景的决策网络，形成完整 Demo。`,`本周：${w.summary}`,...w.tasks.map(t=>`${t.title}｜${t.state}`),`下次看：${w.next.deliverable}；日期：${w.next.date??'待确认'}`,`需要一起判断：${w.decisions.length?w.decisions.map(d=>d.title).join('；'):'暂无已确认的决策事项'}`].join('\n');}
  let toastTimer;function toast(text){$('toast').textContent=text;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,3500);}
  try {
    if(!S||!D?.weeks?.length||!M)throw Error('缺少页面内容文件');
    const w=D.weeks.find(x=>x.id===D.currentWeekId);if(!w)throw Error('未找到本周记录');
    $('direction').innerHTML=renderStrategy();$('roadmap').innerHTML=renderRoadmap();$('current').innerHTML=renderCurrent(w);
    const preview=configuredPreviewURL() ?? (w.preview?.approved?safeURL(w.preview.url):null);
    $('product-media').innerHTML=`<div class="section-heading"><div><p class="kicker">看产品，不只听描述</p><h2 id="media-title">这一版，实际是什么样</h2></div><div class="demo-link-wrap">${preview?`<a class="demo-link" href="${esc(preview)}" target="_blank" rel="noopener noreferrer">亲手体验当前版本 ↗</a>`:'<button class="demo-link" disabled type="button">体验链接待补充</button>'}</div></div><p class="media-note">产品以电脑端体验为主。实时预览用于亲手体验当前版本。</p>${renderMedia(w)}`;
    const history=D.weeks.filter(x=>x.id!==w.id).sort((a,b)=>b.id.localeCompare(a.id));
    $('history-content').innerHTML=history.length?history.map(h=>`<details class="history-card"><summary><span>${esc(h.label)}</span><strong>${esc(h.title)}</strong></summary><div class="history-body"><p>${esc(h.summary)}</p>${records(h)}${renderMedia(h,true)}</div></details>`).join(''):'<div class="empty-history">当前还没有已归档的周记录。后续按时间由近到远排列，展开后可看当时的计划、画面、结果与反馈。</div>';
    $('build-note').textContent=`页面版本 V4 · 内容整理 ${date(D.contentDate)}`;
    $('copy-summary').addEventListener('click',async()=>{const text=summary(w);try{if(!navigator.clipboard?.writeText)throw Error('no clipboard');await navigator.clipboard.writeText(text);toast('已复制本周摘要，未发送给任何人。');}catch{$('copy-text').value=text;$('copy-dialog').showModal();$('copy-text').focus();$('copy-text').select();}});
    $('close-copy').addEventListener('click',()=>$('copy-dialog').close());
    $('close-image').addEventListener('click',()=>$('image-dialog').close());
    $('image-dialog').addEventListener('click',e=>{if(e.target===$('image-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
    $('print-page').addEventListener('click',()=>window.print());
    document.addEventListener('click',e=>{const b=e.target.closest('[data-zoom]');if(b){$('zoom-image').src=b.dataset.zoom;$('zoom-image').alt=b.dataset.title;$('image-dialog-title').textContent=b.dataset.title;$('zoom-caption').textContent=b.dataset.caption;$('image-dialog').showModal();}});
    document.querySelectorAll('video').forEach(v=>{const fail=()=>{v.hidden=true;const error=v.parentElement.querySelector('.media-error');if(error)error.hidden=false;};v.addEventListener('error',fail);v.querySelector('source')?.addEventListener('error',fail);v.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{if(other!==v)other.pause();}));});
    document.querySelectorAll('.image-button img').forEach(im=>{im.addEventListener('error',()=>{im.closest('button').hidden=true;const e=im.closest('.shot-frame').querySelector('.media-error');if(e)e.hidden=false;});});
    // Expose read-only formatting helpers for local checks, not approval controls.
    window.HUB_CHECK={safeURL,summary:()=>summary(w)};
  } catch(e){$('current').innerHTML='<div class="load-error" role="alert">页面内容未能载入。请检查文件是否齐全；信息未显示不代表工作已经完成。</div>';console.error(e);}
})();
