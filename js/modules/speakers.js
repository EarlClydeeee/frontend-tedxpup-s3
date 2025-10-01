// Normalize speaker images to fill the container uniformly
export const initSpeakerImages = () => {
    const applyFormatting = (img) => {
        if (!(img instanceof HTMLImageElement)) return;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.objectPosition = 'center';
        img.decoding = 'async';
        img.loading = 'lazy';
    };

    const formatAll = (root = document) => {
        const images = root.querySelectorAll('.speaker-image img');
        images.forEach(applyFormatting);
    };

    // Initial pass
    formatAll();

    // Observe future additions/changes to speakers
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (!(node instanceof HTMLElement)) return;
                if (node.matches && node.matches('.speaker-image img')) {
                    applyFormatting(node);
                } else {
                    formatAll(node);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
};


// Step-wise horizontal movement every 0.5s
export const initSpeakersStepMove = () => {
    const grid = document.querySelector('#speakers .speakers-grid');
    if (!grid) return;

    // Configure horizontal layout non-destructively
    grid.style.display = 'flex';
    grid.style.overflow = 'hidden';
    const computed = getComputedStyle(grid);
    const gapValue = computed.gap || '32px';
    grid.style.gap = gapValue;

    const getStep = () => {
        const first = grid.children[0];
        if (!(first instanceof HTMLElement)) return 0;
        const gapPx = parseFloat(gapValue);
        return first.offsetWidth + (isNaN(gapPx) ? 0 : gapPx);
    };

    let isAnimating = false;
    const durationMs = 400; // transition duration (ms)
    const intervalMs = 500; // move every 0.5s

    const tick = () => {
        if (isAnimating || grid.children.length === 0) return;
        isAnimating = true;
        const step = getStep();
        if (step <= 0) {
            isAnimating = false;
            return;
        }

        // Animate translateX to the left by one step
        grid.style.transition = `transform ${durationMs}ms ease`;
        grid.style.transform = `translateX(-${step}px)`;

        // After transition, move first child to end and reset transform
        window.setTimeout(() => {
            const firstChild = grid.children[0];
            if (firstChild) {
                grid.appendChild(firstChild);
            }
            grid.style.transition = 'none';
            grid.style.transform = 'translateX(0)';
            // Force reflow so next transition applies
            void grid.offsetHeight;
            isAnimating = false;
        }, durationMs);
    };

    // Start interval
    window.setInterval(tick, intervalMs);
};


// Smooth frame-by-frame horizontal movement (continuous conveyor)
export const initSpeakersSmoothScroll = () => {
    const grid = document.querySelector('#speakers .speakers-grid');
    if (!grid) return;
    if (grid.dataset.smoothInit === '1') return; // prevent double init
    grid.dataset.smoothInit = '1';

    // Configure horizontal layout non-destructively
    grid.style.display = 'flex';
    grid.style.overflow = 'hidden';
    grid.style.alignItems = 'stretch';
    grid.style.willChange = 'transform';
    const computed = getComputedStyle(grid);
    const gapValue = computed.gap || '32px';
    grid.style.gap = gapValue;

    const gapPx = parseFloat(gapValue) || 0;

    const first = grid.children[0];
    if (!(first instanceof HTMLElement)) return;

    // Ensure items are sized for horizontal flow
    const targetWidth = () => {
        const vw = window.innerWidth || 1200;
        const candidate = Math.floor(vw * 0.35); // ~35% of viewport
        return Math.max(260, Math.min(420, candidate));
    };

    const applyItemSizing = () => Array.from(grid.children).forEach((child) => {
        if (!(child instanceof HTMLElement)) return;
        child.style.flex = '0 0 auto';
        child.style.boxSizing = 'border-box';
        child.style.width = targetWidth() + 'px';
        child.style.maxWidth = child.style.width;
    });

    // Ensure there is a waiting card on the left by prepending a clone of the last card
    const lastChildOriginal = grid.children[grid.children.length - 1];
    if (lastChildOriginal instanceof HTMLElement) {
        const leftClone = lastChildOriginal.cloneNode(true);
        grid.insertBefore(leftClone, grid.firstChild);
    }

    applyItemSizing();

    // Current translateX offset (negative values move left)
    let offset = 0;

    const onResize = () => {
        applyItemSizing();
        // Keep one card pre-shifted to the left so there is always a left neighbor
        const s = getStep();
        offset = -s;
        grid.style.transform = `translateX(${offset}px)`;
    };
    window.addEventListener('resize', onResize);

    const speedPerFrame = 0.15; // pixels per frame (slower, smoother)

    const getStep = () => {
        const firstChild = grid.children[0];
        if (!(firstChild instanceof HTMLElement)) return 0;
        return firstChild.offsetWidth + gapPx;
    };

    const animate = () => {
        const step = getStep();
        if (step <= 0) {
            requestAnimationFrame(animate);
            return;
        }

        // Ensure initial position keeps a waiting card on the left
        if (offset === 0) {
            offset = -step;
        }

        offset -= speedPerFrame;
        // Once we've shifted past one full card + gap, recycle first card
        if (Math.abs(offset) >= step) {
            const firstChild = grid.children[0];
            if (firstChild) grid.appendChild(firstChild);
            offset += step; // compensate so visual position stays continuous
        }

        grid.style.transform = `translateX(${offset}px)`;
        requestAnimationFrame(animate);
    };

    // Initialize with left waiting card visible just offscreen
    const initStep = getStep();
    offset = -initStep;
    grid.style.transform = `translateX(${offset}px)`;
    requestAnimationFrame(animate);
};
