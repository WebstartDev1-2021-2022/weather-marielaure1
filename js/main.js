const apiKey = "77a59e5a2e6b714cd3f846b45a86a0d4"

const template = document.querySelector("template")
const main = document.querySelector("main")
const chargement = document.querySelector(".chargement")

// Traiter les erreurs de navigator.geolocation.getCurrentPosition
// const handleGetCurrentPositionError = (error) => {
//     alert("Votre géolocalisation ne fonctionne pas, vérifiez vos paramètres.")
// }

// Requête fetch
const getWeatherOf = async (position) => {
    try{
        // Disparition du chargement de la page
        var clone = document.importNode(template.content, true)
        main.removeChild(chargement)
        main.appendChild(clone)
        
        // Chargement des éléments html
        const city = document.querySelector(".city")
        const nowIcon = document.querySelector(".now-icon")
        const nowDescription = document.querySelector(".description")
        const nowTemperature = document.querySelector(".temperature")
        const hour = document.querySelectorAll(".hour")
        const day = document.querySelectorAll(".day")
        let cityName = document.querySelector(".search-value").value
        
        // Stocker la localisation
        let {latitude, longitude} = position.coords

        // Si l'utilisateur entre une ville, la latitude et longitude
        if(cityName){
            console.log("SEARCH MODE")
            cityResult = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${cityName}&type=municipality&autocomplete=1`)
            const cityData = await cityResult.json()
            console.log("cityData", cityData)

            latitude = cityData.features[0].geometry.coordinates[1]
            longitude = cityData.features[0].geometry.coordinates[0]
        }

        
        const locateResult = await fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${longitude}&lat=${latitude}`)
        const locateData = await locateResult.json()

        const weatherResult = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=metric&lang=fr&appid=${apiKey}`)
        const weatherData = await weatherResult.json()
       
        
        // weatherData = API Open weather map
        // cityData = Ville de l'utilisateur avec l'API https://adresse.data.gouv.fr/api-doc/adresse#reverse
        
        console.log("locateData : ", locateData)
        

        // Changement du background selon la nuit et le jour
          // dt temps en timestamp Unix = tps en ms depuis janvier 1970 = pour convertir faire *1000
        const sunrise = new Date(weatherData.current.sunrise * 1000)
        const sunset = new Date(weatherData.current.sunset * 1000)
        let current_dt = new Date(weatherData.current.dt * 1000)

        if (sunrise <= current_dt && current_dt < sunset ){
            main.style.backgroundImage = `url("./img/jour.jpg")`
            
        } else{
            main.style.backgroundImage = `url("./img/soir.jpeg")`
        }

        // NOW : heure actuelle
        city.innerText= locateData.features[0].properties.city
        cityName = locateData.features[0].properties.city
        nowIcon.src = `img/${weatherData.current.weather[0].icon}.svg`
        nowDescription.innerText= weatherData.current.weather[0].description
        nowTemperature.innerText= `${Math.trunc(weatherData.current.temp)}°`


        // HOURS : 24h
        for(let i = 0; i < 24; i++){
            hour[i].innerHTML = `<p>${new Date(weatherData.hourly[i].dt * 1000).getHours()}h</p>
                                 <img class="hour-icon" src="./img/${weatherData.hourly[i].weather[0].icon}.svg" alt="img temps">
                                 <p>${Math.trunc(weatherData.hourly[i].temp)}°</p>`
        }
        

        // DAYS : 7 jours
        let week = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']

        for(let k = 0; k < week.length; k++){

            let daily_dt = new Date(weatherData.daily[k].dt * 1000).getDay()

            day[k].innerHTML = `<p class="day-text">${week[daily_dt]}</p>
                                <img class="day-icon" src="./img/${weatherData.daily[k].weather[0].icon}.svg" alt="img temps">
                                <p class="day-temperature">Min : ${Math.trunc(weatherData.daily[k].temp.min)}°</p>
                                <p class="day-temperature">Max : ${Math.trunc(weatherData.daily[k].temp.max)}°</p>`
        }

    } catch(error){
        console.error('Erreur dans le getWeatheerOf() ~>', error)
    }
}

const updateUI = (data) => {
    console.log(data)
}


// Récupérer la géolocalisation de l'utilisateur et faire la requête à l'API
navigator.geolocation.getCurrentPosition( 
    getWeatherOf, 
    (error) => console.log('getCurrentPosition error ~>', error), 
    {timeout: 3000}
)


