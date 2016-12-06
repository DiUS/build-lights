import unittest
from datasource.jenkins import Source
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
