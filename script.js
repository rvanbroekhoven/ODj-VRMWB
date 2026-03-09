document.addEventListener('DOMContentLoaded', () => {
    // 1. Variabele voor de GESELECTEERDE datum (in het midden)
    let selectedDate = new Date(); 

    // Haal de HTML elementen op
    const btnPrev = document.getElementById('btn-prev-day');
    const btnNext = document.getElementById('btn-next-day');
    const btnTodayText = document.getElementById('btn-today'); 
    const datetimeDisplay = document.getElementById('datetime-display');

    // Hulpfunctie om te checken of een datum "vandaag" is
    function isToday(dateToCheck) {
        const today = new Date();
        return dateToCheck.getDate() === today.getDate() &&
               dateToCheck.getMonth() === today.getMonth() &&
               dateToCheck.getFullYear() === today.getFullYear();
    }

    // Functie 1: Update de tekst in het midden (Vandaag of de specifieke datum)
    function updateCenterNavigation() {
        if (isToday(selectedDate)) {
            btnTodayText.innerText = "Vandaag";
        } else {
            // Formatteer naar bijv: "10 maart 2026"
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            btnTodayText.innerText = selectedDate.toLocaleDateString('nl-NL', options);
        }
    }

    // Functie 2: Update de echte klok rechtsonder (deze blijft altijd lopen op de huidige tijd)
    function updateRealTimeClock() {
        const now = new Date();
        
        // Datum opmaak voor rechtsonder (bijv: "Di, 9 maart 2026")
        const optionsDate = { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' };
        let dateString = now.toLocaleDateString('nl-NL', optionsDate);
        dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);
        dateString = dateString.replace(' ', ', ');

        // Tijd opmaak
        const timeString = now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

        // Zet de tekst in het display
        datetimeDisplay.innerHTML = `${dateString} &nbsp;&nbsp; ${timeString}`;
    }

    // --- Knoppen Logica ---
    
    // Vorige dag
    btnPrev.addEventListener('click', () => { 
        selectedDate.setDate(selectedDate.getDate() - 1); 
        updateCenterNavigation(); 
    });
    
    // Volgende dag
    btnNext.addEventListener('click', () => { 
        selectedDate.setDate(selectedDate.getDate() + 1); 
        updateCenterNavigation(); 
    });
    
    // Extra UX-toevoeging: als je op de datum in het midden klikt, springt hij terug naar "Vandaag"
    btnTodayText.addEventListener('click', () => { 
        selectedDate = new Date(); 
        updateCenterNavigation(); 
    });

    // Start direct beide functies bij het laden van de pagina
    updateCenterNavigation();
    updateRealTimeClock();
    
    // Laat de klok rechtsonder elke seconde updaten
    setInterval(updateRealTimeClock, 1000);
});