import unittest
from ci_server.buildkite import Source
from lib.constants import STATUS

class BuildkiteTest(unittest.TestCase):

    def setUp(self):
        api_token = 'some_token'
        username  = 'my_username'
        endpoint  = 'http://localhost:8000/buildkite'
        self.source = Source(api_token, username, endpoint)

    def test_list_projects(self):
        projects = self.source.list_projects()
        self.assertTrue('project1' in projects)
        self.assertTrue('project2' in projects)
    
    def test_list_projects_with_space_in_orgname(self):
        self.source = Source('api_token', 'test space', 'xxx')
        self.assertEqual(self.source.username, 'test-space')

    def test_returns_success_for_good_build(self):
        self.assertEqual(self.source.project_status('project1'), STATUS.SUCCESS)

    def test_returns_poll_error_for_build_that_doesnt_exist(self):
        self.assertEqual(self.source.project_status('missing_project'), STATUS.POLL_ERROR)
