DiUS Build Lights 2.0
=====================

[![Build Status](https://travis-ci.org/DiUS/build-lights.svg?branch=master)](https://travis-ci.org/DiUS/build-lights)

DiUS Build-Lights is a device that provides visual feedback of a Continuous Integration (CI) or Continuous Deployment (CD) status. It polls the CI/CD server and displays the various gate or project status on an LED strip. Each section of the LED strip represents a gate or project, and the colour represents the status of that gate or project.

It is an effective way of providing constant visual feedback and it can be very useful in agile software development.

#### Master image for your SD card
We provide a Jessie Raspbian based master image, properly partitioned with all software already installed. More information available [here](https://github.com/DiUS/build-lights/blob/master/README_master_image.md).

All you need to do is unzip it and transfer the downloaded image into an SD Card.

* [Instructions for Linux](https://www.raspberrypi.org/documentation/installation/installing-images/linux.md)
* [Instructions for Windows](https://www.raspberrypi.org/documentation/installation/installing-images/windows.md)
* [Instructions for Mac](https://www.raspberrypi.org/documentation/installation/installing-images/mac.md)

Then boot it up and configure network settings and jobs. The software is installed under `/home/pi`.

#### Features
* Monitors Jenkins web API directly.
* Plays sound when build finishes.
* Automatically divides LEDs to each build.

#### Upcoming Features
* Monitors Jenkins via AWS SQS.

![build-lights-top](https://github.com/DiUS/build-lights/blob/master/docs/device_top.jpg)

![build-lights-side](https://github.com/DiUS/build-lights/blob/master/docs/device_side.jpg)
