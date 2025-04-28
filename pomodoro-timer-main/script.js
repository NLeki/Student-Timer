let timerInterval;
let seconds = 0;

//here is the clock on the sun//


// Function to position numbers correctly
function placeNumbers() {
    const numbersContainer = document.querySelector('.numbers');
    const radius = 80; // Distance from center

    for (let i = 1; i <= 12; i++) {
        const angle = (i - 3) * 30; // Offset by -90° so 12 is at the top
        const x = radius * Math.cos(angle * (Math.PI / 180));
        const y = radius * Math.sin(angle * (Math.PI / 180));

        const numberElement = document.createElement('div');
        numberElement.classList.add('num');
        numberElement.textContent = i;
        numberElement.style.left = `calc(50% + ${x}px)`;
        numberElement.style.top = `calc(50% + ${y}px)`;
        numbersContainer.appendChild(numberElement);
    }
}

// Function to update clock hands
function updateClock() {
    const hourHand = document.getElementById('hour-hand');
    const minuteHand = document.getElementById('minute-hand');
    const secondHand = document.getElementById('second-hand');

    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const hourDeg = (hours * 30) + (minutes / 2); // Each hour is 30 degrees, each minute adds 0.5 degrees
    const minuteDeg = (minutes * 6) + (seconds / 10); // Each minute is 6 degrees
    const secondDeg = seconds * 6; // Each second is 6 degrees

    hourHand.style.transform = `rotate(${hourDeg}deg)`;
    minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
    secondHand.style.transform = `rotate(${secondDeg}deg)`;
}

// Run functions on load
placeNumbers();
setInterval(updateClock, 1000);
updateClock();



function updateTimerDisplay() {
    document.getElementById('timer').innerText = new Date(seconds * 1000).toISOString().substr(14, 5);
}

document.getElementById('start').addEventListener('click', () => {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            seconds++;
            updateTimerDisplay();
        }, 1000);
    }
});

document.getElementById('pause').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

document.getElementById('reset').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    seconds = 0;
    updateTimerDisplay();
});

document.getElementById('delete').addEventListener('click', () => {
    if (confirm("Are you sure you want to delete the timer?")) {
        clearInterval(timerInterval);
        timerInterval = null;
        seconds = 0;
        document.getElementById('timer').innerText = "00:00";
    }
});

document.getElementById('stop').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

function updateBackground() {
    let hours = new Date().getHours();
    document.body.className = hours >= 18 ? 'nighttime' : 'daytime';
}
setInterval(updateBackground, 60000);
updateBackground();

class Calendar {
    constructor() {
        this.date = new Date();
        this.notes = JSON.parse(localStorage.getItem("calendarNotes")) || {};
        this.render();
    }

    render() {
        const year = this.date.getFullYear();
        const month = this.date.getMonth();
        document.getElementById("calendar-title").innerText = this.date.toLocaleString('default', { month: 'long', year: 'numeric' });
        const firstDay = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        const calendarDays = document.getElementById("calendar-days");
        calendarDays.innerHTML = "";

        for (let i = 0; i < firstDay; i++) {
            calendarDays.innerHTML += '<div class="calendar-day empty"></div>';
        }

        for (let i = 1; i <= totalDays; i++) {
            let dayElement = document.createElement("div");
            dayElement.classList.add("calendar-day");
            dayElement.innerText = i;
            if (i === new Date().getDate() && month === new Date().getMonth()) {
                dayElement.classList.add("today");
            }
            if (this.notes[`${year}-${month}-${i}`]) {
                dayElement.classList.add("noted");
                dayElement.innerHTML += "<span class='note-indicator'>📝</span>";
            }
            dayElement.addEventListener("click", () => this.openNoteModal(i));
            calendarDays.appendChild(dayElement);
        }
    }

    openNoteModal(day) {
        const key = `${this.date.getFullYear()}-${this.date.getMonth()}-${day}`;
        const currentNote = this.notes[key] || "";
        let note = prompt("Enter note for " + day, currentNote);
        if (note !== null) {
            if (note.length > 200) {
                alert("Note is too long! Limit to 200 characters.");
                return;
            }
            this.notes[key] = note;
            localStorage.setItem("calendarNotes", JSON.stringify(this.notes));
            this.render();
        }
    }

    changeMonth(offset) {
        this.date.setMonth(this.date.getMonth() + offset);
        this.render();
    }
}

document.getElementById("calendar-button").addEventListener("click", () => {
    document.getElementById("calendar-section").classList.toggle("hidden");
});

const calendar = new Calendar();
document.getElementById("prev-month").addEventListener("click", () => calendar.changeMonth(-1));
document.getElementById("next-month").addEventListener("click", () => calendar.changeMonth(1));
