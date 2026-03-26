// DOM Elements
const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const themeToggle = document.getElementById('theme-toggle');

// Theme Management
let isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

function applyTheme() {
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
    themeToggle.innerHTML = isDarkTheme ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}

applyTheme();

themeToggle.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    applyTheme();
});

// Toast for copy feedback
const toast = document.createElement('div');
toast.className = 'copy-toast';
document.body.appendChild(toast);

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// AI "Brain" - Color Palettes DB
const palettesDB = {
    // 2 Colors
    duotone: [
        { colors: ['#0f172a', '#3fbDF3'], ratios: [70, 30], name: 'Neon Cyber Duotone' },
        { colors: ['#fdf4ff', '#d946ef'], ratios: [80, 20], name: 'Minimal Pink' },
        { colors: ['#171717', '#eab308'], ratios: [85, 15], name: 'Dark Gold Accent' }
    ],
    // 3 Colors
    minimalist: [
        { colors: ['#ffffff', '#f1f5f9', '#0f172a'], ratios: [60, 30, 10], name: 'Clean White Minimal' },
        { colors: ['#fafafa', '#e4e4e7', '#f43f5e'], ratios: [65, 25, 10], name: 'Red Accent Modern' },
        { colors: ['#1e293b', '#334155', '#38bdf8'], ratios: [60, 30, 10], name: 'Dark UI Soft Blue' }
    ],
    // 4 Colors
    nature: [
        { colors: ['#f7fee7', '#d9f99d', '#84cc16', '#3f6212'], ratios: [60, 20, 15, 5], name: 'Spring Fresh' },
        { colors: ['#ecfdf5', '#a7f3d0', '#10b981', '#047857'], ratios: [50, 30, 10, 10], name: 'Mint Forest' },
        { colors: ['#f0fdfa', '#5eead4', '#0f766e', '#134e4a'], ratios: [60, 25, 10, 5], name: 'Deep Ocean' }
    ],
    warm: [
        { colors: ['#fff7ed', '#ffedd5', '#f97316', '#9a3412'], ratios: [55, 30, 10, 5], name: 'Sunset Coffee' },
        { colors: ['#fef2f2', '#fecaca', '#ef4444', '#7f1d1d'], ratios: [60, 20, 15, 5], name: 'Rose Warmth' },
        { colors: ['#fffbeb', '#fef08a', '#eab308', '#854d0e'], ratios: [60, 25, 10, 5], name: 'Golden Hour' }
    ],
    tech: [
        { colors: ['#0b0f19', '#1e293b', '#3b82f6', '#8b5cf6'], ratios: [60, 25, 10, 5], name: 'SaaS Modern Tech' },
        { colors: ['#ffffff', '#f3f4f6', '#2563eb', '#1e40af'], ratios: [60, 20, 15, 5], name: 'Corporate Trust' },
        { colors: ['#000000', '#18181b', '#22c55e', '#ec4899'], ratios: [50, 30, 10, 10], name: 'Hacker Punk' }
    ],
    pastel: [
        { colors: ['#fdf4ff', '#fce7f3', '#fbcfe8', '#f472b6'], ratios: [40, 30, 20, 10], name: 'Cotton Candy' },
        { colors: ['#f0f9ff', '#e0f2fe', '#bae6fd', '#38bdf8'], ratios: [50, 25, 15, 10], name: 'Sky Cloud' }
    ]
};

// Logic to find matches
function getRecommendations(text) {
    const input = text.toLowerCase();
    let pool = [];

    if (input.includes('minimal')) pool = pool.concat(palettesDB.minimalist);
    if (input.includes('alam') || input.includes('hijau') || input.includes('nature') || input.includes('lingkungan')) pool = pool.concat(palettesDB.nature);
    if (input.includes('tech') || input.includes('teknologi') || input.includes('robot') || input.includes('fintech') || input.includes('aplikasi') || input.includes('cyber')) pool = pool.concat(palettesDB.tech);
    if (input.includes('hangat') || input.includes('cafe') || input.includes('kopi') || input.includes('sunset') || input.includes('orange')) pool = pool.concat(palettesDB.warm);
    if (input.includes('pastel') || input.includes('lucu') || input.includes('imut') || input.includes('soft')) pool = pool.concat(palettesDB.pastel);
    if (input.includes('2') || input.includes('dua') || input.includes('duotone')) pool = pool.concat(palettesDB.duotone);

    // If no context matched, combine some common good ones
    if (pool.length === 0) {
        pool = [...palettesDB.tech, ...palettesDB.minimalist, ...palettesDB.warm, ...palettesDB.nature, ...palettesDB.pastel, ...palettesDB.duotone];
    }

    // Remove duplicates based on name
    const uniquePool = [];
    const names = new Set();
    const shuffled = pool.sort(() => 0.5 - Math.random());
    
    for (const item of shuffled) {
        if (!names.has(item.name)) {
            names.add(item.name);
            uniquePool.push(item);
            if (uniquePool.length === 3) break;
        }
    }

    return uniquePool;
}

