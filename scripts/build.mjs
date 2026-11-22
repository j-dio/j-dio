// Builds the hand-made SVGs in profile/. Run: node scripts/build.mjs
// Edit the PEDALS / QUALITIES / PICKS arrays, re-run, commit.
import { mkdirSync, writeFileSync } from "node:fs";

const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";
const HEAVY = "'Arial Black','Helvetica Neue',Arial,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ---------- pedals ----------
// Order = signal chain. Two-tier board: tier 1 runs left to right, tier 2 comes back
// right to left. Each tier is drawn once, then cut into one SVG per pedal so every pedal
// can be its own link. Slices in a row sit edge to edge in the README; GitHub leaves a
// ~6px gap between rows, so the tiers are separate boards joined by a jack box.
const PEDALS = [
  { name: "TAPO(1)", href: "https://tap-o1.vercel.app", kind: "push overdrive", stat: "50+ USERS · 0 ADS", stack: "NEXT.JS · SUPABASE · DENO",
    body: "#e3b341", ink: "#1b1608", led: "#ff3b30", knobs: [["LEVEL", 40], ["SYNC", -30], ["PUSH", 110]], tag: "LIVE" },
  { name: "LOOPIN", href: "https://github.com/j-dio/loop-in", kind: "feedback looper", stat: "62 ENDPOINTS · 14 TABLES", stack: "EXPRESS · POSTGRES · REDIS",
    body: "#1f6f6b", ink: "#f1e9d6", led: "#7CFF6B", knobs: [["FEEDBACK", 120], ["RATE", -60], ["RANK", 20]] },
  { name: "RENTELL", href: "https://rentell.vercel.app", kind: "room reverb", stat: "29 ENDPOINTS · 0 RACES", stack: "NEXT.JS · NEON · MAPBOX",
    body: "#e8dfc9", ink: "#26221a", led: "#ff3b30", knobs: [["ROOM", 80], ["DECAY", -100], ["RENT", 0]] },
  { name: "CARBONCAP", href: "https://lumacang-dio.vercel.app", kind: "carbon compressor", stat: "1ST OF 19 TEAMS", stack: "C++ · QT 6",
    body: "#24272c", ink: "#c6f26a", led: "#c6f26a", knobs: [["THRESH", -40], ["RATIO", 60], ["CO2", -120]], tag: "1ST PLACE" },
  { name: "QREATE", href: "https://github.com/j-dio/Qreate", kind: "exam synth", stat: "AI EXAMS · V1.0.0", stack: "ELECTRON · REACT · SQLITE",
    body: "#5a3f8f", ink: "#f1e9d6", led: "#59c7ff", knobs: [["OCTAVE", 0], ["PROMPT", 100], ["GRADE", -70]] },
  { name: "SPERMSANITY", href: "https://github.com/j-dio/sperm-lovers", kind: "dread fuzz", stat: "GAME JAM · 1 SENTIENT DOOR", stack: "GODOT 4 · GDSCRIPT",
    body: "#c8553d", ink: "#fff1e6", led: "#ffd23f", knobs: [["DREAD", 130], ["GORE", 90], ["DOOR", -20]], tag: "TOP 10" },
];

const PW = 200, PH = 300, JACK_X = 40, SLOT = 300, TOP = 100;
const col = (i) => (i < 3 ? i : 5 - i);
const slot = (i) => [col(i) * SLOT + (SLOT - PW) / 2, TOP];

function knob(cx, cy, label, angle, ink) {
  const ticks = Array.from({ length: 11 }, (_, t) => {
    const a = ((-135 + t * 27) * Math.PI) / 180;
    const r1 = 26, r2 = 29;
    return `<line x1="${(cx + r1 * Math.sin(a)).toFixed(1)}" y1="${(cy - r1 * Math.cos(a)).toFixed(1)}" x2="${(cx + r2 * Math.sin(a)).toFixed(1)}" y2="${(cy - r2 * Math.cos(a)).toFixed(1)}"/>`;
  }).join("");
  return `
    <g stroke="${ink}" stroke-opacity=".45" stroke-width="1.2">${ticks}</g>
    <circle cx="${cx}" cy="${cy + 2}" r="21" fill="#000" opacity=".35"/>
    <circle cx="${cx}" cy="${cy}" r="21" fill="url(#knobSkirt)"/>
    <circle cx="${cx}" cy="${cy}" r="15" fill="url(#knobCap)" stroke="#000" stroke-opacity=".5"/>
    <g transform="rotate(${angle} ${cx} ${cy})"><rect x="${cx - 1.4}" y="${cy - 19}" width="2.8" height="11" rx="1.4" fill="#f4f1ea"/></g>
    <text x="${cx}" y="${cy + 42}" fill="${ink}" font-family="${MONO}" font-size="9" font-weight="700" letter-spacing="1.2" text-anchor="middle">${esc(label)}</text>`;
}

