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


    // --- 3. DYNAMISCHE TITEL & CONTENT SELECTIE ---
    
    // We bewaren hier alleen de HTML content, niet meer de titel!
    const blockContent = {
        'ploeg-indeling': `
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
        `,
        'alarmen': `
            <div class="form-group">
                <label>Selecteer incidenten ter bespreking</label>
                <div class="dropdown-input placeholder">Kies uit recente P1/P2 meldingen...<span class="chevron"></span></div>
            </div>
            <div class="form-group">
                <label>Bijzonderheden / Leermomenten</label>
                <div class="dropdown-input placeholder" style="min-height: 120px; align-items: flex-start;">Typ hier eventuele notities voor de overdracht...</div>
            </div>
        `,
        'voertuigen': `
            <div class="form-group">
                <label>Defecten / Uit de uitruk</label>
                <div class="dropdown-input">Geen defecten gemeld (OASIS)<span class="chevron"></span></div>
            </div>
            <div class="form-group">
                <label>Vervangend materieel</label>
                <div class="dropdown-input placeholder">Selecteer indien van toepassing...<span class="chevron"></span></div>
            </div>
        `,
        'default': `
            <div class="form-group">
                <label>Observaties en Opmerkingen</label>
                <div class="dropdown-input placeholder" style="min-height: 120px; align-items: flex-start;">Voeg hier de details voor dit dagjournaal-onderdeel toe...</div>
            </div>
        `
    };

    const sequenceCards = document.querySelectorAll('.sequence-list .sequence-card');
    const editorTitle = document.getElementById('editor-title');
    const editorContent = document.getElementById('editor-content');

    sequenceCards.forEach(card => {
        card.addEventListener('click', function() {
            // A. Visuele update: maak vorige selectie weer donker
            sequenceCards.forEach(c => {
                c.classList.remove('active-card', 'gold');
                c.classList.add('dark');
            });
            
            // Maak het aangeklikte blok goud
            this.classList.remove('dark');
            this.classList.add('active-card', 'gold');

            // B. DYNAMISCHE TITEL LEZEN:
            // We maken even een onzichtbare kopie van het blok om de rode badge te verwijderen
            let clone = this.cloneNode(true);
            let badge = clone.querySelector('.badge');
            if (badge) {
                badge.remove(); // Sloop de badge eruit
            }
            
            // Lees de overgebleven tekst ("Topdesk", "Mobiliteit", etc.) en maak het HOOFDLETTERS
            let blockName = clone.textContent.trim().toUpperCase(); 
            
            // Verander de titel in de rechterkolom
            editorTitle.innerText = blockName;
            
            // C. Pas de formulier-content aan (specifiek óf de default)
            const blockId = this.getAttribute('data-id');
            const newContent = blockContent[blockId] || blockContent['default'];
            editorContent.innerHTML = newContent;
        });
    });

});