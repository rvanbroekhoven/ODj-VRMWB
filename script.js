document.addEventListener('DOMContentLoaded', () => {
    let displayedDate = new Date(); 

    const btnPrev = document.getElementById('btn-prev-day');
    const btnNext = document.getElementById('btn-next-day');
    const btnToday = document.getElementById('btn-today');
    const datetimeDisplay = document.getElementById('datetime-display');

    function updateDateDisplay() {
        const optionsDate = { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' };
        let dateString = displayedDate.toLocaleDateString('nl-NL', optionsDate);
        dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);
        dateString = dateString.replace(' ', ', ');

        const now = new Date();
        const timeString = now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

        datetimeDisplay.innerHTML = `${dateString} &nbsp;&nbsp; ${timeString}`;
    }

    btnPrev.addEventListener('click', () => { displayedDate.setDate(displayedDate.getDate() - 1); updateDateDisplay(); });
    btnNext.addEventListener('click', () => { displayedDate.setDate(displayedDate.getDate() + 1); updateDateDisplay(); });
    btnToday.addEventListener('click', () => { displayedDate = new Date(); updateDateDisplay(); });

    updateDateDisplay();
    setInterval(updateDateDisplay, 1000);
});