function pedal(p, i) {
  const [x, y] = slot(i);
  const cx = PW / 2;
  const nameSize = Math.min(34, Math.floor((PW - 30) / (p.name.length * 0.74)));
  const knobs = p.knobs.map(([l, a], k) => knob(cx + (k - 1) * 64, 66, l, a, p.ink)).join("");
  const screw = (sx, sy, r) => `<g transform="translate(${sx} ${sy}) rotate(${r})"><circle r="4.2" fill="url(#metal)" stroke="#000" stroke-opacity=".4"/><line x1="-2.6" x2="2.6" stroke="#333" stroke-width="1.2"/></g>`;
  const tag = p.tag
    ? `<g transform="translate(${cx - 28 - (12 + p.tag.length * 7.6) / 2} 250) rotate(-9)"><rect x="${-(12 + p.tag.length * 7.6) / 2}" y="-11" width="${12 + p.tag.length * 7.6}" height="22" rx="3" fill="#f4f1ea" stroke="#111" stroke-width="1.5"/><text y="4.5" fill="#111" font-family="${HEAVY}" font-size="10" font-weight="900" letter-spacing=".8" text-anchor="middle">${p.tag}</text></g>`
    : "";
  return `
  <g transform="translate(${x} ${y})">
    <!-- top-mounted jacks -->
    ${[JACK_X, PW - JACK_X].map((jx) => `<rect x="${jx - 9}" y="-12" width="18" height="16" rx="3" fill="url(#metal)" stroke="#000" stroke-opacity=".5"/>`).join("")}
    <rect width="${PW}" height="${PH}" rx="16" fill="${p.body}" filter="url(#drop)"/>
    <rect width="${PW}" height="${PH}" rx="16" fill="url(#sheen)"/>
    <rect x="1" y="1" width="${PW - 2}" height="${PH - 2}" rx="15" fill="none" stroke="#fff" stroke-opacity=".18"/>
    <rect x=".5" y=".5" width="${PW - 1}" height="${PH - 1}" rx="15.5" fill="none" stroke="#000" stroke-opacity=".45"/>
    ${screw(12, 12, 20)}${screw(PW - 12, 12, -35)}${screw(12, PH - 12, 70)}${screw(PW - 12, PH - 12, 5)}
    <!-- led -->
    <circle cx="${cx}" cy="20" r="9" fill="${p.led}" opacity=".35" filter="url(#glow)">
      <animate attributeName="opacity" values=".2;.55;.2" dur="${2.2 + i * 0.37}s" repeatCount="indefinite"/>
    </circle>
    <circle cx="${cx}" cy="20" r="4.5" fill="${p.led}" stroke="#000" stroke-opacity=".5"/>
    <circle cx="${cx - 1.4}" cy="18.6" r="1.4" fill="#fff" opacity=".8"/>
    ${knobs}
    <!-- nameplate -->
    <line x1="22" x2="${PW - 22}" y1="132" y2="132" stroke="${p.ink}" stroke-opacity=".3"/>
    <text x="${cx}" y="${170}" fill="${p.ink}" font-family="${HEAVY}" font-size="${nameSize}" font-weight="900" letter-spacing="1" text-anchor="middle">${esc(p.name)}</text>
    <text x="${cx}" y="192" fill="${p.ink}" font-family="${SERIF}" font-size="17" font-style="italic" text-anchor="middle">${esc(p.kind)}</text>
    <text x="${cx}" y="214" fill="${p.ink}" fill-opacity=".8" font-family="${MONO}" font-size="11" font-weight="700" letter-spacing=".5" text-anchor="middle">${esc(p.stat)}</text>
    <!-- footswitch -->
    <circle cx="${cx}" cy="250" r="24" fill="#000" opacity=".25"/>
    <polygon points="${hex(cx, 248, 22)}" fill="url(#metal)" stroke="#000" stroke-opacity=".5"/>
    <circle cx="${cx}" cy="248" r="15" fill="url(#metalDark)" stroke="#000" stroke-opacity=".6"/>
    <circle cx="${cx}" cy="248" r="10" fill="url(#metal)"/>
    ${tag}
  </g>`;
}

