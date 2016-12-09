# Using the master image

We provide a Jessie Raspbian based master image, properly partitioned with all software already installed - you can download the master image [here](https://s3-ap-southeast-2.amazonaws.com/dius-build-lights-assets/build-lights-master-20161205.zip). All you need to do is unzip it and transfer the downloaded image into an SD Card.

#### What's in the image

We partitioned the image to minimise the risk of data corruption. This way, when people accidentally pull the power plug of that little device that sits on the corner of somebody in the team, you don't end up with corrupted card.

Here's what it looks like:

```sh
pi@build-lights-v5-master:~ $ df -h
Filesystem      Size  Used Avail Use% Mounted on
/dev/root       1.2G 1001M  126M  89% /
devtmpfs        459M     0  459M   0% /dev
tmpfs           463M     0  463M   0% /dev/shm
tmpfs           463M   12M  451M   3% /run
tmpfs           5.0M  4.0K  5.0M   1% /run/lock
tmpfs           463M     0  463M   0% /sys/fs/cgroup
tmpfs           463M  4.0K  463M   1% /tmp
tmpfs           463M     0  463M   0% /var/tmp
tmpfs           463M   16K  463M   1% /var/log
/dev/mmcblk0p3  969M  252M  651M  28% /storage
/dev/mmcblk0p1   63M   21M   43M  33% /boot
```

* The software required to make the build lights work is all under `/storage/build-lights`.
* Inside `/storage/etc/build-lights` you will find the configuration files for both light and web controllers

We are also using [`Supervisord`](http://supervisord.org) to keep processes alive. All configuration can be found at `/etc/supervisor`.

#### Writing the image to the card

You can use the original instructions present below or read on.

* [Instructions for Linux](https://www.raspberrypi.org/documentation/installation/installing-images/linux.md)
* [Instructions for Windows](https://www.raspberrypi.org/documentation/installation/installing-images/windows.md)
* [Instructions for Mac](https://www.raspberrypi.org/documentation/installation/installing-images/mac.md)

**WARNING**: Writing image to the wrong disk _WILL_ cause data loss !!!

For Mac OSX, you can try [Pi Filler 1.3](http://ivanx.com/raspberrypi/files/PiFiller.zip). It is easy to use, suitable for beginners. More information [here](http://ivanx.com/raspberrypi/).

For Windows, you can try [Win32DiskImager](http://sourceforge.net/projects/win32diskimager).

For Linux, you can try ImageWriter. Alternatively, you can use the command line option. Example (if your microSD card is located at /dev/sdb):

```
sudo dd bs=1M if=build-lights-master-20161103.img of=/dev/sdb
```

**NOTE**: when you use the command `df -h` it is very likely that your microSD card might be listed as `/dev/sdbN` with **N** being a number. This number is the partition number and you don't want to write a partition, you want write to the whole card. When you run the command above ensure *1)* that the microSD is unmounted and *2)* that you are not using the number.

### Running the master image for the first time

After booting the image for the first time, log in to the Pi, either via SSH or via keyboard and screen on the Pi itself.

If logging in via SSH, the master image has this host name: **build-lights-v5-master**. You can login with username `pi` and password `raspberry`.

Once logged in...

1. sudo as root by invoking `sudo su`
2. Remount both `/root` and `/boot` partitions with read-write (RW) permissions
   To remount `/root` partition with RW permission, run this command:
   ```
   rwroot
   ```

   To remount `/boot` partition with RW permission, run this command:
   ```
   rwboot
   ```
3. Run `raspi-config` to change the **hostname** and **resize the root partition** to fill the entire microSD card.
4. We recommend you configure other things such as Timezone and Wifi country, but it's up to you.
5. Reboot   

At this point, if you plugged an ethernet cable to your Raspberry Pi, you can go to the web interface on http://my-new-hostname and configure the rest over there:

* Change hostname
* Change connection type (Wireless, Ethernet)
* Assign a static IP address (if you are not using DHCP)
* Setup your CI connection
* Setup the LED hardware you are using
* Setup the jobs to be monitored
