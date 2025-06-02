const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper"),
  addEventCloseBtn = document.querySelector(".close"),
  addEventTitle = document.querySelector(".event-name"),
  addEventFrom = document.querySelector(".event-time-from"),
  addEventTo = document.querySelector(".event-time-to"),
  addEventCategory = document.querySelector(".event-category"),
  addEventSubmit = document.querySelector(".add-event-btn");

let today = new Date();
let activeDay = today.getDate();
let month = today.getMonth();
let year = today.getFullYear();
let currentView = "month";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const eventsArr = [];
getEvents();

function renderView() {
  if (currentView === "month") {
    renderMonthView();
  } else if (currentView === "week") {
    renderWeekView();
  } else if (currentView === "day") {
    renderDayView();
  }
}

function renderMonthView() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const startDay = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = `${months[month]} ${year}`;
  let days = "";

  for (let x = startDay; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    let event = eventsArr.some(
      (e) => e.day === i && e.month === month + 1 && e.year === year
    );
    const isToday = i === today.getDate() &&
      year === today.getFullYear() &&
      month === today.getMonth();
    let classes = ["day"];
    if (isToday) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      classes.push("today", "active");
    }
    if (event) classes.push("event");
    days += `<div class="${classes.join(" ")}">${i}</div>`;
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days;
  addListner();
}

function renderWeekView() {
  date.innerHTML = `${months[month]} ${year}`;
  let weekStart = activeDay - new Date(year, month, activeDay).getDay();
  weekStart = Math.max(1, weekStart);
  let days = "";

  for (let i = weekStart; i < weekStart + 7; i++) {
    if (i > new Date(year, month + 1, 0).getDate()) break;
    const isToday = i === today.getDate() &&
      year === today.getFullYear() &&
      month === today.getMonth();
    let classes = ["day"];
    if (i === activeDay) classes.push("active");
    if (isToday) classes.push("today");
    if (eventsArr.some(e => e.day === i && e.month === month + 1 && e.year === year))
      classes.push("event");
    days += `<div class="${classes.join(" ")}">${i}</div>`;
  }

  daysContainer.innerHTML = days;
  getActiveDay(activeDay);
  updateEvents(activeDay);
  addListner();
}

function renderDayView() {
  date.innerHTML = `${months[month]} ${year}`;
  const isToday = activeDay === today.getDate() &&
    year === today.getFullYear() &&
    month === today.getMonth();
  let classes = ["day", "active"];
  if (isToday) classes.push("today");
  daysContainer.innerHTML = `<div class="${classes.join(" ")}">${activeDay}</div>`;
  getActiveDay(activeDay);
  updateEvents(activeDay);
  addListner();
}

function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  renderView();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  renderView();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);
todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  activeDay = today.getDate();
  renderView();
});

function addListner() {
  document.querySelectorAll(".day").forEach(day => {
    day.addEventListener("click", e => {
      activeDay = Number(e.target.innerText);
      getActiveDay(activeDay);
      updateEvents(activeDay);
      document.querySelectorAll(".day").forEach(d => d.classList.remove("active"));
      e.target.classList.add("active");
    });
  });
}

dateInput.addEventListener("input", e => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) dateInput.value += "/";
  if (dateInput.value.length > 7) dateInput.value = dateInput.value.slice(0, 7);
});

gotoBtn.addEventListener("click", () => {
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2 && +dateArr[0] > 0 && +dateArr[0] <= 12 && dateArr[1].length === 4) {
    month = +dateArr[0] - 1;
    year = +dateArr[1];
    renderView();
  } else alert("Invalid Date");
});

function getActiveDay(dateNum) {
  const d = new Date(year, month, dateNum);
  const dayName = d.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = `${dateNum} ${months[month]} ${year}`;
}

function updateEvents(date) {
  let eventsHTML = "";
  eventsArr.forEach(ev => {
    if (ev.day === date && ev.month === month + 1 && ev.year === year) {
      ev.events.forEach(e => {
        eventsHTML += `
          <div class="event">
            <div class="title">
              <i class="fas fa-circle" style="color:${getCategoryColor(e.category)};"></i>
              <h3 class="event-title">${e.title}</h3>
            </div>
            <div class="event-time">${e.time}</div>
          </div>`;
      });
    }
  });
  if (!eventsHTML) eventsHTML = `<div class="no-event"><h3>No Events</h3></div>`;
  eventsContainer.innerHTML = eventsHTML;
  saveEvents();
  updateAnalytics();
}

