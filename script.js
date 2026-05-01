const name = "camcat";

const greetingEl = document.getElementById("greeting");

function getTimeGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

const casualGreetings = ["Hi", "Hey there"];

const useTimeBased = Math.random() < 0.7; 
// 70% chance to use time-based greeting, 30% casual

const greeting = useTimeBased
    ? getTimeGreeting()
    : casualGreetings[Math.floor(Math.random() * casualGreetings.length)];

greetingEl.textContent = `${greeting}, ${name}!`;