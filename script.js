document.addEventListener('DOMContentLoaded', () => {

    // --- THEME SWITCHER LOGICA ---
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


    // --- DATUM EN KLOK LOGICA (Ongewijzigd) ---
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

    btnPrev.addEventListener('click', () => { 
        selectedDate.setDate(selectedDate.getDate() - 1); 
        updateCenterNavigation(); 
    });
    
    btnNext.addEventListener('click', () => { 
        selectedDate.setDate(selectedDate.getDate() + 1); 
        updateCenterNavigation(); 
    });
    
    btnTodayText.addEventListener('click', () => { 
        selectedDate = new Date(); 
        updateCenterNavigation(); 
    });

    updateCenterNavigation();
    updateRealTimeClock();
    setInterval(updateRealTimeClock, 1000);
});