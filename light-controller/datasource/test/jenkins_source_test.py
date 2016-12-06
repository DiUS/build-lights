import unittest
from datasource.jenkins_source import JenkinsSource
from lib.constants import STATUS

class JenkinsSourceTest(unittest.TestCase):

    def setUp(self):
        self.ci = JenkinsSource('http://localhost:8000/jenkins/')

    def test_list_projects(self):
        self.assertGreater(len(self.ci.list_projects()), 0)

    def test_successful_build(self):
        self.assertEqual(self.ci.project_status('stablejob'), STATUS.SUCCESS)