// UI Functions
function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function appendMessage(sender, content, isHtml = false) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.classList.add(sender === 'user' ? 'user-message' : 'bot-message');

    const avatarIcon = sender === 'user' 
        ? '<i class="fa-solid fa-user"></i>' 
        : '<i class="fa-solid fa-wand-magic-sparkles"></i>';

    const messageContent = isHtml ? content : `<p>${content}</p>`;

    div.innerHTML = `
        <div class="avatar">${avatarIcon}</div>
        <div class="message-content">
            ${messageContent}
        </div>
    `;

    chatContainer.appendChild(div);
    scrollToBottom();
}

function showTyping() {
    const div = document.createElement('div');
    div.classList.add('message', 'bot-message');
    div.id = 'typing-indicator';
    div.innerHTML = `
        <div class="avatar"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
        <div class="message-content">
            <div class="typing-indicator">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>
    `;
    chatContainer.appendChild(div);
    scrollToBottom();
}

function removeTyping() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

function attachCopyEventListeners() {
    const segments = document.querySelectorAll('.palette-segment');
    segments.forEach(seg => {
        // Prevent stacking listeners
        seg.removeEventListener('click', copyHexColor); 
        seg.addEventListener('click', copyHexColor);
    });

    const cards = document.querySelectorAll('.color-card');
    cards.forEach(card => {
        card.removeEventListener('click', copyHexColorFromCard);
        card.addEventListener('click', copyHexColorFromCard);
        card.style.cursor = 'pointer';
    });

    // Add event listener for preview buttons
    const previewBtns = document.querySelectorAll('.btn-preview-palette');
    previewBtns.forEach(btn => {
        btn.removeEventListener('click', handlePreviewClick);
        btn.addEventListener('click', handlePreviewClick);
    });

    const copyCssBtns = document.querySelectorAll('.btn-copy-css');
    copyCssBtns.forEach(btn => {
        btn.removeEventListener('click', handleCopyCssClick);
        btn.addEventListener('click', handleCopyCssClick);
    });

    const copyTwBtns = document.querySelectorAll('.btn-copy-tailwind');
    copyTwBtns.forEach(btn => {
        btn.removeEventListener('click', handleCopyTwClick);
        btn.addEventListener('click', handleCopyTwClick);
    });
}

function copyHexColor(e) {
    const hex = e.target.getAttribute('data-hex');
    navigator.clipboard.writeText(hex).then(() => {
        showToast(`Disalin: ${hex}`);
    });
}

function copyHexColorFromCard(e) {
    const hexEl = e.currentTarget.querySelector('.color-hex-text');
    if(hexEl) {
        const hex = hexEl.textContent;
        navigator.clipboard.writeText(hex).then(() => {
            showToast(`Disalin: ${hex}`);
        });
    }
}

function buildPaletteOutput(palette) {
    const { colors, ratios, name } = palette;
    
    let barsHTML = '';
    let cardsHTML = '';
    
    // Labels for the roles
    const roles = {
        0: 'Background',
        1: 'Primary Element',
        2: 'Secondary / Accent',
        3: 'Highlight / Text'
    };

    colors.forEach((col, idx) => {
        const r = ratios[idx];
        barsHTML += `<div class="palette-segment" style="width: ${r}%; background-color: ${col};" data-hex="${col}" data-percent="${r}%"></div>`;
        
        cardsHTML += `
            <div class="color-card" title="Klik untuk menyalin">
                <div class="color-swatch-circle" style="background-color: ${col};"></div>
                <div class="color-info-text">
                    <span class="color-hex-text">${col}</span>
                    <span class="color-ratio-text">${r}%</span>
                </div>
            </div>
        `;
    });

    // Formatting rules description
    let guidelines = `<p class="ratio-guideline">Saran Penggunaan:<br>`;
    colors.forEach((col, idx) => {
        guidelines += `<strong>${roles[idx] || 'Accent ' + idx} (${ratios[idx]}%)</strong> menggunakan warna <code>${col}</code>.<br>`;
    });
    guidelines += `</p>`;

    return `
        <div class="palette-display">
            <h3 class="palette-title"><i class="fa-solid fa-droplet"></i> Tema: "${name}"</h3>
            <div class="palette-bar-wrapper">
                ${barsHTML}
            </div>
            <div class="color-cards-grid">
                ${cardsHTML}
            </div>
            ${guidelines}
            <div class="palette-actions">
                <button class="btn-action btn-preview-palette" data-colors='${JSON.stringify(colors)}'>
                    <i class="fa-solid fa-desktop"></i> Preview Web (Landing Page)
                </button>
                <button class="btn-action btn-copy-css" data-palette='${JSON.stringify({name, colors})}'>
                    <i class="fa-brands fa-css3-alt"></i> Salin CSS
                </button>
                <button class="btn-action btn-copy-tailwind" data-palette='${JSON.stringify({name, colors})}'>
                    <i class="fa-solid fa-code"></i> Salin Tailwind
                </button>
            </div>
        </div>
    `;
}

