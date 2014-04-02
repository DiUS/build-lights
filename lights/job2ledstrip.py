""" job to LED strip """
import sys
sys.path.append("../lib")

import logger
import job2light_translator


class Job2LedStrip(job2light_translator.Job2LightTranslator):

    def __init__(self, jobs, strand):
        self.logger = logger.Logger('JenkinsPoller')
        self.strand = strand
        self.jobs = dict.fromkeys(jobs)

        self.leds_per_job = self.strand.num_leds / len(self.jobs)
        index = 0
        for job_name in self.jobs:
            self.jobs[job_name] = index
            index = index + self.leds_per_job
        #self.logger.log('self.jobs: %s', self.jobs)

    def update(self, job_name, job_status):
        #self.logger.log('%s:%s', job_name, job_status)
        if job_name in self.jobs.keys():
            if (job_status == job2light_translator.STATUS.SUCCESS):
                self.strand.fill(0, 255, 0, False, start_index=self.jobs[job_name], end_index=self.jobs[job_name] + self.leds_per_job)
            elif (job_status == job2light_translator.STATUS.FAILURE):
                self.strand.fill(255, 0, 0, False, start_index=self.jobs[job_name], end_index=self.jobs[job_name] + self.leds_per_job)
            elif (job_status == job2light_translator.STATUS.BUILDING_FROM_SUCCESS):
                self.strand.fill(0, 255, 0, True, start_index=self.jobs[job_name], end_index=self.jobs[job_name] + self.leds_per_job)
            elif (job_status == job2light_translator.STATUS.BUILDING_FROM_FAILURE):
                self.strand.fill(255, 0, 0, True, start_index=self.jobs[job_name], end_index=self.jobs[job_name] + self.leds_per_job)
            elif (job_status == job2light_translator.STATUS.BUILDING_FROM_UNKNOWN):
                self.strand.fill(255, 255, 0, True, start_index=self.jobs[job_name], end_index=self.jobs[job_name] + self.leds_per_job)
            elif (job_status == job2light_translator.STATUS.UNKNOWN):
                self.strand.fill(255, 255, 0, False, start_index=self.jobs[job_name], end_index=self.jobs[job_name] + self.leds_per_job)
            else:
                self.strand.fill(0, 0, 0, False, start_index=self.jobs[job_name], end_index=self.jobs[job_name] + self.leds_per_job)
