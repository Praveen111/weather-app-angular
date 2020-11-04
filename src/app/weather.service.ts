import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
  import { map } from 'rxjs/operators';


@Injectable()

export class WeatherService {

    constructor(private _http: HttpClient) {}

    getPlaceInfo(places_string) {

        const value = encodeURI(places_string);
return this._http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${value}i&key=AIzaSyCQQLKfJochnUngKqY_DaEBjC0RWCzXajg`)
        .pipe(map((rsp:any) => {
             return rsp.results[0];
          }));

    }

    getWeatherDetails(lat, lng) {
        return this._http.get(`https://api.darksky.net/forecast/ad2c5ed08f31fdad444a47e0de28f13a/${lat},${lng}`)
                         .pipe(map((response: Response) => {
                              return response;
                         }));
    }

    getData(name) {
        const value = encodeURI(name);
        let lat;
        let lng;


return this._http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=AIzaSyCQQLKfJochnUngKqY_DaEBjC0RWCzXajg`).pipe(
                               map((res:any) => {
                                    if (res.status !== 'ZERO_RESULTS') {
                                        lat = res.results[0].geometry.location.lat;
                                        lng = res.results[0].geometry.location.lng;
                                        const obj = {
                                            lat : lat,
                                            lng: lng
                                        };
                                        return obj;
                                    } else {
                                        return null;
                                    }

                                        }));

    }

}
