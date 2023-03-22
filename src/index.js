import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const DEBOUNCE_DELAY = 300;

const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const clearCountries = data => (data.innerHTML = ''); //Czyszczenie listy państw/ informacji o państwie

const inputHandler = () => {
  const textInput = searchInput.value.trim();
  console.log(textInput);

  fetchCountries(textInput) //zbieranie value z input
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        //jeżeli zostanie znalezione powyżej 10 państw wtedy wyświetla się komunikat:
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
      }
      renderCountriesData(data); //tworzenie listy z danych na podstawie aktualnego textInput
    })
    .catch(error => {
      console.log(error);
      clearCountries(countryList);
      clearCountries(countryInfo);
      Notify.failure('Oops, there is no country with that name');
    });
};

const renderCountriesData = data => {
  if (data.length === 1) {
    //jeśli znajdzie się tylko jedno dopasowanie to tworzy cuntryInfo i czyści countryList
    clearCountries(countryList);
    createCountryInfo(data);
  } else {
    //jeśli znajdzie się więcej (niż 1) dopasowań to tworzy cuntryList i czyści countryInfo
    clearCountries(countryInfo);
    createCountryList(data);
  }
};

function createCountryInfo(countries) {
  //tworzenie informacji o jednym państwie
  const markup = countries
    .map(country => {
      return `
       <h2>
       <img src="${country.flags.svg}" alt = "Flag of ${
        country.name.official
      } " width = "100" />
      ${country.name.official}
      </h2>
        <p><b>Capital</b>: ${country.capital}</p>
        <p><b>Population</b>: ${country.population}</p>
       
          <p><b>Languages</b>: ${Object.values(country.languages)} </p>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
}

function createCountryList(countries) {
  //tworzenie listy państw
  const markup = countries
    .map(country => {
      return `<li><img class = "countries_img"src="${country.flags.svg}" alt = "Flag of ${country.name.official} " width = "20" </p>${country.name.official}<li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}
searchInput.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY)); //zdarzenie input z funkcją inputHandler i opóźnieniem debounce - 300ms
