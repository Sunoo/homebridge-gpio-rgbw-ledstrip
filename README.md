# homebridge-gpio-rgb-ledstrip
[RPi](https://www.raspberrypi.org) GPIO based LED Strip plugin for [Homebridge](https://github.com/nfarina/homebridge)

Built on top of [pigpio](https://www.npmjs.com/package/pigpio) with javascript, inspired by [GiniaE/homebridge-gpio-ledstrip](https://github.com/GiniaE/homebridge-gpio-ledstrip)

It works out of the box with nodejs 12!

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-gpio-rgbw-ledstrip
3. Update your configuration file. See sample config.json snippet below.

# Configuration

Configuration sample:

 ```
    "accessories": [
      {
        "accessory": "SmartLedStrip",
        "name": "Basement LED Strip",
        "rPin": 26,
        "gPin": 19,
        "bPin": 16,
        "wPin": 20
      }
    ]
```

Fields:

* "accessory": Must always be "SmartLedStrip" (required)
* "name": Can be anything (required)
* "rPin": GPIO pin that is used to set red value (required)
* "gPin": GPIO pin that is used to set green value (required)
* "bPin": GPIO pin that is used to set blue value (required)
* "wPin": GPIO pin that is used to set white value (required)
