import unittest
from datasource.circleci_source import CircleCISource
from lib.constants import STATUS

class CircleCISourceTest(unittest.TestCase):

    def setUp(self):
        api_token = 'some_token'
        username  = 'my_username'
        endpoint  = 'http://localhost:8000/circleci'
        self.ci = CircleCISource(api_token, username, endpoint)

    def test_list_projects(self):
        projects = self.ci.list_projects()
        self.assertTrue('project1' in projects)
        self.assertTrue('project2' in projects)

    def test_successful_build(self):
        self.assertEqual(self.ci.project_status('project1'), STATUS.SUCCESS)
