// Smooth color transitions across sections by tweening CSS variables on :root
// Variables affected: --crimson (accent), --glow (accent glow rgba)

const parseColor = (input) => {
    if (!input) return [0, 0, 0, 1];
    if (input.startsWith('#')) {
        const hex = input.replace('#', '');
        const bigint = parseInt(hex.length === 3
            ? hex.split('').map(c => c + c).join('')
            : hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return [r, g, b, 1];
    }
    const m = input.match(/rgba?\(([^)]+)\)/i);
    if (m) {
        const parts = m[1].split(',').map(p => parseFloat(p.trim()));
        const [r, g, b, a = 1] = parts;
        return [r, g, b, a];
    }
    return [0, 0, 0, 1];
};

const toRgba = ([r, g, b, a = 1]) => `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;

const lerp = (a, b, t) => a + (b - a) * t;

const tweenColor = (from, to, t) => [
    lerp(from[0], to[0], t),
    lerp(from[1], to[1], t),
    lerp(from[2], to[2], t),
    lerp(from[3], to[3], t)
];

const getRootVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const setRootVar = (name, value) => document.documentElement.style.setProperty(name, value);

const palettes = {
    hero: {
        crimson: '#DC143C',
        glow: 'rgba(220, 20, 60, 0.60)'
    },
    speakers: {
        crimson: '#C21A3A',
        glow: 'rgba(220, 20, 60, 0.35)'
    },
    schedule: {
        crimson: '#E01E49',
        glow: 'rgba(220, 20, 60, 0.50)'
    },
    tickets: {
        crimson: '#FF2757',
        glow: 'rgba(220, 20, 60, 0.65)'
    }
};

const durationMs = 600;

const animateVars = (target) => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const startCrimson = parseColor(getRootVar('--crimson'));
    const startGlow = parseColor(getRootVar('--glow'));
    const endCrimson = parseColor(target.crimson);
    const endGlow = parseColor(target.glow);

    if (prefersReduced) {
        setRootVar('--crimson', `rgb(${endCrimson[0]}, ${endCrimson[1]}, ${endCrimson[2]})`);
        setRootVar('--glow', toRgba(endGlow));
        return;
    }

    let start;
    const step = (ts) => {
        if (start === undefined) start = ts;
        const t = Math.min(1, (ts - start) / durationMs);
        const c = tweenColor(startCrimson, endCrimson, t);
        const g = tweenColor(startGlow, endGlow, t);
        setRootVar('--crimson', `rgb(${c[0]}, ${c[1]}, ${c[2]})`);
        setRootVar('--glow', toRgba(g));
        if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
};

export const initColorTransitions = () => {
    const sections = [
        { id: 'home', palette: palettes.hero },
        { id: 'speakers', palette: palettes.speakers },
        { id: 'schedule', palette: palettes.schedule },
        { id: 'tickets', palette: palettes.tickets }
    ];

    const map = new Map();
    sections.forEach(({ id, palette }) => {
        const el = document.getElementById(id);
        if (el) map.set(el, palette);
    });
    if (map.size === 0) return;

    const observer = new IntersectionObserver((entries) => {
        // Find the most visible entry
        const visible = entries
            .filter(e => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const targetPalette = map.get(visible.target);
        if (targetPalette) animateVars(targetPalette);
    }, { threshold: [0.2, 0.4, 0.6, 0.8] });

    map.forEach((_, el) => observer.observe(el));
};


// Continuous scroll-based blend specifically between hero (#home) and speakers (#speakers)
export const initHeroSpeakersScrollBlend = () => {
    const hero = document.getElementById('home');
    const speakers = document.getElementById('speakers');
    if (!hero || !speakers) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const heroPal = palettes.hero;
    const spkPal = palettes.speakers;

    const computeOffsets = () => ({
        vh: window.innerHeight,
        heroTop: hero.getBoundingClientRect().top + window.scrollY,
        heroBottom: hero.getBoundingClientRect().bottom + window.scrollY,
        speakersTop: speakers.getBoundingClientRect().top + window.scrollY
    });

    let offsets = computeOffsets();
    let rafId = 0;

    const blend = (t) => {
        const cFrom = parseColor(heroPal.crimson);
        const cTo = parseColor(spkPal.crimson);
        const gFrom = parseColor(heroPal.glow);
        const gTo = parseColor(spkPal.glow);
        const c = tweenColor(cFrom, cTo, t);
        const g = tweenColor(gFrom, gTo, t);
        setRootVar('--crimson', `rgb(${c[0]}, ${c[1]}, ${c[2]})`);
        setRootVar('--glow', toRgba(g));
    };

    const update = () => {
        rafId = 0;
        if (prefersReduced.matches) {
            // Snap to the most visible section
            const scrollY = window.scrollY + offsets.vh * 0.5;
            const heroCenter = (offsets.heroTop + offsets.heroBottom) / 2;
            const speakersCenter = offsets.speakersTop + speakers.offsetHeight / 2;
            const tSnap = scrollY < (heroCenter + speakersCenter) / 2 ? 0 : 1;
            blend(tSnap);
            return;
        }

        const start = offsets.heroBottom - offsets.vh * 0.25; // start blending near end of hero
        const end = offsets.speakersTop + offsets.vh * 0.25;  // finish blending after speakers enters
        const y = window.scrollY;
        let t = 0;
        if (y <= start) t = 0;
        else if (y >= end) t = 1;
        else t = (y - start) / (end - start);
        blend(Math.max(0, Math.min(1, t)));
    };

    const onScroll = () => { if (!rafId) rafId = requestAnimationFrame(update); };
    const onResize = () => { offsets = computeOffsets(); onScroll(); };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    // Initialize
    update();
};


