# Software

There are two ways to get the build lights working: using our Master Image (see below) or install everything yourself. Here's a summary of what you will need:

* OS for Raspberry Pi (we recommend Raspbian) with
  * Python
  * [Supervisord](http://supervisord.org/)
  * NodeJS v6
* [Software for light and web controllers](https://github.com/DiUS/build-lights)

#### Using the master image
If you want to use the master image we provide then move on to [Master Image](/docs/started/master_image.md). All software should be there already.

By default the configuration assumes that your Raspberry Pi will be connected to your network via an ethernet cable using DHCP.

#### Doing all yourself

