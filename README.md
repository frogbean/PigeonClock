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