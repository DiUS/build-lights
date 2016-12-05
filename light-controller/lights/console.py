"""
console.py: Console lights
"""

import os
current_dir = os.path.dirname(os.path.realpath(__file__))
parent_dir = os.path.join(current_dir, "..")
import sys
sys.path.append(parent_dir)

import threading
import signal

from lib import error
from lib.constants import STATUS

class Error(error.Generic):
    """Base class for ledstrip module exceptions"""
    pass

class InputError(Error):
    """Range error"""
    pass

ESC = "\x1b"
BLACK_CIRCLE = unichr(9679)
WHITE_CIRCLE = unichr(9675)
CLEAR_SCREEN = ESC + "[2J" + "\n" + ESC + "[200A"
MAGENTA = ESC + "[105m"
GREEN = ESC + "[42m"
RED = ESC + "[41m"
YELLOW = ESC + "[43m"
BLACK = ESC + "[40m"
PINK = ESC + "[45m"
WHITE = ESC + "[107m"
GRAY = ESC + "[100m"
BLUE = ESC + "[44m"
CYAN = ESC + "[46m"
RESET = ESC + "[0m"

COLORS = {
    STATUS.UNKNOWN: MAGENTA + BLACK_CIRCLE + RESET,
    STATUS.SUCCESS: GREEN + BLACK_CIRCLE + RESET,
    STATUS.FAILURE: RED + BLACK_CIRCLE + RESET,
    STATUS.ABORTED: YELLOW + BLACK_CIRCLE + RESET,
    STATUS.DISABLED: BLACK + BLACK_CIRCLE + RESET,
    STATUS.UNSTABLE: PINK + BLACK_CIRCLE + RESET,
    STATUS.NOT_BUILT: WHITE + BLACK_CIRCLE + RESET,
    STATUS.BUILDING_FROM_UNKNOWN: MAGENTA + WHITE_CIRCLE + RESET,
    STATUS.BUILDING_FROM_SUCCESS: GREEN + WHITE_CIRCLE + RESET,
    STATUS.BUILDING_FROM_FAILURE: RED + WHITE_CIRCLE + RESET,
    STATUS.BUILDING_FROM_ABORTED: YELLOW + WHITE_CIRCLE + RESET,
    STATUS.BUILDING_FROM_DISABLED: CYAN + WHITE_CIRCLE + RESET,
    STATUS.BUILDING_FROM_UNSTABLE: PINK + WHITE_CIRCLE + RESET,
    STATUS.BUILDING_FROM_NOT_BUILT: WHITE + WHITE_CIRCLE + RESET,
    STATUS.BUILDING_FROM_PREVIOUS_STATE: GRAY + WHITE_CIRCLE + RESET,
    STATUS.POLL_ERROR: BLUE + BLACK_CIRCLE + RESET,
    STATUS.INVALID_STATUS: CYAN + BLACK_CIRCLE + RESET,
}

class Strand(threading.Thread):

    def __init__(self, num_leds=32):
        threading.Thread.__init__(self)
        self.terminate = False
        self.update_event = threading.Event()

        if num_leds < 1:
            raise InputError('num_leds must be greater than zero')
        self.num_leds = num_leds

        self.leds = [' ' for x in range(self.num_leds)]
        self.__update()

        signal.signal(signal.SIGTERM, self._handle_signals)
        signal.signal(signal.SIGINT, self._handle_signals)

    def _handle_signals(self, signum, stack):
        if signum == signal.SIGTERM or signum == signal.SIGINT:
            self.stop()

    def __verify_start_end_range(self, start_index, end_index):
        if start_index < 0 or start_index >= self.num_leds :
            raise InputError('start_index out of range')
        if start_index >= end_index:
            raise InputError('start_index must be less than end_index')
        if end_index < 0 or end_index > self.num_leds :
            raise InputError('end_index out of range')

    def set_status(self, status=STATUS.INVALID_STATUS, start_index=None, end_index=None):
        if start_index is None:
            start_index = 0
        if end_index is None or end_index == 0:
            end_index = self.num_leds
        self.__verify_start_end_range(start_index, end_index)
        for i in range(start_index, end_index):
            self.leds[i] = COLORS[status]

    def __update(self):
        sys.stdout.write(CLEAR_SCREEN)
        sys.stdout.flush()

        sys.stdout.write('[')
        for x in self.leds:
            sys.stdout.write(x)
        sys.stdout.write(']')
        sys.stdout.flush()

    def run(self):
        self.__update()
        while not self.terminate:
            self.update_event.wait(3)
            self.update_event.clear()
            self.__update()

    def stop(self):
        self.terminate = True
        self.update_event.set()
