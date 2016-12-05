import unittest
import os
current_dir = os.path.dirname(os.path.realpath(__file__))
parent_dir = os.path.join(current_dir, "../..")
import sys
sys.path.append(parent_dir)

from datasource.circleci_source import *
from lights.job2light_translator import *

class TestStringMethods(unittest.TestCase):

    def setUp(self):
        api_token = 'some_token'
        endpoint  = 'http://localhost:8000/circleci'
        self.ci = CircleCISource(api_token, endpoint)

    def test_list_projects(self):
        self.assertGreater(len(self.ci.list_projects()), 0)

    def test_successful_build(self):
        self.assertEqual(self.ci.project_status('RosterRight', 'cirrus'), STATUS.SUCCESS)

if __name__ == '__main__':
    unittest.main()
