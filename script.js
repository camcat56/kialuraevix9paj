const name = "camcat";

/* ---------------------------
   GREETING
---------------------------- */

const greetingEl = document.getElementById("greeting");

function getTimeGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

const casualGreetings = ["Hi", "Hey there"];
const useTimeBased = Math.random() < 0.7;

const greeting = useTimeBased
    ? getTimeGreeting()
    : casualGreetings[Math.floor(Math.random() * casualGreetings.length)];

greetingEl.textContent = `${greeting}, ${name}!`;

/* ---------------------------
   CLOCK
---------------------------- */

function updateTime() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    document.getElementById("time-text").innerHTML =
        `The time is <span class="bold">${hours}:${minutes}</span> on <span class="bold">${day}/${month}/${year}</span>`;
}

updateTime();
setInterval(updateTime, 1000);

/* ---------------------------
   WEATHER HELPERS
---------------------------- */

function getWeatherEmoji(code) {
    if (code === 0) return "☀️";
    if (code <= 3) return "⛅";
    if (code <= 48) return "🌫️";
    if (code <= 67) return "🌧️";
    if (code <= 77) return "❄️";
    if (code <= 82) return "🌦️";
    if (code <= 86) return "🌨️";
    return "🌩️";
}

function getWeatherText(code) {
    if (code === 0) return "Clear";
    if (code <= 3) return "Partly cloudy";
    if (code <= 48) return "Foggy";
    if (code <= 67) return "Rainy";
    if (code <= 77) return "Snowy";
    if (code <= 82) return "Showers";
    if (code <= 86) return "Snow showers";
    return "Stormy";
}

async function getLocationName(lat, lon) {
    try {
        const res = await fetch(
            `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}`
        );
        const data = await res.json();
        return data.results?.[0]?.name || "Your location";
    } catch {
        return "Your location";
    }
}

/* ---------------------------
   WEATHER (AUTO LOCATION)
---------------------------- */

function getWeatherByCoords(lat, lon) {
    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error("Network error");
            return res.json();
        })
        .then(async data => {
            const weather = data.current_weather;

            const temp = weather.temperature;
            const windMph = (weather.windspeed * 0.621371).toFixed(1);
            const code = weather.weathercode ?? 0;

            const emoji = getWeatherEmoji(code);
            const text = getWeatherText(code);

            const locationName = await getLocationName(lat, lon);

            document.getElementById("weather-emoji").textContent = emoji;
            document.getElementById("weather-location").textContent = locationName;
            document.getElementById("weather-temp").textContent = `${temp}°C • ${text}`;
            document.getElementById("weather-wind").textContent = `${windMph} mph wind`;
        })
        .catch(error => {
            console.log("Weather error:", error);

            document.getElementById("weather-location").textContent = "Weather unavailable";
            document.getElementById("weather-temp").textContent = "";
            document.getElementById("weather-wind").textContent = "";
        });
}

/* ---------------------------
   GET USER LOCATION
---------------------------- */

function initWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                getWeatherByCoords(lat, lon);
                setInterval(() => getWeatherByCoords(lat, lon), 600000);
            },
            () => {
                // fallback if user denies location
                getWeatherByCoords(51.5072, -0.1276); // London fallback
            }
        );
    } else {
        // fallback if browser doesn't support it
        getWeatherByCoords(51.5072, -0.1276);
    }
}

initWeather();
