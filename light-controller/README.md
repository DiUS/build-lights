build-lights
===========

Continuous Integration build lights controller.

Monitors Jenkins CI and provides visual indication of the build status via LED strip.

Features:
* Monitors Jenkins web API directly.
* Monitors Jenkins via AWS SQS.
* Plays sound when build finishes.
* Automatically divides LEDs to each build.

![build-lights](https://github.com/jasaw/build-lights/blob/master/docs/lights.jpg)


### Hardware

You'll need:
* Raspberry Pi with enclosure and SD card
* Digital RGB LED Weatherproof Strip LEDs (1m)
  * adafruit - https://www.adafruit.com/products/306
  * AliExpress Lighting Boutique - http://www.aliexpress.com/item/1M-LPD8806-32leds-m-48leds-m-52leds-m-60leds-m-optional-Waterproof-or-Non-Waterproof-LPD8806/32345061646.html
  * Little bird electronics - https://littlebirdelectronics.com.au/products/digital-rgb-led-weatherproof-strip-lpd8806-32-led-1m
* 4-pin JST SM Plug + Receptacle Cable Set
  * adafruit - http://www.adafruit.com/products/578
  * AliExpress Cool Light LED Technologies - http://www.aliexpress.com/item/4Pin-SM-connector-4Way-Multipole-Connector-cable-plug-With-wire-ternimal-male-and-female-set-5pcs/32418707788.html
  * Little bird electronics - https://littlebirdelectronics.com.au/products/4-pin-jst-sm-plug-receptacle-cable-set
* 5V 2A (2000mA) UL Listed switching power supply (Warning: We need at least 3A power supply, but this will do as long as the lights are *NOT* on full brightness all at the same time) - https://www.adafruit.com/products/276
* Micro USB to 5.5mm female DC jack (Part Number: VUPN7718) - http://www.vetco.net/catalog/product_info.php?products_id=14954
* 4-pin 0.1" (2.54mm) pitch male header
* 4 jumper wires (Black, Red, Yellow, Green) or 4 wires with 4-way 0.1" pitch female connector
* Optional dual schmitt trigger buffer, e.g. SN74LVC2G17 or 2*SN74LVC1G17 (for Pi IO pins protection)
* 1/16" (1.6mm) and 3/32" (2.4mm) Heatshrink

The Pi is fitted with a polyfuse at the USB 5V rail.
You'll need to tap the 5V from the input side of the polyfuse.

![pre-polyfuse 5V](https://github.com/jasaw/build-lights/blob/master/docs/bottom.jpg)

![top](https://github.com/jasaw/build-lights/blob/master/docs/top.jpg)

Refer to images in build-lights/docs.
When soldering the 4-pin JST SM Plug to the LED strip, make sure to solder it on the input side of the strip (input is marked with DI, CI).
If you want protection for the Pi SPI pins, include the schmitt trigger buffer along the 2 SPI lines and power the buffer from the 5V that was tapped earlier (before the polyfuse).



### Software

You'll need:
* Your favourite Pi distro, as long as there is userspace access to spidev (e.g. /dev/spidev0.0). If you don't have a favourite distro, check out this minimal Raspbian install: https://github.com/jmattsson/raspbian_base
* Python 2.7



### Installation

First of all, get the build-lights source.
```
$ git clone https://github.com/jasaw/build-lights.git
```

If using AWS/SQS you'll need to:
```
$ git clone git://github.com/boto/boto.git
$ cd boto
$ sudo python setup.py install
```
You'll need to install AWS/SQS plugin on Jenkins too:
https://github.com/jkelabora/snsnotify-plugin

If you want to play sounds (mp3's only):
```
$ sudo apt-get update
$ sudo apt-get install alsa-utils
$ sudo apt-get install mpg321
```

If you are using device-tree, enable SPI driver from raspi-config.
```
raspi-config
```

otherwise you'll need to add "spi-bcm2708" to /etc/modules to automatically load the SPI driver on boot.

Assuming you have a standard setup of 32 lights connected to spidev0.0, you can test the lights by running (as root):
```
$ cd build-lights/lights
$ python test.py
```

Create config.json based on one of the sample files in build-lights/config/

Test it by running build-lights/light_controller in the foreground first (as root).

Copy build-lights/scripts/build-lights to /etc/init.d/build-lights

To automatically start on boot (as root):
```
$ insserv /etc/init.d/build-lights
```

To remove automatically start on boot (as root):
```
$ insserv -r /etc/init.d/build-lights
```
