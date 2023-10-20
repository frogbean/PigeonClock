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
The when variable is a percentage value of the suns position throughout the sky and into the night
0.0 -> 1.0 is day time with 0.5 being solar noon, 1.0 -> 2.0 is night time with 1.5 being the darkest point of night
The value loops around to 0 again when a new day starts (sunrise)
The program has a test function that displays the sun angle ⊾ and the percentage value