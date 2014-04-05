build-light
===========

Continuous Integration build light controller.

Monitors Jenkins CI and provides visual indication of the build status via LED strip.



### Hardware

You'll need:
* Raspberry Pi with enclosure
* Digital RGB LED Weatherproof Strip LEDs (1m) - https://www.adafruit.com/products/306
* 5V 2A (2000mA) switching power supply (UL Listed) - https://www.adafruit.com/products/276
* 4-pin JST SM Plug + Receptacle Cable Set - http://www.adafruit.com/products/578
* 4 pins 0.1" pitch header
* Jumper wires (Black, Red, Yellow, Green)
* Optional 2 schmitt trigger buffers, e.g. SN74LVC1G17 (for Pi IO pins protection)



### Software

You'll need:
* Your favourite Pi distro, as long as there is userspace access to spidev (e.g. /dev/spidev0.0). If you don't have a favourite distro, check out this minimal Raspbian install: https://github.com/jmattsson/raspbian_base
* Python 2.7



### Installation

First of all, get the build-light source.
```
$ git clone https://github.com/jasaw/build-light.git
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

Create config.json based on one of the sample files in build-light/config/

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
