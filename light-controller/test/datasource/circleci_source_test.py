import unittest
import os
current_dir = os.path.dirname(os.path.realpath(__file__))
parent_dir = os.path.join(current_dir, "../..")
import sys
sys.path.append(parent_dir)

from datasource.circleci_source import CircleCISource
from lib.constants import STATUS

class TestStringMethods(unittest.TestCase):

    def setUp(self):
        api_token = 'some_token'
        endpoint  = 'http://localhost:8000/circleci'
        self.ci = CircleCISource(api_token, endpoint)

    def test_list_projects(self):
        projects = self.ci.list_projects('my_username')
        self.assertTrue('project1' in projects)
        self.assertTrue('project2' in projects)

    def test_successful_build(self):
        self.assertEqual(self.ci.project_status('my_username', 'project1'), STATUS.SUCCESS)

if __name__ == '__main__':
    unittest.main()