// Event Listeners
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    // Send User Message
    appendMessage('user', text);
    userInput.value = '';

    // Show Typing Indicator
    showTyping();

    // AI Logic Simulation
    setTimeout(() => {
        removeTyping();
        const recommendations = getRecommendations(text);
        
        let palettesHtml = '<div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">';
        recommendations.forEach(rec => {
            palettesHtml += buildPaletteOutput(rec);
        });
        palettesHtml += '</div>';
        
        const responseHtml = `<p>Tentu, ini 3 saran rekomendasi palet warna untuk konsep "${text}":</p>` + 
                             palettesHtml + 
                             `<p style="margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-muted);"><i class="fa-regular fa-lightbulb"></i> Tips: Anda dapat mengklik warna manapun untuk menyalin kode Hex-nya secara otomatis.</p>`;
        
        appendMessage('bot', responseHtml, true);
        
        // Attach click listeners to new elements
        setTimeout(() => attachCopyEventListeners(), 100);

    }, Math.random() * 800 + 1000); // Random delay 1-1.8s
});

// Preview logic
function getContrastYIQ(hexcolor){
    hexcolor = hexcolor.replace("#", "");
    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? '#0f172a' : '#f8fafc';
}

function shadeColor(color, percent) {
    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(Math.max(0, Math.min(255, R * (100 + percent) / 100)));
    G = parseInt(Math.max(0, Math.min(255, G * (100 + percent) / 100)));
    B = parseInt(Math.max(0, Math.min(255, B * (100 + percent) / 100)));

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}

function handleCopyCssClick(e) {
    const paletteStr = e.currentTarget.getAttribute('data-palette');
    const { name, colors } = JSON.parse(paletteStr);
    
    let cssText = `/* Palette: ${name} */\n:root {\n`;
    const roles = ['bg', 'primary', 'secondary', 'accent'];
    colors.forEach((col, idx) => {
        cssText += `  --color-${roles[idx] || 'extra-' + idx}: ${col};\n`;
    });
    cssText += `}\n`;
    
    navigator.clipboard.writeText(cssText).then(() => {
        showToast('Berhasil menyalin kode CSS!');
    });
}

function handleCopyTwClick(e) {
    const paletteStr = e.currentTarget.getAttribute('data-palette');
    const { name, colors } = JSON.parse(paletteStr);
    
    const themeName = name.toLowerCase().replace(/\s+/g, '-');
    const roles = ['bg', 'primary', 'secondary', 'accent'];
    
    let twText = `// Tailwind config for ${name}\nconst colors = {\n  '${themeName}': {`;
    colors.forEach((col, idx) => {
        twText += `\n    ${roles[idx] || 'extra' + idx}: '${col}',`;
    });
    twText += `\n  }\n};\n`;
    
    navigator.clipboard.writeText(twText).then(() => {
        showToast('Berhasil menyalin kode Tailwind!');
    });
}

function handlePreviewClick(e) {
    const colorsStr = e.currentTarget.getAttribute('data-colors');
    const colors = JSON.parse(colorsStr);
    showPreview(colors);
}

function showPreview(colors) {
    const modal = document.getElementById('preview-modal');
    const frame = document.getElementById('preview-frame');
    
    let bg = colors[0];
    let primary = colors[1];
    let secondary = colors.length > 2 ? colors[2] : primary;
    let text = colors.length > 3 ? colors[3] : getContrastYIQ(bg);
    
    if(colors.length === 4 && text.toLowerCase() === bg.toLowerCase()) {
        text = getContrastYIQ(bg);
    }
    
    let isLightBg = (getContrastYIQ(bg) === '#0f172a');
    let cardBg = isLightBg ? shadeColor(bg, -3) : shadeColor(bg, 10);
    
    frame.style.setProperty('--prev-bg', bg);
    frame.style.setProperty('--prev-primary', primary);
    frame.style.setProperty('--prev-secondary', secondary);
    frame.style.setProperty('--prev-text', text);
    frame.style.setProperty('--prev-card', cardBg);
    frame.style.setProperty('--prev-btn-text', getContrastYIQ(primary));
    
    const closeBtn = document.getElementById('close-preview-btn');
    if (closeBtn) closeBtn.style.color = getContrastYIQ(bg);

    modal.classList.add('active');
}

document.getElementById('close-preview-btn')?.addEventListener('click', () => {
    document.getElementById('preview-modal').classList.remove('active');
});

document.getElementById('preview-modal')?.addEventListener('click', (e) => {
    if(e.target === document.getElementById('preview-modal')) {
        document.getElementById('preview-modal').classList.remove('active');
    }
});
