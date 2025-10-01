import { $id } from '../utils/dom.js';

export const initIdCard = () => {
    const idCardToggle = $id('idCardToggle');
    const idCard = $id('idCard');
    
    if (!idCardToggle || !idCard) return;
    
    let isIdCardOpen = false;

    idCardToggle.addEventListener('click', () => {
        isIdCardOpen = !isIdCardOpen;
        if (isIdCardOpen) {
            idCard.classList.add('show');
            idCardToggle.classList.add('hidden');
        } else {
            idCard.classList.remove('show');
            idCardToggle.classList.remove('hidden');
        }
    });

    // Close ID card when clicking outside
    document.addEventListener('click', (e) => {
        if (isIdCardOpen && !idCard.contains(e.target) && !idCardToggle.contains(e.target)) {
            idCard.classList.remove('show');
            idCardToggle.classList.remove('hidden');
            isIdCardOpen = false;
        }
    });
};
