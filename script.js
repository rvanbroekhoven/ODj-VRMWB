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


    // --- DYNAMISCHE CONTENT ---
    const blockData = {
        'ploeg-indeling': {
            editorHTML: `<div class="form-group"><label>Kazernes in Roosterplanning</label><div class="dropdown-input"><span class="tag">Bergen op Zoom <span class="close">&times;</span></span><span class="chevron"></span></div></div><div class="form-group"><label>Dienstlijst MWB in Roosterplanning</label><div class="dropdown-input placeholder">Voeg een kazerne toe om standaard naam te overschrijven...<span class="chevron"></span></div></div><div class="form-group"><label>Dienstlijst ZLD in Roosterplanning</label><div class="dropdown-input placeholder">Voeg een kazerne toe om standaard naam te overschrijven...<span class="chevron"></span></div></div><div class="form-group"><label>Ticker rooster in Roosterplanning</label><div class="dropdown-input">Bergen op Zoom<span class="chevron"></span></div></div>`,
            previewHTML: `<h1 class="slide-title">PLOEG INDELING</h1><table class="rooster-table"><tr><th>Functie</th><th>Naam</th></tr><tr><td>Bevelvoerder</td><td>J. de Vries</td></tr><tr><td>Chauffeur/Pompbediende</td><td>P. Hendriks</td></tr><tr><td>Manschap 1</td><td>A. Jansen</td></tr><tr><td>Manschap 2</td><td>M. Bakker</td></tr></table>`
        },
        'alarmen': {
            editorHTML: `<div class="form-group"><label>Selecteer incidenten ter bespreking</label><div class="dropdown-input placeholder">Kies uit recente P1/P2 meldingen...<span class="chevron"></span></div></div><div class="form-group"><label>Bijzonderheden / Leermomenten</label><div class="dropdown-input placeholder" style="min-height: 120px; align-items: flex-start;">Typ hier eventuele notities voor de overdracht...</div></div>`,
            previewHTML: `<h1 class="slide-title">ALARMEN VORIGE DIENST</h1><div class="incident-card"><strong>PRIO 1</strong> - Woningbrand (Middel Brand)<br><br>Locatie: Hoofdstraat 12, Breda<br><span style="opacity: 0.7; font-size: 16px;">Bijzonderheden: Binnenaanval succesvol, controleer ademlucht.</span></div><div class="incident-card" style="border-left-color: var(--vrmwb-gold);"><strong style="color: var(--vrmwb-gold);">PRIO 2</strong> - Buitenbrand<br><br>Locatie: Mastbos, Breda</div>`
        },
        'voertuigen': {
            editorHTML: `<div class="form-group"><label>Defecten / Uit de uitruk</label><div class="dropdown-input">Geen defecten gemeld (OASIS)<span class="chevron"></span></div></div><div class="form-group"><label>Vervangend materieel</label><div class="dropdown-input placeholder">Selecteer indien van toepassing...<span class="chevron"></span></div></div>`,
            previewHTML: `<h1 class="slide-title">STATUS VOERTUIGEN</h1><h3 style="font-size: 24px; margin-bottom: 10px;">Geen defecten gemeld via OASIS.</h3><p style="font-size: 20px; opacity: 0.7;">Alle voertuigen zijn inzetbaar voor de komende dienst.</p>`
        },
        'default': {
            editorHTML: `<div class="form-group"><label>Observaties en Opmerkingen</label><div class="dropdown-input placeholder" style="min-height: 120px; align-items: flex-start;">Voeg hier de details voor dit dagjournaal-onderdeel toe...</div></div>`,
            previewHTML: `<h1 class="slide-title" id="dynamic-preview-title">ONDERDEEL</h1><p style="font-size: 24px; opacity: 0.5; margin-top: 50px;">Geen specifieke bijzonderheden ingevoerd voor dit onderdeel.</p>`
        }
    };

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
        draggable.addEventListener('dragstart', () => { draggable.classList.add('dragging'); });
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
            if (middleList.contains(draggable)) { draggable.classList.add('sequence-card'); } 
            else { draggable.classList.remove('sequence-card', 'active-card', 'gold'); draggable.classList.add('theme-card-light'); }
            
            checkEmptyState();
            if (!middleList.querySelector('.active-card')) {
                editorTitle.innerText = "GEEN BLOK GESELECTEERD";
                editorContent.innerHTML = `<div style="text-align: center; color: var(--text-muted); margin-top: 20px; font-weight: 700;">Voeg een blok toe aan het dagjournaal en klik erop om de instellingen te bekijken.</div>`;
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

    let presentationSlides = [];
    let currentSlideIndex = 0;

    function buildPresentation() {
        presentationSlides = [];

        // 1. Introductie Slide (Gecentreerd)
        const loc = document.getElementById('location-trigger').innerText;
        const date = document.getElementById('btn-today').innerText;
        presentationSlides.push(`
            <div style="text-align: center;">
                <h1 class="slide-title" style="font-size: 72px; margin-bottom: 20px;">OPERATIONEEL DAGJOURNAAL</h1>
                <h2 style="font-size: 48px; color: var(--vrmwb-gold); margin-bottom: 40px; text-transform: uppercase;">${loc}</h2>
                <p style="font-size: 32px; opacity: 0.7; font-weight: 700;">${date}</p>
            </div>
        `);

        // 2. Inhoudelijke Slides (In de gesleepte volgorde)
        const blocksInMiddle = middleList.querySelectorAll('.drag-item');
        blocksInMiddle.forEach(block => {
            const id = block.getAttribute('data-id');
            
            // Knip de badge weg voor de zuivere titel
            let clone = block.cloneNode(true);
            let badge = clone.querySelector('.badge');
            if (badge) badge.remove();
            const title = clone.textContent.trim().toUpperCase();

            const data = blockData[id] || blockData['default'];
            let html = data.previewHTML;
            
            // Vervang de titel als het een standaard blok is
            if (html.includes('id="dynamic-preview-title"')) {
                html = html.replace('id="dynamic-preview-title">ONDERDEEL', 'id="dynamic-preview-title">' + title);
            }
            
            // Verpak de html in een div zodat tabellen mooi links uitlijnen in het midden van het scherm
            presentationSlides.push(`<div style="width: 100%;">${html}</div>`);
        });

        // 3. Afsluitende Slide (Gecentreerd)
        presentationSlides.push(`
            <div style="text-align: center;">
                <h1 class="slide-title" style="font-size: 64px; margin-bottom: 40px; border-color: var(--vrmwb-red);">EINDE DAGJOURNAAL</h1>
                <p style="font-size: 36px; opacity: 0.8; font-weight: 700;">Zijn er nog bijzonderheden of vragen?</p>
            </div>
        `);
    }

    function showSlide(index) {
        if (index < 0) index = 0;
        if (index >= presentationSlides.length) index = presentationSlides.length - 1;
        currentSlideIndex = index;

        presContent.innerHTML = presentationSlides[currentSlideIndex];
        presCounter.innerText = `${currentSlideIndex + 1} / ${presentationSlides.length}`;

        presPrev.style.visibility = (currentSlideIndex === 0) ? 'hidden' : 'visible';
        presNext.style.visibility = (currentSlideIndex === presentationSlides.length - 1) ? 'hidden' : 'visible';
    }

    btnStartPresentation.addEventListener('click', () => {
        const blocksInMiddle = middleList.querySelectorAll('.drag-item');
        if (blocksInMiddle.length === 0) {
            alert("Voeg eerst blokken toe aan het Dagjournaal om de presentatie te starten.");
            return;
        }

        buildPresentation();
        currentSlideIndex = 0;
        showSlide(currentSlideIndex);
        presentationOverlay.classList.add('active');

        // Forceer de browser naar écht volledig scherm voor de ultieme focus!
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(err => console.log(err));
        }
    });

    closePresentationBtn.addEventListener('click', () => {
        presentationOverlay.classList.remove('active');
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(err => console.log(err));
        }
    });

    presPrev.addEventListener('click', () => showSlide(currentSlideIndex - 1));
    presNext.addEventListener('click', () => showSlide(currentSlideIndex + 1));

    // Navigeren met het toetsenbord tijdens de presentatie
    window.addEventListener('keydown', (e) => {
        if (presentationOverlay.classList.contains('active')) {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                showSlide(currentSlideIndex + 1);
            } else if (e.key === 'ArrowLeft') {
                showSlide(currentSlideIndex - 1);
            } else if (e.key === 'Escape') {
                closePresentationBtn.click();
            }
        }
    });

});