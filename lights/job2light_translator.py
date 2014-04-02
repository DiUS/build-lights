""" job to light translator """

import sys
sys.path.append("../lib")

import error
import enum


STATUS = enum.Enum('UNKNOWN',
                   'SUCCESS',
                   'FAILURE',
                   'BUILDING_FROM_UNKNOWN',
                   'BUILDING_FROM_SUCCESS',
                   'BUILDING_FROM_FAILURE',
                   'INTERNAL_ERROR')



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
