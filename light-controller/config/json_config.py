""" Config reader """

try:
    import json
except ImportError:
    import simplejson as json
import jsonschema
from jsonschema import validate
from jsonschema import ValidationError

from lib import error
from lib import list_utils
from lib import json_custom_decode


class Error(error.Generic):
    """Base class for light controller module exceptions"""
    pass

class ConfigError(Error):
    """Config error"""
    def __init__(self, filename, message):
        super(ConfigError, self).__init__('Error in config file ' + filename + ': ' + message)

class JsonConfig(object):

    def __init__(self, config_file='config.json'):
        self.config_file = config_file
        self._load_config()
        self._check_config_is_valid()

    def _load_config(self):
        f = open(self.config_file, 'r')
        self.config = json.load(f, object_hook=json_custom_decode.decode_unicode_to_str_dict)
        f.close()

    def _check_config_is_valid(self):

        self._check_config_against_schema()

        if not list_utils.list_items_unique(self.config['jobs']):
            raise ConfigError(self.config_file, 'jobs must be unique.')

    def _check_config_against_schema(self):
        with open('./config/config_schema.json') as data_file:
            schema = json.load(data_file)
        try:
            validate(self.config, schema)
        except ValidationError as ve:
            raise ConfigError(self.config_file, str(ve.message).encode('utf-8'))

    def get_jobs(self):
        return self.config['jobs']

    def get_light_config(self):
        return self.config['light']

    def get_api_config(self):
        return self.config['api']
