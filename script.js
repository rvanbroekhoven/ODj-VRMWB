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

    function isToday(dateToCheck) {
        const today = new Date();
        return dateToCheck.getDate() === today.getDate() && dateToCheck.getMonth() === today.getMonth() && dateToCheck.getFullYear() === today.getFullYear();
    }
    function updateCenterNavigation() {
        if (isToday(selectedDate)) { btnTodayText.innerText = "Vandaag"; } 
        else { const options = { day: 'numeric', month: 'long', year: 'numeric' }; btnTodayText.innerText = selectedDate.toLocaleDateString('nl-NL', options); }
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

    // --- HERBRUIKBARE WYSIWYG HTML ---
    const wysiwygEditorHTML = `
        <div class="editor-tabs">
            <div class="tab active">Nieuwe tab</div>
        </div>
        <div class="form-group">
            <label>Tab titel:</label>
            <input type="text" class="text-input" value="Nieuwe tab">
        </div>
        <div class="wysiwyg-container">
            <div class="wysiwyg-toolbar">
                <button class="toolbar-btn">P</button>
                <button class="toolbar-btn">H1</button>
                <button class="toolbar-btn">H2</button>
                <button class="toolbar-btn">H3</button>
                <div class="toolbar-divider"></div>
                <button class="toolbar-btn" style="font-weight: 900;">B</button>
                <button class="toolbar-btn" style="font-style: italic;">I</button>
                <button class="toolbar-btn" style="text-decoration: line-through;">S</button>
                <button class="toolbar-btn" style="text-decoration: underline;">U</button>
                <div class="toolbar-divider"></div>
                <button class="toolbar-btn">≡</button>
                <button class="toolbar-btn">☷</button>
            </div>
            <textarea class="wysiwyg-area" placeholder="Typ hier de inhoud voor de presentatie..."></textarea>
        </div>
        <button class="btn-save">Opslaan</button>
    `;

    // --- DYNAMISCHE CONTENT MAPPING ---
    const blockData = {
        'ploeg-indeling': {
            editorHTML: `
                <div class="form-group"><label>Kazernes in Roosterplanning</label>
                    <div class="tags-wrapper"><span class="tag">Bergen op Zoom <span class="close">&times;</span></span></div>
                </div>
                <div class="form-group"><label>Dienstlijst MWB in Roosterplanning</label>
                    <div class="dropdown-input placeholder">Voeg een kazerne toe om standaard naam te overschrijven...<span class="chevron"></span></div>
                </div>
                <div class="form-group"><label>Dienstlijst ZLD in Roosterplanning</label>
                    <div class="dropdown-input placeholder">Voeg een kazerne toe om standaard naam te overschrijven...<span class="chevron"></span></div>
                </div>
                <div class="form-group"><label>Ticker rooster in Roosterplanning</label>
                    <div class="tags-wrapper"><span class="tag">Bergen op Zoom <span class="close">&times;</span></span></div>
                </div>
                <button class="btn-save">Opslaan</button>
            `,
            previewHTML: `<h1 class="slide-title">PLOEG INDELING</h1><table class="rooster-table"><tr><th>Functie</th><th>Naam</th></tr><tr><td>Bevelvoerder</td><td>J. de Vries</td></tr><tr><td>Chauffeur/Pompbediende</td><td>P. Hendriks</td></tr><tr><td>Manschap 1</td><td>A. Jansen</td></tr><tr><td>Manschap 2</td><td>M. Bakker</td></tr></table>`
        },
        'alarmen': {
            editorHTML: `
                <div class="table-container">
                    <table class="data-table">
                        <thead><tr><th>Datum</th><th>Adres</th><th>Melding</th><th>Voertuigen</th><th>Toelichting</th><th>Acties</th></tr></thead>
                        <tbody>
                            <tr>
                                <td>9-4-2026<br>16:06 - 16:41</td>
                                <td>Afrit A4 Re - Hoogerheide</td>
                                <td>P1 Brand - Wegvervoer</td>
                                <td>201531, 201444, 201092, 284831, 194230</td>
                                <td></td>
                                <td><button class="icon-btn edit">✎</button><button class="icon-btn delete">🗑</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `,
            previewHTML: `<h1 class="slide-title">ALARMEN VORIGE DIENST</h1><div class="incident-card"><strong>PRIO 1</strong> - Brand Wegvervoer<br><br>Locatie: Afrit A4 Re - Hoogerheide<br><span style="opacity: 0.7; font-size: 16px;">Voertuigen: 201531, 201444, 201092, 284831, 194230</span></div>`
        },
        'voertuigen': {
            editorHTML: `
                <div class="form-group"><label>Voertuigen standaard in lijst kazerne</label>
                    <div class="tags-wrapper">
                        <span class="tag">201531 <span class="close">&times;</span></span><span class="tag">201543 <span class="close">&times;</span></span>
                        <span class="tag">201551 <span class="close">&times;</span></span><span class="tag">201571 <span class="close">&times;</span></span>
                        <span class="tag">200025 <span class="close">&times;</span></span><span class="tag">201561 <span class="close">&times;</span></span>
                    </div>
                </div>
                <div class="form-group"><label>Voertuigen uitsluiten van lijst</label>
                    <div class="dropdown-input placeholder">Voeg een voertuig toe<span class="chevron"></span></div>
                </div>
                <div class="form-group"><label>Voertuigen standaard in lijst regio</label>
                    <div class="tags-wrapper">
                        <span class="tag">201532 <span class="close">&times;</span></span><span class="tag">201161 <span class="close">&times;</span></span>
                        <span class="tag">209461 <span class="close">&times;</span></span>
                    </div>
                </div>
                <button class="btn-save">Opslaan</button>
            `,
            previewHTML: `<h1 class="slide-title">STATUS VOERTUIGEN</h1><h3 style="font-size: 24px; margin-bottom: 10px;">Geen defecten gemeld via OASIS.</h3><p style="font-size: 20px; opacity: 0.7;">Alle voertuigen zijn inzetbaar voor de komende dienst.</p>`
        },
        'topdesk': {
            editorHTML: `
                <div class="form-group"><label>Topdesk kazernes</label>
                    <div class="tags-wrapper"><span class="tag">Bergen op Zoom <span class="close">&times;</span></span></div>
                </div>
                <div class="form-group"><label>Ruimtes uitsluiten</label>
                    <div class="dropdown-input placeholder">Voeg ruimte toe<span class="chevron"></span></div>
                </div>
                <div class="form-group"><label>Reservering voertuigen</label>
                    <div class="tags-wrapper">
                        <span class="tag">201001 <span class="close">&times;</span></span><span class="tag">201002 <span class="close">&times;</span></span>
                        <span class="tag">201003 <span class="close">&times;</span></span><span class="tag">201093 <span class="close">&times;</span></span>
                    </div>
                </div>
                <div class="form-group"><label>Tabjes</label>
                    <div class="tags-wrapper">
                        <span class="tag">Kazerne <span class="close">&times;</span></span><span class="tag">Voertuig <span class="close">&times;</span></span><span class="tag">ReserveringVoertuig <span class="close">&times;</span></span>
                    </div>
                </div>
                <button class="btn-save">Opslaan</button>
            `,
            previewHTML: `<h1 class="slide-title">TOPDESK MELDINGEN</h1><p style="font-size: 24px; opacity: 0.5; margin-top: 50px;">Geen openstaande Topdesk meldingen gevonden voor deze kazerne.</p>`
        },
        'mobiliteit': {
            editorHTML: `
                <div class="form-group"><label>Kaartlagen Actueel</label>
                    <div class="tags-wrapper"><span class="tag">Bereikbaarheid wegdeel (nu) <span class="close">&times;</span></span><span class="tag">Weg Info punt (nu) <span class="close">&times;</span></span></div>
                </div>
                <div class="form-group"><label>Kaartlagen Generiek</label>
                    <div class="dropdown-input placeholder">Selecteer Lagen<span class="chevron"></span></div>
                </div>
                <div class="form-group"><label>Kaartlagen Toekomst</label>
                    <div class="tags-wrapper"><span class="tag">Bereikbaarheid wegdeel <span class="close">&times;</span></span><span class="tag">Weg Info punt <span class="close">&times;</span></span></div>
                </div>
                <div class="form-group"><label>RDx</label><input type="text" class="text-input" value="79015"></div>
                <div class="form-group"><label>RDy</label><input type="text" class="text-input" value="390597"></div>
                <div class="form-group"><label>Zoom</label><input type="text" class="text-input" value="13"></div>
                <button class="btn-save">Opslaan</button>
            `,
            previewHTML: `<h1 class="slide-title">MOBILITEIT & WEGAFSLUITINGEN</h1><div style="width: 100%; height: 400px; background: rgba(255,255,255,0.1); display: flex; justify-content: center; align-items: center; border-radius: 12px; border: 1px dashed rgba(255,255,255,0.3);">Kaartmodule Actueel wordt hier geladen.</div>`
        },
        'gepland-onderhoud': {
            editorHTML: `
                <div class="table-container">
                    <table class="data-table">
                        <thead><tr><th>Voertuig</th><th>Melding</th><th>van / tot</th><th>Acties</th></tr></thead>
                        <tbody>
                            <tr>
                                <td>20-1571</td>
                                <td>ingezet op post Raamsdonksveer i.v.m. onderhoud 20-5271</td>
                                <td>13 tot 17 april</td>
                                <td style="white-space: nowrap;"><button class="icon-btn copy">⎘</button><button class="icon-btn edit">✎</button><button class="icon-btn delete">🗑</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="add-item-row" style="margin-top: 0;">
                    <input type="text" class="text-input" placeholder="Voeg een nieuw voertuig toe..." style="flex: 1; border-style: dashed;">
                    <button class="btn-add">+</button>
                </div>
            `,
            previewHTML: `<h1 class="slide-title">GEPLAND ONDERHOUD VOERTUIGEN</h1><table class="rooster-table"><tr><th>Voertuig</th><th>Omschrijving</th><th>Datum</th></tr><tr><td>20-1571</td><td>Ingezet op post Raamsdonksveer i.v.m. onderhoud 20-5271</td><td>13 tot 17 april</td></tr></table>`
        },
        'algemeen': {
            editorHTML: `
                <div class="checklist-item"><div class="check-box">✓</div><div class="check-content"><strong>Schoonmaken vuile ruimte en ruimte wasmachine</strong><span>Auteur: Paul van der Heijden automatisch toegevoegd</span></div><button class="icon-btn edit">✎</button><button class="icon-btn delete">🗑</button></div>
                <div class="checklist-item"><div class="check-box">✓</div><div class="check-content"><strong>SVM-rondpompen 20-1561</strong><span>Auteur: Paul van der Heijden automatisch toegevoegd</span></div><button class="icon-btn edit">✎</button><button class="icon-btn delete">🗑</button></div>
                <div class="checklist-item"><div class="check-box">✓</div><div class="check-content"><strong>Papierbakken legen</strong><span>Auteur: Paul van der Heijden automatisch toegevoegd</span></div><button class="icon-btn edit">✎</button><button class="icon-btn delete">🗑</button></div>
                <div class="add-item-row"><input type="text" class="text-input" placeholder="Vul hier een item in voor de werklijst..."><button class="btn-add">+</button></div>
            `,
            previewHTML: `<h1 class="slide-title">ALG. WERKZAAMHEDEN</h1><ul style="font-size: 24px; line-height: 2; list-style-type: square; padding-left: 30px;"><li>Schoonmaken vuile ruimte en ruimte wasmachine</li><li>SVM-rondpompen 20-1561</li><li>Papierbakken legen</li></ul>`
        },
        'ademlucht': {
            editorHTML: `
                <div class="checklist-item"><div class="check-box" style="background: var(--vrmwb-red);"></div><div class="check-content"><strong>Na einde werkzaamheden in de ademluchtwerkplaats testbanken en vulbalk-pc volledig uitschakelen</strong><span>Auteur: Paul van der Heijden automatisch toegevoegd</span></div><button class="icon-btn edit">✎</button><button class="icon-btn delete">🗑</button></div>
                <div class="add-item-row"><input type="text" class="text-input" placeholder="Vul hier een item in voor de werklijst..."><button class="btn-add">+</button></div>
            `,
            previewHTML: `<h1 class="slide-title">ADEMLUCHT WERKZAAMHEDEN</h1><div class="incident-card" style="border-left-color: #FFFFFF;"><strong>TAAK:</strong> Na einde werkzaamheden in de ademluchtwerkplaats testbanken en vulbalk-pc volledig uitschakelen.</div>`
        },
        'vakbekwaam': {
            editorHTML: `
                <div class="form-group"><label>Ploegen voor activiteiten</label>
                    <div class="dropdown-input placeholder">Selecteer ploeg...<span class="chevron"></span></div>
                </div>
                <button class="btn-save">Opslaan</button>
            `,
            previewHTML: `<h1 class="slide-title">VAKBEKWAAM AG5</h1><p style="font-size: 24px; opacity: 0.5; margin-top: 50px;">Geen bijzonderheden voor komende dienst.</p>`
        },
        'evenementen': {
            editorHTML: `
                <div class="form-group"><label>Woonplaats filter</label>
                    <div class="tags-wrapper">
                        <span class="tag">Breda <span class="close">&times;</span></span><span class="tag">Prinsenbeek <span class="close">&times;</span></span>
                        <span class="tag">Teteringen <span class="close">&times;</span></span><span class="tag">Ginneken <span class="close">&times;</span></span>
                        <span class="tag">Effen <span class="close">&times;</span></span><span class="tag">Ulvenhout <span class="close">&times;</span></span>
                    </div>
                </div>
                <button class="btn-save">Opslaan</button>
            `,
            previewHTML: `<h1 class="slide-title">EVENEMENTEN (REGIO BREDA)</h1><table class="rooster-table"><tr><th>Datum</th><th>Evenement</th><th>Locatie</th></tr><tr><td>Zaterdag 11 apr</td><td>Wielerronde Prinsenbeek</td><td>Centrum Prinsenbeek</td></tr></table>`
        },
        'default': {
            editorHTML: wysiwygEditorHTML,
            previewHTML: `<h1 class="slide-title" id="dynamic-preview-title">ONDERDEEL</h1><p style="font-size: 24px; margin-top: 20px; line-height: 1.5;">Dit is een voorbeeld van de opgemaakte tekst die door de beheerder is ingetypt in de editor. De tekst is makkelijk te lezen en wordt keurig uitgelijnd op het presentatiescherm.</p>`
        }
    };

    // --- DRAG & DROP LOGICA ---
    const draggables = document.querySelectorAll('.drag-item');
    const leftList = document.getElementById('blok-selectie');
    const middleList = document.getElementById('dagjournaal-lijst');
    const emptyState = document.getElementById('empty-state');
    const editorTitle = document.getElementById('editor-title');
    const editorContent = document.getElementById('editor-content');

    // DE HERSTELDE REGELS:
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
        draggable.addEventListener('dragstart', () => { draggable.classList.add('dragging'); });
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
            if (middleList.contains(draggable)) { draggable.classList.add('sequence-card'); } 
            else { draggable.classList.remove('sequence-card', 'active-card', 'gold'); draggable.classList.add('theme-card-light'); }
            
            checkEmptyState();
            if (!middleList.querySelector('.active-card')) {
                editorTitle.innerText = "GEEN BLOK GESELECTEERD";
                editorContent.innerHTML = `<div class="editor-placeholder-text">Voeg een blok toe aan het dagjournaal en klik erop om de instellingen te bekijken.</div>`;
                currentSelectedBlockId = null;
            }
        });
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.drag-item:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) { return { offset: offset, element: child }; } else { return closest; }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    [leftColumn, middleColumn].forEach(col => {
        col.addEventListener('dragover', e => {
            e.preventDefault(); 
            const draggable = document.querySelector('.dragging');
            if (!draggable) return;
            const zone = col.querySelector('.scroll-area');
            const afterElement = getDragAfterElement(zone, e.clientY);
            if (afterElement == null) { zone.appendChild(draggable); } else { zone.insertBefore(draggable, afterElement); }
        });
    });

    // --- KLIKKEN IN DE MIDDELSTE KOLOM ---
    middleList.addEventListener('click', e => {
        const card = e.target.closest('.drag-item');
        if (!card) return; 
        if (!middleList.contains(card)) return; 

        middleList.querySelectorAll('.drag-item').forEach(c => { c.classList.remove('active-card', 'gold'); });
        card.classList.add('active-card', 'gold');

        let clone = card.cloneNode(true);
        let badge = clone.querySelector('.badge');
        if (badge) badge.remove();
        
        currentSelectedBlockName = clone.textContent.trim().toUpperCase();
        editorTitle.innerText = currentSelectedBlockName; 
        
        currentSelectedBlockId = card.getAttribute('data-id');
        const data = blockData[currentSelectedBlockId] || blockData['default'];
        editorContent.innerHTML = data.editorHTML;
    });

    // --- ENKELE PREVIEW LOGICA ---
    const btnOpenPreview = document.getElementById('btn-open-preview');
    const previewModal = document.getElementById('preview-modal');
    const closePreviewBtn = document.getElementById('close-preview');
    const previewBody = document.getElementById('preview-body');

    btnOpenPreview.addEventListener('click', () => {
        if (!currentSelectedBlockId) { alert("Selecteer eerst een blok in het Dagjournaal om te previewen!"); return; }
        const data = blockData[currentSelectedBlockId] || blockData['default'];
        previewBody.innerHTML = data.previewHTML;
        const dynamicTitle = document.getElementById('dynamic-preview-title');
        if (dynamicTitle) { dynamicTitle.innerText = currentSelectedBlockName; }
        previewModal.classList.add('active');
    });

    closePreviewBtn.addEventListener('click', () => { previewModal.classList.remove('active'); });

    // --- LOCATIE SELECTIE (MODAL) ---
    const locationTrigger = document.getElementById('location-trigger');
    const locationModal = document.getElementById('location-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const locBtns = document.querySelectorAll('.loc-btn');

    locationTrigger.addEventListener('click', () => { locationModal.classList.add('active'); });
    closeModalBtn.addEventListener('click', () => { locationModal.classList.remove('active'); });
    
    window.addEventListener('click', (e) => { 
        if (e.target === locationModal) locationModal.classList.remove('active'); 
        if (e.target === previewModal) previewModal.classList.remove('active');
    });

    locBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            locBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            locationTrigger.innerText = this.innerText;
            locationModal.classList.remove('active');
        });
    });

    // --- VOLLEDIG SCHERM PRESENTATIE LOGICA ---
    const btnStartPresentation = document.getElementById('btn-start-presentation');
    const presentationOverlay = document.getElementById('presentation-overlay');
    const closePresentationBtn = document.getElementById('close-presentation');
    const presContent = document.getElementById('pres-content');
    const presPrev = document.getElementById('pres-prev');
    const presNext = document.getElementById('pres-next');
    const presCounter = document.getElementById('pres-counter');
    const presBgImageContainer = document.getElementById('pres-bg-image');

    let presentationSlides = [];
    let currentSlideIndex = 0;

    function shuffleArray(array) {
        let curId = array.length;
        while (0 !== curId) {
            let randId = Math.floor(Math.random() * curId);
            curId -= 1;
            let tmp = array[curId];
            array[curId] = array[randId];
            array[randId] = tmp;
        }
        return array;
    }

    function buildPresentation() {
        presentationSlides = [];
        presBgImageContainer.innerHTML = ''; 
        presBgImageContainer.style.backgroundImage = 'none'; 

        const randomIntroNum = Math.floor(Math.random() * 5) + 1;
        const randomOutroNum = Math.floor(Math.random() * 5) + 1;
        const introBg = `img/intro-${randomIntroNum}.jpg`;
        const outroBg = `img/outro-${randomOutroNum}.jpg`;

        let contentImagePool = [];
        for(let i = 1; i <= 25; i++) { contentImagePool.push(`img/content-${i}.jpg`); }
        contentImagePool = shuffleArray(contentImagePool);

        const loc = document.getElementById('location-trigger').innerText;
        const date = document.getElementById('datetime-display').innerText.split('   ')[0];
        
        presentationSlides.push({
            bgImage: introBg,
            html: `
                <div style="text-align: center; width: 100%;">
                    <h1 class="slide-title" style="font-size: 72px; margin-bottom: 20px; border-bottom: none;">OPERATIONEEL DAGJOURNAAL</h1>
                    <h2 style="font-size: 48px; color: var(--vrmwb-gold); margin-bottom: 40px; text-transform: uppercase;">${loc}</h2>
                    <p style="font-size: 32px; opacity: 0.7; font-weight: 700;">${date}</p>
                </div>
            `
        });

        const blocksInMiddle = middleList.querySelectorAll('.drag-item');
        blocksInMiddle.forEach((block, index) => {
            const id = block.getAttribute('data-id');
            let clone = block.cloneNode(true);
            let badge = clone.querySelector('.badge');
            if (badge) badge.remove();
            const title = clone.textContent.trim().toUpperCase();

            const data = blockData[id] || blockData['default'];
            let slideHtml = data.previewHTML;
            
            if (slideHtml.includes('id="dynamic-preview-title"')) {
                slideHtml = slideHtml.replace('id="dynamic-preview-title">ONDERDEEL', 'id="dynamic-preview-title">' + title);
            }

            const activeBgImage = contentImagePool[index % contentImagePool.length];
            presentationSlides.push({
                bgImage: activeBgImage,
                html: `<div style="width: 100%; text-align: left; padding: 0 40px;">${slideHtml}</div>`
            });
        });

        presentationSlides.push({
            bgImage: outroBg,
            html: `
                <div style="text-align: center; width: 100%;">
                    <h1 class="slide-title" style="font-size: 64px; margin-bottom: 40px; border-bottom: 4px solid var(--vrmwb-red);">EINDE DAGJOURNAAL</h1>
                    <p style="font-size: 36px; opacity: 0.8; font-weight: 700;">Zijn er nog bijzonderheden of vragen?</p>
                </div>
            `
        });

        presentationSlides.forEach((slide, i) => {
            const bgLayer = document.createElement('div');
            bgLayer.id = `bg-slide-${i}`;
            bgLayer.style.position = 'absolute';
            bgLayer.style.top = '0'; bgLayer.style.left = '0';
            bgLayer.style.width = '100%'; bgLayer.style.height = '100%';
            bgLayer.style.backgroundSize = 'cover'; bgLayer.style.backgroundPosition = 'center';
            bgLayer.style.backgroundImage = `url('${slide.bgImage}')`;
            bgLayer.style.opacity = (i === 0) ? '1' : '0';
            bgLayer.style.transition = 'opacity 0.4s ease'; 
            presBgImageContainer.appendChild(bgLayer);
        });
    }

    function showSlide(index) {
        if (index < 0) index = 0;
        if (index >= presentationSlides.length) index = presentationSlides.length - 1;
        currentSlideIndex = index;

        presentationSlides.forEach((_, i) => {
            const layer = document.getElementById(`bg-slide-${i}`);
            if (layer) { layer.style.opacity = (i === currentSlideIndex) ? '1' : '0'; }
        });
        
        presContent.innerHTML = presentationSlides[currentSlideIndex].html;
        presCounter.innerText = `${currentSlideIndex + 1} / ${presentationSlides.length}`;
        presPrev.style.visibility = (currentSlideIndex === 0) ? 'hidden' : 'visible';
        presNext.style.visibility = (currentSlideIndex === presentationSlides.length - 1) ? 'hidden' : 'visible';
    }

    btnStartPresentation.addEventListener('click', () => {
        const blocksInMiddle = middleList.querySelectorAll('.drag-item');
        if (blocksInMiddle.length === 0) { alert("Voeg eerst blokken toe aan het Dagjournaal om de presentatie te starten."); return; }
        
        buildPresentation(); 
        currentSlideIndex = 0;
        showSlide(currentSlideIndex);
        presentationOverlay.classList.add('active');
        
        if (document.documentElement.requestFullscreen) { document.documentElement.requestFullscreen().catch(err => console.log(err)); }
    });

    closePresentationBtn.addEventListener('click', () => {
        presentationOverlay.classList.remove('active');
        if (document.fullscreenElement) { document.exitFullscreen().catch(err => console.log(err)); }
    });

    presPrev.addEventListener('click', () => showSlide(currentSlideIndex - 1));
    presNext.addEventListener('click', () => showSlide(currentSlideIndex + 1));

    window.addEventListener('keydown', (e) => {
        if (presentationOverlay.classList.contains('active')) {
            if (e.key === 'ArrowRight' || e.key === ' ') { showSlide(currentSlideIndex + 1); } 
            else if (e.key === 'ArrowLeft') { showSlide(currentSlideIndex - 1); } 
            else if (e.key === 'Escape') { closePresentationBtn.click(); }
        }
    });

    // Preloader voor razendsnelle start
    setTimeout(() => {
        const imagesToPreload = [];
        for (let i = 1; i <= 5; i++) { imagesToPreload.push(`img/intro-${i}.jpg`); imagesToPreload.push(`img/outro-${i}.jpg`); }
        for (let i = 1; i <= 25; i++) { imagesToPreload.push(`img/content-${i}.jpg`); }
        imagesToPreload.forEach(src => { const img = new Image(); img.src = src; });
    }, 1000); 
});