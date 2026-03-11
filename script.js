document.addEventListener('DOMContentLoaded', () => {

    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        if (currentTheme === 'light') {
            body.setAttribute('data-theme', 'dark');
            themeToggle.innerText = '☀️ Light Mode';
        } else {
            body.setAttribute('data-theme', 'light');
            themeToggle.innerText = '🌙 Dark Mode';
        }
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


    // --- DYNAMISCHE CONTENT (GEÜPDATE MET PREVIEW DATA) ---
    // In plaats van alleen HTML voor de rechterkolom, slaan we nu OOK de preview (slide) HTML op.
    const blockData = {
        'ploeg-indeling': {
            editorHTML: `
                <div class="form-group"><label>Kazernes in Roosterplanning</label><div class="dropdown-input"><span class="tag">Bergen op Zoom <span class="close">&times;</span></span><span class="chevron"></span></div></div>
                <div class="form-group"><label>Dienstlijst MWB in Roosterplanning</label><div class="dropdown-input placeholder">Voeg een kazerne toe om standaard naam te overschrijven...<span class="chevron"></span></div></div>
                <div class="form-group"><label>Dienstlijst ZLD in Roosterplanning</label><div class="dropdown-input placeholder">Voeg een kazerne toe om standaard naam te overschrijven...<span class="chevron"></span></div></div>
                <div class="form-group"><label>Ticker rooster in Roosterplanning</label><div class="dropdown-input">Bergen op Zoom<span class="chevron"></span></div></div>
            `,
            previewHTML: `
                <h1 class="slide-title">PLOEG INDELING</h1>
                <table class="rooster-table">
                    <tr><th>Functie</th><th>Naam</th></tr>
                    <tr><td>Bevelvoerder</td><td>J. de Vries</td></tr>
                    <tr><td>Chauffeur/Pompbediende</td><td>P. Hendriks</td></tr>
                    <tr><td>Manschap 1</td><td>A. Jansen</td></tr>
                    <tr><td>Manschap 2</td><td>M. Bakker</td></tr>
                </table>
            `
        },
        'alarmen': {
            editorHTML: `
                <div class="form-group"><label>Selecteer incidenten ter bespreking</label><div class="dropdown-input placeholder">Kies uit recente P1/P2 meldingen...<span class="chevron"></span></div></div>
                <div class="form-group"><label>Bijzonderheden / Leermomenten</label><div class="dropdown-input placeholder" style="min-height: 120px; align-items: flex-start;">Typ hier eventuele notities voor de overdracht...</div></div>
            `,
            previewHTML: `
                <h1 class="slide-title">ALARMEN VORIGE DIENST</h1>
                <div class="incident-card">
                    <strong>PRIO 1</strong> - Woningbrand (Middel Brand)
                    <br><br>
                    Locatie: Hoofdstraat 12, Breda<br>
                    <span style="opacity: 0.7; font-size: 16px;">Bijzonderheden: Binnenaanval succesvol, controleer ademlucht.</span>
                </div>
                <div class="incident-card" style="border-left-color: var(--vrmwb-gold);">
                    <strong style="color: var(--vrmwb-gold);">PRIO 2</strong> - Buitenbrand
                    <br><br>
                    Locatie: Mastbos, Breda
                </div>
            `
        },
        'voertuigen': {
            editorHTML: `
                <div class="form-group"><label>Defecten / Uit de uitruk</label><div class="dropdown-input">Geen defecten gemeld (OASIS)<span class="chevron"></span></div></div>
                <div class="form-group"><label>Vervangend materieel</label><div class="dropdown-input placeholder">Selecteer indien van toepassing...<span class="chevron"></span></div></div>
            `,
            previewHTML: `
                <h1 class="slide-title">STATUS VOERTUIGEN</h1>
                <h3 style="font-size: 24px; margin-bottom: 10px;">Geen defecten gemeld via OASIS.</h3>
                <p style="font-size: 20px; opacity: 0.7;">Alle voertuigen zijn inzetbaar voor de komende dienst.</p>
            `
        },
        'default': {
            editorHTML: `
                <div class="form-group"><label>Observaties en Opmerkingen</label><div class="dropdown-input placeholder" style="min-height: 120px; align-items: flex-start;">Voeg hier de details voor dit dagjournaal-onderdeel toe...</div></div>
            `,
            previewHTML: `
                <h1 class="slide-title" id="dynamic-preview-title">ONDERDEEL</h1>
                <p style="font-size: 24px; opacity: 0.5; text-align: center; margin-top: 100px;">Geen specifieke bijzonderheden ingevoerd voor dit onderdeel.</p>
            `
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

    // Globaal bijhouden welk blok we momenteel selecteren voor de preview
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
            
            if (middleList.contains(draggable)) {
                draggable.classList.add('sequence-card');
            } else {
                draggable.classList.remove('sequence-card', 'active-card', 'gold');
                draggable.classList.add('theme-card-light');
            }
            
            checkEmptyState();
            
            if (!middleList.querySelector('.active-card')) {
                editorTitle.innerText = "GEEN BLOK GESELECTEERD";
                editorContent.innerHTML = `<div style="text-align: center; color: var(--text-main); margin-top: 20px; font-weight: 700;">Voeg een blok toe aan het dagjournaal en klik erop om de instellingen te bekijken.</div>`;
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

        middleList.querySelectorAll('.drag-item').forEach(c => {
            c.classList.remove('active-card', 'gold');
        });

        card.classList.add('active-card', 'gold');

        let clone = card.cloneNode(true);
        let badge = clone.querySelector('.badge');
        if (badge) badge.remove();
        
        currentSelectedBlockName = clone.textContent.trim().toUpperCase();
        editorTitle.innerText = currentSelectedBlockName; 
        
        currentSelectedBlockId = card.getAttribute('data-id');
        
        // Vul de rechterkolom met de editorHTML uit de data
        const data = blockData[currentSelectedBlockId] || blockData['default'];
        editorContent.innerHTML = data.editorHTML;
    });


    // --- PREVIEW LOGICA ---
    const btnOpenPreview = document.getElementById('btn-open-preview');
    const previewModal = document.getElementById('preview-modal');
    const closePreviewBtn = document.getElementById('close-preview');
    const previewBody = document.getElementById('preview-body');

    btnOpenPreview.addEventListener('click', () => {
        if (!currentSelectedBlockId) {
            alert("Selecteer eerst een blok in het Dagjournaal om te previewen!");
            return;
        }

        // Haal de presentatie content op
        const data = blockData[currentSelectedBlockId] || blockData['default'];
        previewBody.innerHTML = data.previewHTML;

        // Als het de default is, vervang dan de titel door de echte naam van het blok
        const dynamicTitle = document.getElementById('dynamic-preview-title');
        if (dynamicTitle) {
            dynamicTitle.innerText = currentSelectedBlockName;
        }

        previewModal.classList.add('active');
    });

    closePreviewBtn.addEventListener('click', () => {
        previewModal.classList.remove('active');
    });


    // --- LOCATIE SELECTIE (MODAL) ---
    const locationTrigger = document.getElementById('location-trigger');
    const locationModal = document.getElementById('location-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const locBtns = document.querySelectorAll('.loc-btn');

    locationTrigger.addEventListener('click', () => { locationModal.classList.add('active'); });
    closeModalBtn.addEventListener('click', () => { locationModal.classList.remove('active'); });
    
    // Sluit modals als je buiten de content klikt
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

});