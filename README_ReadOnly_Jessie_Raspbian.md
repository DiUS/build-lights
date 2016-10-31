# Converting Jessie Raspbian to read-only filesystem

It is highly recommended to update Raspbian to the latest version before proceeding with read-only filesystem conversion.

```
sudo su -
apt-get update
apt-get upgrade
```

### Configure timezone and wifi country

```
raspi-config
```

### Clean up

```
apt-get remove --purge wolfram-engine triggerhappy cron logrotate dbus dphys-swapfile xserver-common lightdm fake-hwclock
apt-get autoremove --purge
```

### replace log management with busybox, you can read the logs with logread

```
apt-get install busybox-syslogd; dpkg --purge rsyslog
```


### Disable filesystem checks, disable swap, mount root as read-only

Add "fastboot noswap ro" to /boot/cmdline.txt.

File /boot/cmdline.txt looks like this:

```
dwc_otg.lpm_enable=0 console=serial0,115200 console=tty1 root=/dev/mmcblk0p2 rootfstype=ext4 elevator=deadline fsck.repair=yes rootwait fastboot noswap ro
```

### Move spool

```
rm -rf  /var/spool
ln -s /tmp /var/spool
```

### Mount root and boot partitions as read-only, move /var and /tmp to tmpfs

Add "ro" flag to /etc/fstab. Move /var and /tmp to tmpfs.

Example:

```
proc            /proc           proc    defaults          0       0
/dev/mmcblk0p1  /boot           vfat    defaults,ro       0       2
/dev/mmcblk0p2  /               ext4    defaults,noatime,ro 0     1
/dev/mmcblk0p3  /storage        ext4    defaults,noatime,sync 0   3
tmpfs           /var/log        tmpfs   nodev,nosuid      0       0
tmpfs           /var/tmp        tmpfs   nodev,nosuid      0       0
tmpfs           /tmp            tmpfs   nodev,nosuid      0       0
```

### Move dhcpd.resolv.conf to tmpfs

```
touch /tmp/dhcpcd.resolv.conf
rm /etc/resolv.conf
ln -s /tmp/dhcpcd.resolv.conf /etc/resolv.conf
```

### Easy switching between read-only and read-write

Place the below at the end of /etc/bash.bashrc

```
# set variable identifying the filesystem you work in (used in the prompt below)
fs_mode=$(mount | sed -n -e "s/^.* on \/ .*(\(r[w|o]\).*/\1/p")
# alias ro/rw
alias roroot='mount -o remount,ro / ; fs_mode=$(mount | sed -n -e "s/^.* on \/ .*(\(r[w|o]\).*/\1/p")'
alias rwroot='mount -o remount,rw / ; fs_mode=$(mount | sed -n -e "s/^.* on \/ .*(\(r[w|o]\).*/\1/p")'
# setup fancy prompt
export PS1='\[\033[01;32m\]\u@\h${fs_mode:+($fs_mode)}\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '
# aliases for mounting boot volume
alias roboot='mount -o remount,ro /boot'
alias rwboot='mount -o remount,rw /boot'
```

### Watchdog

Add to /boot/config.txt

```
# Enable watchdog
dtparam=watchdog=on
```



Edit watchdog config /etc/watchdog.conf and enable (uncomment) following lines:

```
watchdog-device = /dev/watchdog
max-load-1
```




Start watchdog at system start and start right away

```
insserv watchdog; /etc/init.d/watchdog start
```




http://raspberrypi.stackexchange.com/questions/33850/pi-b-raspbian-jessie-watchdog-doesnt-start-at-boot additional settings needed on Jessie, edit /lib/systemd/system/watchdog.service and add:

```
[Install]
WantedBy=multi-user.target
```




Now it should be enabled properly

```
systemctl enable watchdog
```



Setup automatic reboot after kernel panic in /etc/sysctl.conf (add to the end)

```
kernel.panic = 10
```



Finish and reboot

