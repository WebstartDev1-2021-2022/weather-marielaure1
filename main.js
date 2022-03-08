const apiKey = "77a59e5a2e6b714cd3f846b45a86a0d4"

const nowIcon = document.querySelector(".now-icon")
const nowDescription = document.querySelector(".description")
const nowTemperature = document.querySelector(".temperature")
const hour = document.querySelectorAll(".hour")
const day = document.querySelectorAll(".day")
const city = document.querySelector("h2")
const background = document.querySelector(".bg-fixed")
const chargement = document.querySelector(".chargement")
const now = document.querySelector(".now")
const hours_days = document.querySelector(".hours-days")
const body = document.querySelector("body")
let nowDay =  new Date().getDay()

// TODO: Récupérer les éléments  du DOM dans des constantes

// Traiter les erreurs de navigator.geolocation.getCurrentPosition
const handleGetCurrentPositionError = (error) => {
    alert("Votre géolocalisation ne fonctionne pas, vérifiez vos paramètres.")
}

// Requête fetch

const getWeatherOf = async (position) => {
    try{
        // let lat = position.coords.latitude;
        // let lon = position.coords.longitude;

        const {latitude, longitude} = position.coords

        const allPromise = Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=metric&lang=fr&appid=${apiKey}`),
            fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${longitude}&lat=${latitude}`)
        ])

        const [weatherResult, cityResult] = await allPromise   // Destructuration
        const weatherData = await weatherResult.json()
        const cityData = await cityResult.json()
        
        // API Open weather map
        updateUI(weatherData)

        // Ville de l'utilisateur avec l'API https://adresse.data.gouv.fr/api-doc/adresse#reverse
        updateUI(cityData)   

        // Disparition du chargement de la page
        chargement.style.display = "none";
        now.style.display = "block";
        hours_days.style.display = "block";


        // Changement du background selon la nuit et le jour
        const sr = new Date(weatherData.current.sunrise * 1000)  // dt temps en timestamp Unix = tps en ms depuis janvier 1970 = pour convertir faire *1000
        const ss = new Date(weatherData.current.sunset * 1000)
        let current_dt = new Date(weatherData.current.dt * 1000)

        if (sr <= current_dt && current_dt < ss ){
            background.style.backgroundImage = `url("./img/jour.jpg")`
            
        } else{
            background.style.backgroundImage = `url("./img/soir.jpeg")`
        }


        // NOW : heure actuelle
        city.innerText= `${cityData.features[0].properties.city}`
        nowIcon.src = `img/${weatherData.current.weather[0].icon}.svg`
        nowDescription.innerText= `${weatherData.current.weather[0].description}`
        nowTemperature.innerText= `${Math.trunc(weatherData.current.temp)}°`


        // HOURS : 24h
        for(let i = 0; i < 24; i++){

            hour[i].innerHTML = `<p class="hour-text">${new Date(weatherData.hourly[i].dt * 1000).getHours()}h</p>
                                 <img class="hour-icon" src="img/${weatherData.hourly[i].weather[0].icon}.svg" alt="img temps">
                                 <p class="hour-temperature">${Math.trunc(weatherData.hourly[i].temp)}°</p>`
        }
        

        // DAYS : 
        let week = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
        console.log(new Date().getDay())
        for(let k = 0; k < week.length; k++){

            // if (k > week.length) {
            //     k = 0
            // }

            let daily_dt = new Date(weatherData.daily[k].dt * 1000).getDay()
            

            day[k].innerHTML = `<p class="day-text">${week[daily_dt]}</p>
                                <img class="day-icon" src="img/${weatherData.daily[k].weather[0].icon}.svg" alt="img temps">
                                <p class="day-temperature">Min : ${Math.trunc(weatherData.daily[k].temp.min)}°</p>
                                <p class="day-temperature">Max : ${Math.trunc(weatherData.daily[k].temp.max)}°</p>`
        }
        

    } catch(error){
        console.error('Erreur dans le getWeatheerOf() ~>', error)
    }
}

const updateUI = (data) => {
    console.log(data)
    // const newContent = template.content.cloneNode
}


// Récupérer la géolocalisation de l'utilisateur et faire la requête à l'API
navigator.geolocation.getCurrentPosition( 
    getWeatherOf, 
    (error) => console.log('getCurrentPosition error ~>', error), 
    {timeout: 1000}
)


