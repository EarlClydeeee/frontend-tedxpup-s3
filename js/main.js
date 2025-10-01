import { ready } from './utils/dom.js';
import { initMobileNavigation, initSmoothScrolling } from './modules/navigation.js';
import { initScrollAnimations } from './modules/animations.js';

// Initialize all modules when DOM is ready
ready(() => {
    initMobileNavigation();
    initSmoothScrolling();
    initScrollAnimations();
});