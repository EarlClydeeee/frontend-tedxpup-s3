// DOM utility functions
export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => root.querySelectorAll(selector);
export const $$a = (selector, root = document) => Array.from(root.querySelectorAll(selector));
export const $id = (id) => document.getElementById(id);

// DOM ready utility
export const ready = (callback) => {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', callback);
	} else {
		callback();
	}
};

// Element creation utilities
export const createElement = (tag, className = '', textContent = '') => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
};

// Fragment helpers to minimize reflows on bulk inserts
export const createFragment = (children = []) => {
	const fragment = document.createDocumentFragment();
	for (const child of children) {
		if (typeof child === 'string') {
			fragment.appendChild(document.createTextNode(child));
		} else if (child != null) {
			fragment.appendChild(child);
		}
	}
	return fragment;
};

export const appendWithFragment = (parent, nodes = []) => {
	parent.appendChild(createFragment(nodes));
	return parent;
};

// Event helper with sensible passive defaults for scroll/touch events
const passiveDefaultEvents = new Set(['touchstart', 'touchmove', 'wheel']);
export const on = (target, type, handler, options) => {
	const usePassive = options && 'passive' in options ? options.passive : passiveDefaultEvents.has(type);
	const finalOptions = options ? { ...options, passive: usePassive } : { passive: usePassive };
	target.addEventListener(type, handler, finalOptions);
	return () => target.removeEventListener(type, handler, finalOptions);
};

// Schedule DOM writes on the next animation frame to avoid layout thrash
export const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));
export const mutate = async (fn) => {
	await nextFrame();
	return fn();
};