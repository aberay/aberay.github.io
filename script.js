// Sabit: İzmit koordinatları
const LAT = 40.7667;
const LON = 29.9167;

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
  73: "🌨️",
  75: "🌨️",
  80: "🌦️",
  81: "🌧️",
  82: "🌧️",
  95: "⛈️",
  96: "⛈️",
  99: "⛈️"
};

function dayNameFromDateStr(dateStr){
  const d = new Date(dateStr + "T00:00:00");
  const days = ["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"];
  return days[d.getDay()];
}

function niceMonthDay(dateStr){
  const d = new Date(dateStr + "T00:00:00");
  const months = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

async function loadWeather(){
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
  try {
    const res = await fetch(url);
    if(!res.ok) throw new Error("Ağ hatası");
    const data = await res.json();

    const current = data.current_weather;
    const daily = data.daily;

    // current
    const currTemp = Math.round(current.temperature);
    const currCode = current.weathercode;

    // daily arrays: [0] = today, [1] = next day
    const todayIndex = 0;
    const nextIndex = 1;

    const todayDate = daily.time[todayIndex];
    const nextDate = (daily.time.length > nextIndex) ? daily.time[nextIndex] : null;

    const todayMax = Math.round(daily.temperature_2m_max[todayIndex]);
    const todayMin = Math.round(daily.temperature_2m_min[todayIndex]);

    let nextMax = "--", nextMin = "--", nextCode = null;
    if(nextDate){
      nextMax = Math.round(daily.temperature_2m_max[nextIndex]);
      nextMin = Math.round(daily.temperature_2m_min[nextIndex]);
      nextCode = daily.weathercode[nextIndex];
    }

    // DOM update - top
    document.getElementById("date-top").textContent = `${dayNameFromDateStr(todayDate)}, ${new Date(todayDate).getDate()}.`;
    document.getElementById("current-day").textContent = dayNameFromDateStr(todayDate);
    document.getElementById("current-date").textContent = niceMonthDay(todayDate);

    // current card
    document.getElementById("current-icon").textContent = weatherIcons[currCode] || "❓";
    document.getElementById("current-temp").textContent = `${currTemp}°`;
    document.getElementById("current-max").textContent = `${todayMax}°`;
    const curMinEl = document.getElementById("current-min");
    curMinEl.textContent = `${todayMin}°`;

    // next card (if available)
    if(nextDate){
      document.getElementById("next-day").textContent = dayNameFromDateStr(nextDate);
      document.getElementById("next-date").textContent = niceMonthDay(nextDate);
      document.getElementById("next-icon").textContent = weatherIcons[nextCode] || "❓";
      document.getElementById("next-temp").textContent = `${nextMax}°`;
      document.getElementById("next-max").textContent = `${nextMax}°`;
      const nextMinEl = document.getElementById("next-min");
      nextMinEl.textContent = `${nextMin}°`;

      // Eğer ertesi günün hava kodu farklıysa kırmızı vurgu uygula (senin kural)
      const change = (nextCode !== currCode);
      nextMinEl.classList.toggle("red", change);

      // Ayrıca isteğe bağlı: eğer ertesi gün yağmur/olumsuz ise footer değişikliği
      if(change){
        document.getElementById("footer").textContent = "Hava değişebilir — ertesi gün farklı koşullar bekleniyor.";
      } else {
        document.getElementById("footer").textContent = "Hava sürekliliği bekleniyor.";
      }
    } else {
      // next day yoksa boş bırak
      document.getElementById("next-day").textContent = "--";
      document.getElementById("next-date").textContent = "--";
      document.getElementById("next-icon").textContent = "—";
      document.getElementById("next-temp").textContent = `--°`;
      document.getElementById("next-max").textContent = `--°`;
      document.getElementById("next-min").textContent = `--°`;
      document.getElementById("footer").textContent = "Günlük veri bulunamadı.";
    }

  } catch (err) {
    console.error(err);
    document.getElementById("date-top").textContent = "Veri alınamadı";
    document.getElementById("footer").textContent = "Open-Meteo'ya erişilemiyor.";
  }
}

loadWeather();
