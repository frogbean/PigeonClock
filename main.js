const suncalc = require("suncalc");
const alarms = require("./alarms.json");

try {
    require("./coords.json");
} catch {
console.warn("You need to create a coords.json file containing your latitude and longitude values")
console.warn(`Example 

{
    "latitude" : 50,
    "longitude" : 5
}

Save it as coords.json`)
    process.exit(0);
}
const { latitude, longitude } = require("./coords.json");

function sunAngle(when = new Date()) {
    return (suncalc.getPosition(when, latitude, longitude).altitude * 100);
}

function sunAngleMax() {
    const noon = suncalc.getTimes(new Date(), latitude, longitude).solarNoon;
    return sunAngle(noon);
}

function sunAngleMin() {
    const unnoon = suncalc.getTimes(new Date(), latitude, longitude).nadir;
    return sunAngle(unnoon);
}

function pClock() {
    pClock.sunMax ??= sunAngleMax();
    pClock.sunMin ??= sunAngleMin();
    const sunAng = sunAngle();

    if(sunAng >= 0) {
        const noon = suncalc.getTimes(new Date(), latitude, longitude).solarNoon;
        const phase = sunAng / pClock.sunMax;
        if(new Date() <= noon)
            return phase / 2;
        else 
            return 0.5 + ((1 - phase) / 2);
    } else {
        const unnoon = suncalc.getTimes(new Date(), latitude, longitude).nadir;
        const phase = sunAng / pClock.sunMin;
        if(new Date() <= unnoon)
            return phase / 2;
        else 
            return -0.5 - ((-1 + phase) / 2);
    }
}

setInterval(()=>{
    console.clear();
    console.log(sunAngle().toFixed(2), '⊾');
    console.log((pClock() * 100).toFixed(2), '%');
}, 100);
