""" jenkins poller """
import os
current_dir = os.path.dirname(os.path.realpath(__file__))
parent_dir = os.path.join(current_dir, "..")
import sys
sys.path.append(parent_dir)

import urllib2

from lib import logger


class JenkinsPoller(object):

    def __init__(self, url, monitor):
        self.logger = logger.Logger('JenkinsPoller')
        self.url = url
        self.monitor = monitor

    def poll(self):
        req = urllib2.Request(self.url)
        req.add_header('Content-Type', 'application/json')

        response_body = None
        try:
            rsp = urllib2.urlopen(req)
            if rsp is not None:
                response_body = rsp.read()
        except urllib2.URLError, e:
            self.logger.log('URL error: %s', str(e.reason))
            response_body = None
        except urllib2.httplib.BadStatusLine, e:
            self.logger.log('HTTP bad status line: %s', str(e.reason))
            response_body = None

        self.monitor.process_build(response_body)
