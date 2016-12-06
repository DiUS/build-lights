import unittest
from datasource.travisci import Source
from lib.constants import STATUS

class TravisCITest(unittest.TestCase):

    def setUp(self):
        username = 'DiUS'
        uri = 'http://localhost:8000/travisci'
        self.source = Source(username, uri)

    def test_list_projects(self):
        projects = self.source.list_projects()
        self.assertTrue('build-lights' in projects)

    # def test_successful_build(self):
    #     self.assertEqual(self.source.project_status('build-lights'), STATUS.SUCCESS)
