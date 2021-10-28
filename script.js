const cards = document.querySelector('.cards');
const darkLightModeBtn = document.querySelector(".dark-lightMode")
const darkLightModeText = document.querySelector(".dark-lightMode h4")
const body = document.querySelector("body")
const filter = document.querySelector(".filter")
const dropDown = document.querySelector(".drop-down")
const dropDownLi = document.querySelectorAll(".drop-down li")
const search = document.querySelector(".search")
const modal = document.querySelector(".modal")
const closeModalBtn = document.querySelector("button")

// country-continent
dropDownLi.forEach(continentSearch => {
    continentSearch.addEventListener('click', () => {
        const value = continentSearch.innerText;
        const countryContinent = document.querySelectorAll(".country-continent")
        countryContinent.forEach(continent => {
        if ( continent.innerText.includes(value) || value === "All") {
            continent.parentElement.parentElement.parentElement.style.display = "block"
        } else {
            continent.parentElement.parentElement.parentElement.style.display = "none"
            }
        })
        dropDown.classList.remove('active')
    })
})

// Drop-down on/off
filter.addEventListener('click', (e) => {
    const clicked = e.target.closest('.filter')
    if(filter === clicked) {
        dropDown.classList.toggle('active')
    }
})

// Search
let eTargetValue;
function fetchListOfProducts() {
        const { value } = eTargetValue
        const countryName = document.querySelectorAll(".country-name")
    
        countryName.forEach(name => {
    
            if ( name.innerText.toLowerCase().includes(value.toLowerCase())) {
                name.parentElement.parentElement.style.display = "block"
            } else {
                name.parentElement.parentElement.style.display = "none"
            }
    })
}
  
  const debounce = (fn, delay) => {
    let timer;
  
    return arguments => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, arguments);
      }, delay);
    };
  };
  
  const debounceProductSearchCall = debounce(fetchListOfProducts, 300);

  search.addEventListener('input', (e) => {
    eTargetValue = e.target
    debounceProductSearchCall
  })


// Dark-Light Mode
darkLightModeBtn.addEventListener('click', (e) => {
    const clicked = e.target.closest('.dark-lightMode')
    if(darkLightModeBtn === clicked) {
        if (darkLightModeText.innerText === "Light Mode") {
            body.classList.remove('dark')
            darkLightModeText.innerText = "Dark Mode"
        } else {
            body.classList.add('dark')
            darkLightModeText.innerText = "Light Mode"
        }

    }
})

// Api
let countriesArray = [];

function displayCountries() {
    countriesArray.forEach((country) => {

        //created card
        const population = country.population.toLocaleString("en-US")
        const textHTML = document.createElement('div');
        textHTML.classList.add('card');
        textHTML.innerHTML = `
        <div class="img-flag">
        <img src="${country.flags.png}" alt="No Flag in Data">
    </div>
    <div class="card-text">
        <h3 class="country-name">${country.name.common ? country.name.common : "no info"}</h3>
        <div>
            <h5>Population: &nbsp;</h5>
            <p>${country.population ? population : "no info"}</p>
        </div>
        <div>
            <h5>Region: &nbsp;</h5>
            <p class="country-continent">${country.continents[0] ? country.continents[0] : "no info"}</p>
        </div>
        <div>
            <h5>Capital: &nbsp;</h5>
            <p>${country.capital ? country.capital : "no info"}</p>
        </div>
    </div>   
    `

    // Modal
    textHTML.addEventListener('click', () => {
        modal.style.display = 'flex'
        body.style.position = 'fixed'
        showCountryDetails(country)
    })

    // card add to cards class
    cards.appendChild(textHTML)
    })
}

// created modal
function showCountryDetails(country) {
    const population = country.population.toLocaleString("en-US")

    let borders;
    if (country.borders) {
    let bordersArray = country.borders
    borders = bordersArray.join('</p> <p>');
    }

    const languages = country.languages;
    let languagesArr = []
    for( const key in languages){
          languagesArr.push(languages[key])
          
    }
    const language = languagesArr.join(', ');


    const currencies = country.currencies
    const currency = Object.values(currencies)[0].name

    const nativeNames = country.name.nativeName
    const nativeName = Object.values(nativeNames)[0].common

    modal.querySelector('.modal-main').innerHTML = `
                <section class="img-modal">
                    <img src="${country.flags.png}" alt="img-modal">
                </section>
                <section class="right-side">
                    <h2>${country.name.common ? country.name.common : "no info"}</h2>
                    <div class="right-side-text">
                        <section>
                            <div>
                                <h5>Native Name: &nbsp;</h5>
                                <p>${nativeName ? nativeName : "no info"}</p>
                            </div>
                            <div>
                                <h5>Population: &nbsp;</h5>
                                <p>${country.population ? population : "no info"}</p>
                            </div>
                            <div>
                                <h5>Region: &nbsp;</h5>
                                <p>${country.continents[0] ? country.continents[0] : "no info"}</p>
                            </div>
                            <div>
                                <h5>Sub Region: &nbsp;</h5>
                                <p>${country.subregion ? country.subregion : "no info"}</p>
                            </div>
                            <div>
                                <h5>Capital: &nbsp;</h5>
                                <p>${country.capital ? country.capital : "no info"}</p>
                            </div>
                        </section>
                        <section>
                            <div>
                                <h5>Top Level Domain: &nbsp;</h5>
                                <p>${country.tld ? country.tld : "no info"}</p>
                            </div>
                            <div>
                                <h5>Currencies: &nbsp;</h5>
                                <p>${currency ? currency : "no info"}</p>
                            </div>
                            <div>
                                <h5>Languages: &nbsp;</h5>
                                <p>${language ? language : "no info"}</p>
                            </div>
                        </section>
                    </div>
                    <div class="right-side-bottom">
                        <h5>Border Countries: &nbsp;</h5>
                        <div class="right-side-bottom-borders">
                        <p>${borders ? borders : "no info"} </p>
                        </div>
                    </div>
                </section>
    `
}

// close Modal
closeModalBtn.addEventListener('click', (e) => {
    modal.style.display = 'none'
    body.style.position = 'static'
})

async function getCountries() {
        try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            countriesArray = await response.json();
        
            displayCountries()
        }   catch (error) {
    }
}

getCountries()