function hex(cx, cy, r) {
  return Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 3) * k + Math.PI / 6;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

// One patch cable: dark jacket + colored stripe + moving signal pulses + plugs at both ends.
function cable(d, color, delay, plugs) {
  const plug = ([px, py]) =>
    `<g transform="translate(${px} ${py}) rotate(-90)"><rect x="0" y="-7" width="18" height="14" rx="3" fill="url(#metal)" stroke="#000" stroke-opacity=".5"/><rect x="18" y="-5.5" width="7" height="11" rx="2" fill="#151515"/></g>`;
  return `
  <path d="${d}" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="12" stroke-linecap="round" transform="translate(0 5)"/>
  <path d="${d}" fill="none" stroke="#111214" stroke-width="10" stroke-linecap="round"/>
  <path d="${d}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-opacity=".55"/>
  <path d="${d}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 34" filter="url(#glow)">
    <animate attributeName="stroke-dashoffset" from="36" to="0" dur="1.1s" begin="${delay}s" repeatCount="indefinite"/>
  </path>
  ${plugs.map(plug).join("")}`;
}

function tier(row) {
  const W = SLOT * 3, H = row ? 454 : 424;
  const ids = row ? [3, 4, 5] : [0, 1, 2];
  // Jack tops: the plug sits on the jack, the cable leaves 25px above it.
  const J = (i, right) => [slot(i)[0] + (right ? PW - JACK_X : JACK_X), TOP - 12];
  const C = ([x, y]) => [x, y - 25];
  const arc = (a, b, lift = 38) => {
    const [ax, ay] = C(a), [bx, by] = C(b);
    return `M ${ax} ${ay} C ${ax} ${ay - lift}, ${bx} ${by - lift}, ${bx} ${by}`;
  };
  const colors = ["#ffd23f", "#e3b341", "#5fd3c5", "#f1e9d6", "#c6f26a", "#a88bff", "#ff8a5c"];
  const BOX = [W - 38, TOP];
  const box = `<g transform="translate(${BOX[0]} ${BOX[1]})">
    <rect x="-14" y="0" width="28" height="64" rx="4" fill="url(#metal)" stroke="#000" stroke-opacity=".5"/>
    <rect x="-9" y="-12" width="18" height="14" rx="3" fill="url(#metalDark)" stroke="#000" stroke-opacity=".5"/>
    <text transform="translate(4 32) rotate(-90)" fill="#222" font-family="${MONO}" font-size="9" font-weight="700" letter-spacing="1.5" text-anchor="middle">${row ? "FROM 1" : "TO 2"}</text>
  </g>`;
  const boxJ = [BOX[0], BOX[1] - 12];
  const cables = row
    ? [
        cable(arc(boxJ, J(3, 1), 30), colors[3], 0, [boxJ, J(3, 1)]),
        cable(arc(J(3, 0), J(4, 1)), colors[4], 0, [J(3, 0), J(4, 1)]),
        cable(arc(J(4, 0), J(5, 1)), colors[5], 0, [J(4, 0), J(5, 1)]),
        cable(`M ${C(J(5, 0))[0]} ${C(J(5, 0))[1]} C ${C(J(5, 0))[0]} ${C(J(5, 0))[1] - 40}, 20 30, -5 30`, colors[6], 0, [J(5, 0)]),
      ]
    : [
        cable(`M -5 30 C 20 30, ${C(J(0, 0))[0]} ${C(J(0, 0))[1] - 40}, ${C(J(0, 0))[0]} ${C(J(0, 0))[1]}`, colors[0], 0, [J(0, 0)]),
        cable(arc(J(0, 1), J(1, 0)), colors[1], 0, [J(0, 1), J(1, 0)]),
        cable(arc(J(1, 1), J(2, 0)), colors[2], 0, [J(1, 1), J(2, 0)]),
        cable(arc(J(2, 1), boxJ, 30), colors[3], 0, [J(2, 1), boxJ]),
      ];
  const frameH = row ? H - 34 : H - 4;
  const content = `
<defs>
  ${sharedDefs()}
  <linearGradient id="frame" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b6068"/><stop offset=".5" stop-color="#3a3e45"/><stop offset="1" stop-color="#26292e"/></linearGradient>
  <pattern id="rails" width="${W}" height="74" patternUnits="userSpaceOnUse" y="40">
    <rect width="${W}" height="74" fill="#0b0c0e"/>
    <rect y="6" width="${W}" height="62" fill="#1c1e22"/>
    <rect y="6" width="${W}" height="2" fill="#fff" opacity=".06"/>
  </pattern>
  <pattern id="velcro" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".8" fill="#fff" opacity=".05"/><circle cx="4.5" cy="4.5" r=".8" fill="#000" opacity=".3"/></pattern>
</defs>
<rect x="2" y="2" width="${W - 4}" height="${frameH}" rx="22" fill="url(#frame)"/>
<rect x="16" y="16" width="${W - 32}" height="${frameH - 28}" rx="12" fill="url(#rails)"/>
<rect x="16" y="16" width="${W - 32}" height="${frameH - 28}" rx="12" fill="url(#velcro)"/>
<rect x="16" y="16" width="${W - 32}" height="${frameH - 28}" rx="12" fill="none" stroke="#000" stroke-opacity=".6" stroke-width="2"/>
${ids.map((i) => pedal(PEDALS[i], i)).join("")}
${box}
${cables.join("")}
${row ? `<g transform="translate(${W / 2} ${H - 16})">
  <rect x="-170" y="-11" width="340" height="22" rx="4" fill="url(#metal)" stroke="#000" stroke-opacity=".5"/>
  <text y="4" fill="#222" font-family="${MONO}" font-size="10.5" font-weight="700" letter-spacing="2.4" text-anchor="middle">J-DIO · SIGNAL CHAIN · IDEA → PROD</text>
</g>` : ""}`;
  // One file per pedal: same drawing, different window onto it.
  return ids.map((i) => {
    const p = PEDALS[i];
    return [i, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${col(i) * SLOT} 0 ${SLOT} ${H}" width="${SLOT}" height="${H}" role="img">
<title>${esc(`${p.name}: ${p.kind}. ${p.stat}. Built with ${p.stack}.`)}</title>${content}
</svg>`];
  });
}

// ---------- amp head ----------
// Knobs are cranked on purpose.
const QUALITIES = [["CONSISTENCY", 120], ["DRIVE", 135], ["OWNERSHIP", 125], ["CURIOSITY", 110], ["GRIT", 130], ["FOCUS", 100], ["CRAFT", 115], ["CARE", 128]];

function amp() {
  const W = 1000, H = 330;
  const knobs = QUALITIES.map(([l, ang], k) => {
    const cx = 215 + k * 78, cy = 262;
    return `
    <circle cx="${cx}" cy="${cy + 2}" r="19" fill="#000" opacity=".4"/>
    <circle cx="${cx}" cy="${cy}" r="19" fill="url(#knobSkirt)"/>
    <circle cx="${cx}" cy="${cy}" r="12" fill="url(#metal)" stroke="#000" stroke-opacity=".5"/>
    <g transform="rotate(${ang} ${cx} ${cy})"><rect x="${cx - 1.3}" y="${cy - 18}" width="2.6" height="9" rx="1.3" fill="#f4f1ea"/></g>
    <text x="${cx}" y="${cy - 28}" fill="#1a1a1a" font-family="${MONO}" font-size="8.5" font-weight="700" letter-spacing="1" text-anchor="middle">${l}</text>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t">
<title id="t">Amp head with the name dio on the grille and knobs for consistency, drive, ownership, curiosity, grit, focus, craft and care, all turned up</title>
<defs>
  ${sharedDefs()}
  <pattern id="tolex" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#17171a"/><circle cx="1.5" cy="1.5" r=".9" fill="#000" opacity=".6"/><circle cx="3.8" cy="3.6" r=".6" fill="#fff" opacity=".05"/></pattern>
  <pattern id="grille" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width="6" height="6" fill="#2a1d14"/><rect width="3" height="6" fill="#3d2a1b"/><rect width="6" height="1" fill="#b48a4a" opacity=".35"/>
  </pattern>
  <radialGradient id="grilleShade" cx=".5" cy=".4" r=".75"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
  <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffaf0"/><stop offset=".45" stop-color="#d8cfbf"/><stop offset=".55" stop-color="#8a7f6c"/><stop offset="1" stop-color="#efe6d3"/></linearGradient>
  <linearGradient id="panel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9dcc0"/><stop offset="1" stop-color="#cbb98f"/></linearGradient>
  <linearGradient id="shine" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <clipPath id="logoClip"><text x="500" y="146" font-family="${SERIF}" font-size="96" font-style="italic" font-weight="700" text-anchor="middle">dio</text></clipPath>
</defs>
<!-- handle -->
<rect x="410" y="6" width="180" height="26" rx="13" fill="#0e0e10" stroke="#2c2c30" stroke-width="2"/>
<rect x="392" y="22" width="26" height="16" rx="3" fill="url(#metal)"/><rect x="582" y="22" width="26" height="16" rx="3" fill="url(#metal)"/>
<!-- cabinet -->
<rect x="22" y="42" width="956" height="${H - 50}" rx="20" fill="#000" opacity=".4" filter="url(#blur)"/>
<rect x="20" y="32" width="960" height="${H - 46}" rx="20" fill="url(#tolex)"/>
<rect x="20" y="32" width="960" height="${H - 46}" rx="20" fill="url(#sheen)"/>
<rect x="32" y="44" width="936" height="${H - 70}" rx="12" fill="none" stroke="#d8c9a3" stroke-width="2.5" stroke-opacity=".85"/>
<!-- corners -->
${[[20, 32, 0], [980, 32, 90], [980, H - 14, 180], [20, H - 14, 270]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 34 V8 Q0 0 8 0 H34 L34 12 H12 V34 Z" fill="url(#metal)" stroke="#000" stroke-opacity=".4"/><circle cx="7" cy="7" r="2.5" fill="#555"/></g>`).join("")}
<!-- grille -->
<rect x="54" y="62" width="892" height="140" rx="6" fill="url(#grille)"/>
<rect x="54" y="62" width="892" height="140" rx="6" fill="url(#grilleShade)"/>
<!-- logo -->
<text x="500" y="150" fill="#000" opacity=".55" font-family="${SERIF}" font-size="96" font-style="italic" font-weight="700" text-anchor="middle">dio</text>
<text x="500" y="146" fill="url(#chrome)" stroke="#4a4234" stroke-width="1" font-family="${SERIF}" font-size="96" font-style="italic" font-weight="700" text-anchor="middle">dio</text>
<g clip-path="url(#logoClip)"><rect x="300" y="60" width="60" height="120" fill="url(#shine)" transform="skewX(-20)">
  <animate attributeName="x" values="300;760;760" keyTimes="0;.35;1" dur="7s" repeatCount="indefinite"/>
</rect></g>
<text x="500" y="182" fill="#e6d6b0" fill-opacity=".85" font-family="${MONO}" font-size="12" letter-spacing="4" text-anchor="middle">FULL-STACK ENGINEER · WEB DEV · UP CEBU</text>
<!-- control panel -->
<rect x="54" y="214" width="892" height="88" rx="6" fill="url(#panel)" stroke="#000" stroke-opacity=".5"/>
<rect x="54" y="214" width="892" height="88" rx="6" fill="url(#sheen)"/>
<!-- input jacks -->
${[92, 140].map((x, k) => `<circle cx="${x}" cy="262" r="12" fill="url(#metal)" stroke="#000" stroke-opacity=".5"/><circle cx="${x}" cy="262" r="6" fill="#111"/><text x="${x}" y="234" fill="#1a1a1a" font-family="${MONO}" font-size="8.5" font-weight="700" letter-spacing="1" text-anchor="middle">${k ? "HI" : "LO"}</text>`).join("")}
${knobs}
<!-- jewel + switch -->
<circle cx="862" cy="262" r="20" fill="#ff3b30" opacity=".4" filter="url(#glow)"><animate attributeName="opacity" values=".25;.6;.25" dur="2.6s" repeatCount="indefinite"/></circle>
<circle cx="862" cy="262" r="12" fill="url(#metal)"/>
<circle cx="862" cy="262" r="8" fill="#ff3b30"/><circle cx="859.5" cy="259.5" r="2.5" fill="#fff" opacity=".85"/>
<text x="862" y="234" fill="#1a1a1a" font-family="${MONO}" font-size="8.5" font-weight="700" letter-spacing="1" text-anchor="middle">ON</text>
<rect x="902" y="248" width="16" height="28" rx="4" fill="#111"/><rect x="905" y="250" width="10" height="13" rx="2" fill="url(#metal)"/>
<text x="910" y="234" fill="#1a1a1a" font-family="${MONO}" font-size="8.5" font-weight="700" letter-spacing="1" text-anchor="middle">SHIP</text>
</svg>`;
}

function sharedDefs() {
  return `
  <filter id="drop" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#000" flood-opacity=".55"/></filter>
  <filter id="glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3"/></filter>
  <filter id="blur"><feGaussianBlur stdDeviation="8"/></filter>
  <linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".35" stop-color="#fff" stop-opacity=".04"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
  <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f4f2"/><stop offset=".5" stop-color="#a9abae"/><stop offset="1" stop-color="#e2e3e4"/></linearGradient>
  <linearGradient id="metalDark" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8d9094"/><stop offset="1" stop-color="#3b3d40"/></linearGradient>
  <radialGradient id="knobSkirt" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#3c3d40"/><stop offset="1" stop-color="#0c0c0d"/></radialGradient>
  <radialGradient id="knobCap" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#55575b"/><stop offset="1" stop-color="#141415"/></radialGradient>`;
}

// ---------- picks ----------
// Group -> pick look. "fill" is a color or a pattern id.
const GROUPS = {
  languages: { label: "LANGUAGES", fill: "url(#tortoise)", ink: "#fbe9c8" },
  frontend: { label: "FRONTEND", fill: "url(#pearl)", ink: "#26221a" },
  backend: { label: "BACKEND", fill: "#1f6f6b", ink: "#f1e9d6" },
  data: { label: "DATA", fill: "#c8553d", ink: "#fff1e6" },
  ship: { label: "CLOUD + DEVOPS", fill: "#5a3f8f", ink: "#f1e9d6" },
  test: { label: "QUALITY", fill: "#e3b341", ink: "#1b1608" },
  ai: { label: "AI", fill: "#2f6db5", ink: "#f1f6ff" },
  growth: { label: "GROWTH", fill: "#7fd1b9", ink: "#10241e" },
};
const PICKS = [
  ["TypeScript", "languages"], ["Python", "languages"], ["JavaScript", "languages"], ["SQL", "languages"], ["C++", "languages"],
  ["React", "frontend"], ["Next.js", "frontend"], ["Tailwind", "frontend"], ["shadcn/ui", "frontend"], ["Electron", "frontend"],
  ["Node.js", "backend"], ["Express", "backend"], ["Deno", "backend"], ["Drizzle", "backend"], ["Zod", "backend"],
  ["Postgres", "data"], ["Supabase", "data"], ["Redis", "data"], ["SQLite", "data"],
  ["AWS", "ship"], ["Docker", "ship"], ["Vercel", "ship"], ["Railway", "ship"], ["Hostinger", "ship"],
  ["Playwright", "test"], ["Vitest", "test"], ["Godot", "frontend"],
  ["GSAP", "frontend"], ["Radix UI", "frontend"], ["Mapbox", "frontend"],
  ["Resend", "backend"], ["Stripe", "backend"],
  ["Turborepo", "ship"], ["pnpm", "ship"], ["GH Actions", "ship"], ["Sentry", "ship"],
  ["Semgrep", "test"], ["Lighthouse", "test"],
  ["Claude API", "ai"], ["Claude Code", "ai"], ["Codex", "ai"],
  ["GA4", "growth"], ["Clarity", "growth"], ["Search Console", "growth"], ["GoHighLevel", "growth"],
];

// Seeded random so the scatter is the same on every build.
function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PICK_PATH = "M0 44 C-15 34,-34 8,-34 -14 C-34 -32,-18 -40,0 -40 C18 -40,34 -32,34 -14 C34 8,15 34,0 44 Z";

function pick(name, g, x, y, rot, scale = 1) {
  const size = Math.min(13, 60 / (name.length * 0.6));
  return `
  <g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${scale})">
    <path d="${PICK_PATH}" fill="${g.fill}" filter="url(#pickDrop)"/>
    <path d="${PICK_PATH}" fill="url(#pickSheen)"/>
    <path d="${PICK_PATH}" fill="none" stroke="#000" stroke-opacity=".35"/>
    <text y="-6" fill="${g.ink}" stroke="${g.ink.startsWith("#1") || g.ink.startsWith("#2") ? "none" : "#000"}" stroke-opacity=".5" stroke-width="2" paint-order="stroke" font-family="${HEAVY}" font-size="${size.toFixed(1)}" font-weight="900" text-anchor="middle">${esc(name)}</text>
    <text y="12" fill="${g.ink}" fill-opacity=".55" font-family="${MONO}" font-size="6.5" letter-spacing="1" text-anchor="middle">.73mm</text>
  </g>`;
}

function picks() {
  const W = 1000, H = 600;
  const r = rng(73);
  // ponytail: rejection sampling, fine for ~30 picks; shrink minDist if it can't place them all.
  const placed = [];
  for (const [name, g] of PICKS) {
    let best = null;
    for (let t = 0, minDist = 96; !best; t++) {
      const x = 48 + r() * (W - 96), y = 50 + r() * (H - 100);
      if (placed.every((q) => Math.hypot(q.x - x, q.y - y) > minDist)) best = { x, y };
      if (t % 400 === 399) minDist -= 4;
    }
    placed.push({ ...best, name, g, rot: (r() - 0.5) * 90 });
  }
  const body = placed.map((q) => pick(q.name, GROUPS[q.g], q.x, q.y, q.rot)).join("");
  const keys = Object.values(GROUPS);
  let lx = 40;
  const legend = keys.map((g) => {
    const at = lx;
    lx += 50 + g.label.length * 8.6;
    return [g, at];
  }).map(([g, lx]) => {
    return `<g transform="translate(${lx} ${H + 6})"><g transform="rotate(-15) scale(.32)"><path d="${PICK_PATH}" fill="${g.fill}"/><path d="${PICK_PATH}" fill="none" stroke="#000" stroke-opacity=".4" stroke-width="3"/></g>
      <text x="16" y="4" fill="#8b949e" font-family="${MONO}" font-size="11" font-weight="700" letter-spacing="1.5">${g.label}</text></g>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H + 30}" width="${W}" height="${H + 30}" role="img" aria-labelledby="t">
<title id="t">Guitar picks scattered on a table, one per tool: ${PICKS.map(([n]) => n).join(", ")}</title>
<defs>
  <filter id="pickDrop" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="1" dy="4" stdDeviation="3" flood-color="#000" flood-opacity=".45"/></filter>
  <linearGradient id="pickSheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>
  <pattern id="tortoise" width="40" height="40" patternUnits="userSpaceOnUse">
    <rect width="40" height="40" fill="#7a3a12"/>
    <ellipse cx="8" cy="10" rx="9" ry="5" fill="#3a1606" opacity=".8" transform="rotate(30 8 10)"/>
    <ellipse cx="28" cy="26" rx="10" ry="6" fill="#2b1004" opacity=".75" transform="rotate(-20 28 26)"/>
    <ellipse cx="30" cy="6" rx="5" ry="3" fill="#b5641f" opacity=".7"/>
    <ellipse cx="10" cy="32" rx="6" ry="3" fill="#c2752a" opacity=".6" transform="rotate(15 10 32)"/>
  </pattern>
  <linearGradient id="pearl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf7ef"/><stop offset=".45" stop-color="#e3ddd2"/><stop offset=".6" stop-color="#f3eee6"/><stop offset="1" stop-color="#d6cfc2"/></linearGradient>
</defs>
${body}
${legend}
</svg>`;
}

mkdirSync(new URL("../profile/pedals/", import.meta.url), { recursive: true });
for (const [i, svg] of [...tier(0), ...tier(1)]) writeFileSync(new URL(`../profile/pedals/${i + 1}.svg`, import.meta.url), svg);
writeFileSync(new URL("../profile/amp.svg", import.meta.url), amp());
writeFileSync(new URL("../profile/picks.svg", import.meta.url), picks());
console.log("wrote profile/pedals/1-6.svg, profile/amp.svg, profile/picks.svg");
