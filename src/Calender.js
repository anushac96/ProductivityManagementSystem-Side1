import React, { useState, useEffect } from 'react';
import { format, parse, isValid, addHours } from 'date-fns';
import axios from "axios";

function Calender() {
// TODO: when clicked on dates of next/prev month. That date should get selected and show in right
// TODO: once events are deleted, the calander should not show any event sign 
  const [date, setDate] = useState(new Date());
  const [showingMonth, setShowingMonth] = useState(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
  const [months, setMonths] = useState([
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]);

  const [errMsg, setErrMsg] = useState('');

  //const history = useNavigate();

  const [selectedEventIndex, setSelectedEventIndex] = useState(null);
  const eventsContainerRef = React.useRef();

  const [events, setEvents] = useState(() => {
    const storedEvents = window.sessionStorage.getItem("eventsOfPerticularDateStored");
    return storedEvents ? JSON.parse(storedEvents) : [];
  });

  const [eventsArr, setEventsArr] = useState(() => {
    const storedEventsArr = window.sessionStorage.getItem('eventsStored');
    return storedEventsArr ? JSON.parse(storedEventsArr) : events;
  });

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
    //console.log("storing value");
    window.sessionStorage.setItem('eventsStored', JSON.stringify(eventsArr));
    window.sessionStorage.setItem("eventsOfPerticularDateStored", JSON.stringify(events));
  }); // Update the effect to run whenever the date changes

  // useEffect to schedule notifications on component mount
  useEffect(() => {
    // Start scheduling minute notifications
    scheduleMinuteNotifications(eventsArr);
  }, [eventsArr]);

  useEffect(() => {
    const scheduleNotifications = () => {
      const currentTime = new Date();
      
      // Filter events that are 1 hour ahead from the current time
      const upcomingEvents = eventsArr.filter((event) => {
        return event.events.some((e) => {
          const eventTime = parse(e.time.split('-')[0].trim(), 'HH:mm', new Date());
          return eventTime > currentTime && eventTime <= addHours(currentTime, 1);
        });
      });
  
      // Sort the upcoming events by their start time
      upcomingEvents.forEach((event) => {
        event.events.sort((a, b) => {
          const timeA = parse(a.time.split('-')[0].trim(), 'HH:mm', new Date());
          const timeB = parse(b.time.split('-')[0].trim(), 'HH:mm', new Date());
          return timeA - timeB;
        });
      });

      // // Schedule notifications for upcoming events
      // upcomingEvents.forEach((event) => {
      //   event.events.forEach((e) => {
      //     const eventTime = parse(e.time.split('-')[0].trim(), 'HH:mm', new Date());
      //     const timeDiff = eventTime - currentTime;
      //     console.log("event is ",e);
      //     // Schedule notifications only for events happening in the next hour
      //     if (timeDiff > 0 && timeDiff <= 60 * 60 * 1000) { // Changed to check for 1 hour (60 minutes * 60 seconds * 1000 milliseconds)
      //       console.log("notification");
      //       const notification = new Notification('Event Reminder', {
      //         body: `Event "${e.title}" is scheduled in 1 hour.`,
      //       });
  
      //       // Automatically close the notification after 10 seconds
      //       setTimeout(() => {
      //         console.log("notification came");
      //         notification.close();
      //       }, 10000);
      //     }
      //   });
      // });

      // Schedule notifications for upcoming events with a staggered delay
      upcomingEvents.forEach((event, index) => {
        event.events.forEach((e, i) => {
          const eventTime = parse(e.time.split('-')[0].trim(), 'HH:mm', new Date());
          const timeDiff = eventTime - currentTime;
          
          // Stagger the notification timing based on the event index
          const delay = index * 5000; // 5 seconds delay per event
          const notificationTime = new Date(currentTime.getTime() + timeDiff + delay);
  
          // Schedule notifications only for events happening in the next hour
          if (timeDiff > 0 && timeDiff <= 60 * 60 * 1000) {
            setTimeout(() => {
              console.log("Event ",e.title," is scheduled in some time.",new Date());
              const notification = new Notification('Event Reminder', {
                body: `Event "${e.title}" is scheduled in some time.`,
              });
  
              // Automatically close the notification after 10 seconds
              setTimeout(() => {
                notification.close();
              }, 10000);
            }, delay);
          }
        });
      });
  
      // Request permission for notifications
      Notification.requestPermission();
    };
  
    // Schedule notifications on component mount
    scheduleNotifications();
  
    // Cleanup function to clear interval
    const interval = setInterval(() => {
      scheduleNotifications();
    }, 15 * 60 * 1000); // Run every 15 minute
  
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this effect runs only once on component mount   


  useEffect(() => {
    initCalendar();
  }, [date, inputDate, eventsArr, events]); // Update the effect to run whenever the date changes

  function scheduleMinuteNotifications(eventsArr) {
    setInterval(() => {
      // Request permission for notifications
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          // Check for events within the next minute
          const currentTime = new Date();
          const nextMinute = new Date(currentTime.getTime() + 60 * 1000);
  
          const upcomingEvents = eventsArr.filter((event) => {
            return event.events.some((e) => {
              const eventTime = parse(e.time.split('-')[0].trim(), 'HH:mm', new Date());
              return eventTime > currentTime && eventTime <= nextMinute;
            });
          });
  
          console.log("Schedule notifications for upcoming events");
  
          // Schedule notifications for upcoming events
          upcomingEvents.forEach((event) => {
            event.events.forEach((e) => {
              const eventTime = parse(e.time.split('-')[0].trim(), 'HH:mm', new Date());
              const timeDiff = eventTime - currentTime;
              console.log("Scheduled");
              // Request permission for notifications
              if (Notification.permission === 'granted') {
                console.log("permission granted");
                // Create a notification
                const notification = new Notification('Event Reminder', {
                  body: `Event "${e.title}" is scheduled within the next minute.`,
                });
  
                // Automatically close the notification after 10 seconds
                setTimeout(() => {
                  notification.close();
                }, 10000);
              } else {
                console.log("Notification permission not granted");
              }
            });
          });
        } else {
          console.log("Notification permission not granted");
        }
      });
    }, 60 * 1000); // Run every minute
  }  

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
    //console.log("text:", new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()));
    setShowingMonth(new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()));
  }

  function goToNextMonth() {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, date.getDate()));
    //console.log("text:", new Date(date.getFullYear(), date.getMonth() + 1, date.getDate()));
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
        //console.log('Invalid Time From:', inputTime);
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
        //console.log('Invalid Time To:', inputTime);
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
    const leftDay = firstDay.getDay();

    // retain the classes other than active
    // Print all classes of the clicked date
    setTimeout(() => {
      const clickedDateElement = document.querySelector(`.day:nth-child(${index + 1})`);
      const clickedDateClasses = Array.from(clickedDateElement.classList);


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

    // Use the clicked date to update the SelectedDayName
    const newSelectedDayName = getDayName(new Date(date.getFullYear(), date.getMonth(), index - leftDay + 1));
    setSelectedDayName(newSelectedDayName);

    // Use the clicked date to update the SelectedDayIndex
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
      }, 100);

    }
    console.log("events are:", eventsArr);
  }

  function updateEvents(selectedDate) {

    //console.log("events array in updated method: ", eventsArr);
    // Find events for the selected day
    const eventsOnSelectedDay = eventsArr.find(
      (event) =>
        event.day === selectedDate.getDate() &&
        event.month === selectedDate.getMonth() + 1 &&
        event.year === selectedDate.getFullYear()
    );
    //console.log("event are before update: ", events);
    //console.log("eventsOnSelectedDay; ", eventsOnSelectedDay);
    // Set events state with the actual events data
    if (eventsOnSelectedDay) {
      // Sort the events based on their time
      const sortedEvents = eventsOnSelectedDay.events.sort((a, b) => {
        const timeA = parse(a.time.split('-')[0].trim(), 'HH:mm', new Date());
        const timeB = parse(b.time.split('-')[0].trim(), 'HH:mm', new Date());
        return timeA - timeB;
      });
      
      setEvents(sortedEvents);

    } else {
      //console.log("eventsOnSelectedDay is false");
      setEvents([]); // No events for the selected day
    }
  }
  // useEffect to perform actions after events is updated
  useEffect(() => {
    //console.log("event are after update: ", events);
  }, [events]);


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
      setEventsArr((prevEventsArr) =>
        prevEventsArr.map((event) =>
          event === existingEventsOnDay
            ? { ...existingEventsOnDay, events: [...existingEventsOnDay.events, newEvent] }
            : event
        )
      );
    } else {
      // Add a new entry for the selected day
      const newEntry = {
        day: selectedDayIndex.getDate(),
        month: selectedDayIndex.getMonth() + 1,
        year: selectedDayIndex.getFullYear(),
        events: [newEvent],
      };

      //console.log("newEntry: ", newEntry);
      // Update the state and call the function to update events based on the selected date
      setEventsArr(prevEventsArr => [...prevEventsArr, newEntry]);
    }
    addEvent(localStorage.getItem("userId"),eventName, eventTimeFrom, eventTimeTo);
    // Close the add-event-wrapper
    toggleAddEvent();
  };

  // useEffect to perform actions after eventsArr is updated
  useEffect(() => {
    //console.log("events array after submit: ", eventsArr);
    //console.log("selectedDayIndex: ", selectedDayIndex);
    // Additional actions or side effects can be performed here
    updateEvents(selectedDayIndex); // Call updateEvents after updating state

    //addEvent(localStorage.getItem("userId"),eventName, eventDate, eventTime);
    // Update localStorage
    window.sessionStorage.setItem('eventsStored', JSON.stringify(eventsArr));
    window.sessionStorage.setItem("eventsOfPerticularDateStored", JSON.stringify(events));
  }, [eventsArr]);

  // Modify the frontend code to send requests to the new endpoints for managing events
