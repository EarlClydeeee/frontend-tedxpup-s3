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


