DiUS Build Lights Master Image
==============================

The master image is based on Jessie Raspbian. The image consists of 3 partitions: boot, storage, root. Both root and boot partitions have been configured to read-only mode, suitable for embedded environment. Storage partition is available for local storage. You will need at least a 4GB microSD card. You can download the master image [here](https://s3-ap-southeast-2.amazonaws.com/dius-build-lights-assets/build-lights-master-20161122.zip).


### Writing master image to microSD card

If you have already downloaded the master image, you will need to write the image to the microSD card that is going to run on the Raspberry Pi.


**WARNING**: Writing image to the wrong disk _WILL_ cause data loss !!!


For Mac OSX, you can try [Pi Filler 1.3](http://ivanx.com/raspberrypi/files/PiFiller.zip). It is easy to use, suitable for beginners. More information [here](http://ivanx.com/raspberrypi/).


For Windows, you can try [Win32DiskImager](http://sourceforge.net/projects/win32diskimager).


For Linux, you can try ImageWriter. Alternatively, you can use the command line option. Example (if your microSD card is located at /dev/sdb):

```
sudo dd bs=1M if=build-lights-master-20161103.img of=/dev/sdb
```


### Running the master image for the first time

After booting the image for the first time, log in to the Pi, either via SSH or via keyboard and screen on the Pi itself.

If logging in via SSH, the master image has this hostname: **build-lights-v2-master**


Use this log in credentials:
```
Username: pi
Password: raspberry
```


1. Once logged in, remount both root and boot partitions with read-write permission.

   To remount *root* partition with read-write permission, run this command:
   ```
   rwroot
   ```

   To remount *boot* partition with read-write permission, run this command:
   ```
   rwboot
   ```

   **Note**: *root* and *boot* partitions can be remounted back to read-only mode via *roroot* and *roboot* commands.


2. Change the **hostname** and **resize the root partition** to fill the entire microSD card via raspi-config. You can configure other things if you wish, like timezone and wifi country.

   ```
   sudo raspi-config
   ```

   **Please reboot after that.**


3. Configure the build-lights jobs via its web interface.

   Alternatively, you can modify the configuration file located at */storage/etc/build-lights/light-controller.json*. You'll need to restart the *light_controller* process for the new configuration to take effect.
