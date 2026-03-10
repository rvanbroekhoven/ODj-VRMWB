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
        dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);
        dateString = dateString.replace(' ', ', ');

        const timeString = now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
        datetimeDisplay.innerHTML = `${dateString} &nbsp;&nbsp; ${timeString}`;
    }

    btnPrev.addEventListener('click', () => { selectedDate.setDate(selectedDate.getDate() - 1); updateCenterNavigation(); });
    btnNext.addEventListener('click', () => { selectedDate.setDate(selectedDate.getDate() + 1); updateCenterNavigation(); });
    btnTodayText.addEventListener('click', () => { selectedDate = new Date(); updateCenterNavigation(); });

    updateCenterNavigation();
    updateRealTimeClock();
    setInterval(updateRealTimeClock, 1000);


    // --- 3. DYNAMISCHE CONTENT & SELECTIE (STAP 1) ---
    
    // Een mini-database met de inhoud voor de rechterkolom per blok
    const blockContent = {
        'ploeg-indeling': {
            title: 'PLOEG INDELING',
            html: `
                <div class="form-group">
                    <label>Kazernes in Roosterplanning</label>
                    <div class="dropdown-input">
                        <span class="tag">Bergen op Zoom <span class="close">&times;</span></span>
                        <span class="chevron"></span>
                    </div>
                </div>
                <div class="form-group">
                    <label>Dienstlijst MWB in Roosterplanning</label>
                    <div class="dropdown-input placeholder">Voeg een kazerne toe om standaard naam te overschrijven...<span class="chevron"></span></div>
                </div>
                <div class="form-group">
                    <label>Dienstlijst ZLD in Roosterplanning</label>
                    <div class="dropdown-input placeholder">Voeg een kazerne toe om standaard naam te overschrijven...<span class="chevron"></span></div>
                </div>
                <div class="form-group">
                    <label>Ticker rooster in Roosterplanning</label>
                    <div class="dropdown-input">Bergen op Zoom<span class="chevron"></span></div>
                </div>
            `
        },
        'alarmen': {
            title: 'ALARMEN VORIGE DIENST',
            html: `
                <div class="form-group">
                    <label>Selecteer incidenten ter bespreking</label>
                    <div class="dropdown-input placeholder">Kies uit recente P1/P2 meldingen...<span class="chevron"></span></div>
                </div>
                <div class="form-group">
                    <label>Bijzonderheden / Leermomenten</label>
                    <div class="dropdown-input placeholder" style="min-height: 120px; align-items: flex-start;">Typ hier eventuele notities voor de overdracht...</div>
                </div>
            `
        },
        'voertuigen': {
            title: 'STATUS VOERTUIGEN',
            html: `
                <div class="form-group">
                    <label>Defecten / Uit de uitruk</label>
                    <div class="dropdown-input">Geen defecten gemeld (OASIS)<span class="chevron"></span></div>
                </div>
                <div class="form-group">
                    <label>Vervangend materieel</label>
                    <div class="dropdown-input placeholder">Selecteer indien van toepassing...<span class="chevron"></span></div>
                </div>
            `
        },
        'default': {
            title: 'BLOK INHOUD',
            html: `
                <div class="form-group">
                    <label>Observaties en Opmerkingen</label>
                    <div class="dropdown-input placeholder" style="min-height: 120px; align-items: flex-start;">Voeg hier de details voor dit dagjournaal-onderdeel toe...</div>
                </div>
            `
        }
    };

    // Haal de elementen op uit de HTML
    const sequenceCards = document.querySelectorAll('.sequence-list .sequence-card');
    const editorTitle = document.getElementById('editor-title');
    const editorContent = document.getElementById('editor-content');

    // Voeg klik-functionaliteit toe aan elke kaart in de middelste lijst
    sequenceCards.forEach(card => {
        card.addEventListener('click', function() {
            // A. Visuele update: Maak alle kaarten eerst donker en inactief
            sequenceCards.forEach(c => {
                c.classList.remove('active-card', 'gold');
                c.classList.add('dark');
            });

            // B. Geef de specifieke kaart waar je nu op klikte de gouden/actieve kleur
            this.classList.remove('dark');
            this.classList.add('active-card', 'gold');

            // C. Haal de ID van het blok op en verander de rechterkolom
            const blockId = this.getAttribute('data-id');
            const newContent = blockContent[blockId] || blockContent['default'];

            editorTitle.innerText = newContent.title;
            editorContent.innerHTML = newContent.html;
        });
    });

});