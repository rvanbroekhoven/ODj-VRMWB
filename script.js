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

    // --- STATE MANAGEMENT: SYNC TUSSEN KIS EN BEHEER ---
    // Dit is het brein. De render functies kijken naar deze data om de HTML op te bouwen.
    const appState = {
        'alarmen': {
            incidents: [
                { id: 'al1', prio: 1, title: 'Woningbrand (Middel Brand)', loc: 'Hoofdstraat 12, Breda', desc: 'Brand wegvervoer op de A4. Voertuigen: 201531, 201444, 201092, 284831, 194230', infoTitle: 'Carnaval Nieuw-Vossemeer', infoText: 'Carnaval Nieuw-Vossemeer is een evenement met verhoogd risico. Brandweer is lokaal aanwezig ter ondersteuning.' }
            ]
        },
        'algemeen': {
            tasks: [
                { id: 'aw1', text: 'Schoonmaken vuile ruimte en ruimte wasmachine', checked: true, author: 'Paul van der Heijden' },
                { id: 'aw2', text: 'SVM-rondpompen 20-1561', checked: false, author: 'Paul van der Heijden' },
                { id: 'aw3', text: 'Papierbakken legen', checked: false, author: 'Paul van der Heijden' }
            ]
        },
        'ademlucht': {
            tasks: [
                { id: 'ad1', text: 'Na einde werkzaamheden in de ademluchtwerkplaats testbanken en vulbalk-pc volledig uitschakelen', checked: false, author: 'Paul van der Heijden' }
            ]
        }
    };

    // --- RENDER FUNCTIES ---
    // Deze functies bouwen de actuele HTML op basis van de state (voor perfecte sync)
    
    function getTaskEditorHTML(blockId) {
        const tasks = appState[blockId].tasks;
        let html = '';
        tasks.forEach(t => {
            html += `<div class="checklist-item editor-check-toggle" data-block="${blockId}" data-id="${t.id}">
                        <div class="check-box ${t.checked ? 'checked' : ''}">${t.checked ? '✓' : ''}</div>
                        <div class="check-content"><strong>${t.text}</strong><span>Auteur: ${t.author} automatisch toegevoegd</span></div>
                        <button class="icon-btn edit" onclick="event.stopPropagation()">✎</button>
                        <button class="icon-btn delete" onclick="event.stopPropagation()">🗑</button>
                    </div>`;
        });
        html += `<div class="add-item-row"><input type="text" class="text-input" placeholder="Vul hier een item in..."><button class="btn-add">+</button></div>`;
        return html;
    }

    function getTaskKISHTML(blockId, title) {
        const tasks = appState[blockId].tasks;
        let html = `<h1 class="slide-title">${title}</h1><ul class="kis-checklist">`;
        tasks.forEach(t => {
            html += `<li class="kis-checklist-item kis-check-toggle" data-block="${blockId}" data-id="${t.id}">
                        <div class="kis-check ${t.checked ? 'checked' : ''}">${t.checked ? '✓' : ''}</div>
                        <span>${t.text}</span>
                     </li>`;
        });
        html += `</ul>`;
        return html;
    }

    function getAlarmenKISHTML() {
        let html = `<h1 class="slide-title">ALARMEN VORIGE DIENST</h1>`;
        appState['alarmen'].incidents.forEach(inc => {
            html += `
                <div class="kis-card prio-${inc.prio}">
                    <div class="kis-card-icon"><span>🔥</span>PRIO ${inc.prio}</div>
                    <div class="kis-card-content">
                        <div class="kis-card-title">${inc.title}</div>
                        <div class="kis-card-sub">Locatie: ${inc.loc}</div>
                        <div class="kis-card-desc">${inc.desc}</div>
                    </div>
                    ${inc.infoText ? `<div class="info-trigger" data-title="${inc.infoTitle}" data-text="${inc.infoText}">i</div>` : ''}
                </div>`;
        });
        return html;
    }

    const wysiwygEditorHTML = `
        <div class="editor-tabs"><div class="tab active">Nieuwe tab</div></div>
        <div class="form-group"><label>Tab titel:</label><input type="text" class="text-input" value="Nieuwe tab"></div>
        <div class="wysiwyg-container">
            <div class="wysiwyg-toolbar">
                <button class="toolbar-btn">P</button><button class="toolbar-btn">H1</button><button class="toolbar-btn">H2</button>
                <div class="toolbar-divider"></div>
                <button class="toolbar-btn" style="font-weight: 900;">B</button><button class="toolbar-btn" style="font-style: italic;">I</button>
                <div class="toolbar-divider"></div>
                <button class="toolbar-btn">≡</button>
            </div>
            <textarea class="wysiwyg-area" placeholder="Typ hier de inhoud voor de presentatie..."></textarea>
        </div><button class="btn-save">Opslaan</button>
    `;

    // De BlockData (verwijst naar de render functies of statische HTML waar geen sync nodig is)
    const blockData = {
        'ploeg-indeling': { count: 0, editorHTML: `<div class="form-group"><label>Kazernes</label><div class="tags-wrapper"><span class="tag">Bergen op Zoom <span class="close">&times;</span></span></div></div><button class="btn-save">Opslaan</button>`, previewHTML: `<h1 class="slide-title">PLOEG INDELING</h1><table class="rooster-table"><tr><th>Functie</th><th>Naam</th></tr><tr><td>Bevelvoerder</td><td>J. de Vries</td></tr><tr><td>Chauffeur</td><td>P. Hendriks</td></tr></table>` },
        'alarmen': { count: () => appState.alarmen.incidents.length, editorHTML: `<div class="table-container"><table class="data-table"><thead><tr><th>Datum</th><th>Melding</th><th>Acties</th></tr></thead><tbody><tr><td>9-4-2026</td><td>P1 Brand - Wegvervoer</td><td><button class="icon-btn edit">✎</button></td></tr></tbody></table></div>`, previewHTML: () => getAlarmenKISHTML() },
        'voertuigen': { count: 0, editorHTML: `<div class="form-group"><label>Voertuigen in lijst</label><div class="tags-wrapper"><span class="tag">201531 <span class="close">&times;</span></span><span class="tag">201543 <span class="close">&times;</span></span></div></div><button class="btn-save">Opslaan</button>`, previewHTML: `<h1 class="slide-title">STATUS VOERTUIGEN</h1><h3 style="font-size: 24px; margin-bottom: 10px;">Geen defecten gemeld via OASIS.</h3>` },
        'topdesk': { count: 0, editorHTML: `<div class="form-group"><label>Topdesk kazernes</label><div class="tags-wrapper"><span class="tag">Bergen op Zoom <span class="close">&times;</span></span></div></div><button class="btn-save">Opslaan</button>`, previewHTML: `<h1 class="slide-title">TOPDESK MELDINGEN</h1><p style="font-size: 24px; opacity: 0.5; margin-top: 50px;">Geen openstaande Topdesk meldingen.</p>` },
        'mobiliteit': { count: 0, editorHTML: `<div class="form-group"><label>Kaartlagen</label><div class="tags-wrapper"><span class="tag">Weg Info punt (nu) <span class="close">&times;</span></span></div></div><button class="btn-save">Opslaan</button>`, previewHTML: `<h1 class="slide-title">MOBILITEIT</h1><div style="width: 100%; height: 400px; background: rgba(255,255,255,0.1); border: 1px dashed rgba(255,255,255,0.3);">Kaartmodule</div>` },
        'gepland-onderhoud': { count: 1, editorHTML: `<div class="table-container"><table class="data-table"><thead><tr><th>Voertuig</th><th>Melding</th><th>Acties</th></tr></thead><tbody><tr><td>20-1571</td><td>ingezet op post Raamsdonksveer</td><td><button class="icon-btn edit">✎</button></td></tr></tbody></table></div>`, previewHTML: `<h1 class="slide-title">GEPLAND ONDERHOUD VOERTUIGEN</h1><table class="rooster-table"><tr><th>Voertuig</th><th>Omschrijving</th><th>Datum</th></tr><tr><td>20-1571</td><td>Ingezet op post Raamsdonksveer</td><td>13 tot 17 april</td></tr></table>` },
        'algemeen': { count: () => appState.algemeen.tasks.length, editorHTML: () => getTaskEditorHTML('algemeen'), previewHTML: () => getTaskKISHTML('algemeen', 'ALGEMENE WERKZAAMHEDEN') },
        'ademlucht': { count: () => appState.ademlucht.tasks.length, editorHTML: () => getTaskEditorHTML('ademlucht'), previewHTML: () => getTaskKISHTML('ademlucht', 'ADEMLUCHT WERKZAAMHEDEN') },
        'vakbekwaam': { count: 0, editorHTML: `<div class="form-group"><label>Ploegen</label><div class="dropdown-input placeholder">Selecteer ploeg...<span class="chevron"></span></div></div><button class="btn-save">Opslaan</button>`, previewHTML: `<h1 class="slide-title">VAKBEKWAAM AG5</h1><p style="font-size: 24px; opacity: 0.5;">Geen bijzonderheden.</p>` },
        'evenementen': { count: 1, editorHTML: `<div class="form-group"><label>Woonplaats filter</label><div class="tags-wrapper"><span class="tag">Breda <span class="close">&times;</span></span></div></div><button class="btn-save">Opslaan</button>`, previewHTML: `<h1 class="slide-title">EVENEMENTEN (REGIO BREDA)</h1><table class="rooster-table"><tr><th>Datum</th><th>Evenement</th><th>Locatie</th></tr><tr><td>Zat 11 apr</td><td>Wielerronde Prinsenbeek</td><td>Centrum</td></tr></table>` },
        'default': { count: 0, editorHTML: wysiwygEditorHTML, previewHTML: `<h1 class="slide-title" id="dynamic-preview-title">ONDERDEEL</h1><p style="font-size: 24px; line-height: 1.5;">Dit is een opgemaakte tekst voor de presentatie.</p>` }
    };

    // Helper om string vs functie af te vangen
    function getHTML(id, type) {
        const data = blockData[id] || blockData['default'];
        const content = data[type];
        return typeof content === 'function' ? content() : content;
    }
    function getBadgeCount(id) {
        const data = blockData[id] || blockData['default'];
        const count = data.count;
        return typeof count === 'function' ? count() : count;
    }

    // --- BADGES INJECTEREN ---
    function initializeBadges() {
        document.querySelectorAll('.drag-item').forEach(card => {
            const id = card.getAttribute('data-id');
            const count = getBadgeCount(id);
            if (count > 0) {
                let badge = document.createElement('span');
                badge.className = 'badge red-bg';
                badge.innerText = count;
                card.appendChild(badge);
            }
        });
    }
    initializeBadges();

    // --- GLOBALE KLIK AFHANDELING (VOOR SYNC & POP-UPS) ---
    document.addEventListener('click', (e) => {
        
        // 1. Checklist Toggles (Beheer & KIS)
        const toggleBtn = e.target.closest('.editor-check-toggle, .kis-check-toggle');
        if (toggleBtn) {
            const blockId = toggleBtn.getAttribute('data-block');
            const taskId = toggleBtn.getAttribute('data-id');
            
            // Pas centraal state aan
            const task = appState[blockId].tasks.find(t => t.id === taskId);
            if (task) task.checked = !task.checked;

            // Re-render KIS als deze open staat
            if (document.getElementById('presentation-overlay').classList.contains('active')) {
                showSlide(currentSlideIndex); // Herlaadt huidige KIS slide met nieuwe state
            }
            // Re-render Beheer (Kolom 3) als deze open staat
            if (currentSelectedBlockId === blockId) {
                document.getElementById('editor-content').innerHTML = getHTML(blockId, 'editorHTML');
            }
            return;
        }

        // 2. Info Pop-ups (Figma Stijl)
        const infoTrigger = e.target.closest('.info-trigger');
        const popup = document.getElementById('pres-info-popup');
        
        if (infoTrigger) {
            document.getElementById('popup-title').innerText = infoTrigger.getAttribute('data-title');
            document.getElementById('popup-text').innerText = infoTrigger.getAttribute('data-text');
            
            // Plaats popup fysiek BOVEN de trigger knop
            const rect = infoTrigger.getBoundingClientRect();
            popup.style.left = (rect.left - (350 / 2) + 14) + 'px'; // 350 is popup breedte
            popup.style.top = (rect.top - popup.offsetHeight - 20) + 'px'; 
            
            popup.classList.add('active');
            e.stopPropagation();
        } else if (!e.target.closest('.pres-info-popup')) {
            // Klik buiten popup = sluiten
            if (popup) popup.classList.remove('active');
        }
    });

    // --- DRAG & DROP LOGICA ---
    const draggables = document.querySelectorAll('.drag-item');
    const leftList = document.getElementById('blok-selectie');
    const middleList = document.getElementById('dagjournaal-lijst');
    const emptyState = document.getElementById('empty-state');
    const editorTitle = document.getElementById('editor-title');
    const editorContent = document.getElementById('editor-content');

    const leftColumn = leftList.closest('.column');
    const middleColumn = middleList.closest('.column');

    let currentSelectedBlockId = null;
    let currentSelectedBlockName = "";

    function checkEmptyState() {
        if (!emptyState) return;
        const itemsInMiddle = middleList.querySelectorAll('.drag-item').length;
        emptyState.style.display = itemsInMiddle === 0 ? 'block' : 'none';
    }

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => draggable.classList.add('dragging'));
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
            if (middleList.contains(draggable)) draggable.classList.add('sequence-card'); 
            else draggable.classList.remove('sequence-card', 'active-card', 'gold'); draggable.classList.add('theme-card-light');
            checkEmptyState();
            if (!middleList.querySelector('.active-card')) {
                editorTitle.innerText = "GEEN BLOK GESELECTEERD";
                editorContent.innerHTML = `<div class="editor-placeholder-text">Voeg een blok toe aan het dagjournaal en klik erop.</div>`;
                currentSelectedBlockId = null;
            }
        });
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.drag-item:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) return { offset: offset, element: child }; else return closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    [leftColumn, middleColumn].forEach(col => {
        col.addEventListener('dragover', e => {
            e.preventDefault(); 
            const draggable = document.querySelector('.dragging');
            if (!draggable) return;
            const zone = col.querySelector('.scroll-area');
            const afterElement = getDragAfterElement(zone, e.clientY);
            if (afterElement == null) zone.appendChild(draggable); else zone.insertBefore(draggable, afterElement);
        });
    });

    // --- KLIKKEN IN DE MIDDELSTE KOLOM ---
    middleList.addEventListener('click', e => {
        const card = e.target.closest('.drag-item');
        if (!card || !middleList.contains(card)) return; 

        middleList.querySelectorAll('.drag-item').forEach(c => c.classList.remove('active-card', 'gold'));
        card.classList.add('active-card', 'gold');

        let clone = card.cloneNode(true);
        let badge = clone.querySelector('.badge');
        if (badge) badge.remove(); 
        
        currentSelectedBlockName = clone.textContent.trim().toUpperCase();
        editorTitle.innerText = currentSelectedBlockName; 
        
        currentSelectedBlockId = card.getAttribute('data-id');
        editorContent.innerHTML = getHTML(currentSelectedBlockId, 'editorHTML');
    });

    // --- PREVIEW MODAL ---
    const btnOpenPreview = document.getElementById('btn-open-preview');
    const previewModal = document.getElementById('preview-modal');
    btnOpenPreview.addEventListener('click', () => {
        if (!currentSelectedBlockId) { alert("Selecteer eerst een blok!"); return; }
        let html = getHTML(currentSelectedBlockId, 'previewHTML');
        if (html.includes('id="dynamic-preview-title"')) html = html.replace('id="dynamic-preview-title">ONDERDEEL', 'id="dynamic-preview-title">' + currentSelectedBlockName);
        document.getElementById('preview-body').innerHTML = html;
        previewModal.classList.add('active');
    });
    document.getElementById('close-preview').addEventListener('click', () => previewModal.classList.remove('active'));

    // --- LOCATIE MODAL ---
    const locationModal = document.getElementById('location-modal');
    document.getElementById('location-trigger').addEventListener('click', () => locationModal.classList.add('active'));
    document.getElementById('close-modal').addEventListener('click', () => locationModal.classList.remove('active'));
    
    document.querySelectorAll('.loc-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.loc-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('location-trigger').innerText = this.innerText;
            locationModal.classList.remove('active');
        });
    });

    // --- VOLLEDIG SCHERM PRESENTATIE ---
    const presentationOverlay = document.getElementById('presentation-overlay');
    const presContent = document.getElementById('pres-content');
    const presBgImageContainer = document.getElementById('pres-bg-image');

    let presentationSlides = [];
    let currentSlideIndex = 0;

    function buildPresentation() {
        presentationSlides = [];
        presBgImageContainer.innerHTML = ''; 

        // Willekeurige bg logica behouden
        let contentImagePool = [];
        for(let i = 1; i <= 25; i++) { contentImagePool.push(`img/content-${i}.jpg`); }
        contentImagePool.sort(() => Math.random() - 0.5);

        const loc = document.getElementById('location-trigger').innerText;
        const date = document.getElementById('datetime-display').innerText.split('   ')[0];
        
        // Intro
        presentationSlides.push({ bgImage: `img/intro-${Math.floor(Math.random() * 5) + 1}.jpg`, html: `<div style="text-align: center; width: 100%;"><h1 class="slide-title" style="font-size: 72px; margin-bottom: 20px; border-bottom: none;">OPERATIONEEL DAGJOURNAAL</h1><h2 style="font-size: 48px; color: var(--vrmwb-gold); margin-bottom: 40px; text-transform: uppercase;">${loc}</h2><p style="font-size: 32px; opacity: 0.7; font-weight: 700;">${date}</p></div>`, blockId: null });

        // Content
        const blocksInMiddle = middleList.querySelectorAll('.drag-item');
        blocksInMiddle.forEach((block, index) => {
            const id = block.getAttribute('data-id');
            let clone = block.cloneNode(true);
            let badge = clone.querySelector('.badge');
            if (badge) badge.remove();
            const title = clone.textContent.trim().toUpperCase();

            // BELANGRIJK: Hier roepen we de dynamische previewHTML() functie aan
            let slideHtml = getHTML(id, 'previewHTML');
            if (slideHtml.includes('id="dynamic-preview-title"')) slideHtml = slideHtml.replace('id="dynamic-preview-title">ONDERDEEL', 'id="dynamic-preview-title">' + title);

            presentationSlides.push({ bgImage: contentImagePool[index % contentImagePool.length], html: `<div style="width: 100%; text-align: left; padding: 0 40px;">${slideHtml}</div>`, blockId: id });
        });

        // Outro
        presentationSlides.push({ bgImage: `img/outro-${Math.floor(Math.random() * 5) + 1}.jpg`, html: `<div style="text-align: center; width: 100%;"><h1 class="slide-title" style="font-size: 64px; margin-bottom: 40px; border-bottom: 4px solid var(--vrmwb-red);">EINDE DAGJOURNAAL</h1><p style="font-size: 36px; opacity: 0.8; font-weight: 700;">Zijn er nog bijzonderheden of vragen?</p></div>`, blockId: null });

        // Pre-render Backgrounds
        presentationSlides.forEach((slide, i) => {
            const bgLayer = document.createElement('div');
            bgLayer.id = `bg-slide-${i}`;
            bgLayer.style.cssText = `position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-position: center; background-image: url('${slide.bgImage}'); opacity: ${i === 0 ? '1' : '0'}; transition: opacity 0.4s ease;`;
            presBgImageContainer.appendChild(bgLayer);
        });
    }

    function showSlide(index) {
        if (index < 0) index = 0;
        if (index >= presentationSlides.length) index = presentationSlides.length - 1;
        currentSlideIndex = index;

        // Als we refreshen door een state-change (checklist), haal dan de meest verse HTML op
        const currentSlide = presentationSlides[currentSlideIndex];
        if (currentSlide.blockId) {
            let freshHtml = getHTML(currentSlide.blockId, 'previewHTML');
            // Behoud de specifieke titel
            let currentTitleMatch = currentSlide.html.match(/<h1 class="slide-title"[^>]*>(.*?)<\/h1>/);
            if (freshHtml.includes('id="dynamic-preview-title"') && currentTitleMatch) {
                freshHtml = freshHtml.replace('id="dynamic-preview-title">ONDERDEEL', 'id="dynamic-preview-title">' + currentTitleMatch[1]);
            }
            currentSlide.html = `<div style="width: 100%; text-align: left; padding: 0 40px;">${freshHtml}</div>`;
        }

        presentationSlides.forEach((_, i) => { const layer = document.getElementById(`bg-slide-${i}`); if (layer) layer.style.opacity = (i === currentSlideIndex) ? '1' : '0'; });
        
        presContent.innerHTML = currentSlide.html;
        document.getElementById('pres-counter').innerText = `${currentSlideIndex + 1} / ${presentationSlides.length}`;
        document.getElementById('pres-prev').style.visibility = (currentSlideIndex === 0) ? 'hidden' : 'visible';
        document.getElementById('pres-next').style.visibility = (currentSlideIndex === presentationSlides.length - 1) ? 'hidden' : 'visible';
        
        // Zorg dat popups sluiten bij sliden
        document.getElementById('pres-info-popup').classList.remove('active');
    }

    document.getElementById('btn-start-presentation').addEventListener('click', () => {
        if (middleList.querySelectorAll('.drag-item').length === 0) { alert("Voeg blokken toe!"); return; }
        buildPresentation(); currentSlideIndex = 0; showSlide(currentSlideIndex);
        presentationOverlay.classList.add('active');
        if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(e => console.log(e));
    });

    document.getElementById('close-presentation').addEventListener('click', () => {
        presentationOverlay.classList.remove('active');
        if (document.fullscreenElement) document.exitFullscreen().catch(e => console.log(e));
    });

    document.getElementById('pres-prev').addEventListener('click', () => showSlide(currentSlideIndex - 1));
    document.getElementById('pres-next').addEventListener('click', () => showSlide(currentSlideIndex + 1));

    window.addEventListener('keydown', (e) => {
        if (presentationOverlay.classList.contains('active')) {
            if (e.key === 'ArrowRight' || e.key === ' ') showSlide(currentSlideIndex + 1);
            else if (e.key === 'ArrowLeft') showSlide(currentSlideIndex - 1);
            else if (e.key === 'Escape') document.getElementById('close-presentation').click();
        }
    });

    // Preloader
    setTimeout(() => {
        for (let i = 1; i <= 5; i++) { new Image().src = `img/intro-${i}.jpg`; new Image().src = `img/outro-${i}.jpg`; }
        for (let i = 1; i <= 25; i++) { new Image().src = `img/content-${i}.jpg`; }
    }, 1000); 
});