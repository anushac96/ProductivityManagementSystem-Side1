import React, { useState, useEffect } from 'react';

function Calender() {

  const [date, setDate] = useState(new Date());
  const [months, setMonths] = useState([
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]);

  const [days, setDays] = useState([]);
  const [inputDate, setInputDate] = useState('');
   // Add state for controlling the visibility of the add-event-wrapper
   const [isAddEventActive, setAddEventActive] = useState(false);


  useEffect(() => {
    initCalendar();
  }, [date, inputDate]); // Update the effect to run whenever the date changes

  function initCalendar() {
    const month = date.getMonth();
    const year = date.getFullYear();
    setDateContent(`${months[month]} ${year}`);

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;

    let daysArray = [];

    // Add days from the previous month
    for (let x = day; x > 0; x--) {
      daysArray.push({
        value: prevDays - x + 1,
        className: 'prev-date'
      });
    }

    // Add days from the current month
    for (let i = 1; i <= lastDate; i++) {
      const currentDate = new Date(year, month, i);
      const currentDay = {
        value: i,
        className: '',
        isToday: isSameDay(currentDate, new Date()),
      };

      if (currentDay.isToday) {
        currentDay.className = 'active';
      }

      daysArray.push(currentDay);
    }

    // Add days from the next month
    for (let i = 1; i <= nextDays; i++) {
      const nextMonthDay = i;
      daysArray.push({
        value: nextMonthDay,
        className: 'next-date',
        //isToday: false,
        //isPrevMonth: false,
      });
    }

    // Update the state with the calculated days
    setDays(daysArray);
  }

  function setDateContent(content) {
    const dateElement = document.querySelector('.calendar .month .date');
    if (dateElement) {
      dateElement.innerHTML = content;
    }
  }

  function isSameDay(date1, date2) {
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return d1.getTime() === d2.getTime();
  }

  function goToPreviousMonth() {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()));
  }

  function goToNextMonth() {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, date.getDate()));
  }

  function goToToday() {
    setDate(new Date());
  }

  function goToSelectedMonth() {
    if (inputDate) {
      const [selectedMonth, selectedYear] = inputDate.split('/');
      const monthNumber = Number(selectedMonth);
      const yearNumber = Number(selectedYear);

      // Check if the input is a valid month and year
      if (
        !isNaN(monthNumber) &&
        monthNumber >= 1 &&
        monthNumber <= 12 &&
        !isNaN(yearNumber) &&
        yearNumber >= 1000
      ) {
        const selectedDate = new Date(yearNumber, monthNumber - 1, 1);
        setDate(selectedDate);
      }
      // If input is invalid, do nothing
    }
  }

  // Function to toggle the add-event-wrapper's visibility
  const toggleAddEvent = () => {
    setAddEventActive(!isAddEventActive);
  };

  return (
    <body>
      <div class="container">
        <div class="left">
          <div class="calendar">
            <div class="month">
              <i class="fa fa-angle-left prev" onClick={goToPreviousMonth}></i>
              <div class="date">January 2024</div>
              <i class="fa fa-angle-right next" onClick={goToNextMonth}></i>
            </div>
            <div class="weekdays">
              <div>sun</div>
              <div>mon</div>
              <div>tue</div>
              <div>wed</div>
              <div>thrus</div>
              <div>fri</div>
              <div>sat</div>
            </div>
            <div class="days">
              {days.map((day, index) => (
                <div key={index} className={`day ${day.className}`}>
                  {day.value}
                </div>
              ))}
            </div>
            <div class="goto-today">
              <div class="goto">
                <input
                  type="text"
                  placeholder="mm/yyyy"
                  className="date-input"
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                ></input>
                <button class="goto-btn" onClick={goToSelectedMonth}>Go</button>
              </div>
              <button class="today-btn" onClick={goToToday}>Today</button>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="today-date">
            <div class="event-day">Wed</div>
            <div class="event-date">17 January 2024</div>
          </div>
          <div class="events"></div>
          <div class={`add-event-wrapper ${isAddEventActive ? 'active' : ''}`}>
            <div class="add-event-header">
              <div class="title">Add Event</div>
              <i class="fas fa-times close" onClick={toggleAddEvent}></i>
            </div>
            <div class="add-event-body">
              <div class="add-event-input">
                <input type="text" placeholder="Event Name" class="event-name"></input>
              </div>
              <div class="add-event-input">
                <input type="text" placeholder="Event Time From" class="event-time-from"></input>
              </div>
              <div class="add-event-input">
                <input type="text" placeholder="Event Time To" class="event-time-to"></input>
              </div>
            </div>
            <div class = "add-event-footer">
              <button class = "add-event-btn">Add Event</button>
            </div>
          </div>
          <button class = "add-event" onClick={toggleAddEvent}>
            <i class = "fas fa-plus"></i>
          </button>
        </div>
      </div>
    </body>
  );
}
export default Calender;