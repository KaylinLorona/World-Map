import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  fetchCountryData(countryId: string) {
    let api = `https://api.worldbank.org/v2/country/${countryId}?format=json`;
    return this.http.get(api);
  }

  setCountryData(countryId: string) {
    let subject = new Subject();

    this.fetchCountryData(countryId).subscribe((data: any) => {
      const countryData = data[1];
      subject.next({
        country: countryData[0].name,
        capital: countryData[0].capitalCity,
        income: countryData[0].incomeLevel.value,
        region: countryData[0].region.value,
        latitude: countryData[0].latitude,
        longitude: countryData[0].longitude,
      })
    })

    return subject.asObservable();
  }

  private apiUrl = 'https://api.worldbank.org/v2/country/?format=json';

  fetchAllCountries(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const countries: any[] = [];
      let page = 1;
      const perPage = 100; // Adjust the per_page parameter based on the API's limits

      const fetchNextPage = () => {
        const api = `https://api.worldbank.org/v2/country?format=json&page=${page}&per_page=${perPage}`;
        this.http.get(api).subscribe(
          (data: any) => {
            const retrievedCountries = data[1];
            if (retrievedCountries.length > 0) {
              countries.push(...retrievedCountries);
              page++;
              fetchNextPage();
            } else {
              resolve(countries);
            }
          },
          (error: any) => {
            reject(error);
          }
        );
      };

      fetchNextPage();
    });
  }
}


