import unittest
from ci_server.bamboo import Source
from lib.constants import STATUS

class BambooTest(unittest.TestCase):

    def setUp(self):
        self.baseUrl  = 'http://localhost:8000/bamboo'
        self.source = Source(self.baseUrl)

    def test_list_projects(self):
        projects = self.source.list_projects()
        self.assertTrue('JOB-BROK' in projects)
        self.assertTrue('JOB-GOOD' in projects)

    def test_returns_failure_for_failed_build(self):
        self.assertEqual(self.source.project_status('JOB-BROK'), STATUS.FAILURE)

    def test_returns_success_for_good_build(self):
        self.assertEqual(self.source.project_status('JOB-GOOD'), STATUS.SUCCESS)

    def test_shows_building_from_success(self):
        self.assertEqual(self.source.project_status('JOB-BUILDING'), STATUS.BUILDING_FROM_PREVIOUS_STATE)

    def test_returns_poll_error_for_build_that_doesnt_exist(self):
        self.assertEqual(self.source.project_status('missing-project'), STATUS.POLL_ERROR)

    def test_still_works_when_url_has_trailing_slash(self):
        projects = Source(self.baseUrl + '/').list_projects()
        self.assertTrue('JOB-BROK' in projects)
        self.assertTrue('JOB-GOOD' in projects)
