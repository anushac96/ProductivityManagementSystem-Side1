import React, { useState, useEffect } from 'react';
import { format, parse, isValid } from 'date-fns';

function Calender() {

  const [date, setDate] = useState(new Date());
  const [showingMonth, setShowingMonth] = useState(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
  const [months, setMonths] = useState([
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]);
  const [events, setEvents] = useState([]);
  const eventsContainerRef = React.useRef();
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
    {
      day: 19,
      month: 1,
      year: 2024,
      events: [
        {
          title: "Event 1 bla bla bla dolar sit genfa tersd dsad ",
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
  // Add a state to keep track of the selected day index
  const [selectedDayIndex, setSelectedDayIndex] = useState(new Date(date.getFullYear(), date.getMonth(), date.getDate()));


  // Function to get the day name from a date
  const getDayName = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    //console.log("date=======", date);
    return days[date.getDay()];
  };

  const [selectedDayName, setSelectedDayName] = useState(getDayName(new Date(date.getFullYear(), date.getMonth(), date.getDate())));

  const month = date.getMonth();
  const year = date.getFullYear();

  useEffect(() => {
    initCalendar();
  }, [date, inputDate]); // Update the effect to run whenever the date changes

  function initCalendar() {

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

      if (currentDay.isToday) {
        if (eventsOnCurrentDay) {
          currentDay.hasEvents = true;
          currentDay.className = 'day today active event';
        } else
          currentDay.className = 'today active';
      }
      else {
        if (eventsOnCurrentDay) {
          currentDay.hasEvents = true;
          currentDay.className = 'day event';
        } else
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
    console.log("text:", new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()));
    setShowingMonth(new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()));
  }

  function goToNextMonth() {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, date.getDate()));
    console.log("text:", new Date(date.getFullYear(), date.getMonth() + 1, date.getDate()));
    setShowingMonth(new Date(date.getFullYear(), date.getMonth() + 1, date.getDate()));
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

  function handleDayClick(day, index) {
    const currDate = new Date();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const leftDay = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;

    console.log("todays date: ", currDate.getMonth());
    // retain the classes other than active
    // Print all classes of the clicked date
    setTimeout(() => {
      const clickedDateElement = document.querySelector(`.day:nth-child(${index + 1})`);
      const clickedDateClasses = Array.from(clickedDateElement.classList);
      console.log('Clicked Date Classes:', clickedDateClasses);

      // Update the state to mark the selected day as active
      const updatedDays = days.map((d, i) => {
        if (i === index) {
          return { ...d, className: ['active', ...clickedDateClasses].join(' ') };
        } else {
          return d;
        }
      });

      setDays(updatedDays);

      // Remove the 'active' class from other days after a short delay
      const updatedDaysAfterDelay = updatedDays.map((d, i) => {
        if (i !== index) {
          // Use a regular expression to replace only the 'active' class
          const updatedClass = d.className.replace(/\bactive\b/g, '');
          return { ...d, className: updatedClass };
        } else {
          return d;
        }
      });

      setDays(updatedDaysAfterDelay);

      setTimeout(() => {
        clickedDateElement.classList.add(...clickedDateClasses.filter(cls => cls !== 'active'));
      }, 0);

    }, 100);

    console.log("showingMonth.getMonth(): ", showingMonth.getMonth());
    console.log("date.getMonth():", date.getMonth());



    // Use the clicked date to update the SelectedDayName
    const newSelectedDayName = getDayName(new Date(date.getFullYear(), date.getMonth(), index - leftDay + 1));
    setSelectedDayName(newSelectedDayName);

    // Use the clicked date to update the SelectedDayName
    const newSelectedDayIndex = new Date(date.getFullYear(), date.getMonth(), index - leftDay + 1);
    setSelectedDayIndex(newSelectedDayIndex);

    // Call the function to update events based on the selected date
    updateEvents(newSelectedDayIndex);

    if (days[index].className === 'prev-date' || days[index].className === 'next-date') {
      // Delay changing the month to wait for the 'active' class to be added
      setTimeout(() => {
        if (days[index].className === 'prev-date') {
          goToPreviousMonth();
        } else if (days[index].className === 'next-date') {
          goToNextMonth();
        }

        // Find the index of the clicked day in the updated month
        const clickedDayIndexInUpdatedMonth = days.findIndex(
          (d) => d.value === day && !d.className.includes('prev-date') && !d.className.includes('next-date')
        );

        // Add 'active' class to the clicked day after the month is changed
        const updatedDaysAfterMonthChange = days.map((d, i) => {
          if (i === clickedDayIndexInUpdatedMonth) {
            return { ...d, className: 'active' };
          } else {
            return d;
          }
        });

        setDays(updatedDaysAfterMonthChange);

        // TODO: when clicked on dates of next/prev month. That date should get selected and show in right
      }, 100);
    }
  }

  const handleAddEvent = () => {
    // Do something with the event details (eventName, eventTimeFrom, eventTimeTo)
    // For now, let's just log them
    console.log('Event Name:', eventName);
    console.log('Event Time From:', eventTimeFrom);
    console.log('Event Time To:', eventTimeTo);

    // Close the add-event-wrapper
    setAddEventActive(false);
  };

  function updateEvents(selectedDate) {
    let eventsHtml = '';
    // Find events for the selected day
    const eventsOnSelectedDay = eventsArr.find(event =>
      event.day === selectedDate.getDate() &&
      event.month === selectedDate.getMonth() + 1 &&
      event.year === selectedDate.getFullYear()
    );

    if (eventsOnSelectedDay) {
      // Show events on the document
      eventsOnSelectedDay.events.forEach((event) => {
        eventsHtml += `<div class="event">
          <div class="title">
            <i class="fas fa-circle"></i>
            <h3 class="event-title">${event.title}</h3>
          </div>
          <div class="event-time">
            <span class="event-time">${event.time}</span>
          </div>
        </div>`;
      });
    } else {
      eventsHtml = `<div class="no-event">
        <h3>No Events</h3>
      </div>`;
    }

    setEvents(eventsHtml);
    // Update the events container using the ref
    eventsContainerRef.current.innerHTML = eventsHtml;
  }

  const handleAddEventSubmit = () => {
    if (!eventName || !eventTimeFrom || !eventTimeTo) {
      alert("Please fill in all fields");
      return;
    }

    // Convert time to 24-hour format
    const timeFrom = format(parse(eventTimeFrom, 'h:mm a', new Date()), 'HH:mm');
    const timeTo = format(parse(eventTimeTo, 'h:mm a', new Date()), 'HH:mm');

    // Check if the event is already added
    const eventExist = eventsArr.some(event =>
      event.day === selectedDayIndex.getDate() &&
      event.month === selectedDayIndex.getMonth() + 1 &&
      event.year === selectedDayIndex.getFullYear() &&
      event.events.some(e => e.title === eventName)
    );

    if (eventExist) {
      alert("Event already added");
      return;
    }

    // Create a new event object
    const newEvent = {
      title: eventName,
      time: `${timeFrom} - ${timeTo}`,
    };

    // Check if there are events on the selected day
    const existingEventsOnDay = eventsArr.find(event =>
      event.day === selectedDayIndex.getDate() &&
      event.month === selectedDayIndex.getMonth() + 1 &&
      event.year === selectedDayIndex.getFullYear()
    );

    if (existingEventsOnDay) {
      // Update existing events on the selected day
      existingEventsOnDay.events.push(newEvent);
    } else {
      // Add a new entry for the selected day
      eventsArr.push({
        day: selectedDayIndex.getDate(),
        month: selectedDayIndex.getMonth() + 1,
        year: selectedDayIndex.getFullYear(),
        events: [newEvent],
      });
    }

    // Update events being displayed
    updateEvents(selectedDayIndex);

    // Close the add-event-wrapper
    toggleAddEvent();
  };

  return (
    <body>
      <div class="container">
        <div class="left">
          <div class="calendar">
            <div class="month">
              <i class="fa fa-angle-left prev" onClick={goToPreviousMonth}></i>
              <div class="date"></div>
              <i class="fa fa-angle-right next" onClick={goToNextMonth}></i>
            </div>
            <div class="weekdays">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            <div class="days">
              {days.map((day, index) => (
                <div key={index} className={`day ${day.className}`} onClick={() => handleDayClick(day, index)}>
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
            <div class="event-day">{selectedDayName}</div>
            <div class="event-date">{format(selectedDayIndex, 'dd MMMM yyyy')}</div>
          </div>
          <div ref={eventsContainerRef} class="events"></div>
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
              <button class="add-event-btn" onClick={handleAddEventSubmit}>Add Event</button>
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