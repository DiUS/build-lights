"""
ledstrip.py: Raspberry Pi library for the Adafruit LPD8806 RGB Strand

Provides the ability to drive a LPD8806 based strand of RGB leds from the Raspberry Pi

Colors are provided as RGB and converted internally to the strand's 7 bit values.

The leds are available here: http://adafruit.com/products/306

Wiring:
	Pi MOSI -> Strand DI
	Pi SCLK -> Strand CI

Make sure to use an external power supply to power the strand.
"""

import sys
sys.path.append("../lib")

import threading

import logger
import error


class Error(error.Generic):
    """Base class for ledstrip module exceptions"""
    pass

class InputError(Error):
    """Range error"""
    pass



class Strand(threading.Thread):

    #SLEEP_INTERVAL_S = 0.030
    SLEEP_INTERVAL_S = 3.000
    BLINK_STEPS = 66

    def __init__(self, num_leds=32, spidev='/dev/spidev0.0', simulate_mode=False):
        threading.Thread.__init__(self)
        self.logger = logger.Logger('Strand')
        self.terminate = False
        self.lock = threading.Lock()
        self.update_event = threading.Event()

        if num_leds < 1:
            raise InputError('num_leds must be greater than zero')
        self.num_leds = num_leds
        self.simulate_mode = simulate_mode
        self.spidev = spidev
        self.spi = None

        self.gamma = bytearray(256)
        for i in range(256):
            # Color calculations from http://learn.adafruit.com/light-painting-with-raspberry-pi
            self.gamma[i] = 0x80 | int(pow(float(i) / 255.0, 2.5) * 127.0 + 0.5)
        self.led_colour = [bytearray(3) for x in range(self.num_leds)]
        self.buffer = [bytearray(3) for x in range(self.num_leds)]
        self.blink = [False for x in range(self.num_leds)]
        self.blink_state = Strand.BLINK_STEPS
        self.blink_direction = -1

    def alloff(self):
        """
        Turns off all LEDs.
        """
        self.fill(0, 0, 0)

    def fill(self, r, g, b, blink=False, start_index=None, end_index=None):
        """
        Fills a range of LEDs with the specific colour.
        """
        r = int(r)
        g = int(g)
        b = int(b)
        if start_index is None:
            start_index = 0
        if end_index is None or end_index == 0:
            end_index = self.num_leds
        if start_index < 0 or \
           start_index >= self.num_leds :
            raise InputError('start_index out of range')
        if start_index >= end_index:
            raise InputError('start_index must be less than end_index')
        if end_index < 0 or \
           end_index > self.num_leds :
            raise InputError('end_index out of range')
        if r < 0 or r >= 256 or \
           g < 0 or g >= 256 or \
           b < 0 or b >= 256 :
            raise InputError('rgb out of range')
        self.lock.acquire()
        changed = False
        for i in range(start_index, end_index):
            if self.__setled(i, r, g, b, blink):
                changed = True
        if changed:
            self.update_event.set()
        self.lock.release()

    def setled(self, pixel_index, r, g, b, blink=False):
        """
        Set a single LED a specific colour
        """
        pixel_index = int(pixel_index)
        r = int(r)
        g = int(g)
        b = int(b)
        if pixel_index < 0 or \
           pixel_index >= self.num_leds :
            raise InputError('pixel_index out of range')
        if r < 0 or r >= 256 or \
           g < 0 or g >= 256 or \
           b < 0 or b >= 256 :
            raise InputError('rgb out of range')
        self.lock.acquire()
        changed = self.__setled(pixel_index, r, g, b, blink)
        if changed:
            self.update_event.set()
        self.lock.release()

    def __setled(self, pixel_index, r, g, b, blink):
        changed = False
        if self.led_colour[pixel_index][0] != g:
            self.led_colour[pixel_index][0] = g
            changed = True
        if self.led_colour[pixel_index][1] != r:
            self.led_colour[pixel_index][1] = r
            changed = True
        if self.led_colour[pixel_index][2] != b:
            self.led_colour[pixel_index][2] = b
            changed = True
        if self.blink[pixel_index] != blink:
            self.blink[pixel_index] = blink
            changed = True
        return changed

    def __update(self):
        self.buffer = [bytearray(3) for x in range(self.num_leds)]
        for i in range(self.num_leds):
            for j in range(3):
                if 0 <= self.led_colour[i][j] < 256:
                    if not self.blink[i]:
                        self.buffer[i][j] = self.gamma[self.led_colour[i][j]]
                    else:
                        step = (float(self.led_colour[i][j]) / Strand.BLINK_STEPS) * self.blink_state
                        self.buffer[i][j] = self.gamma[int()]


        self.blink_state = Strand.BLINK_STEPS
        self.blink_direction = -1



        tmp = [bytearray(3) for x in range(self.num_leds)]
            for i in range(self.num_leds):
                for j in range(3):
                    tmp[i][j] = self.gamma[self.buffer[i][j]]

        if not self.simulate_mode:
            for x in range(self.num_leds):
                self.spi.write(tmp[x])
            self.spi.write(bytearray(b'\x00'))
            self.spi.flush()
        else:
            print '%s\n\n' % str(tmp)

    def run(self):
        try:
            if not self.simulate_mode:
                self.spi = open(self.spidev, 'wb')
            self.fill(0, 0, 0)
            self.__update()

            self.logger.log('LED driver thread: STARTING ...')
            while not self.terminate:
                self.update_event.clear()
                timeout = None
                if True in self.blink:
                    timeout = Strand.SLEEP_INTERVAL_S
                self.update_event.wait(timeout)
                self.__update()

            self.logger.log('LED driver thread: STOPPING ...')

        except Exception, e:
            logger.print_trace(e)

        self.logger.log('LED driver thread: STOPPED')

    def stop(self):
        self.terminate = True
        self.alloff()


