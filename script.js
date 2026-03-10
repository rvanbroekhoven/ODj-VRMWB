document.addEventListener('DOMContentLoaded', () => {

    // --- 1. THEME SWITCHER LOGICA ---
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

    // --- 2. DATUM EN KLOK LOGICA ---
    let selectedDate = new Date(); 
    const btnPrev = document.getElementById('btn-prev-day');
    const btnNext = document.getElementById('btn-next-day');
    const btnTodayText = document.getElementById('btn-today'); 
    const datetimeDisplay = document.getElementById('datetime-display');

    function isToday(dateToCheck) {
        const today = new Date();
        return dateToCheck.getDate() === today.getDate() &&
               dateToCheck.getMonth() === today.getMonth() &&
               dateToCheck.getFullYear() === today.getFullYear();
    }

    function updateCenterNavigation() {
        if (isToday(selectedDate)) {
            btnTodayText.innerText = "Vandaag";
        } else {
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            btnTodayText.innerText = selectedDate.toLocaleDateString('nl-NL', options);
        }
    }

    function updateRealTimeClock() {
        const now = new Date();
        const optionsDate = { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' };
        let dateString = now.toLocaleDateString('nl-NL', optionsDate);
        dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1).replace(' ', ', ');

        const timeString = now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
        datetimeDisplay.innerHTML = `${dateString} &nbsp;&nbsp; ${timeString}`;
    }

    btnPrev.addEventListener('click', () => { selectedDate.setDate(selectedDate.getDate() - 1); updateCenterNavigation(); });
    btnNext.addEventListener('click', () => { selectedDate.setDate(selectedDate.getDate() + 1); updateCenterNavigation(); });
    btnTodayText.addEventListener('click', () => { selectedDate = new Date(); updateCenterNavigation(); });

    updateCenterNavigation();
    updateRealTimeClock();
    setInterval(updateRealTimeClock, 1000);


    // --- 3. DYNAMISCHE CONTENT DATABASE ---
    const blockContent = {
        'ploeg-indeling': `<div class="form-group"><label>Kazernes in Roosterplanning</label><div class="dropdown-input"><span class="tag">Bergen op Zoom <span class="close">&times;</span></span><span class="chevron"></span></div></div><div class="form-group"><label>Dienstlijst MWB in Roosterplanning</label><div class="dropdown-input placeholder">Voeg een kazerne toe om standaard naam te overschrijven...<span class="chevron"></span></div></div><div class="form-group"><label>Dienstlijst ZLD in Roosterplanning</label><div class="dropdown-input placeholder">Voeg een kazerne toe om standaard naam te overschrijven...<span class="chevron"></span></div></div><div class="form-group"><label>Ticker rooster in Roosterplanning</label><div class="dropdown-input">Bergen op Zoom<span class="chevron"></span></div></div>`,
        'alarmen': `<div class="form-group"><label>Selecteer incidenten ter bespreking</label><div class="dropdown-input placeholder">Kies uit recente P1/P2 meldingen...<span class="chevron"></span></div></div><div class="form-group"><label>Bijzonderheden / Leermomenten</label><div class="dropdown-input placeholder" style="min-height: 120px; align-items: flex-start;">Typ hier eventuele notities voor de overdracht...</div></div>`,
        'voertuigen': `<div class="form-group"><label>Defecten / Uit de uitruk</label><div class="dropdown-input">Geen defecten gemeld (OASIS)<span class="chevron"></span></div></div><div class="form-group"><label>Vervangend materieel</label><div class="dropdown-input placeholder">Selecteer indien van toepassing...<span class="chevron"></span></div></div>`,
        'default': `<div class="form-group"><label>Observaties en Opmerkingen</label><div class="dropdown-input placeholder" style="min-height: 120px; align-items: flex-start;">Voeg hier de details voor dit dagjournaal-onderdeel toe...</div></div>`
    };


    // --- 4. DRAG & DROP LOGICA (100% Kogelvrij) ---
    const draggables = document.querySelectorAll('.drag-item');
    const leftList = document.getElementById('blok-selectie');
    const middleList = document.getElementById('dagjournaal-lijst');
    const emptyState = document.getElementById('empty-state');
    const editorTitle = document.getElementById('editor-title');
    const editorContent = document.getElementById('editor-content');

    // FIX: We selecteren de HELE kolom in plaats van alleen het kleine lijstje
    const leftColumn = leftList.closest('.column');
    const middleColumn = middleList.closest('.column');

    // Houdt in de gaten of het midden leeg is om de tekst te tonen
    function checkEmptyState() {
        if (!emptyState) return;
        const itemsInMiddle = middleList.querySelectorAll('.drag-item').length;
        emptyState.style.display = itemsInMiddle === 0 ? 'block' : 'none';
    }

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        });

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
            
            // Checken waar we hem losgelaten hebben om de stijl aan te passen
            if (middleList.contains(draggable)) {
                draggable.classList.remove('theme-card-light');
                draggable.classList.add('dark', 'sequence-card');
            } else {
                draggable.classList.remove('dark', 'sequence-card', 'active-card', 'gold');
                draggable.classList.add('theme-card-light');
            }
            
            checkEmptyState();

            // Als we per ongeluk het geselecteerde (gouden) blok terug hebben gegooid: reset de rechterkolom
            if (!middleList.querySelector('.active-card')) {
                editorTitle.innerText = "GEEN BLOK GESELECTEERD";
                editorContent.innerHTML = `<div style="text-align: center; color: var(--text-muted); margin-top: 20px;">Voeg een blok toe aan het dagjournaal en klik erop om de instellingen te bekijken.</div>`;
            }
        });
    });

    // Functie berekent de exacte positie tussen andere blokken tijdens het slepen
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.drag-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // De Magneet: Als je zweeft over de linkse of rechtse KOLOM
    [leftColumn, middleColumn].forEach(col => {
        col.addEventListener('dragover', e => {
            e.preventDefault(); // Browser vertellen dat droppen hier oké is
            
            const draggable = document.querySelector('.dragging');
            if (!draggable) return;

            // Welke kant zijn we aan het slepen? Vind de juiste lijst in die kolom
            const zone = col.querySelector('.scroll-area');
            const afterElement = getDragAfterElement(zone, e.clientY);
            
            if (afterElement == null) {
                zone.appendChild(draggable); // Plaats onderaan
            } else {
                zone.insertBefore(draggable, afterElement); // Plaats ertussen
            }
        });
    });


    // --- 5. KLIKKEN IN DE MIDDELSTE KOLOM ---
    // Event listener op de hele lijst, zodat pas-gesleepte blokken het ook direct snappen
    middleList.addEventListener('click', e => {
        const card = e.target.closest('.drag-item');
        if (!card) return; // Er is op de achtergrond geklikt
        if (!middleList.contains(card)) return; // Je kan geen blokken selecteren die nog links staan

        // Maak alle kaarten donker
        middleList.querySelectorAll('.drag-item').forEach(c => {
            c.classList.remove('active-card', 'gold');
            c.classList.add('dark');
        });

        // Maak het aangeklikte blok goud
        card.classList.remove('dark');
        card.classList.add('active-card', 'gold');

        // Knip de badge weg voor de titel
        let clone = card.cloneNode(true);
        let badge = clone.querySelector('.badge');
        if (badge) badge.remove();
        
        editorTitle.innerText = clone.textContent.trim().toUpperCase(); 
        
        // Laad het juiste HTML-formulier in
        const blockId = card.getAttribute('data-id');
        const newContent = blockContent[blockId] || blockContent['default'];
        editorContent.innerHTML = newContent;
    });

});