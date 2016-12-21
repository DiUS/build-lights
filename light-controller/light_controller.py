#!/usr/bin/python
""" Build light controller """

import os
current_dir = os.path.dirname(os.path.realpath(__file__))
import sys
sys.path.append(current_dir)

import signal
import getopt
import importlib

from lib import daemonize
from lib import logger
from lib import list_utils
from lib.constants import STATUS
from config import json_config
from lights import job2ledstrip

default_config_file = 'config.json'
light = None
dlogger = None

class LightController:

    def _write_pid(self, filename):
        global dlogger

        try:
            pidfile = open(filename, "w")
            pidfile.write("%d\n" % os.getpid())
            pidfile.close()
        except IOError, e:
            dlogger.log("ERROR: unable to write pid file %s: %s", filename, str(e))

    def _unlink_pid(self, filename):
        try:
            os.unlink(filename)
        except:
            pass

    def _handle_signals(self, signum, stack):
        global light
        if signum == signal.SIGTERM or signum == signal.SIGINT:
            if light is not None:
                light.stop()

    def _print_usage(self, prog_cmd):
        print "Usage: %s [options]" % prog_cmd
        print "Options:"
        print "-b           --daemonize         Run in the background."
        print "-l           --syslog            Log output to syslog."
        print "-c <file>    --config <file>     Config file, default \"%s\"." % default_config_file
        print "-h           --help              Print this help page."

    def __init__(self):
        global light
        global dlogger

        background = False
        forcesyslog = False
        config_file = default_config_file
        dlogger = logger.Logger(os.path.basename(sys.argv[0]))

        try:
            (opts, args) = getopt.getopt(sys.argv[1:], "hblc:", ["help", "daemonize", "syslog", "config="])
        except getopt.error, why:
            dlogger.log("Error: getopt error: %s", why)
            self._print_usage(sys.argv[0])
            sys.exit(-1)

        try:
            for opt in opts:
                if opt[0] == "-h" or opt[0] == "--help":
                    self._print_usage(sys.argv[0])
                    sys.exit(1)
                if opt[0] == "-b" or opt[0] == "--daemonize":
                    background = True
                    continue
                if opt[0] == "-l" or opt[0] == "--syslog":
                    forcesyslog = True
                    continue
                if opt[0] == "-c" or opt[0] == "--config":
                    config_file = opt[1]
                    continue
                self._print_usage(sys.argv[0])
                sys.exit(-1)
        except ValueError, why:
            dlogger.log("Error: bad parameter \"%s\" for option %s: %s", opt[1], opt[0], why)
            self._print_usage(sys.argv[0])
            sys.exit(-1)

        if forcesyslog:
            logger.Logger.use_syslog = True

        if background:
            logger.Logger.use_syslog = True
            daemonize.createDaemon()

        if not os.path.isfile(config_file):
            dlogger.log("ERROR: config file %s not found.", config_file)
            sys.exit(-1)

        try:
            self.conf = json_config.JsonConfig(config_file)
        except Exception, e:
            logger.print_trace(e)
            sys.exit(-1)

        ci_server_conf = self.conf['ci_server']
        ci_server_type = ci_server_conf.pop('type')
        self.poll_interval_seconds = ci_server_conf.pop('pollrate_s', None)
        self.ci = importlib.import_module('ci_server.' + ci_server_type).Source(**ci_server_conf)

    def list_projects(self):
        return self.ci.list_projects()

    def control_lights(self):
        light_conf = self.conf['light']
        light_type = light_conf.pop('type')
        light = importlib.import_module('lights.' + light_type).Strand(**light_conf)

        jobs = self.conf['jobs']
        if len(jobs) < 1:
            dlogger.log("No jobs have been configured")
            sys.exit(-1)

        translator = job2ledstrip.Job2LedStrip(jobs, light)

        dlogger.log("Starting light controller")
        pidfilename = "/var/run/%s.pid" % os.path.basename(sys.argv[0])
        self._write_pid(pidfilename)

        try:
            light.daemon = True
            light.start()

            for job in jobs:
                translator.update(job, STATUS.UNKNOWN)
            while True:
                for job in jobs:
                    status = self.ci.project_status(job)
                    translator.update(job, status)
                light.join(self.poll_interval_seconds)
                if not light.isAlive():
                    break
        except Exception, e:
            logger.print_trace(e)
            sys.exit(-1)

        self._unlink_pid(pidfilename)
        dlogger.log("Terminated light controller")

if __name__ == "__main__":
    lc = LightController()
    signal.signal(signal.SIGTERM, lc._handle_signals)
    signal.signal(signal.SIGINT, lc._handle_signals)
    # print lc.list_projects()
    lc.control_lights()
