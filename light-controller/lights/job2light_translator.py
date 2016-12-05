""" job to light translator """
import os
current_dir = os.path.dirname(os.path.realpath(__file__))
parent_dir = os.path.join(current_dir, "..")
import sys
sys.path.append(parent_dir)

from lib import error

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
