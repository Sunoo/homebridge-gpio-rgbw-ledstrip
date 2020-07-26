# homebridge-gpio-rgb-ledstrip

[![npm](https://img.shields.io/npm/v/homebridge-gpio-rgb-ledstrip) ![npm](https://img.shields.io/npm/dt/homebridge-gpio-rgb-ledstrip)](https://www.npmjs.com/package/homebridge-gpio-rgb-ledstrip)

[RPi](https://www.raspberrypi.org) GPIO based LED Strip plugin for [Homebridge](https://github.com/nfarina/homebridge)

## Installation

1. Install Homebridge using the [official instructions](https://github.com/homebridge/homebridge/wiki).
2. Install pi-blaster using [these instructions](https://github.com/sarfata/pi-blaster#how-to-install).
3. Update pi-blaster DAEMON\_OPTS to contain the pins your LED strip is connected to ([instructions](https://github.com/sarfata/pi-blaster#warnings-and-other-caveats)).
4. Install this plugin using `sudo npm install -g homebridge-gpio-rgbw-ledstrip`.
5. Update your configuration file. See sample config.json snippet below.

### Configuration

Configuration sample:

```json
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

#### Fields

* "accessory": Must always be "SmartLedStrip" (required)
* "name": Can be anything (required)
* "rPin": GPIO pin that is used to set red value (required)
* "gPin": GPIO pin that is used to set green value (required)
* "bPin": GPIO pin that is used to set blue value (required)
* "wPin": GPIO pin that is used to set white value (required)
