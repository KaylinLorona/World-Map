import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { count } from 'rxjs';

@Component({
  selector: 'app-svg-map',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './svg-map.component.html',
  styleUrl: './svg-map.component.scss'
})
export class SvgMapComponent {

  countryInfo: any = {};
  countries: any[] = [];
  searchQuery: string = '';

  constructor (private apiService: ApiService) {
    this.fetchCountries();
  }

  setCountryData(event: any) {
    this.apiService.setCountryData(event.target.id).subscribe((data: any) => {
      this.countryInfo = {
        ...data
      }
    })
  }

fetchCountries(): void {
  this.apiService.fetchAllCountries().then((data: any[]) => {
    console.log('Fetched Data:', data);
    this.countries = data;
    console.log(this.countries)
    },
    (error: any) => {
      console.error('Error fetching countries:', error);
    }
  );
}

searchCountryId(): void {
  const countryId = this.getCountryIdByName(this.searchQuery);
  console.log('Country ID:', countryId);

  if (countryId !== 'Not Found' && countryId !== undefined) {
    this.apiService.setCountryData(countryId).subscribe((data: any) => {
      this.countryInfo = { ...data };
      console.log('Country Info:', this.countryInfo);
    });
  } else {
    console.error('Country ID not found or undefined.');
  }

  this.apiService.setCountryData(countryId).subscribe((data: any) => {
    this.countryInfo = { ...data };
    console.log('Country Info:', this.countryInfo);
  });
}

getCountryIdByName(countryName: string): string {
  const country = this.countries.find((c) => c.name === countryName);
  return country ? country.id : 'Not Found'; 
}

}
