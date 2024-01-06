import './App.css';
import Timer from './Timer';
import Settings from './Settings';
import { useState } from 'react';
import SettingsContext from './SettingsContext';

function App() {

  const [showSettings, setShowSettings] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5)
  return (
    <><main>
      <SettingsContext.Provider value={{
        showSettings,
        setShowSettings,
        workMinutes,
        breakMinutes,
        setWorkMinutes,
        setBreakMinutes,
      }}>
        {showSettings ? <Settings /> : <Timer />}
      </SettingsContext.Provider>
    </main>

    <calendar>
    <div class="container">
      <div class="left">
        <div class="calendarTag">
          <div class="month">
            <i class="fas fa-angle-left prev"></i>
            <div class="date">January 2024</div>
            <i class="fas fa-angle-right next"></i>
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
          <div class='days'>
          <div class='day'>31</div>
          <div class='day'>1</div>
          <div class='day'>2</div>
          <div class='day'>3</div>
          <div class='day'>4</div>
          <div class='day'>5</div>
          <div class='day'>6</div>
          <div class='day'>7</div>
          <div class='day'>8</div>
          <div class='day'>9</div>
          <div class='day'>10</div>
          <div class='day'>11</div>
          <div class='day'>12</div>
          <div class='day'>13</div>
          <div class='day'>14</div>
          <div class='day'>15</div>
          <div class='day'>16</div>
          <div class='day'>17</div>
          <div class='day'>18</div>
          <div class='day'>19</div>
          <div class='day'>20</div>
          <div class='day'>21</div>
          <div class='day'>22</div>
          <div class='day'>23</div>
          <div class='day'>24</div>
          <div class='day'>25</div>
          <div class='day'>26</div>
          <div class='day'>27</div>
          <div class='day'>28</div>
          <div class='day'>29</div>
          <div class='day'>30</div>
          <div class='day'>31</div>
          <div class='day'>1</div>
          <div class='day'>2</div>
          <div class='day'>3</div>
          <div class='day'>4</div>
          <div class='day'>5</div>
          <div class='day'>6</div>
          <div class='day'>7</div>
          <div class='day'>8</div>
          <div class='day'>9</div>
          <div class='day'>10</div>
          </div>
        </div>
      </div>
    </div>
    </calendar></>
  );
}

export default App;
