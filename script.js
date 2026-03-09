document.addEventListener('DOMContentLoaded', () => {
    // We starten met de huidige datum
    let displayedDate = new Date(); 

    // Haal de knoppen en het display-element op uit de HTML
    const btnPrev = document.getElementById('btn-prev-day');
    const btnNext = document.getElementById('btn-next-day');
    const btnToday = document.getElementById('btn-today');
    const datetimeDisplay = document.getElementById('datetime-display');

    // Functie om de datum en tijd te updaten in de HTML
    function updateDateDisplay() {
        // Formatteer de datum (bijv: "di 3 maart 2026")
        const optionsDate = { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' };
        let dateString = displayedDate.toLocaleDateString('nl-NL', optionsDate);
        
        // Zorg dat de eerste letter een hoofdletter is (zoals in jouw design: "Di, ")
        dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);
        // Voeg de komma toe na de dag (vervang de eerste spatie door een komma + spatie)
        dateString = dateString.replace(' ', ', ');

        // Haal de echte huidige tijd op voor het klokje rechtsonder
        const now = new Date();
        const timeString = now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

        // Zet de tekst in de HTML
        datetimeDisplay.innerHTML = `${dateString} &nbsp;&nbsp; ${timeString}`;
    }

    // --- Event Listeners voor de knoppen ---

    // Knop: Vorige dag (<)
    btnPrev.addEventListener('click', () => {
        displayedDate.setDate(displayedDate.getDate() - 1);
        updateDateDisplay();
    });

    // Knop: Volgende dag (>)
    btnNext.addEventListener('click', () => {
        displayedDate.setDate(displayedDate.getDate() + 1);
        updateDateDisplay();
    });

    // Knop: Vandaag
    btnToday.addEventListener('click', () => {
        displayedDate = new Date(); // Reset naar écht vandaag
        updateDateDisplay();
    });

    // Initialiseer direct bij het laden
    updateDateDisplay();

    // Laat de klok elke seconde (1000 milliseconden) updaten zodat de tijd doorloopt
    setInterval(updateDateDisplay, 1000);
});