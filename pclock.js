const suncalc = require("suncalc");
const alarms = require("./alarms.json");

let path = "./coords.json";
try {
    require(path);
} catch {
    try {
        path = "../../coords.json";
        require(path);
        
    }  catch {
    console.warn("You need to create a coords.json file containing your latitude and longitude values")
    console.warn(`Example 

    {
        "latitude" : 50,
        "longitude" : 5
    }

    Save it as coords.json and !IMPORTANTLY! add that filename to your .gitignore`)
        process.exit(0);
    }
}
const { latitude, longitude } = require(path);

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

function pClock(when = new Date()) {
    pClock.sunMax ??= sunAngleMax();
    pClock.sunMin ??= sunAngleMin();
    const sunAng = sunAngle(when);

    if(sunAng >= 0) {
        const noon = suncalc.getTimes(when, latitude, longitude).solarNoon;
        const phase = sunAng / pClock.sunMax;
        if(when <= noon)
            return phase / 2;
        else 
            return 0.5 + ((1 - phase) / 2);
    } else {
        let unnoon;
        if(when.getHours() > 0 && when.getHours() < 12) {
            unnoon = suncalc.getTimes(when, latitude, longitude).nadir;
        } else unnoon = suncalc.getTimes(new Date(when.getTime() + 1000*60*60*24), latitude, longitude).nadir;
        const phase = sunAng / pClock.sunMin;
        if(when <= unnoon)
            return 1.0 + (phase / 2);
        else 
            return 1.5 + ((1 - phase) / 2);
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

function alert(message) { return;
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

function test() {
    setInterval(eventer, 250);
    let forwards = 0;
    setInterval(()=>{
        console.clear();
        const date = new Date(Date.now() + forwards);
        console.log(date);
        console.log(sunAngle(date).toFixed(2), '⊾');
        console.log((pClock(date)*100).toFixed(2), '%');
        forwards += 1000 * 60 * 5
    }, 100);
}

//test();
module.exports = { pClock };