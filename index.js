"use strict";

var Service, Characteristic;

const Gpio = require('pigpio').Gpio;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory('homebridge-gpio-rgb-ledstrip', 'SmartLedStrip', SmartLedStripAccessory);
}

function SmartLedStripAccessory(log, config) {
    this.log = log;
    this.name = config['name'];

    this.rPin = config['rPin'];
    this.gPin = config['gPin'];
    this.bPin = config['bPin'];
    this.wPin = config['wPin'];

    if (!this.rPin) throw new Error("You must provide a config value for redPin.");
    if (!this.gPin) throw new Error("You must provide a config value for greenPin.");
    if (!this.bPin) throw new Error("You must provide a config value for bluePin.");
    if (!this.wPin) throw new Error("You must provide a config value for whitePin.");

    this.rLeds = new Gpio(this.rPin, {
        mode: Gpio.OUTPUT
    });
    this.gLeds = new Gpio(this.gPin, {
        mode: Gpio.OUTPUT
    });
    this.bLeds = new Gpio(this.bPin, {
        mode: Gpio.OUTPUT
    });
    this.wLeds = new Gpio(this.wPin, {
        mode: Gpio.OUTPUT
    });
}

SmartLedStripAccessory.prototype = {

    getServices: function() {

        let informationService = new Service.AccessoryInformation();

        informationService
            .setCharacteristic(Characteristic.Manufacturer, 'Sunoo')
            .setCharacteristic(Characteristic.Model, 'RGBW LED Strip')
            .setCharacteristic(Characteristic.SerialNumber, this.rPin + ':' + this.gPin + ':' + this.bPin + ':' + this.wPin);

        let smartLedStripService = new Service.Lightbulb(this.name);

        smartLedStripService
            .getCharacteristic(Characteristic.On)
            .on('change', this.toggleState.bind(this));

        smartLedStripService
            .addCharacteristic(new Characteristic.Brightness())
            .on('change', this.toggleState.bind(this));

        smartLedStripService
            .addCharacteristic(new Characteristic.Hue())
            .on('change', this.toggleState.bind(this));

        smartLedStripService
            .addCharacteristic(new Characteristic.Saturation())
            .on('change', this.toggleState.bind(this));

        smartLedStripService.getCharacteristic(Characteristic.Brightness).value = 100

        this.informationService = informationService;
        this.smartLedStripService = smartLedStripService;

        return [informationService, smartLedStripService];
    },

    isOn: function() {
        return this.smartLedStripService.getCharacteristic(Characteristic.On).value;
    },

    getBrightness: function() {
        return this.smartLedStripService.getCharacteristic(Characteristic.Brightness).value;
    },

    getHue: function() {
        return this.smartLedStripService.getCharacteristic(Characteristic.Hue).value;
    },

    getSaturation: function() {
        return this.smartLedStripService.getCharacteristic(Characteristic.Saturation).value;
    },

    toggleState: function() {
        if (!this.isOn()) {
            this.updateRGBW(0, 0, 0, 0);
        } else {
            var rgbw = this.hsi2rgbw(this.getHue(), this.getSaturation(), this.getBrightness());
            this.updateRGBW(rgbw.R, rgbw.G, rgbw.B, rgbw.W);
        }
    },

    updateRGBW: function(red, green, blue, white) {
        this.log("Setting RGBW: " + red + ", " + green + ", " + blue + ", " + white);
        this.rLeds.pwmWrite(red);
        this.gLeds.pwmWrite(green);
        this.bLeds.pwmWrite(blue);
        this.wLeds.pwmWrite(white);
    },

    hsi2rgbw: function(H, S, I) {
        if (H == 0 && S == 0) {
            return {
                R: 0,
                G: 0,
                B: 0,
                W: I
            };
        } else {
            var segment = Math.floor(H / 60);
            var offset = H % 60;
            var mid = Math.round((I * offset) / 60);

            var white = Math.round((I / 100) * (100 - S));

            if (segment == 0) {
                return {
                    R: I,
                    G: mid,
                    B: 0,
                    W: white
                };
            } else if (segment == 1) {
                return {
                    R: I - mid,
                    G: I,
                    B: 0,
                    W: white
                };
            } else if (segment == 2) {
                return {
                    R: 0,
                    G: I,
                    B: mid,
                    W: white
                };
            } else if (segment == 3) {
                return {
                    R: 0,
                    G: I - mid,
                    B: I,
                    W: white
                };
            } else if (segment == 4) {
                return {
                    R: mid,
                    G: 0,
                    B: I,
                    W: white
                };
            } else if (segment == 5) {
                return {
                    R: I,
                    G: 0,
                    B: I - mid,
                    W: white
                };
            } else {
                //Should never get here, but this will prevent a crash if it does
                return {
                    R: 0,
                    G: 0,
                    B: 0,
                    W: 0
                };
            }
        }
    }

}