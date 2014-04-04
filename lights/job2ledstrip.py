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

        if len(jobs) == 0 or len(jobs) > self.strand.num_leds:
            raise job2light_translator.InputError('Unable to map ' + len(jobs) + ' jobs to ' + self.strand.num_leds + ' LEDs')
        # order of the jobs is important
        self.jobs = list(list_utils.flatten_list(jobs))
        self.offset = dict.fromkeys(jobs)
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

            if (job_status == job2light_translator.STATUS.BUILDING_FROM_PREVIOUS_STATE):
                kwargs['blink'] = True
                self.strand.setblinkrange(**kwargs)
                return


            # TODO: convert colours to lookup table

            elif (job_status == job2light_translator.STATUS.UNKNOWN):
                # purple
                kwargs['r']     = 102
                kwargs['g']     = 0
                kwargs['b']     = 204
                kwargs['blink'] = False

            elif (job_status == job2light_translator.STATUS.SUCCESS):
                # green
                kwargs['r']     = 0
                kwargs['g']     = 204
                kwargs['b']     = 0
                kwargs['blink'] = False

            elif (job_status == job2light_translator.STATUS.FAILURE):
                # red
                kwargs['r']     = 204
                kwargs['g']     = 0
                kwargs['b']     = 0
                kwargs['blink'] = False

            elif (job_status == job2light_translator.STATUS.ABORTED):
                # yellow
                kwargs['r']     = 204
                kwargs['g']     = 204
                kwargs['b']     = 0
                kwargs['blink'] = False

            elif (job_status == job2light_translator.STATUS.DISABLED):
                # off
                kwargs['r']     = 0
                kwargs['g']     = 0
                kwargs['b']     = 0
                kwargs['blink'] = False

            elif (job_status == job2light_translator.STATUS.UNSTABLE):
                # pink
                kwargs['r']     = 204
                kwargs['g']     = 0
                kwargs['b']     = 204
                kwargs['blink'] = False

            elif (job_status == job2light_translator.STATUS.NOT_BUILT):
                # white
                kwargs['r']     = 204
                kwargs['g']     = 204
                kwargs['b']     = 204
                kwargs['blink'] = False

            elif (job_status == job2light_translator.STATUS.BUILDING_FROM_UNKNOWN):
                # purple
                kwargs['r']     = 102
                kwargs['g']     = 0
                kwargs['b']     = 204
                kwargs['blink'] = True

            elif (job_status == job2light_translator.STATUS.BUILDING_FROM_SUCCESS):
                # green
                kwargs['r']     = 0
                kwargs['g']     = 204
                kwargs['b']     = 0
                kwargs['blink'] = True

            elif (job_status == job2light_translator.STATUS.BUILDING_FROM_FAILURE):
                # red
                kwargs['r']     = 204
                kwargs['g']     = 0
                kwargs['b']     = 0
                kwargs['blink'] = True

            elif (job_status == job2light_translator.STATUS.BUILDING_FROM_ABORTED):
                # yellow
                kwargs['r']     = 204
                kwargs['g']     = 204
                kwargs['b']     = 0
                kwargs['blink'] = True

            elif (job_status == job2light_translator.STATUS.BUILDING_FROM_DISABLED):
                # cyan
                kwargs['r']     = 0
                kwargs['g']     = 204
                kwargs['b']     = 204
                kwargs['blink'] = True

            elif (job_status == job2light_translator.STATUS.BUILDING_FROM_UNSTABLE):
                # pink
                kwargs['r']     = 204
                kwargs['g']     = 0
                kwargs['b']     = 204
                kwargs['blink'] = True

            elif (job_status == job2light_translator.STATUS.BUILDING_FROM_NOT_BUILT):
                # white
                kwargs['r']     = 204
                kwargs['g']     = 204
                kwargs['b']     = 204
                kwargs['blink'] = True

            elif (job_status == job2light_translator.STATUS.POLL_ERROR):
                # blue
                kwargs['r']     = 0
                kwargs['g']     = 0
                kwargs['b']     = 204
                kwargs['blink'] = False

            elif (job_status == job2light_translator.STATUS.INVALID_STATUS):
                # cyan
                kwargs['r']     = 0
                kwargs['g']     = 204
                kwargs['b']     = 204
                kwargs['blink'] = False

            else:
                # off
                kwargs['r']     = 0
                kwargs['g']     = 0
                kwargs['b']     = 0
                kwargs['blink'] = False

            self.strand.fill(**kwargs)
