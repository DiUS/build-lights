# Setup Jessie Raspbian Pixel read only mode

It is recommended to run the build-lights in __read-only__ mode. All modifications to the root filesystem stay in RAM, so there is minimal chance of corrupting the SD card when the power is removed abruptly. If you have writable partitions on the same SD card as the root filesystem, corruption may still occur when power is removed while the SD card is doing wear-leveling across partitions.

Note that only the root partition is overlaid by this procedure. In particular, the /boot partition will not overlaid. If you have created any additional partitions, those will not be overlaid either.

### Enable overlayfs

Edit /usr/share/initramfs-tools/hook-functions


Around line 528 add __overlay__ to the list of modules to be include in the default initramfs. The relevant part of the file should now look like

```
    for arg in "$@" ; do
        case "$arg" in
        base)
            modules="$modules ehci-pci ehci-orion ehci-hcd ohci-hcd ohci-pci uhci-hcd usbhid overlay"
            modules="$modules xhci xhci-pci xhci-hcd"
            modules="$modules btrfs ext2 ext3 ext4 ext4dev "
```

### Prepare overlay files

Create /usr/share/initramfs-tools/scripts/overlay

```
cd /usr/share/initramfs-tools/scripts
cp local overlay
cp -rp local-premount overlay-premount
```

### Mounting overlay

Now edit the file __overlay__ to include the commands to mount the overlay filesystem. The routine to change is __local_mount_root()__. The if statement has been __commented__ out so the root filesystem will always be mounted read only and a writable tmpfs is overlayed on top of the read-only root.

The relevant changes look like:

```
#   if [ "${readonly}" = "y" ]; then
        roflag=-r
#   else
#       roflag=-w
#   fi

    # FIXME This has no error checking
    modprobe ${FSTYPE}

    checkfs ${ROOT} root

    # FIXME This has no error checking
    # Mount root
    mkdir /upper /lower
    if [ "${FSTYPE}" != "unknown" ]; then
        mount ${roflag} -t ${FSTYPE} ${ROOTFLAGS} ${ROOT} /lower
    else
        mount ${roflag} ${ROOTFLAGS} ${ROOT} /lower
    fi
    modprobe overlay
    mount -t tmpfs tmpfs /upper
    mkdir /upper/data /upper/work
    mount -t overlay -olowerdir=/lower,upperdir=/upper/data,workdir=/upper/work overlay ${rootmnt}
```

### Create initramfs

It is now possible to create a suitable initramfs using the commands

```
if [ "$(uname -m)" = "armv7l" ]; then v=7; else v=; fi

cp /boot/config.txt{,.rw}
echo -e "\nkernel=kernel$v.img\ninitramfs initrd$v.img" | cat /boot/config.txt - > /boot/config.txt.ro
cp /boot/config.txt{.ro,}

cp /boot/cmdline.txt{,.rw}
echo -n "boot=overlay " | cat - /boot/cmdline.txt > /boot/cmdline.txt.ro
cp /boot/cmdline.txt{.ro,}

update-initramfs -c -k $(uname -r)
mv /boot/initrd.img-$(uname -r) /boot/initrd$v.img
```

If you are running a different kernel, for example, on a Pi B+ which uses an ARMv6 CPU the 7's will be missing from the filenames.

The initramfs is enabled by the ___/boot/config.txt___ commands. It adds these lines to the ___/boot/config.txt___ file.

```
kernel=kernel7.img
initramfs initrd7.img
```

The ___/boot/cmdline.txt___ commands also instructs the kernel to boot with overlay by adding __boot=overlay__ to ___/boot/cmdline.txt___.

At this point Raspbian is configured with a read-only root and ready to reboot. Try rebooting.

If your Pi fails to boot, you can simply revert to __read-write__ mode by reverting the changes to ___/boot/config.txt___ and ___/boot/cmdline.txt___. Alternatively, you can simply overwrite ___/boot/config.txt___ and ___/boot/cmdline.txt___ with ___/boot/cmdline.txt.rw___ and ___/boot/config.txt.rw___.


### Mounting boot and storage partitions as synchronous

The boot and storage partitions can be mounted as synchronous to minimize filesystem corruption.

Add __sync__ to the __boot__ and __storage__ in /etc/fstab to look like this:
```
/dev/mmcblk0p1  /boot           vfat    defaults,sync     0       2
/dev/mmcblk0p3  /storage        ext4    defaults,noatime,sync 0   3
```
