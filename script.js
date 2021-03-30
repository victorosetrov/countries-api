"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

const renderCountry = function (data, className = "") {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} people</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
  `;
  countriesContainer.insertAdjacentHTML("beforeend", html);
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText("beforeend", msg);
};

// const getCountryDataAndNeighbour = function (country) {
//   const request = new XMLHttpRequest();
//   request.open("GET", `https://restcountries.eu/rest/v2/name/${country}`);
//   request.send();
//   request.addEventListener("load", function () {
//     const data = JSON.parse(this.responseText);
//     console.log(data);
//     renderCountry(data);

//     //     const html = `
//     //     <article class="country">
//     //     <img class="country__img" src="${data.flag}" />
//     //       <div class="country__data">
//     //         <h3 class="country__name">${data.name}</h3>
//     //         <h4 class="country__region">${data.region}</h4>
//     //         <p class="country__row"><span>👫</span>${(
//     //           +data.population / 1000000
//     //         ).toFixed(1)}</p>
//     //         <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
//     //         <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
//     //       </div>
//     //   </article>
//     // `;
//     //     countriesContainer.insertAdjacentHTML("beforeend", html);
//     //     countriesContainer.getElementsByClassName.opacity = 1;
//   });
// };

// getCountryDataAndNeighbour("ireland");

// const request = new XMLHttpRequest();
// request.open("GET", `https://restcountries.eu/rest/v2/name/${country}`);
// request.send();

// const request = fetch("https://restcountries.eu/rest/v2/name/portugal");
// console.log(request);

const getJSON = function (url, errorMsg = "Something went wrong") {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`(${errorMsg})(${response.status})`);
    return response.json();
  });
};

const getCountryData = function (country) {
  getJSON(
    `https://restcountries.eu/rest/v2/name/${country}`,
    "Country not found"
  )
    .then((data) => {
      renderCountry(data[0]);
      const neighbour = data[0].borders[0];
      if (!neighbour) throw new Error("No neighbour found");
      return getJSON(
        `https://restcountries.eu/rest/v2/alpha/${neighbour}`,
        "Country not found"
      );
    })
    .then((data) => renderCountry(data, "neighbour"))
    .catch((err) => {
      renderError(`Something went wrong 🤪 ${err.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener("click", function () {
  getCountryData("Uzbekistan");
});
