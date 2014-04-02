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

        # TODO: handle error
      response_body = urllib2.urlopen(req).read()
      self.monitor.process_build(response_body)


