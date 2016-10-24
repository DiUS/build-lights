DiUS Build Lights 2.0
=====================

[![Build Status](https://travis-ci.org/DiUS/build-lights.svg?branch=master)](https://travis-ci.org/DiUS/build-lights)

DiUS Build-Lights is a device that provides visual feedback of a Continuous Integration (CI) or Continuous Deployment (CD) status. It polls the CI/CD server and displays the various gate or project status on an LED strip. Each section of the LED strip represents a gate or project, and the colour represents the status of that gate or project.

It is an effective way of providing constant visual feedback and it can be very useful in agile software development.

#### Features
* Monitors Jenkins web API directly.
* Plays sound when build finishes.
* Automatically divides LEDs to each build.

#### Upcoming Features
* Monitors Jenkins via AWS SQS.

![build-lights-top](https://github.com/DiUS/build-lights/blob/master/docs/device_top.jpg)

![build-lights-side](https://github.com/DiUS/build-lights/blob/master/docs/device_side.jpg)
