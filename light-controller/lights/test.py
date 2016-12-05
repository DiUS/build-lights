import time
#import adafruit_lpd8806 as ledstrip
import epistar_lpd8806 as ledstrip
#import console as ledstrip
import signal
from lib.constants import STATUS

led = ledstrip.Strand()


def _handle_signals(signum, stack):
    global led
    if signum == signal.SIGTERM or signum == signal.SIGINT:
        led.stop()


def run():
    global led

    signal.signal(signal.SIGTERM, _handle_signals)
    signal.signal(signal.SIGINT, _handle_signals)

    led.daemon = True
    led.start()

    led.set_status(STATUS.UNKNOWN, 0, 2)
    led.set_status(STATUS.SUCCESS, 2, 4)
    led.set_status(STATUS.FAILURE, 4, 6)
    led.set_status(STATUS.ABORTED, 6, 8)
    led.set_status(STATUS.DISABLED, 8, 10)
    led.set_status(STATUS.UNSTABLE, 10, 12)
    led.set_status(STATUS.NOT_BUILT, 12, 14)
    led.set_status(STATUS.BUILDING_FROM_UNKNOWN, 14, 16)
    led.set_status(STATUS.BUILDING_FROM_SUCCESS, 16, 18)
    led.set_status(STATUS.BUILDING_FROM_FAILURE, 18, 20)
    led.set_status(STATUS.BUILDING_FROM_ABORTED, 20, 22)
    led.set_status(STATUS.BUILDING_FROM_DISABLED, 22, 24)
    led.set_status(STATUS.BUILDING_FROM_UNSTABLE, 24, 26)
    led.set_status(STATUS.BUILDING_FROM_NOT_BUILT, 26, 28)
    led.set_status(STATUS.POLL_ERROR, 28, 30)
    led.set_status(STATUS.INVALID_STATUS, 30, 32)

    while True:
        led.join(1000)
        if not led.isAlive():
            break
    print 'terminated\n'



if __name__ == "__main__":
    run()
