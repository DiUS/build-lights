""" job to light translator """
import os
current_dir = os.path.dirname(os.path.realpath(__file__))
parent_dir = os.path.join(current_dir, "..")
import sys
sys.path.append(parent_dir)

from lib import error
from lib import enum


STATUS = enum.Enum('UNKNOWN',
                   'SUCCESS',
                   'FAILURE',
                   'ABORTED',
                   'DISABLED',
                   'UNSTABLE',
                   'NOT_BUILT',
                   'BUILDING_FROM_UNKNOWN',
                   'BUILDING_FROM_SUCCESS',
                   'BUILDING_FROM_FAILURE',
                   'BUILDING_FROM_ABORTED',
                   'BUILDING_FROM_DISABLED',
                   'BUILDING_FROM_UNSTABLE',
                   'BUILDING_FROM_NOT_BUILT',
                   'POLL_ERROR',
                   'INVALID_STATUS')



class Error(error.Generic):
    """Base class for job2light translator module exceptions"""
    pass

class InputError(Error):
    """Range error"""
    pass



class Job2LightTranslator(object):

    def __init__(self, jobs):
        self.jobs = dict.fromkeys(jobs)

    def update(self):
        pass
