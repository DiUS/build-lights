""" jenkins monitor """
import os
current_dir = os.path.dirname(os.path.realpath(__file__))
parent_dir = os.path.join(current_dir, "..")
import sys
sys.path.append(parent_dir)

from lib import logger
from lib import list_utils
from lights import job2light_translator


class JenkinsAwsSqsMonitor(object):

    status_dict = {
        'FAILURE' : 'red',
        'SUCCESS' : 'green',
        'ABORTED' : 'white'
        #'aborted'         : job2light_translator.STATUS.ABORTED,
        #'aborted_anime'   : job2light_translator.STATUS.BUILDING_FROM_ABORTED,
        #'blue'            : job2light_translator.STATUS.SUCCESS,
        #'blue_anime'      : job2light_translator.STATUS.BUILDING_FROM_SUCCESS,
        #'disabled'        : job2light_translator.STATUS.DISABLED,
        #'disabled_anime'  : job2light_translator.STATUS.BUILDING_FROM_DISABLED,
        #'grey'            : job2light_translator.STATUS.UNKNOWN,
        #'grey_anime'      : job2light_translator.STATUS.BUILDING_FROM_UNKNOWN,
        #'notbuilt'        : job2light_translator.STATUS.NOT_BUILT,
        #'notbuilt_anime'  : job2light_translator.STATUS.BUILDING_FROM_NOT_BUILT,
        #'red'             : job2light_translator.STATUS.FAILURE,
        #'red_anime'       : job2light_translator.STATUS.BUILDING_FROM_FAILURE,
        #'yellow'          : job2light_translator.STATUS.UNSTABLE,
        #'yellow_anime'    : job2light_translator.STATUS.BUILDING_FROM_UNSTABLE
    }

    def __init__(self, jobs, translator):
        self.logger = logger.Logger('JenkinsAwsSqsMonitor')
        self.translator = translator
        self.pipeline = jobs
        self.jobs = dict.fromkeys(list_utils.flatten_list(jobs))

    def process_build(self, directive):
        if directive is not None:
            self.__process_directive(directive)
        else:
            for name in self.jobs:
                self.jobs[name] = job2light_translator.STATUS.POLL_ERROR

        #self.logger.log('Jobs: %s', self.jobs)

        for job_name, status in self.jobs.iteritems():
            self.translator.update(job_name, status)



    def __process_directive(self, directive):
        if directive == 'all_off':
            # TODO: exclude index 0 of each pipeline
            for name in self.jobs:
                self.jobs[name] = job2light_translator.STATUS.DISABLED
            return

        jenkins_regex = r"Build ([A-Z]+): (.*) #"
        match = re.search(jenkins_regex, directive)
        if match is None:
            return
        found_colour = match.group(1)
        job_name = match.group(2)

        found_pipeline = list_utils.find_list_given_value(self.pipeline, job_name)
        if len(found_pipeline) == 0:
            return
        found_segment_number = found_pipeline.index(job_name)
        if found_colour not in JenkinsAwsSqsMonitor.status_dict:
            self.jobs[job_name] = job2light_translator.STATUS.DISABLED
            return

        if found_segment_number == 0:
            # TODO: issue start build
            # TODO: exclude index 0 of each pipeline
            return

        if found_segment_number == 1 and re.match('.*Unit.*', directive):
            # TODO: issue found_colour to entire pipeline
            # TODO: exclude index 0 of each pipeline
            return

        self.jobs[job_name] = JenkinsAwsSqsMonitor.status_dict[found_colour]

