import unittest
from config.json_config import *

class JsonConfigTest(unittest.TestCase):

    def test_errors_if_config_violates_schema(self):
        try:
            JsonConfig('./config/test/invalid_config_missing_jobs.json')
            self.assertTrue(False)
        except ConfigError as ce:
            self.assertEquals("Error in config file ./config/test/invalid_config_missing_jobs.json: u'jobs' is a required property", str(ce))

    def test_errors_if_config_has_duplicated_job_names(self):
        try:
            JsonConfig('./config/test/invalid_config_duplicated_job_names.json')
            self.assertTrue(False)
        except ConfigError as ce:
            self.assertEquals('jobs must be unique.', str(ce))

    def test_accepts_valid_config(self):
        JsonConfig('./config/test/valid_config.json')
