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

function trigger(alarmName) {
    eventer[alarmName].triggered = true;
    const event = alarms[alarmName];
    alert(`${alarmName}: ${event.description}`);
}

function eventer() {
    const clock = pClock(); 
    for(const alarmName in alarms) {
        eventer[alarmName] ??= {};
        if(eventer[alarmName]?.triggered) return;
        const event = alarms[alarmName];
        const day = event.when > 0;
        if(day && event.when < clock) trigger(alarmName); 
        if(!day && event.when > clock) trigger(alarmName);
        if(day && clock < 0) eventer[alarmName].triggered = false;
        if(!day && clock > 0) eventer[alarmName].triggered = false;
    }
}

function alert(message) {
    try {
        globalThis._alert_statics ??= {
            spawnSync: require('child_process')?.spawnSync,
            os: require('os')?.platform(),
            handler: {
                "win32" : message =>
                    _alert_statics.spawnSync("powershell.exe", [`
                        Add-Type -AssemblyName PresentationCore,PresentationFramework;
                        [System.Windows.MessageBox]::Show('${message}');
                    `]),
                "linux" : message => _alert_statics.spawnSync('zenity', ['--info', '--text', message]),
                "macOS" : message => _alert_statics.spawnSync('osascript', ['-e', `display dialog "${message}"`])
            }
        }
        try {

            if (_alert_statics.handler[_alert_statics.os]) _alert_statics.handler[_alert_statics.os](message);
            else console.warn('Platform not recognized. Alert not supported on this platform.');

        } catch (err) { console.error(err); }

    } catch (err) { console.error(err); }
}

setInterval(eventer, 250);

setInterval(()=>{
    console.clear();
    console.log(sunAngle().toFixed(2), '⊾');
    console.log((pClock() * 100).toFixed(2), '%');
}, 100);


module.exports = { pClock };