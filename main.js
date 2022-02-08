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

        const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=metric&lang=fr&appid=${apiKey}`)
        const data = await res.json()

        updateUI(data)

        // Ville de l'utilisateur avec l'API https://adresse.data.gouv.fr/api-doc/adresse#reverse
        const locateUser = await (await fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${longitude}&lat=${latitude}`)).json()

        console.log(locateUser)

        // Disparition du chargement de la page
        chargement.style.display = "none";
        now.style.display = "block";
        hours_days.style.display = "block";


        // Changement du background selon la nuit et le jour
        const sr = new Date(data.current.sunrise * 1000)
        const ss = new Date(data.current.sunset * 1000)
        let current_dt = new Date(data.current.dt * 1000)
        console.log(sr)

        if (sr <= current_dt && current_dt < ss ){
            background.style.backgroundImage = `url("./img/jour.jpg")`
            
        } else{
            background.style.backgroundImage = `url("./img/soir.jpeg")`
        }


        // NOW : heure actuelle
        city.innerHTML= `${locateUser.features[0].properties.city}`
        nowIcon.src = `img/${data.current.weather[0].icon}.svg`
        nowDescription.innerText= `${data.current.weather[0].description}`
        nowTemperature.innerText= `${Math.trunc(data.current.temp)}°`


        // HOURS : 24h
        for(let i = 0; i < 24; i++){

            hour[i].innerHTML = `<p class="hour-text">${new Date(data.hourly[i].dt * 1000).getHours()}h</p>
                                 <img class="hour-icon" src="img/${data.hourly[i].weather[0].icon}.svg" alt="img temps">
                                 <p class="hour-temperature">${Math.trunc(data.hourly[i].temp)}°</p>`
        }
        

        // DAYS : 
        let week = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
        

        for(let k = 0; k < week.length; k++){

            if (k > week.length) {
                k = 0
            }

            let hourly_dt = new Date(data.daily[k].dt * 1000).getDay()
            

            day[k].innerHTML = `<p class="day-text">${week[hourly_dt]}</p>
                                <img class="day-icon" src="img/${data.daily[k].weather[0].icon}.svg" alt="img temps">
                                <p class="day-temperature">min ${Math.trunc(data.daily[k].temp.min)}°</p>
                                <p class="day-temperature">max ${Math.trunc(data.daily[k].temp.max)}°</p>`
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
    {timeout: 1000}
)


