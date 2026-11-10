(() => {
  document.documentElement.classList.add("js");
  const page = document.body.dataset.page || "";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const links = [["collection.html","Collection","collection"],["installations.html","Sculpture","installations"],["atelier.html","Atelier","atelier"],["journal.html","Journal","journal"],["trade.html","Trade","trade"]];

  const hdr = document.createElement("header");
  hdr.className = "hdr" + (document.body.dataset.header === "light" ? " light" : "");
  hdr.innerHTML = `<div class="in">
    <a href="index.html" class="logo" aria-label="Knotty Things home"></a>
    <nav aria-label="Primary">${links.map(([h,t,k])=>`<a href="${h}"${k===page?' aria-current="page"':""}>${t}</a>`).join("")}</nav>
    <a class="cta" href="commission.html">Commission</a>
    <button class="burger" aria-expanded="false" aria-controls="drawer">Menu</button></div>`;
  document.body.prepend(hdr);
  const drawer = document.createElement("div");
  drawer.className = "drawer"; drawer.id = "drawer";
  drawer.innerHTML = links.map(([h,t])=>`<a href="${h}">${t}</a>`).join("") + `<a href="commission.html">Commission</a><a href="contact.html">Contact</a><span class="label">contact@theknottythings.com</span>`;
  document.body.append(drawer);
  const burger = hdr.querySelector(".burger");
  burger.onclick = () => { const o = drawer.classList.toggle("open"); hdr.classList.toggle("menu-open", o); burger.setAttribute("aria-expanded", o); burger.textContent = o ? "Close" : "Menu"; document.body.style.overflow = o ? "hidden" : ""; };

  const ftr = document.createElement("footer");
  ftr.className = "ftr";
  ftr.innerHTML = `<div class="wrap">
    <a href="index.html" class="logo" aria-label="Knotty Things home"></a>
    <p class="big">Every knot,<br><em>a decision made by hand.</em></p>
    <div class="cols">
      <div><h4>Studio</h4><span>Luxuriously Artisanal. Radically Human.</span><span class="muted" style="color:rgba(243,238,230,.5)">Hyderabad · Handmade in India</span></div>
      <div><h4>Explore</h4>${links.map(([h,t])=>`<a href="${h}">${t}</a>`).join("")}</div>
      <div><h4>Contact</h4><a href="contact.html">Write to us</a><a href="mailto:contact@theknottythings.com">contact@theknottythings.com</a><a href="tel:+919717040077">+91 97170 40077</a><a href="tel:+919717844077">+91 97178 44077</a></div>
      <div><h4>Follow</h4><a href="https://www.instagram.com/the.knotty.things" target="_blank" rel="noopener">Instagram</a><a href="commission.html">Begin a commission</a><a href="system.html">Design system</a></div>
    </div>
    <div class="base"><span>© 2026 Knotty Things</span><a href="system.html">Design system</a></div></div>`;
  document.body.append(ftr);

  const darkSecs = [...document.querySelectorAll(".dark, .ftr")];
  const onScroll = () => {
    const y = scrollY, heroH = (document.querySelector("[data-hero]")?.offsetHeight || 0) - 80;
    hdr.classList.toggle("solid", document.body.dataset.solid !== undefined || y > Math.max(40, heroH));
    hdr.classList.toggle("ondark", darkSecs.some(s => { const r = s.getBoundingClientRect(); return r.top < 70 && r.bottom > 70; }));
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  if (!reduce && "IntersectionObserver" in window) {
    const els = [...document.querySelectorAll(".rv,.img-rv")].filter(el => el.getBoundingClientRect().top > innerHeight * 0.92);
    els.forEach(el => el.classList.add("pending"));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.remove("pending"); io.unobserve(e.target); } }), { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    els.forEach(el => io.observe(el));
  }

  const veil = document.createElement("div"); veil.className = "veil"; document.body.append(veil);
  document.addEventListener("click", e => {
    const a = e.target.closest("a"); if (e.defaultPrevented || !a || reduce || e.metaKey || e.ctrlKey || a.target === "_blank") return;
    const href = a.getAttribute("href") || "";
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || /^https?:/.test(href)) return;
    e.preventDefault(); veil.classList.add("on"); setTimeout(() => location.href = href, 420);
  });
  addEventListener("pageshow", () => veil.classList.remove("on"));

  window.KTfmt = { ft: n => (n % 1 ? n : n.toFixed(0)) + " ft", pad: i => String(i + 1).padStart(2, "0") };

  /* Fringe: a curtain of hanging cords under a knotted band. Opens on load; the cursor parts it. */
  window.Fringe = function (canvas, opts = {}) {
    const ctx = canvas.getContext("2d");
    const o = Object.assign({ gap: 7, band: 46, open: 0.34, color: [215, 200, 177], auto: true }, opts);
    let W, H, dpr, cords = [], mx = -9999, my = -9999, openT = reduce ? 1 : 0, t0 = performance.now(), raf;
    function size() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.ceil(W / o.gap) + 1;
      cords = Array.from({ length: n }, (_, i) => ({ x: i * o.gap + (Math.random() - .5) * 1.5, off: 0, v: 0, push: 0, pv: 0, len: H * (o.len ?? 0.9) * (0.92 + Math.random() * 0.08), w: 1.4 + Math.random() * 1.3, a: .55 + Math.random() * .4, ph: Math.random() * 6.28 }));
    }
    function frame(now) {
      const t = (now - t0) / 1000;
      if (!reduce && openT < 1) openT = Math.min(1, (t - 0.35) / 1.8);
      const ease = openT <= 0 ? 0 : 1 - Math.pow(1 - openT, 3);
      ctx.clearRect(0, 0, W, H);
      const cx = W * (o.cx ?? 0.62), half = W * o.open * ease;
      const [r, g, b] = o.color;
      for (const c of cords) {
        const dx = c.x - cx;
        let target = 0;
        if (Math.abs(dx) < half + 140) {
          const side = dx < 0 ? -1 : 1, inside = Math.max(0, 1 - Math.abs(dx) / (half + 1));
          target = side * (half * 0.9) * Math.pow(inside, 0.55) * (Math.abs(dx) < half ? 1 : 0);
          if (Math.abs(dx) >= half) target = side * Math.max(0, (half + 140 - Math.abs(dx))) * 0.32;
        }
        const md = c.x + c.off - mx, inY = my > o.band && my < H;
        const p = inY && Math.abs(md) < 120 ? Math.sign(md || 1) * (120 - Math.abs(md)) * 0.7 : 0;
        c.v += (target - c.off) * 0.06; c.v *= 0.82; c.off += c.v;
        c.pv += (p - c.push) * 0.09; c.pv *= 0.8; c.push += c.pv;
        const sway = reduce ? 0 : Math.sin(t * 0.9 + c.ph) * 2.2;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${r},${g},${b},${c.a})`; ctx.lineWidth = c.w;
        const steps = 22;
        for (let k = 0; k <= steps; k++) {
          const f = k / steps, y = o.band + f * (c.len - o.band);
          const bend = Math.pow(f, 0.7), local = Math.exp(-Math.pow((y - my) / 160, 2));
          const x = c.x + (c.off + sway) * bend + c.push * local * f;
          k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
      const ry = o.band - 22;
      ctx.fillStyle = `rgba(${r},${g},${b},.92)`;
      for (let x = o.gap; x < W; x += o.gap * 2) {
        const y = o.band - 9;
        ctx.beginPath(); ctx.moveTo(x, y - 7); ctx.lineTo(x + o.gap * .9, y); ctx.lineTo(x, y + 7); ctx.lineTo(x - o.gap * .9, y); ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = "rgba(180,144,74,.95)";
      ctx.fillRect(0, ry - 1.5, W, 3);
      raf = requestAnimationFrame(frame);
    }
    size(); addEventListener("resize", size);
    const host = canvas.parentElement;
    let lastPluck = 0;
    host.addEventListener("pointermove", e => {
      const r = canvas.getBoundingClientRect(), nx = e.clientX - r.left, ny = e.clientY - r.top;
      if (window.KTSound?.on && mx > -9000 && ny > o.band) {
        const lo = Math.min(mx, nx), hi = Math.max(mx, nx), now = performance.now();
        cords.forEach((c, i) => { const cx2 = c.x + c.off; if (cx2 > lo && cx2 <= hi && ny < c.len && now - lastPluck > 38) { lastPluck = now; KTSound.pluck(i, 1 - ny / H); } });
      }
      mx = nx; my = ny;
    });
    host.addEventListener("pointerleave", () => { mx = my = -9999; });
    const vis = new IntersectionObserver(([e]) => { if (e.isIntersecting) { if (!raf) raf = requestAnimationFrame(frame); } else { cancelAnimationFrame(raf); raf = null; } });
    vis.observe(canvas);
  };

  /* Sound: generated in the browser, off until the visitor turns it on. A low warm drone, slow chimes, and cords that sound when touched. */
  window.KTSound = (() => {
    let ac, master, padGain, chimeTimer, on = false;
    const scale = [146.83, 164.81, 185.0, 220.0, 246.94];
    const note = i => scale[i % 5] * Math.pow(2, Math.floor(i / 5) % 3);
    function init() {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      master = ac.createGain(); master.gain.value = 0; master.connect(ac.destination);
      const verb = ac.createConvolver(), len = ac.sampleRate * 3.2, buf = ac.createBuffer(2, len, ac.sampleRate);
      for (let ch = 0; ch < 2; ch++) { const d = buf.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
      verb.buffer = buf; const wet = ac.createGain(); wet.gain.value = .55; verb.connect(wet); wet.connect(master);
      KT_bus = ac.createGain(); KT_bus.connect(master); KT_bus.connect(verb);
      padGain = ac.createGain(); padGain.gain.value = .0; const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 520; lp.Q.value = .4;
      padGain.connect(lp); lp.connect(KT_bus);
      const lfo = ac.createOscillator(), lfoG = ac.createGain(); lfo.frequency.value = .05; lfoG.gain.value = 220; lfo.connect(lfoG); lfoG.connect(lp.frequency); lfo.start();
      [73.42, 110, 146.83, 220.4].forEach((f, k) => { const o = ac.createOscillator(); o.type = k % 2 ? "triangle" : "sine"; o.frequency.value = f; o.detune.value = (k - 1.5) * 4; const g = ac.createGain(); g.gain.value = [.5, .22, .28, .08][k]; o.connect(g); g.connect(padGain); o.start(); });
    }
    let KT_bus;
    function pluck(i, height = .5, vel = 1) {
      if (!on) return;
      const t = ac.currentTime, f = note(i + Math.round(height * 4));
      const g = ac.createGain(), lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.setValueAtTime(2600, t); lp.frequency.exponentialRampToValueAtTime(500, t + 1.4);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.09 * vel, t + .006); g.gain.exponentialRampToValueAtTime(.0004, t + 2.2);
      [[1, "triangle", 1], [2.003, "sine", .3], [3.01, "sine", .08]].forEach(([m, type, a]) => { const o = ac.createOscillator(), og = ac.createGain(); o.type = type; o.frequency.value = f * m; og.gain.value = a; o.connect(og); og.connect(g); o.start(t); o.stop(t + 2.3); });
      g.connect(lp); lp.connect(KT_bus);
    }
    function chimes() { clearTimeout(chimeTimer); if (!on) return; pluck(Math.floor(Math.random() * 10), Math.random(), .55); chimeTimer = setTimeout(chimes, 2600 + Math.random() * 4200); }
    function set(v) {
      if (v && !ac) init();
      on = v; if (ac) { const t = ac.currentTime; ac.resume();
        master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t); master.gain.linearRampToValueAtTime(v ? .9 : 0, t + (v ? 2.5 : .8));
        padGain.gain.cancelScheduledValues(t); padGain.gain.setValueAtTime(padGain.gain.value, t); padGain.gain.linearRampToValueAtTime(v ? .06 : 0, t + 4); }
      v ? setTimeout(chimes, 1500) : clearTimeout(chimeTimer);
      document.querySelectorAll(".snd").forEach(b => { b.setAttribute("aria-pressed", v); b.querySelector("span").textContent = v ? "Sound on" : "Sound off"; });
    }
    document.addEventListener("visibilitychange", () => { if (!ac) return; document.hidden ? ac.suspend() : on && ac.resume(); });
    return { get on() { return on; }, toggle: () => set(!on), pluck };
  })();
  const snd = document.createElement("button");
  snd.className = "snd"; snd.setAttribute("aria-pressed", "false"); snd.setAttribute("aria-label", "Toggle ambient sound");
  snd.innerHTML = `<i aria-hidden="true"><b></b><b></b><b></b><b></b></i><span>Sound off</span>`;
  snd.onclick = () => KTSound.toggle();
  hdr.querySelector(".cta").before(snd);

  /* Film: a slow sequence of shots with captions. Uses a real video instead when data-video points to a file that exists. */
  window.Film = function (el, shots, opts = {}) {
    const dur = opts.dur || 7000;
    el.innerHTML = shots.map((s, i) => `<figure class="shot${i ? "" : " on"}"><img src="${s.src}" alt="${s.alt || ""}" style="object-position:${s.pos || "50% 50%"}"></figure>`).join("") +
      `<div class="film-cap"><span class="film-n num">01 / ${String(shots.length).padStart(2, "0")}</span><span class="film-t">${shots[0].cap}</span><span class="film-bar"><i></i></span></div>`;
    const figs = [...el.querySelectorAll(".shot")], n = el.querySelector(".film-n"), t = el.querySelector(".film-t"), bar = el.querySelector(".film-bar i");
    let i = 0, timer;
    const go = k => {
      figs[i].classList.remove("on"); i = (k + figs.length) % figs.length; figs[i].classList.add("on");
      n.textContent = `${String(i + 1).padStart(2, "0")} / ${String(figs.length).padStart(2, "0")}`; t.textContent = shots[i].cap;
      bar.style.transition = "none"; bar.style.transform = "scaleX(0)"; void bar.offsetWidth; bar.style.transition = `transform ${dur}ms linear`; bar.style.transform = "scaleX(1)";
    };
    const loop = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => go(i + 1), dur); };
    go(0); loop();
    if (opts.video) fetch(opts.video, { method: "HEAD" }).then(r => { if (!r.ok) return;
      const v = document.createElement("video"); Object.assign(v, { src: opts.video, muted: true, loop: true, playsInline: true, autoplay: !reduce }); v.className = "film-video"; v.setAttribute("aria-hidden", "true");
      el.prepend(v); clearInterval(timer); el.classList.add("has-video"); }).catch(() => {});
  };

  /* Knot design system. Six primitives from the physical work; every icon, rule and ornament is built from them. */
  const SPRITE = `<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">
  <defs>
    <symbol id="k-square" viewBox="0 0 40 16"><g fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round">
      <path d="M2 8 C9 8 11 2.6 16 2.6 C20.5 2.6 19.5 13.4 24 13.4 C29 13.4 31 8 38 8"/>
      <path d="M2 8 C9 8 11 13.4 16 13.4 C20.5 13.4 19.5 2.6 24 2.6 C29 2.6 31 8 38 8"/></g></symbol>
    <symbol id="k-lark" viewBox="0 0 16 20"><g fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round">
      <path d="M1 5 H15" stroke-opacity=".55"/>
      <path d="M5 8.5 C5 1.5 11 1.5 11 8.5"/><path d="M6.5 7.5 V19 M9.5 7.5 V19"/></g></symbol>
    <symbol id="k-spiral" viewBox="0 0 12 40"><g fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round">
      <path d="M6 0 V40" stroke-opacity=".35"/>
      <path d="M2 3 C6 4 10 6 10 8 M2 9 C6 10 10 12 10 14 M2 15 C6 16 10 18 10 20 M2 21 C6 22 10 24 10 26 M2 27 C6 28 10 30 10 32 M2 33 C6 34 10 36 10 38"/></g></symbol>
    <symbol id="k-wrap" viewBox="0 0 16 28"><g fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round">
      <path d="M5.5 0 V28 M8 0 V28 M10.5 0 V28" stroke-opacity=".6"/>
      <path d="M3.5 10 H12.5 M3.5 12.2 H12.5 M3.5 14.4 H12.5 M3.5 16.6 H12.5 M3.5 18.8 H12.5"/></g></symbol>
    <symbol id="k-fringe" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round">
      <path d="M3 6 H21" stroke-width="1.5"/><path d="M7 6 V18 M12 6 V15 M17 6 V20"/></g></symbol>
    <symbol id="k-rod" viewBox="0 0 48 12"><path d="M5 6 H43" stroke="#B4904A" stroke-width="1.4" stroke-linecap="round"/><circle cx="4" cy="6" r="2.6" fill="#B4904A"/><circle cx="44" cy="6" r="2.6" fill="#B4904A"/></symbol>

    <symbol id="i-arrow" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2.5 12 H20"/><path d="M5 10.2 V13.8 M6.8 10.2 V13.8"/><path d="M14.5 6.5 L20 12 L14.5 17.5"/></g></symbol>
    <symbol id="i-ext" viewBox="0 0 24 24"><use href="#i-arrow" transform="rotate(-45 12 12)"/></symbol>
    <symbol id="i-back" viewBox="0 0 24 24"><use href="#i-arrow" transform="rotate(180 12 12)"/></symbol>
    <symbol id="i-menu" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"><path d="M7 7 H21 M7 12 H21 M7 17 H21"/></g><g fill="currentColor"><circle cx="4.5" cy="7" r="1.5"/><circle cx="4.5" cy="12" r="1.5"/><circle cx="4.5" cy="17" r="1.5"/></g></symbol>
    <symbol id="i-close" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"><path d="M5 5 C10 10 14 14 19 19 M19 5 C14 10 10 14 5 19"/></g><circle cx="12" cy="12" r="1.9" fill="currentColor"/></symbol>
    <symbol id="i-plus" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"><path d="M12 4 V20 M4 12 H20"/></g><circle cx="12" cy="12" r="1.9" fill="currentColor"/></symbol>
  </defs></svg>`;
  document.body.insertAdjacentHTML("afterbegin", SPRITE);
  const icon = (n, cls = "ki") => `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#${n}"/></svg>`;
  window.KTicon = icon;
  function hanging(n = 3) {
    const w = 18 + n * 12, xs = Array.from({ length: n }, (_, i) => 13 + i * 12);
    return `<svg class="hang" viewBox="0 0 ${w} 20" width="${w}" height="20" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round">${xs.map(x => `<path d="M${x - 3} 8.5 C${x - 3} 2 ${x + 3} 2 ${x + 3} 8.5"/><path d="M${x - 1.5} 7.5 V${15 + (x % 5)} M${x + 1.5} 7.5 V${17 - (x % 4)}"/>`).join("")}</g><path d="M5 5 H${w - 5}" stroke="#B4904A" stroke-width="1.4" stroke-linecap="round"/><circle cx="4" cy="5" r="2.4" fill="#B4904A"/><circle cx="${w - 4}" cy="5" r="2.4" fill="#B4904A"/></svg>`;
  }
  function hydrate(root = document) {
    root.querySelectorAll(".arr:not([data-k])").forEach(el => { el.dataset.k = 1; el.innerHTML = icon("i-arrow"); });
    root.querySelectorAll("[data-icon]:not([data-k])").forEach(el => { el.dataset.k = 1; el.innerHTML = icon("i-" + el.dataset.icon); });
    root.querySelectorAll(".rod:not([data-k])").forEach(el => { el.dataset.k = 1; el.innerHTML = hanging(+(el.dataset.n || 2)); });
    root.querySelectorAll(".knot-rule:not([data-k])").forEach(el => { el.dataset.k = 1; el.setAttribute("aria-hidden", "true"); el.innerHTML = `<i></i>${icon("k-square", "kr")}<i></i>`; });
  }
  hydrate();
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => n.nodeType === 1 && hydrate(n.parentNode || n)))).observe(document.body, { childList: true, subtree: true });

  burger.innerHTML = `${icon("i-menu")}<span>Menu</span>`;
  const oldToggle = burger.onclick;
  burger.onclick = () => { oldToggle(); const o = drawer.classList.contains("open"); burger.innerHTML = `${icon(o ? "i-close" : "i-menu")}<span>${o ? "Close" : "Menu"}</span>`; };
  snd.innerHTML = `<svg class="ki snd-i" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6 H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><g stroke="currentColor" stroke-width="1.25" stroke-linecap="round"><path class="c1" d="M6.5 6 V16"/><path class="c2" d="M10.5 6 V19"/><path class="c3" d="M14.5 6 V14"/><path class="c4" d="M18.5 6 V17"/></g></svg><span>Sound off</span>`;

  const veilKnot = document.createElement("div");
  veilKnot.className = "veil-knot"; veilKnot.innerHTML = icon("k-square", "vk");
  veil.append(veilKnot);

  const fav = document.createElement("link"); fav.rel = "icon";
  fav.href = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="#1A1613"/><g transform="translate(0 12)" fill="none" stroke="#D7C8B1" stroke-width="2" stroke-linecap="round"><path d="M2 8 C9 8 11 2.6 16 2.6 C20.5 2.6 19.5 13.4 24 13.4 C29 13.4 31 8 38 8"/><path d="M2 8 C9 8 11 13.4 16 13.4 C20.5 13.4 19.5 2.6 24 2.6 C29 2.6 31 8 38 8"/></g></svg>`);
  document.head.append(fav);
})();

/* Enquiry forms post to Netlify Forms (form-name + fields as URL-encoded data). Netlify emails each one to the studio and keeps a copy. */
window.KTsend = async (formName, data) => {
  const body = new URLSearchParams({ "form-name": formName, ...data });
  const r = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
  if (!r.ok) throw new Error("Send failed: " + r.status);
};
