import { initScrollEffects } from './runtime.js';

document.addEventListener('DOMContentLoaded', () => {
  initScrollEffects();

  // ScrollSpy Logic for Sidebar Menu
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('aside nav a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            // Set active state
            link.classList.add('bg-blue-500/10', 'text-blue-400');
            link.classList.remove('text-slate-400', 'hover:text-white', 'hover:bg-slate-800/50');
          } else {
            // Set inactive state
            link.classList.add('text-slate-400', 'hover:text-white', 'hover:bg-slate-800/50');
            link.classList.remove('bg-blue-500/10', 'text-blue-400');
          }
        });
      }
    });
  }, { 
    // Triggers when the top of the section reaches the upper 30% of the screen
    rootMargin: '-10% 0px -60% 0px' 
  });

  sections.forEach(section => observer.observe(section));

  // Copy to Clipboard Logic
  const codeElements = document.querySelectorAll('.font-mono');
  
  codeElements.forEach(el => {
    // Add hover styles to indicate it's clickable
    el.style.cursor = 'pointer';
    el.title = "Click to copy class name";
    
    el.addEventListener('click', async () => {
      let textToCopy = el.textContent.trim();
      
      // Extract ALL class names starting with a dot (including Tailwind arbitrary values with brackets)
      const classMatches = textToCopy.match(/\.[\w-\[\]\.\:]+/g);
      if (classMatches) {
        // Remove the dots and join with spaces
        textToCopy = classMatches.map(c => c.replace(/^\./, '')).join(' ');
      } else {
        textToCopy = textToCopy.replace(/^\./, '');
      }

      try {
        await navigator.clipboard.writeText(textToCopy);
        
        // Visual Feedback
        const originalText = el.textContent;
        const originalBg = el.style.backgroundColor;
        
        el.textContent = 'Copied!';
        el.style.backgroundColor = 'rgba(16, 185, 129, 0.2)'; // Emerald background
        el.style.color = '#34d399'; // Emerald text
        
        setTimeout(() => {
          el.textContent = originalText;
          el.style.backgroundColor = originalBg;
          el.style.color = '';
        }, 1500);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    });
  });
});
