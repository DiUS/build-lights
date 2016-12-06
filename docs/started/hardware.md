# Hardware

It's a somewhat simple task to build the Raspberry Pi with the lights.

Some soldering experience will definitely help but don't feel discouraged: below you will find everything you need, just read through.

#### Components

* 8 GB SD card (or Micro SD if you are using Raspberry Pi 3)
* [Raspberry Pi with enclosure and SD card](https://www.adafruit.com/products/3055)
* Digital RGB LED Weatherproof Strip LEDs (1m)
  * [Adafruit LPD8806](https://www.adafruit.com/products/306) from Adafruit
  * [Epistar LPD8806](https://www.aliexpress.com/item/1M-5M-LPD8806-32leds-m-48leds-m-52leds-m-60leds-m-optional-Waterproof-or-Non-Waterproof/32428471835.html) from AliExpress [Angel-LED store](https://www.aliexpress.com/store/822899)
  * [Adafruit LPD8806](https://littlebirdelectronics.com.au/products/digital-rgb-led-weatherproof-strip-lpd8806-32-led-1m) from Little bird electronics
* 4-pin JST SM Plug + Receptacle Cable Set
  * [adafruit](http://www.adafruit.com/products/578)
  * [AliExpress Angel-LED](https://www.aliexpress.com/item/Freeshipping-8-Sets-JST-4pin-Connector-for-3528-5050-RGB-LED-Light-Strips-Cable-Wire/32434191228.html)
  * [AliExpress Cool Light LED Technologies](http://www.aliexpress.com/item/4Pin-SM-connector-4Way-Multipole-Connector-cable-plug-With-wire-ternimal-male-and-female-set-5pcs/32418707788.html)
  * [Little bird electronics](https://littlebirdelectronics.com.au/products/4-pin-jst-sm-plug-receptacle-cable-set)
* WiFi dongle **only for Raspberry Pi 2**
  * [Edimax 2.4 GHz USB 2.0 Wireless Adapter](http://au.rs-online.com/web/p/wireless-adapters/7603621)
  * [Miniature WiFi module (802.11b/g/n)](https://www.adafruit.com/product/814)
* [5V 2A \(2000mA\) UL Listed switching power supply](https://www.adafruit.com/products/276)
  * _Warning: We need at least 3A power supply, but this will do as long as the lights are ___NOT___ on full brightness all at the same time_
* [Micro USB to 5.5mm female DC jack \(Part Number: VUPN7718\)](http://www.vetco.net/catalog/product_info.php?products_id=14954)
* 4-pin 0.1" \(2.54mm\) pitch male header
* 4 jumper wires \(Black, Red, Yellow, Green\) or 4 wires with 4-way 0.1" pitch female connector
* **Optional** dual schmitt trigger buffer, e.g. SN74LVC2G17 or 2
  \*SN74LVC1G17 \(for Pi IO pins protection\)
* 1\/16" \(1.6mm\) and 3\/32" \(2.4mm\) Heatshrink
* [Master Image to be written to the microSD card](https://s3-ap-southeast-2.amazonaws.com/dius-build-lights-assets/build-lights-master-20161205.zip) (optional)

#### Instructions for the hardware

The Raspberry Pi is fitted with a polyfuse at the USB 5V rail. You'll need to tap the 5V from the input side of the polyfuse (the photos below are from the Raspberry Pi 2).

![pre-polyfuse 5V](bottom.jpg)

![Top view of the connections](top.jpg)

When soldering the 4-pin JST SM Plug to the LED strip, make sure to solder it on the input side of the strip \(input is marked with DI, CI\).

If you want protection for the Pi SPI pins, include the schmitt trigger buffer along the 2 SPI lines and power the buffer from the 5V that was tapped earlier \(before the polyfuse\).
