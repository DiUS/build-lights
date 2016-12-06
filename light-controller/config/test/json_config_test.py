import unittest
from config.json_config import *

class JsonConfigTest(unittest.TestCase):

    def test_errors_if_config_violates_schema(self):
        try:
            JsonConfig('./config/test/invalid_config.json')
            self.assertTrue(False)
        except ConfigError as ce:
            self.assertEquals('', ce.message)

    def test_accepts_valid_config(self):
        JsonConfig('./config/test/valid_config.json')
