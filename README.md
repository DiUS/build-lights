build-light
===========

Continuous Integration build light controller.

Currently only polls Jenkins and drives LED strip.


### Hardware

* Raspberry Pi with a enclosure
* Digital RGB LED Weatherproof Strip LEDs (1m) - https://www.adafruit.com/products/306
* 5V 2A (2000mA) switching power supply (UL Listed) - https://www.adafruit.com/products/276
* 4-pin JST SM Plug + Receptacle Cable Set - http://www.adafruit.com/products/578
* 4 pins 0.1" pitch header
* Jumper wires (Black, Red, Yellow, Green)
* 2 schmitt trigger buffers (for Pi IO pins protection)



### Software

* Your favourite Pi distro, as long as there is userspace access to spidev (e.g. /dev/spidev0.0).
* Python 2.7

```
$ git clone https://github.com/jasaw/build-light.git
```

Create config.json based on build-light/config/config.json.sample

Test it by running build-light/light_controller in the foreground first.

Copy build-light/scripts/build-light to /etc/init.d/build-light

To automatically start on boot:
```
$ insserv /etc/init.d/build-light
```

To remove automatically start on boot:
```
$ insserv -r /etc/init.d/build-light
```
