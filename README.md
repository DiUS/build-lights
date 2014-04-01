build-light
===========

Continuous Integration build light controller.

Currently only polls Jenkins and drives LED strip.


### Hardware

* Raspberry Pi with a enclosure
* https://www.adafruit.com/products/306 (Digital RGB LED Weatherproof Strip LEDs - (1m))
* https://www.adafruit.com/products/276 (5V 2A (2000mA) switching power supply - UL Listed)
* http://www.adafruit.com/products/578 (4-pin JST SM Plug + Receptacle Cable Set)
* 4 pins 0.1" pitch header
* Jumper wires - Black, Red, Yellow, Green.



### Software

* Your favourite Pi distro, as long as there is userspace access to spidev (e.g. /dev/spidev0.0).
* Python 2.7


