import { ready } from './utils/dom.js';
import { initMobileNavigation, initSmoothScrolling } from './modules/navigation.js';
import { initScrollAnimations } from './modules/animations.js';
import { initIdCard } from './modules/id.js';
import { initCountdown } from './modules/countdown.js';
import { initSpeakerImages, initSpeakersSmoothScroll } from './modules/speakers.js';
import { initColorTransitions, initHeroSpeakersScrollBlend } from './modules/theme.js';

// Initialize all modules when DOM is ready
ready(() => {
    initMobileNavigation();
    initSmoothScrolling();
    initScrollAnimations();
    initIdCard();
    initCountdown();
    initSpeakerImages();
    initSpeakersSmoothScroll();
    initColorTransitions();
    initHeroSpeakersScrollBlend();
});