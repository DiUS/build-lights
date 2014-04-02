""" jenkins monitor """
import sys
sys.path.append("../lib")
sys.path.append("../light")

try:
    import json
except ImportError:
    import simplejson as json

import logger
import json_custom_decode
import job2light_translator


class JenkinsMonitor(object):

    status_dict = {
      'aborted'         : job2light_translator.STATUS.UNKNOWN,
      'aborted_anime'   : job2light_translator.STATUS.BUILDING_FROM_UNKNOWN,
      'blue'            : job2light_translator.STATUS.SUCCESS,
      'blue_anime'      : job2light_translator.STATUS.BUILDING_FROM_SUCCESS,
      'disabled'        : job2light_translator.STATUS.UNKNOWN,
      'disabled_anime'  : job2light_translator.STATUS.BUILDING_FROM_UNKNOWN,
      'grey'            : job2light_translator.STATUS.UNKNOWN,
      'grey_anime'      : job2light_translator.STATUS.BUILDING_FROM_UNKNOWN,
      'notbuilt'        : job2light_translator.STATUS.UNKNOWN,
      'notbuilt_anime'  : job2light_translator.STATUS.BUILDING_FROM_UNKNOWN,
      'red'             : job2light_translator.STATUS.FAILURE,
      'red_anime'       : job2light_translator.STATUS.BUILDING_FROM_FAILURE,
      'yellow'          : job2light_translator.STATUS.UNKNOWN,
      'yellow_anime'    : job2light_translator.STATUS.BUILDING_FROM_UNKNOWN
    }

    def __init__(self, jobs, translator):
        self.logger = logger.Logger('JenkinsMonitor')
        self.translator = translator
        self.jobs = dict.fromkeys(jobs)

    def process_build(self, build_json_rsp):
        parsed_rsp = json.loads(build_json_rsp, object_hook=json_custom_decode.decode_unicode_to_str_dict)
        self.jobs = self.__parse_build(parsed_rsp)

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
            return { job['name'] : job2light_translator.STATUS.INTERNAL_ERROR }

    # returns dictionary of build_name to current status
    def __parse_build(self, build):
        jobs = filter( self.__filter_build, build['jobs'] )
        updated_statuses = map( self.__jenkins_to_rpi, jobs )
        return dict(map(dict.popitem, updated_statuses))

