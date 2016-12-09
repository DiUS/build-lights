import unittest
from ci_server.jenkins import Source
from lib.constants import STATUS

class JenkinsTest(unittest.TestCase):

    def setUp(self):
        self.source = Source('http://localhost:8000/jenkins/')

    def test_list_projects(self):
        projects = self.source.list_projects()
        self.assertTrue('stablejob' in projects)
        self.assertTrue('unstablejob' in projects)

    def test_successful_build(self):
        self.assertEqual(self.source.project_status('stablejob'), STATUS.SUCCESS)

    def test_project_status_returns_poll_error_when_job_doesnt_exist(self):
        self.assertEqual(self.source.project_status('unknown_job'), STATUS.POLL_ERROR)