function getCategoryColor(category) {
  return {
    Work: "#007bff",
    Personal: "#28a745",
    Holiday: "#ffc107",
    Other: "#6c757d"
  }[category] || "#b38add";
}

addEventBtn.addEventListener("click", () => addEventWrapper.classList.toggle("active"));
addEventCloseBtn.addEventListener("click", () => addEventWrapper.classList.remove("active"));

document.addEventListener("click", e => {
  if (!addEventWrapper.contains(e.target) && e.target !== addEventBtn) {
    addEventWrapper.classList.remove("active");
  }
});

addEventTitle.addEventListener("input", () => {
  addEventTitle.value = addEventTitle.value.slice(0, 60);
});
addEventFrom.addEventListener("input", () => {
  addEventFrom.value = formatTimeInput(addEventFrom.value);
});
addEventTo.addEventListener("input", () => {
  addEventTo.value = formatTimeInput(addEventTo.value);
});
function formatTimeInput(v) {
  v = v.replace(/[^0-9:]/g, "");
  if (v.length === 2) v += ":";
  return v.slice(0, 5);
}

addEventSubmit.addEventListener("click", () => {
  const title = addEventTitle.value.trim();
  const timeFrom = addEventFrom.value.trim();
  const timeTo = addEventTo.value.trim();
  const category = addEventCategory.value;
  if (!title || !timeFrom || !timeTo) return alert("Fill all fields");

  const newEvent = {
    title,
    time: `${convertTime(timeFrom)} - ${convertTime(timeTo)}`,
    category
  };

  let added = false;
  eventsArr.forEach(e => {
    if (e.day === activeDay && e.month === month + 1 && e.year === year) {
      e.events.push(newEvent);
      added = true;
    }
  });
  if (!added) {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year,
      events: [newEvent]
    });
  }

  addEventWrapper.classList.remove("active");
  addEventTitle.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";
  addEventCategory.value = "Work";
  updateEvents(activeDay);

  const el = document.querySelector(".day.active");
  if (el && !el.classList.contains("event")) el.classList.add("event");
});

eventsContainer.addEventListener("click", e => {
  const el = e.target.closest(".event");
  if (!el) return;
  const title = el.querySelector(".event-title").innerText;
  if (!confirm("Delete this event?")) return;

  eventsArr.forEach(e => {
    if (e.day === activeDay && e.month === month + 1 && e.year === year) {
      e.events = e.events.filter(ev => ev.title !== title);
    }
  });
  updateEvents(activeDay);
});

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}
function getEvents() {
  const saved = localStorage.getItem("events");
  if (saved) eventsArr.push(...JSON.parse(saved));
}
function convertTime(t) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${(h % 12 || 12)}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function updateAnalytics() {
  const categoryStats = {};
  const dayStats = {};
  let totalMinutes = 0;

  eventsArr.forEach(({ day, month, year, events }) => {
    const dateKey = `${year}-${month}-${day}`;
    dayStats[dateKey] = (dayStats[dateKey] || 0) + events.length;

    events.forEach(({ category, time }) => {
      categoryStats[category] = (categoryStats[category] || 0) + 1;
      const match = time.match(/(\d+):(\d+)\s\w+\s-\s(\d+):(\d+)\s\w+/);
      if (match) {
        const [, h1, m1, h2, m2] = match.map(Number);
        totalMinutes += (h2 * 60 + m2) - (h1 * 60 + m1);
      }
    });
  });

  const catList = document.getElementById("category-stats");
  catList.innerHTML = "";
  Object.entries(categoryStats).forEach(([cat, count]) => {
    const li = document.createElement("li");
    li.textContent = `${cat}: ${count}`;
    catList.appendChild(li);
  });

  const maxDay = Object.entries(dayStats).sort((a, b) => b[1] - a[1])[0];
  document.getElementById("busiest-day").textContent = maxDay
    ? `${maxDay[0]} (${maxDay[1]} events)` : "-";

  document.getElementById("total-hours").textContent = (totalMinutes / 60).toFixed(2);
}

const darkToggle = document.getElementById("dark-mode-toggle");
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  darkToggle.textContent = "☀️ Light Mode";
}
darkToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  darkToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
});

document.querySelectorAll(".view-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".view-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentView = btn.dataset.view;
    renderView();
  });
});
document.querySelector('.view-btn[data-view="month"]').classList.add("active");

renderView();
