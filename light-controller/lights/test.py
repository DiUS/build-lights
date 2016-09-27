import time
import ledstrip
import signal

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

    print 'Fill LEDs\n'
    led.fill(255,0,0,False,0,3)
    led.fill(0,255,0,True,3,6)
    led.fill(0,0,255,False,6,9)
    led.fill(255,255,0,True,9,12)
    led.fill(255,0,255,False,12,15)
    led.fill(0,255,255,True,15,18)
    led.fill(255,255,255,False,18,21)
    led.fill(80,127,255,True,21)

    time.sleep(1)
    led.setblink(2, True)
    led.setblinkrange(True, 8, 9)
    led.setblink(13, True)
    led.setblink(19, True)

    print '\n'
    print 'LED join\n'
    while True:
        led.join(1000)
        if not led.isAlive():
            break
    print 'terminated\n'



if __name__ == "__main__":
    run()
