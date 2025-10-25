const LAT = 40.7667, LON = 29.9167;

const iconMap = {
  0:"☀️",1:"🌤️",2:"⛅",3:"☁️",45:"🌫️",48:"🌫️",
  51:"🌦️",53:"🌧️",55:"🌧️",61:"🌧️",63:"🌧️",
  65:"🌧️",71:"🌨️",73:"🌨️",75:"🌨️",80:"🌦️",
  81:"🌧️",82:"🌧️",95:"⛈️",96:"⛈️",99:"⛈️"
};
const rainCodes = [51,53,55,61,63,65,71,73,75,80,81,82,95,96,99];

(async()=>{
  const url=`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true&hourly=weathercode&daily=temperature_2m_min,temperature_2m_max,weathercode&timezone=auto`;
  const r=await fetch(url);
  const d=await r.json();

  const now=d.current_weather;
  const daily=d.daily;
  const hourly=d.hourly;

  const today=0, tomorrow=1;
  const nowTemp=Math.round(now.temperature);
  const minTemp=Math.round(daily.temperature_2m_min[today]);
  const nextTemp=Math.round(daily.temperature_2m_max[tomorrow]);
  const codeNow=now.weathercode;
  const codeToday=daily.weathercode[today];
  const codeTomorrow=daily.weathercode[tomorrow];

  const t1=new Date(daily.time[today]);
  const t2=new Date(daily.time[tomorrow]);
  const days=["pazar","pazartesi","salı","çarşamba","perşembe","cuma","cumartesi"];
  const months=["ocak","şubat","mart","nisan","mayıs","haziran","temmuz","ağustos","eylül","ekim","kasım","aralık"];

  // bugünün tarihi
  const leftDate=document.getElementById("date-left");
  leftDate.innerHTML=`${days[t1.getDay()]}, <span class="small">${t1.getDate()}.</span>`;

  // yarının tarihi
  const rightDate=document.getElementById("date-right");
  rightDate.innerHTML=`${t2.getDate()} ${months[t2.getMonth()]}.`;

  // ayın başı/sonu renkleri
  const lastDay = new Date(t1.getFullYear(), t1.getMonth()+1, 0).getDate();
  if(t1.getDate()===lastDay) leftDate.classList.add("red");
  if(t1.getDate()===1) leftDate.classList.add("green");
  if(t2.getDate()===1) rightDate.classList.add("green");

  // sıcaklıklar ve ikonlar
  document.getElementById("temp-now").textContent=`${nowTemp}°`;
  const minEl=document.getElementById("temp-min");
  minEl.textContent=`${minTemp}°`;
  document.getElementById("icon-today").textContent=iconMap[codeNow]||"❓";
  document.getElementById("icon-next").textContent=iconMap[codeTomorrow]||"❓";
  document.getElementById("temp-next").textContent=`${nextTemp}°`;

  // düşük sıcaklık rengi (hava durumu değişimi)
  const eveningCode = hourly.weathercode.slice(18,24).find(c=>c);
  const nowRain = rainCodes.includes(codeNow) || rainCodes.includes(codeToday);
  const eveningRain = rainCodes.includes(eveningCode);
  if(nowRain && !eveningRain) minEl.classList.add("green");
  else if(!nowRain && eveningRain) minEl.classList.add("red");
})();
