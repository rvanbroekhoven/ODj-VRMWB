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


    // --- 3. DYNAMISCHE TITEL SELECTIE ---
    
    // Tijdelijke standaard content voor de rechterkolom (aangezien dit nog niet relevant is)
    const defaultHTML = `
        <div class="form-group">
            <label>Instellingen voor dit blok</label>
            <div class="dropdown-input placeholder" style="min-height: 120px; align-items: flex-start;">
                Inhoud volgt later...
            </div>
        </div>
    `;

    const sequenceCards = document.querySelectorAll('.sequence-list .sequence-card');
    const editorTitle = document.getElementById('editor-title');
    const editorContent = document.getElementById('editor-content');

    sequenceCards.forEach(card => {
        card.addEventListener('click', function() {
            // A. Visuele update: Maak alle kaarten in de lijst donker
            sequenceCards.forEach(c => {
                c.classList.remove('active-card', 'gold');
                c.classList.add('dark');
            });

            // B. Geef het aangeklikte blok de gouden kleur
            this.classList.remove('dark');
            this.classList.add('active-card', 'gold');

            // C. Haal de naam van het blok op (zonder de rode badge mee te nemen)
            let clone = this.cloneNode(true); // Maak een onzichtbare kopie van het blok
            let badge = clone.querySelector('.badge');
            if (badge) {
                badge.remove(); // Haal de badge uit de kopie
            }
            
            // Haal de schone tekst op en zet deze om naar HOOFDLETTERS
            let blockName = clone.textContent.trim().toUpperCase(); 

            // D. Verander de titel in de rechterkolom
            editorTitle.innerText = blockName;
            
            // E. Zet de standaard content in de editor
            editorContent.innerHTML = defaultHTML;
        });
    });

});