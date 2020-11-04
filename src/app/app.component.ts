import {
  Component,
  OnInit,
  HostListener
} from '@angular/core';
import dataSource from './data/datasource';
import {
  WeatherService
} from './weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // places : some of the default places
  places = ['Bengaluru', 'Mumbai', 'Chennai', 'Kolkata', 'Delhi', 'London', 'California', 'Tokyo', 'New York'];

  place: string;
  // lat,long : used to save latitude and longitude from google maps api
  lat: number;
  long: number;

  // current : holds current weather data
  current: object;
  // hourly : holds upcoming hours data
  hourly: object;
  // weekly :  holds overall weekly data
  weekly: object;
  isDegree: boolean = false;

  // below variables are initialization to the fusion chart used in the app.component.html
  id = 'chart1';
  width = '90%';
  height = 400;
  type = 'line';
  dataFormat = 'json';
  dataSource;
  innerWidth: number;



  // below HostListener gets Window:resize event and adjusts the innerwidth of the fusion chart

  @HostListener('window:resize', ['$event']) onResize(event) {
    this.innerWidth = window.innerWidth;
  
  }

  constructor(private _weatherService: WeatherService) {}

  ngOnInit() {

    this.innerWidth = window.innerWidth;
    this.dataSource = dataSource;

  }

  // this function returns proper CSS class to be applied to the weather icons
  getIcon(iconvalue) {

    switch (iconvalue) {
      case 'wind':
        return 'wi-day-rain';
      case 'rain':
        return 'wi-day-cloudy-windy';
      case 'partly-cloudy-day':
        return 'wi-day-cloudy';
      case 'partly-cloudy-night':
        return 'wi-night-cloudy';
      case 'cloudy':
        return 'wi-day-cloudy';
      case 'clear-day':
        return 'wi-day-sunny';
      case 'clear-night':
        return 'wi-night-clear';
    }

  }

  // this returns AM or PM string based on hour value
  getValue(hour) {
    if (hour < 12 || hour === 0) {
      return 'AM';
    } else {
      return 'PM';
    }
  }


  // convertData - this function converts Degree to farenheit or vice versa
  convertData() {
    const oldData = this.dataSource.data;
    this.dataSource.data = [];
    const weatherData = [];

    if (!this.isDegree) {

      oldData.forEach(e => {
        const newdata = {
          'label': e.label,
          'value': ((e.value - 32) * .5556).toFixed(0), //  fareheit to celsius conversion
          'stepSkipped': false,
          'appliedSmartLabel': true
        };
        weatherData.push(newdata);
      });
      this.isDegree = true;
    } else {

      oldData.forEach(e => {
        const newdata = {
          'label': e.label,
          'value': ((e.value * 1.8) + 32).toFixed(0), //  Celsius to farenheit conversion
          'stepSkipped': false,
          'appliedSmartLabel': true
        };

        weatherData.push(newdata);

      });
      this.isDegree = false;
    }

    this.dataSource.data = weatherData;

  }



  // GET_WEATHER_DETAILS - gets the weather data once user selects value from select dropdown or enters a place value - START

  getWeatherData(name: string) {
    this.isDegree = false;
    this._weatherService.getData(name).subscribe(result => {
        let data: any = result;
      if (result !== null) {
        this._weatherService.getWeatherDetails(data.lat, data.lng).subscribe(resp => {
         let response : any = resp;
          this.current = response.currently;
          this.weekly = response.daily;
          this.hourly = response.hourly.data;

          this.dataSource.data = [];
          for (let i = 0; i < 10; i++) {
            const t = new Date(1970, 0, 1); // Epoch

            t.setSeconds(this.hourly[i].time);
            // console.log(t.getHours() +':' + t.getMinutes());
            let time;
            if (t.getMinutes() === 0) {
              time = t.getHours() + ':' + '00' + this.getValue(t.getHours());
              this.getValue(t.getHours());
            } else {
              time = t.getHours() + ':' + t.getMinutes() + this.getValue(t.getHours());

            }
            const data = {
              'label': time,
              'value': this.hourly[i].temperature, // in fareheit
              'stepSkipped': false,
              'appliedSmartLabel': true
            };
            // this.loader.nativeElement.style.display = 'none';
            this.dataSource.data.push(data);

          }
        });
      } else {
        console.log('Zero Results');
      }
    });
  }
}
