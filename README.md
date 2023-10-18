# PigeonClock

`git clone https://github.com/frogbean/PigeonClock`

`cd PigeonClock`

`npm install`

`node ./main.js`

Create a json with your coordinates

Example 

```json
{
    "latitude" : 50,
    "longitude" : 5
}
```

Save it as `coords.json`

Now you can use `alarms.json` like so

```json
{
    "Pigeon breakfast" : {
        "message" : "Time to feed the pigeons their breakfast!",
        "when" : 0.25
    },
    "Pigeon dinner" : {
        "message" : "Time to feed the pigeons their dinner!",
        "when" : 0.75
    }
}
```
The when variable is a percentage value of the suns position throughout the sky. For example a value of 0.50 will be at solar noon, a value of -0.5 will be the middle of the night

There is probably undefined behavoir with setting the value as 0 or -1 however 0.01 will be sunrise, 0.999 will be sunset, -0.001 will also be sunset, -0.999 will be sunrise as well

The formulas for these calculations are here

```js
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
```