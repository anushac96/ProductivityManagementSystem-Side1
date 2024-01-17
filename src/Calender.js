function Calender(){
  return(
    <body>
      <div class = "container">
        <div class = "left">
          <div class = "calendar">
            <div class = "month">
              <i class = "fa fa-angle-left prev"></i>
              <div class = "date">January 2024</div>
              <i class = "fa fa-angle-right next"></i>
            </div>
            <div class = "weekdays">
              <div>sun</div>
              <div>mon</div>
              <div>tue</div>
              <div>wed</div>
              <div>thrus</div>
              <div>fri</div>
              <div>sat</div>
            </div>
            <div class = "days">
              <div class = "day prev-date">31</div>
              <div class = "day">1</div>
              <div class = "day">2</div>
              <div class = "day">3</div>
              <div class = "day">4</div>
              <div class = "day">5</div>
              <div class = "day">6</div>
              <div class = "day">7</div>
              <div class = "day">8</div>
              <div class = "day">9</div>
              <div class = "day event">10</div>
              <div class = "day">11</div>
              <div class = "day">12</div>
              <div class = "day">13</div>
              <div class = "day event active">14</div>
              <div class = "day today">15</div>
              <div class = "day">16</div>
              <div class = "day">17</div>
              <div class = "day">18</div>
              <div class = "day">19</div>
              <div class = "day">20</div>
              <div class = "day event">21</div>
              <div class = "day">22</div>
              <div class = "day">23</div>
              <div class = "day">24</div>
              <div class = "day">25</div>
              <div class = "day">26</div>
              <div class = "day">27</div>
              <div class = "day">28</div>
              <div class = "day">29</div>
              <div class = "day">30</div>
              <div class = "day">31</div>
              <div class = "day next-date">1</div>
              <div class = "day next-date">2</div>
              <div class = "day next-date">3</div>
              <div class = "day next-date">4</div>
              <div class = "day next-date">5</div>
              <div class = "day next-date">6</div>
              <div class = "day next-date">7</div>
              <div class = "day next-date">8</div>
              <div class = "day next-date">9</div>
              <div class = "day next-date">10</div>
            </div>
            <div class = "goto-today">
              <div class = "goto">
                <input type ="text" placeholder="mm/yyyy" class = "date-input"></input>
                <button class = "goto-btn">go</button>
              </div>
              <button class = "today-btn">today</button>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
}
export default Calender;