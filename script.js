document.addEventListener('DOMContentLoaded', () => {

    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        if (currentTheme === 'light') { body.setAttribute('data-theme', 'dark'); themeToggle.innerText = '☀️ Light Mode'; } 
        else { body.setAttribute('data-theme', 'light'); themeToggle.innerText = '🌙 Dark Mode'; }
    });

    let selectedDate = new Date(); 
    const btnPrev = document.getElementById('btn-prev-day');
    const btnNext = document.getElementById('btn-next-day');
    const btnTodayText = document.getElementById('btn-today'); 
    const datetimeDisplay = document.getElementById('datetime-display');

    function updateCenterNavigation() {
        const today = new Date();
        const isToday = selectedDate.getDate() === today.getDate() && selectedDate.getMonth() === today.getMonth() && selectedDate.getFullYear() === today.getFullYear();
        if (isToday) { btnTodayText.innerText = "Vandaag"; } 
        else { btnTodayText.innerText = selectedDate.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }); }
    }
    function updateRealTimeClock() {
        const now = new Date();
        let dateString = now.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
        dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1).replace(' ', ', ');
        datetimeDisplay.innerHTML = `${dateString} &nbsp;&nbsp; ${now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`;
    }

    btnPrev.addEventListener('click', () => { selectedDate.setDate(selectedDate.getDate() - 1); updateCenterNavigation(); });
    btnNext.addEventListener('click', () => { selectedDate.setDate(selectedDate.getDate() + 1); updateCenterNavigation(); });
    btnTodayText.addEventListener('click', () => { selectedDate = new Date(); updateCenterNavigation(); });

    updateCenterNavigation(); updateRealTimeClock(); setInterval(updateRealTimeClock, 1000);

    // --- SHARED STATE & FIGMA DATA ---
    const appState = {
        'rooster': {
            members: [
                { name: 'Ron Appeldoorn', tags: [{text: 'TS 1: BV', color: 'red'}] },
                { name: 'Bart Savelsberg', tags: [{text: 'TS 1: Ch, Avond/Nacht', color: 'red'}] },
                { name: 'Wiebo Razenberg', tags: [{text: 'TS 1: Ch, Dag', color: 'red'}] },
                { name: 'Erik Smulders', tags: [{text: 'TS 1: 1', color: 'red'}, {text: 'WO: ass', color: 'green'}] },
                { name: 'Dirk Magielse', tags: [{text: 'TS 1: 2, Avond/Nacht', color: 'red'}, {text: 'TS 2: 2, Dag', color: 'red'}, {text: 'WO: duiker 2', color: 'green'}] },
                { name: 'Jan Rijvers', tags: [{text: 'TS 2: Ch, Dag', color: 'red'}] },
                { name: 'Jasper Meeusen', tags: [{text: 'TS 1: 4', color: 'red'}] },
                { name: 'Jochem Verdonk', tags: [{text: 'TS 2: BV', color: 'red'}, {text: 'WO: BV', color: 'gold'}] },
                { name: 'Henri Smans', tags: [{text: 'TS 2: Ch', color: 'red'}, {text: 'WO: Ch', color: 'gold'}, {text: 'Kantinist', color: 'grey'}] },
                { name: 'Geert Tuerlings', tags: [{text: 'TS 2: 1', color: 'red'}, {text: 'SPEC. voertuig: 1', color: 'blue'}] },
                { name: 'Kjell Bastiaansen', tags: [{text: 'TS 2: 2, Avond/Nacht', color: 'red'}] },
                { name: 'Ronnie van Dongen', tags: [{text: 'TS 2: 3', color: 'red'}, {text: 'WO: DPL', color: 'gold'}] },
                { name: 'Nick van Melsen', tags: [{text: 'TS 2: BV', color: 'red'}, {text: 'WO: duiker 1', color: 'gold'}] },
                { name: 'Christ Joosen', tags: [{text: 'SPEC. voertuig: BV', color: 'blue'}, {text: 'Sleutel ronde', color: 'grey'}] },
                { name: 'Richard Broeders', tags: [{text: 'SPEC. voertuig: Ch', color: 'blue'}] }
            ]
        },
        'alarmen': { incidents: [{ id: 'al1', type: 'P1 Brand - Wegvervoer', loc: 'Afrit A4 Re - Hoogerheide', date: '9-4-2026', time: '16:06 - 16:41', vehicles: '201531, 201444, 201092', infoTitle: 'Carnaval Nieuw-Vossemeer', infoText: 'Adres: Dorpskern Nieuw-Vossemeer.\n\nBestanden:\n- Veiligheidsplan Optochten 2026.pdf\n- Plattegrond carnavalsroute.pdf' }] },
        'evenementen': { incidents: [{ id: 'ev1', type: 'B-Evenement (~300)', loc: 'Nieuw-Vossemeer', date: '23-1-2026', time: 'Hele dag', vehicles: 'Nienke Zwetsloot (Adviseur)', infoTitle: 'Carnaval Nieuw-Vossemeer', infoText: 'Carnaval Nieuw-Vossemeer is een evenement met verhoogd risico ivm wegafsluiting.' }] },
        'algemeen': { tasks: [ { id: 'aw1', text: 'Schoonmaken vuile ruimte en ruimte wasmachine', checked: true, author: 'Paul van der Heijden' }, { id: 'aw2', text: 'SVM-rondpompen 20-1561', checked: false, author: 'Paul van der Heijden' }, { id: 'aw3', text: 'Papierbakken legen', checked: false, author: 'Paul van der Heijden' } ] },
        'ademlucht': { tasks: [ { id: 'ad1', text: 'Na einde werkzaamheden testbanken en vulbalk-pc uitschakelen', checked: false, author: 'Paul van der Heijden' } ] }
    };

    // Voeg lege state toe voor alle dynamische tekstblokken (WYSIWYG)
    const textBlocks = ['afspraken', 'nieuws', 'arbo', 'communicatie', 'iboa', 'ocb', 'rbcb', 'straten', 'tfl', 'vkb', 'waarschuwingen'];
    textBlocks.forEach(id => { appState[id] = { title: '', content: '' }; });

    // --- RENDER FUNCTIES ---
    function getRoosterKISHTML() {
        let html = `<h1 class="slide-title">Ploeg indeling: Breda</h1><div class="kis-rooster-grid">`;
        appState.rooster.members.forEach(m => {
            let tagsHtml = m.tags.map(t => `<span class="func-tag" data-color="${t.color}">${t.text}</span>`).join('');
            html += `<div class="kis-rooster-card"><div class="member-name">${m.name}</div><div class="member-tags">${tagsHtml}</div></div>`;
        });
        html += `</div>`;
        return html;
    }

    function getTaskEditorHTML(blockId) {
        let html = '';
        appState[blockId].tasks.forEach(t => {
            html += `<div class="editor-check-toggle ${t.checked ? 'checked' : ''}" data-block="${blockId}" data-id="${t.id}">
                        <div class="check-box">${t.checked ? '✓' : ''}</div>
                        <div class="check-content"><strong>${t.text}</strong><span>Auteur: ${t.author} automatisch toegevoegd</span></div>
                        <button class="icon-btn edit">✎</button><button class="icon-btn delete">🗑</button>
                    </div>`;
        });
        html += `<div class="add-item-row"><input type="text" class="text-input" placeholder="Vul hier een item in..."><button class="btn-add">+</button></div>`;
        return html;
    }

    function getTaskKISHTML(blockId, title) {
        let html = `<h1 class="slide-title">${title}</h1><div style="width:100%;">`;
        appState[blockId].tasks.forEach(t => {
            html += `<div class="kis-checklist-card ${t.checked ? 'checked' : ''}" data-block="${blockId}" data-id="${t.id}">
                        <div class="kis-check-square">${t.checked ? '✓' : ''}</div>
                        <div class="kis-check-text">${t.text}<span class="kis-check-author">Auteur: ${t.author} automatisch toegevoegd</span></div>
                     </div>`;
        });
        html += `</div>`;
        return html;
    }

    function getGlassRowsKISHTML(title, incidents) {
        let html = `<h1 class="slide-title">${title}</h1><div style="width:100%;">`;
        html += `<div style="display:flex; gap:20px; font-weight:700; color:rgba(255,255,255,0.6); padding:0 30px 10px; font-size:16px; text-transform:uppercase;"><div style="flex:1;">Melding</div><div style="flex:1;">Locatie</div><div style="flex:1;">Datum</div><div style="flex:1;">Details</div><div style="flex:0 0 40px;"></div></div>`;
        incidents.forEach(inc => {
            html += `
                <div class="kis-glass-row">
                    <div class="kis-glass-col bold">${inc.type}</div>
                    <div class="kis-glass-col">${inc.loc}</div>
                    <div class="kis-glass-col">${inc.date}<br><span style="font-size:14px;opacity:0.7;">${inc.time}</span></div>
                    <div class="kis-glass-col">${inc.vehicles}</div>
                    ${inc.infoText ? `<div class="kis-info-trigger" data-title="${inc.infoTitle}" data-text="${inc.infoText}">i</div>` : '<div style="flex:0 0 40px;"></div>'}
                </div>`;
        });
        html += `</div>`;
        return html;
    }

    // De herbruikbare editor en preview generator voor tekstblokken
    function getWysiwygEditorHTML(blockId) {
        const data = appState[blockId] || { title: '', content: '' };
        const tabName = data.title || 'Nieuwe tab';
        return `
            <div class="editor-tabs"><div class="tab active">${tabName}</div></div>
            <div class="form-group"><label>Tab titel:</label><input type="text" class="text-input tab-title-input" value="${data.title}" placeholder="Typ een titel..."></div>
            <div class="wysiwyg-container">
                <div class="wysiwyg-toolbar">
                    <button class="toolbar-btn">P</button><button class="toolbar-btn">H1</button><button class="toolbar-btn">H2</button>
                    <div class="toolbar-divider"></div>
                    <button class="toolbar-btn" style="font-weight:900;">B</button><button class="toolbar-btn" style="font-style:italic;">I</button>
                </div>
                <textarea class="wysiwyg-area tab-content-input" placeholder="Typ inhoud...">${data.content}</textarea>
            </div>
            <button class="btn-save btn-save-text" data-block="${blockId}">Opslaan</button>
        `;
    }

    function getWysiwygPreviewHTML(blockId, fallbackTitle) {
        const data = appState[blockId] || { title: '', content: '' };
        const titleToUse = data.title ? data.title.toUpperCase() : fallbackTitle;
        const contentToUse = data.content ? data.content.replace(/\n/g, '<br>') : 'Geen inhoud opgeslagen.';
        return `
            <h1 class="slide-title">${titleToUse}</h1>
            <div style="font-size: 24px; line-height: 1.6;" class="kis-text-content">${contentToUse}</div>
        `;
    }

    const blockData = {
        'ploeg-indeling': { count: 0, editorHTML: `<div class="form-group"><label>Kazerne in Roosterplanning</label><div class="tags-wrapper"><span class="tag">Breda <span class="close">&times;</span></span></div></div><button class="btn-save">Opslaan</button>`, previewHTML: () => getRoosterKISHTML() },
        'alarmen': { count: () => appState.alarmen.incidents.length, editorHTML: `<div class="table-container"><table class="data-table"><thead><tr><th>Datum</th><th>Melding</th><th>Acties</th></tr></thead><tbody><tr><td>9-4-2026</td><td>P1 Brand - Wegvervoer</td><td><button class="icon-btn edit">✎</button></td></tr></tbody></table></div>`, previewHTML: () => getGlassRowsKISHTML('ALARMEN VORIGE DIENST', appState.alarmen.incidents) },
        'evenementen': { count: () => appState.evenementen.incidents.length, editorHTML: `<div class="form-group"><label>Filter</label><div class="tags-wrapper"><span class="tag">Nieuw-Vossemeer <span class="close">&times;</span></span></div></div><button class="btn-save">Opslaan</button>`, previewHTML: () => getGlassRowsKISHTML('EVENEMENTEN', appState.evenementen.incidents) },
        'voertuigen': { count: 0, editorHTML: `<div class="form-group"><label>Voertuigen</label><div class="tags-wrapper"><span class="tag">201531 <span class="close">&times;</span></span></div></div><button class="btn-save">Opslaan</button>`, previewHTML: `<h1 class="slide-title">STATUS VOERTUIGEN</h1><h3 style="font-size: 24px; font-weight: 700;">Geen defecten gemeld.</h3>` },
        'topdesk': { count: 0, editorHTML: `<div class="form-group"><label>Topdesk</label><div class="tags-wrapper"><span class="tag">Bergen op Zoom <span class="close">&times;</span></span></div></div><button class="btn-save">Opslaan</button>`, previewHTML: `<h1 class="slide-title">TOPDESK MELDINGEN</h1><p style="opacity:0.5; font-size: 20px;">Geen meldingen.</p>` },
        'mobiliteit': { count: 0, editorHTML: `<div class="form-group"><label>Kaartlagen</label><div class="tags-wrapper"><span class="tag">Weg Info <span class="close">&times;</span></span></div></div><button class="btn-save">Opslaan</button>`, previewHTML: `<h1 class="slide-title">MOBILITEIT</h1><div style="width:100%;height:400px;background:rgba(0,0,0,0.05);border:1px dashed var(--input-border);display:flex;align-items:center;justify-content:center;">Kaart</div>` },
        'gepland-onderhoud': { count: 1, editorHTML: `<div class="table-container"><table class="data-table"><thead><tr><th>Voertuig</th><th>Melding</th><th>Acties</th></tr></thead><tbody><tr><td>20-1571</td><td>Onderhoud</td><td><button class="icon-btn edit">✎</button></td></tr></tbody></table></div>`, previewHTML: `<h1 class="slide-title">GEPLAND ONDERHOUD VOERTUIGEN</h1><p style="font-size: 20px;">20-1571 in onderhoud.</p>` },
        'algemeen': { count: () => appState.algemeen.tasks.length, editorHTML: () => getTaskEditorHTML('algemeen'), previewHTML: () => getTaskKISHTML('algemeen', 'ALG. WERKZAAMHEDEN') },
        'ademlucht': { count: () => appState.ademlucht.tasks.length, editorHTML: () => getTaskEditorHTML('ademlucht'), previewHTML: () => getTaskKISHTML('ademlucht', 'ADEMLUCHT WERKZAAMHEDEN') },
        'vakbekwaam': { count: 0, editorHTML: `<div class="form-group"><label>Ploegen</label><div class="dropdown-input placeholder">Selecteer...</div></div><button class="btn-save">Opslaan</button>`, previewHTML: `<h1 class="slide-title">VAKBEKWAAM AG5</h1><p style="opacity:0.5; font-size: 20px;">Geen bijzonderheden.</p>` },
        'default': { count: 0, editorHTML: (id) => getWysiwygEditorHTML(id), previewHTML: (id, title) => getWysiwygPreviewHTML(id, title) }
    };

    function getHTML(id, type, defaultTitle) { const data = blockData[id] || blockData['default']; const content = data[type]; return typeof content === 'function' ? content(id, defaultTitle) : content; }
    function getBadgeCount(id) { const data = blockData[id] || blockData['default']; const count = data.count; return typeof count === 'function' ? count() : count; }

    function initializeBadges() { document.querySelectorAll('.drag-item').forEach(card => { const count = getBadgeCount(card.getAttribute('data-id')); if (count > 0) { let badge = document.createElement('span'); badge.className = 'badge red-bg'; badge.innerText = count; card.appendChild(badge); } }); }
    initializeBadges();

    // --- DIRECT DOM SYNC & SAVE LOGIC ---
    document.addEventListener('click', (e) => {
        // Tekst opslaan voor WYSIWYG
        if (e.target.classList.contains('btn-save-text')) {
            const blockId = e.target.getAttribute('data-block');
            appState[blockId].title = document.querySelector('.tab-title-input').value;
            appState[blockId].content = document.querySelector('.tab-content-input').value;
            
            const activeTab = document.querySelector('.editor-tabs .tab.active');
            if (activeTab) activeTab.innerText = appState[blockId].title || 'Nieuwe tab';

            const orgText = e.target.innerText;
            e.target.innerText = 'Opgeslagen ✓';
            e.target.style.backgroundColor = 'var(--vrmwb-gold)';
            e.target.style.color = '#1E1E1E';
            setTimeout(() => { e.target.innerText = orgText; e.target.style.backgroundColor = ''; e.target.style.color = ''; }, 1500);
            return;
        }

        const checkToggle = e.target.closest('.editor-check-toggle, .kis-checklist-card');
        if (checkToggle && !e.target.closest('.icon-btn')) {
            const blockId = checkToggle.getAttribute('data-block');
            const taskId = checkToggle.getAttribute('data-id');
            const task = appState[blockId].tasks.find(t => t.id === taskId);
            
            if (task) {
                task.checked = !task.checked; 
                document.querySelectorAll(`[data-block="${blockId}"][data-id="${taskId}"]`).forEach(el => {
                    if (task.checked) {
                        el.classList.add('checked');
                        const icon = el.querySelector('.check-box, .kis-check-square');
                        if (icon) icon.innerText = '✓';
                    } else {
                        el.classList.remove('checked');
                        const icon = el.querySelector('.check-box, .kis-check-square');
                        if (icon) icon.innerText = '';
                    }
                });
            }
            return;
        }

        const infoTrigger = e.target.closest('.kis-info-trigger');
        const kisModal = document.getElementById('kis-modal');
        if (infoTrigger) {
            document.getElementById('kis-modal-title').innerText = infoTrigger.getAttribute('data-title');
            document.getElementById('kis-modal-text').innerText = infoTrigger.getAttribute('data-text');
            kisModal.classList.add('active');
            e.stopPropagation();
        } else if (e.target.closest('#kis-modal-close') || e.target === kisModal) {
            kisModal.classList.remove('active');
        }
    });

    // --- DRAG & DROP ---
    const middleList = document.getElementById('dagjournaal-lijst');
    const editorContent = document.getElementById('editor-content');
    const leftColumn = document.getElementById('blok-selectie').closest('.column');
    const middleColumn = middleList.closest('.column');

    let currentSelectedBlockId = null;

    document.querySelectorAll('.drag-item').forEach(draggable => {
        draggable.addEventListener('dragstart', () => draggable.classList.add('dragging'));
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
            if (middleList.contains(draggable)) draggable.classList.add('sequence-card'); 
            else draggable.classList.remove('sequence-card', 'active-card', 'gold'), draggable.classList.add('theme-card-light');
            document.getElementById('empty-state').style.display = middleList.querySelectorAll('.drag-item').length === 0 ? 'block' : 'none';
            if (!middleList.querySelector('.active-card')) {
                document.getElementById('editor-title').innerText = "GEEN BLOK GESELECTEERD";
                editorContent.innerHTML = `<div class="editor-placeholder-text">Voeg een blok toe en klik erop.</div>`;
                currentSelectedBlockId = null;
            }
        });
    });

    function getDragAfterElement(container, y) { const draggableElements = [...container.querySelectorAll('.drag-item:not(.dragging)')]; return draggableElements.reduce((closest, child) => { const box = child.getBoundingClientRect(); const offset = y - box.top - box.height / 2; if (offset < 0 && offset > closest.offset) return { offset: offset, element: child }; else return closest; }, { offset: Number.NEGATIVE_INFINITY }).element; }

    [leftColumn, middleColumn].forEach(col => {
        col.addEventListener('dragover', e => {
            e.preventDefault(); const draggable = document.querySelector('.dragging'); if (!draggable) return;
            const zone = col.querySelector('.scroll-area'); const afterElement = getDragAfterElement(zone, e.clientY);
            if (afterElement == null) zone.appendChild(draggable); else zone.insertBefore(draggable, afterElement);
        });
    });

    middleList.addEventListener('click', e => {
        const card = e.target.closest('.drag-item');
        if (!card || !middleList.contains(card)) return; 
        middleList.querySelectorAll('.drag-item').forEach(c => c.classList.remove('active-card', 'gold'));
        card.classList.add('active-card', 'gold');
        currentSelectedBlockId = card.getAttribute('data-id');
        const title = card.textContent.trim().toUpperCase();
        document.getElementById('editor-title').innerText = title;
        editorContent.innerHTML = getHTML(currentSelectedBlockId, 'editorHTML', title);
    });

    // --- MODALS ---
    const previewModal = document.getElementById('preview-modal');
    document.getElementById('btn-open-preview').addEventListener('click', () => {
        if (!currentSelectedBlockId) { alert("Selecteer eerst een blok!"); return; }
        const title = document.getElementById('editor-title').innerText;
        document.getElementById('preview-body').innerHTML = getHTML(currentSelectedBlockId, 'previewHTML', title);
        previewModal.classList.add('active');
    });
    document.getElementById('close-preview').addEventListener('click', () => previewModal.classList.remove('active'));

    const locationModal = document.getElementById('location-modal');
    document.getElementById('location-trigger').addEventListener('click', () => locationModal.classList.add('active'));
    document.getElementById('close-modal').addEventListener('click', () => locationModal.classList.remove('active'));
    document.querySelectorAll('.loc-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.loc-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active'); document.getElementById('location-trigger').innerText = this.innerText;
            locationModal.classList.remove('active');
        });
    });

    // --- KIS PRESENTATIE ---
    const presentationOverlay = document.getElementById('presentation-overlay');
    const presContent = document.getElementById('pres-content');
    const presBgImageContainer = document.getElementById('pres-bg-image');

    let presentationSlides = [];
    let currentSlideIndex = 0;

    function buildPresentation() {
        presentationSlides = []; presBgImageContainer.innerHTML = ''; 
        let contentImagePool = []; for(let i = 1; i <= 25; i++) { contentImagePool.push(`img/content-${i}.jpg`); } contentImagePool.sort(() => Math.random() - 0.5);
        
        presentationSlides.push({ bgImage: `img/intro-${Math.floor(Math.random() * 5) + 1}.jpg`, html: `<div style="text-align: center; width: 100%;"><h1 class="slide-title" style="font-size: 72px; margin-bottom: 20px; border-bottom: none;">OPERATIONEEL DAGJOURNAAL</h1><h2 style="font-size: 48px; color: var(--vrmwb-gold); margin-bottom: 40px; text-transform: uppercase;">${document.getElementById('location-trigger').innerText}</h2><p style="font-size: 32px; opacity: 0.7; font-weight: 700;">${document.getElementById('datetime-display').innerText.split('   ')[0]}</p></div>`, blockId: null });

        middleList.querySelectorAll('.drag-item').forEach((block, index) => {
            const id = block.getAttribute('data-id');
            const title = block.textContent.trim().toUpperCase();
            let slideHtml = getHTML(id, 'previewHTML', title);
            presentationSlides.push({ bgImage: contentImagePool[index % contentImagePool.length], html: `<div style="width: 100%; text-align: left; padding: 0 40px;">${slideHtml}</div>`, blockId: id, blockTitle: title });
        });

        presentationSlides.push({ bgImage: `img/outro-${Math.floor(Math.random() * 5) + 1}.jpg`, html: `<div style="text-align: center; width: 100%;"><h1 class="slide-title" style="font-size: 64px; margin-bottom: 40px; border-bottom: 4px solid var(--vrmwb-red);">EINDE DAGJOURNAAL</h1><p style="font-size: 36px; opacity: 0.8; font-weight: 700;">Zijn er nog bijzonderheden of vragen?</p></div>`, blockId: null });

        presentationSlides.forEach((slide, i) => {
            const bgLayer = document.createElement('div'); bgLayer.id = `bg-slide-${i}`;
            bgLayer.style.cssText = `position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-position: center; background-image: url('${slide.bgImage}'); opacity: ${i === 0 ? '1' : '0'}; transition: opacity 0.4s ease;`;
            presBgImageContainer.appendChild(bgLayer);
        });
    }

    function showSlide(index) {
        if (index < 0) index = 0; if (index >= presentationSlides.length) index = presentationSlides.length - 1;
        currentSlideIndex = index;

        const currentSlide = presentationSlides[currentSlideIndex];
        // Vers genereer de preview zodat data altijd klopt (ook voor de WYSIWYG editor blokken)
        if (currentSlide.blockId) {
            let freshHtml = getHTML(currentSlide.blockId, 'previewHTML', currentSlide.blockTitle);
            currentSlide.html = `<div style="width: 100%; text-align: left; padding: 0 40px;">${freshHtml}</div>`;
        }
        presentationSlides.forEach((_, i) => { const layer = document.getElementById(`bg-slide-${i}`); if (layer) layer.style.opacity = (i === currentSlideIndex) ? '1' : '0'; });
        presContent.innerHTML = currentSlide.html;
        document.getElementById('pres-counter').innerText = `${currentSlideIndex + 1} / ${presentationSlides.length}`;
        document.getElementById('pres-prev').style.visibility = (currentSlideIndex === 0) ? 'hidden' : 'visible';
        document.getElementById('pres-next').style.visibility = (currentSlideIndex === presentationSlides.length - 1) ? 'hidden' : 'visible';
        document.getElementById('kis-modal').classList.remove('active');
    }

    document.getElementById('btn-start-presentation').addEventListener('click', () => {
        if (middleList.querySelectorAll('.drag-item').length === 0) { alert("Voeg blokken toe!"); return; }
        buildPresentation(); currentSlideIndex = 0; showSlide(currentSlideIndex); presentationOverlay.classList.add('active');
        if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(e => console.log(e));
    });

    document.getElementById('close-presentation').addEventListener('click', () => {
        presentationOverlay.classList.remove('active');
        if (document.fullscreenElement) document.exitFullscreen().catch(e => console.log(e));
    });

    document.getElementById('pres-prev').addEventListener('click', () => showSlide(currentSlideIndex - 1));
    document.getElementById('pres-next').addEventListener('click', () => showSlide(currentSlideIndex + 1));

    window.addEventListener('keydown', (e) => {
        if (presentationOverlay.classList.contains('active') && !document.getElementById('kis-modal').classList.contains('active')) {
            if (e.key === 'ArrowRight' || e.key === ' ') showSlide(currentSlideIndex + 1);
            else if (e.key === 'ArrowLeft') showSlide(currentSlideIndex - 1);
            else if (e.key === 'Escape') document.getElementById('close-presentation').click();
        } else if (e.key === 'Escape') { document.getElementById('kis-modal').classList.remove('active'); }
    });

    setTimeout(() => { for (let i = 1; i <= 5; i++) { new Image().src = `img/intro-${i}.jpg`; new Image().src = `img/outro-${i}.jpg`; } for (let i = 1; i <= 25; i++) { new Image().src = `img/content-${i}.jpg`; } }, 1000); 
});