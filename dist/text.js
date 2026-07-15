/**
 * Advanced Text Splitting Engine
 * Supports nested HTML tags and Emojis via Array.from() which respects surrogate pairs.
 */
let charIndex = 0;
let wordIndex = 0;
export const splitTextNode = (node, splitType) => {
    const fragment = document.createDocumentFragment();
    const text = node.nodeValue || '';
    if (splitType === 'chars') {
        // Array.from perfectly splits string into characters while preserving emojis!
        const chars = Array.from(text);
        chars.forEach((char) => {
            if (char === ' ') {
                // Preserve spaces as text nodes to avoid layout breakage
                fragment.appendChild(document.createTextNode(' '));
            }
            else {
                const span = document.createElement('span');
                span.className = 'tw-split-char inline-block';
                span.style.setProperty('--tw-split-index', `${charIndex++}`);
                span.textContent = char;
                fragment.appendChild(span);
            }
        });
    }
    else if (splitType === 'words') {
        const words = text.split(/(\s+)/); // Split by whitespace but keep the whitespace
        words.forEach((word) => {
            if (word.trim() === '') {
                fragment.appendChild(document.createTextNode(word));
            }
            else {
                const span = document.createElement('span');
                span.className = 'tw-split-word inline-block';
                span.style.setProperty('--tw-split-index', `${wordIndex++}`);
                span.textContent = word;
                fragment.appendChild(span);
            }
        });
    }
    return fragment;
};
export const recursiveSplit = (element, splitType) => {
    const childNodes = Array.from(element.childNodes);
    childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const fragment = splitTextNode(node, splitType);
            element.replaceChild(fragment, node);
        }
        else if (node.nodeType === Node.ELEMENT_NODE) {
            // Don't recurse into already split elements
            const el = node;
            if (!el.classList.contains('tw-split-char') && !el.classList.contains('tw-split-word')) {
                recursiveSplit(el, splitType);
            }
        }
    });
};
export const initTextSplitting = () => {
    const charsElements = document.querySelectorAll('.text-split-chars');
    charsElements.forEach((el) => {
        charIndex = 0; // Reset per container
        recursiveSplit(el, 'chars');
        el.style.setProperty('--tw-total-splits', `${charIndex}`);
    });
    const wordsElements = document.querySelectorAll('.text-split-words');
    wordsElements.forEach((el) => {
        wordIndex = 0; // Reset per container
        recursiveSplit(el, 'words');
        el.style.setProperty('--tw-total-splits', `${wordIndex}`);
    });
};
