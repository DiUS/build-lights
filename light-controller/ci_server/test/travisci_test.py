import unittest
from ci_server.travisci import Source
from lib.constants import STATUS

class TravisCITest(unittest.TestCase):

    def setUp(self):
        username = 'DiUS'
        uri = 'http://localhost:8000/travisci'
        self.source = Source(username, uri)

    def test_list_projects(self):
        projects = self.source.list_projects()
        self.assertTrue('build-lights' in projects)

    def test_returns_success_for_good_build(self):
        self.assertEqual(self.source.project_status('build-lights'), STATUS.SUCCESS)

    def test_returns_poll_error_for_build_that_doesnt_exist(self):
        self.assertEqual(self.source.project_status('missing-build'), STATUS.POLL_ERROR)

    def test_returns_unknown_if_no_status_is_returned(self):
        self.assertEqual(self.source.project_status('disabled-job'), STATUS.UNKNOWN)