// Include user authentication tokens in requests to authenticate users and associate events with their accounts
// Example using fetch API:

const addEvent = async ( userId, eventName, eventTimeFrom, eventTimeTo) => {
  //e.preventDefault();
  try {
    const startTime = format(parse(eventTimeFrom, 'h:mm a', new Date(selectedDayIndex.getFullYear(), selectedDayIndex.getMonth(), selectedDayIndex.getDate())), 'yyyy-MM-dd HH:mm:ss');
const endTime = format(parse(eventTimeTo, 'h:mm a', new Date(selectedDayIndex.getFullYear(), selectedDayIndex.getMonth(), selectedDayIndex.getDate())), 'yyyy-MM-dd HH:mm:ss');

    console.log("startTime ",startTime);
    console.log("endTime: ",endTime);
      const response = await axios.post('http://localhost:3001/addEvents', { userId, eventName, startTime, endTime })
      console.log(response);
  } catch (error) {
      console.error("Error:", error.response.data.message);
      setErrMsg(error.response.data.message);
  }
}

// Update other CRUD operations for events in a similar manner

  const handleEventClick = (index) => {
    // Remove the clicked event from the events array
    const updatedEventsArr = eventsArr.map((event) => {
      if (
        event.day === selectedDayIndex.getDate() &&
        event.month === selectedDayIndex.getMonth() + 1 &&
        event.year === selectedDayIndex.getFullYear()
      ) {
        // Remove the selected event from the events array
        event.events = event.events.filter((_, i) => i !== index);
      }
      return event;
    });

    // Update the state with the modified events array
    setEventsArr(updatedEventsArr);
  };

  // useEffect to perform actions after eventsArr is updated
  useEffect(() => {
    //console.log("events array after submit: ", eventsArr);
    //console.log("selectedDayIndex: ", selectedDayIndex);
    // Additional actions or side effects can be performed here
    updateEvents(selectedDayIndex); // Call updateEvents after updating state

    // Update localStorage
    window.sessionStorage.setItem('eventsStored', JSON.stringify(eventsArr));
    window.sessionStorage.setItem("eventsOfPerticularDateStored", JSON.stringify(events));
  }, [eventsArr]);

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
          <div ref={eventsContainerRef} class="events">
            {events.length > 0 ? (
              events.map((event, index) => (
                <div
                  key={index}
                  class={`event ${selectedEventIndex === index ? 'selected' : ''}`}
                  onClick={() => handleEventClick(index)}
                >
                  <div class="title">
                    <i class="fas fa-circle"></i>
                    <h3 class="event-title">{event.title}</h3>
                  </div>
                  <div class="event-time">
                    <span class="event-time">{event.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div class="no-event">
                <h3>No Events</h3>
              </div>
            )}
          </div>
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