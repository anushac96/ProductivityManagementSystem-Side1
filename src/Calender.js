import React, { useState, useEffect } from 'react';
import { format, parse, isValid } from 'date-fns';

function Calender() {

  const [date, setDate] = useState(new Date());
  const [months, setMonths] = useState([
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]);

  // default event array
  const eventsArr = [
    {
      day: 17,
      month: 1,
      year: 2024,
      events: [
        {
          title: "Event 1 lorem ipsun dolar sit genfa tersd dsad ",
          time: "10:00 AM",
        },
        {
          title: "Event 2",
          time: "11:00 AM",
        },
      ],
    },
  ];

  const [days, setDays] = useState([]);
  const [inputDate, setInputDate] = useState('');
  // Add state for controlling the visibility of the add-event-wrapper
  const [isAddEventActive, setAddEventActive] = useState(false);

  const [eventName, setEventName] = useState('');
  const [eventTimeFrom, setEventTimeFrom] = useState('');
  const [eventTimeTo, setEventTimeTo] = useState('');

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
      // check if event is present on current day
      const currentDate = new Date(year, month, i);
      const currentDay = {
        value: i,
        className: '',
        isToday: isSameDay(currentDate, new Date()),
        hasEvents: false, // Initialize a flag for events on the current day
      };

      // Check if there are events on the current day
      const eventsOnCurrentDay = eventsArr.find(event => {
        return (
          event.day === i &&
          event.month === month + 1 && // Months are 0-indexed in JavaScript Date objects
          event.year === year
        );
      });

      // if (eventsOnCurrentDay) {
      //   currentDay.hasEvents = true;
      //   currentDate.className = 'day today active event';
      // }

      if (currentDay.isToday) {
        if (eventsOnCurrentDay) {
          currentDay.hasEvents = true;
          currentDay.className = 'day today active event';
        }else
        currentDay.className = 'today active';
      }
      else{
        if (eventsOnCurrentDay) {
          currentDay.hasEvents = true;
          currentDay.className = 'day event';
        }else
        currentDay.className = 'day';
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

    // Reset input values when closing the modal
    if (!isAddEventActive) {
      setEventName('');
      setEventTimeFrom('');
      setEventTimeTo('');
    }
  };



  const handleEventTimeFrom = (e) => {
    const inputTime = e.target.value;

    if (inputTime.length >= 7) {
      const parsedTime = parse(inputTime, 'hh:mm a', new Date());

      if (isValid(parsedTime)) {
        setEventTimeFrom(format(parsedTime, 'hh:mm a'));
      } else {
        console.log('Invalid Time From:', inputTime);
        // Handle invalid time if needed
        // setEventTimeFrom('');
      }
    }

    // Update the local state for smooth rendering
    setEventTimeFrom(inputTime);
  };

  const handleEventTimeTo = (e) => {
    const inputTime = e.target.value;

    if (inputTime.length >= 7) {
      const parsedTime = parse(inputTime, 'hh:mm a', new Date());

      if (isValid(parsedTime)) {
        setEventTimeTo(format(parsedTime, 'hh:mm a'));
      } else {
        console.log('Invalid Time To:', inputTime);
        // Handle invalid time if needed
        // setEventTimeTo('');
      }
    }

    // Update the local state for smooth rendering
    setEventTimeTo(inputTime);
  };

  const handleAddEvent = () => {
    // Do something with the event details (eventName, eventTimeFrom, eventTimeTo)
    // For now, let's just log them
    console.log('Event Name:', eventName);
    console.log('Event Time From:', eventTimeFrom);
    console.log('Event Time To:', eventTimeTo);

    // Close the add-event-wrapper
    setAddEventActive(false);
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
                <input type="text"
                  placeholder="Event Name"
                  class="event-name"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}></input>
              </div>
              <div class="add-event-input">
                <input type="text"
                  placeholder="Event Time From"
                  class="event-time-from"
                  value={eventTimeFrom}
                  onChange={handleEventTimeFrom}></input>
              </div>
              <div class="add-event-input">
                <input type="text"
                  placeholder="Event Time To"
                  class="event-time-to"
                  value={eventTimeTo}
                  onChange={handleEventTimeTo} ></input>
              </div>
            </div>
            <div class="add-event-footer">
              <button class="add-event-btn" onClick={handleAddEvent}>Add Event</button>
            </div>
          </div>
          <button class="add-event" onClick={toggleAddEvent}>
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
    </body>
  );
}
export default Calender;