# Troubleshooting

### My wireless configuration is not working

Check if you are trying to connect to a 5 GHz wireless network. The Raspberry Pi 3 does not support 5 GHz connections - check [this forum post](https://www.raspberrypi.org/forums/viewtopic.php?f=36&t=138166) - but you can buy a 5 GHz dongle and attach to it if you really want. Here's a [list fresh from Google](http://www.wirelesshack.org/top-10-wifi-dongles-for-the-raspberry-pi-2016.html).

### I want to update my software

There are two ways to achieve this:

1. Update the software through git
2. Backup configuration, upgrade the image, and restore configuration

For the first option you will need to ssh into your Pi and go to the location where the software is installed - in the case of the master image, that's under `/storage` - and execute a `git pull`. Restart the Pi and you should be good to go.

If you are using the master image and want to do more than a `git pull`, for the second option you will need to backup the configuration files present under `/storage/etc/build-lights`, the wireless configuration under `/etc/wpa_supplicant` and the DHCP configuration under `/etc/dhcpcd.conf`.

Download the latest master image, write it to the SD Card and put your configuration files back on.
### I'm behind a corporate proxy

Yes, I know, it's not great. But there are ways around it.

The most straight forward solution would be for you to talk to your sys admin and whitelist the domain where your CI server lives. If you host it in house, shouldn't be a problem.

In case the above isn't successful, Supervisor - the job runner we use - allows for environment variables to be passed in to the jobs it monitors. Inside the [configuration file for the Light Controller](https://github.com/DiUS/build-lights/blob/master/supervisor-config/etc/supervisor/conf.d/dius-light-controller.conf) you will need to add a new line with the following content:

```
environment=http_proxy='http://user:pwd@proxy:8080',https_proxy='http://user:pwd@proxy:8080'
```

Replace the `http://user@pwd@proxy:8080` with the appropriate username, password and proxy address and port for your company and then the light controller should be able to talk to external websites that are allowed through the proxy.

**Note:** it is possible you might need a `no_proxy` setting as well in case you are forced to use the proxy for every device connected to the network but yout sys admin has whitelisted your CI serverand you don't need proxy for that.



