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

    toggleState: function() {
        if (!this.smartLedStripService.getCharacteristic(Characteristic.On).value) {
            this.updateRGBW(0, 0, 0, 0);
        } else {
            var rgbw = this.hsb2rgbw(this.smartLedStripService.getCharacteristic(Characteristic.Hue).value,
                this.smartLedStripService.getCharacteristic(Characteristic.Saturation).value,
                this.smartLedStripService.getCharacteristic(Characteristic.Brightness).value);
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

    hsb2rgbw: function(H, S, B) {
        var rgbw = {
            R: 0,
            G: 0,
            B: 0,
            W: 0
        }

        if (H == 0 && S == 0) {
            rgbw.W = B;
        } else {
            var segment = Math.floor(H / 60);
            var offset = H % 60;
            var mid = (B * offset) / 60;

            rgbw.W = Math.round((B / 100) * (100 - S));

            if (segment == 0) {
                rgbw.R = Math.round((S / 100) * B);
                rgbw.G = Math.round((S / 100) * mid);
            } else if (segment == 1) {
                rgbw.R = Math.round((S / 100) * (B - mid));
                rgbw.G = Math.round((S / 100) * B);
            } else if (segment == 2) {
                rgbw.G = Math.round((S / 100) * B);
                rgbw.B = Math.round((S / 100) * mid);
            } else if (segment == 3) {
                rgbw.G = Math.round((S / 100) * (B - mid));
                rgbw.B = Math.round((S / 100) * B);
            } else if (segment == 4) {
                rgbw.R = Math.round((S / 100) * mid);
                rgbw.B = Math.round((S / 100) * B);
            } else if (segment == 5) {
                rgbw.R = Math.round((S / 100) * B);
                rgbw.B = Math.round((S / 100) * (B - mid));
            }
        }

        return rgbw;
    }

}