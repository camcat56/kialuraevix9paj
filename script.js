const name = "camcat";

document.getElementById("greeting").textContent =
    `${Math.random() < 0.7
        ? (new Date().getHours() < 12 ? "Good morning" :
           new Date().getHours() < 18 ? "Good afternoon" : "Good evening")
        : ["Hi", "Hey there"][Math.floor(Math.random()*2)]
    }, ${name}!`;

/* CLOCK */
function updateTime() {
    const now = new Date();

    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");

    const d = String(now.getDate()).padStart(2, "0");
    const mo = String(now.getMonth()+1).padStart(2, "0");
    const y = now.getFullYear();

    document.getElementById("time-text").innerHTML =
        `The time is <span class="bold">${h}:${m}</span> on <span class="bold">${d}/${mo}/${y}</span>`;
}

updateTime();
setInterval(updateTime, 1000);

/* WEATHER */

function getEmoji(code) {
    if (code === 0) return "☀️";
    if (code <= 3) return "⛅";
    if (code <= 48) return "🌫️";
    if (code <= 67) return "🌧️";
    return "❄️";
}

function getText(code) {
    if (code === 0) return "Clear";
    if (code <= 3) return "Cloudy";
    if (code <= 48) return "Foggy";
    if (code <= 67) return "Rainy";
    return "Snow";
}

async function getLocation(lat, lon) {
    try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}`);
        const data = await res.json();
        const p = data.results?.[0];
        return p?.city || p?.town || p?.village || p?.name || "Your location";
    } catch {
        return "Your location";
    }
}

function loadWeather(lat, lon) {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(r => r.json())
        .then(async data => {
            const w = data.current_weather;

            const loc = await getLocation(lat, lon);

            document.getElementById("weather-emoji").textContent = getEmoji(w.weathercode);
            document.getElementById("weather-location").textContent = loc;
            document.getElementById("weather-temp").textContent =
                `${w.temperature}°C • ${getText(w.weathercode)}`;
            document.getElementById("weather-wind").textContent =
                `${(w.windspeed * 0.621371).toFixed(1)} mph wind`;
        });
}

navigator.geolocation.getCurrentPosition(
    pos => loadWeather(pos.coords.latitude, pos.coords.longitude),
    () => loadWeather(51.68187, -3.17708)
);
