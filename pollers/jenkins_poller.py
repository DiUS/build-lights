""" jenkins poller """
import sys
sys.path.append("../lib")

import urllib2

import logger


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

        self.monitor.process_build(response_body)
