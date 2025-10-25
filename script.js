const widget = document.getElementById("weather-widget");

const weatherIcons = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  53: "🌦️",
  55: "🌧️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  71: "🌨️",
  80: "🌦️",
  81: "🌧️",
  82: "🌧️",
  95: "⛈️"
};

async function loadWeather() {
  const url = "https://api.open-meteo.com/v1/forecast?latitude=40.7667&longitude=29.9167&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&hourly=weathercode&timezone=auto";
  const res = await fetch(url);
  const data = await res.json();

  const current = data.current_weather;
  const daily = data.daily;
  const hourly = data.hourly;

  const nowTemp = Math.round(current.temperature);
  const minTemp = Math.round(daily.temperature_2m_min[0]);
  const maxTemp = Math.round(daily.temperature_2m_max[0]);
  const codeNow = current.weathercode;
  const codeLater = hourly.weathercode.slice(-6).some(c => c !== codeNow);

  // 🔹 Tarih bilgisi
  const today = new Date(daily.time[0]);
  const days = ["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"];
  const months = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];

  document.getElementById("date-top").textContent =
    `${days[today.getDay()]}, ${today.getDate()}.`;

  // 🔹 İkon
  document.getElementById("weather-icon").textContent =
    weatherIcons[codeNow] || "❓";

  // 🔹 Sıcaklıklar
  document.getElementById("current-temp").textContent = `${nowTemp}°`;
  const minTempEl = document.getElementById("min-temp");
  minTempEl.textContent = `${minTemp}°`;
  minTempEl.classList.toggle("red", codeLater); // hava değişecekse kırmızı

  // 🔹 Gün özeti
  document.getElementById("day-summary").textContent =
    `${maxTemp}  ${minTemp}`;

  // 🔹 Alt tarih
  document.getElementById("footer-date").textContent =
    `${today.getDate()} ${months[today.getMonth()]}.`;
}

loadWeather();
