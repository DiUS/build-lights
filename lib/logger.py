""" Logger
"""
import sys
import syslog
import os
import traceback

class Logger(object):
    """Provides ability to log to syslog or stdout

    To route log messages to syslog, at the start of the program do:
    logger.Logger.use_syslog = True
    """
    use_syslog = False

    def __init__(self, module_name):
        self.__name = module_name
        if self.__class__.use_syslog:
            syslog.openlog(os.path.basename(sys.argv[0]), syslog.LOG_PID)
            #syslog.openlog(os.path.basename(sys.argv[0]), syslog.LOG_PID, syslog.LOG_DAEMON)

    def __del__(self):
        if self.__class__.use_syslog:
            syslog.closelog()

    def log(self, message, *args):
        """Print a log message"""
        if args:
            text = self.__name + ": " + (message % args).encode("string_escape")
        else:
            text = self.__name + ": " + message.encode("string_escape")

        if type(self).use_syslog:
            syslog.syslog(syslog.LOG_INFO, text)
        else:
            print text


def print_trace(e):
    """Print exception trace"""
    d = Logger(module_name=os.path.basename(sys.argv[0]))
    trace = traceback.format_exc().split('\n')
    d.log("Unhandled exception: %s - %s", str(e.__class__), str(e))
    d.log("Exception trace:")
    for l in trace:
        d.log("  %s", l)
    del d
