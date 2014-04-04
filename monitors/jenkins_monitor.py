""" jenkins monitor """
import os
current_dir = os.path.dirname(os.path.realpath(__file__))
parent_dir = os.path.join(current_dir, "..")
import sys
sys.path.append(parent_dir)

try:
    import json
except ImportError:
    import simplejson as json

from lib import logger
from lib import list_utils
from lib import json_custom_decode
from lights import job2light_translator


class JenkinsMonitor(object):

    status_dict = {
        'aborted'         : job2light_translator.STATUS.ABORTED,
        'aborted_anime'   : job2light_translator.STATUS.BUILDING_FROM_ABORTED,
        'blue'            : job2light_translator.STATUS.SUCCESS,
        'blue_anime'      : job2light_translator.STATUS.BUILDING_FROM_SUCCESS,
        'disabled'        : job2light_translator.STATUS.DISABLED,
        'disabled_anime'  : job2light_translator.STATUS.BUILDING_FROM_DISABLED,
        'grey'            : job2light_translator.STATUS.UNKNOWN,
        'grey_anime'      : job2light_translator.STATUS.BUILDING_FROM_UNKNOWN,
        'notbuilt'        : job2light_translator.STATUS.NOT_BUILT,
        'notbuilt_anime'  : job2light_translator.STATUS.BUILDING_FROM_NOT_BUILT,
        'red'             : job2light_translator.STATUS.FAILURE,
        'red_anime'       : job2light_translator.STATUS.BUILDING_FROM_FAILURE,
        'yellow'          : job2light_translator.STATUS.UNSTABLE,
        'yellow_anime'    : job2light_translator.STATUS.BUILDING_FROM_UNSTABLE
    }

    def __init__(self, jobs, translator):
        self.logger = logger.Logger('JenkinsMonitor')
        self.translator = translator
        jobs = list_utils.flatten_list(jobs)
        self.jobs = dict.fromkeys(jobs)

    def process_build(self, build_json_rsp):
        if build_json_rsp is not None:
            parsed_rsp = json.loads(build_json_rsp, object_hook=json_custom_decode.decode_unicode_to_str_dict)
            self.jobs = self.__parse_build(parsed_rsp)
        else:
            for name in self.jobs:
                self.jobs[name] = job2light_translator.STATUS.POLL_ERROR

        #self.logger.log('Jobs: %s', self.jobs)

        for job_name, status in self.jobs.iteritems():
            self.translator.update(job_name, status)

    # return true for only the jobs we're interested in
    def __filter_build(self, build):
        return build['name'] in self.jobs

    # map jenkins job entries to our jobs
    def __jenkins_to_rpi(self, job):
        if job['color'] in JenkinsMonitor.status_dict:
            return { job['name'] : JenkinsMonitor.status_dict[job['color']] }
        else:
            return { job['name'] : job2light_translator.STATUS.INVALID_STATUS }

    # returns dictionary of build_name to current status
    def __parse_build(self, build):
        jobs = filter( self.__filter_build, build['jobs'] )
        updated_statuses = map( self.__jenkins_to_rpi, jobs )
        return dict(map(dict.popitem, updated_statuses))
