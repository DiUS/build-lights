""" job to LED strip """
import os
current_dir = os.path.dirname(os.path.realpath(__file__))
parent_dir = os.path.join(current_dir, "..")
import sys
sys.path.append(parent_dir)

from lib import logger
from lib import list_utils
from lights import job2light_translator



class Job2LedStrip(job2light_translator.Job2LightTranslator):

    def __init__(self, jobs, strand):
        self.logger = logger.Logger('JenkinsPoller')
        self.strand = strand

        # order of the jobs is important
        self.jobs = list(list_utils.flatten_list(jobs))
        if len(self.jobs) == 0 or len(self.jobs) > self.strand.num_leds:
            raise job2light_translator.InputError('Unable to map ' + str(len(self.jobs)) + ' jobs to ' + str(self.strand.num_leds) + ' LEDs')
        self.offset = dict.fromkeys(self.jobs)
        self.leds_per_job = int(self.strand.num_leds / len(self.jobs))

        index = 0
        for name in self.jobs:
            self.offset[name] = index
            index = index + self.leds_per_job
        #self.logger.log('self.jobs: %s', self.jobs)

    def update(self, job_name, job_status):
        #self.logger.log('%s:%s', job_name, job_status)
        if job_name in self.offset.keys():
            kwargs = {}
            kwargs['start_index'] = self.offset[job_name]
            kwargs['end_index']   = self.offset[job_name] + self.leds_per_job
            kwargs['status']      = job_status

            self.strand.set_status(**kwargs)
