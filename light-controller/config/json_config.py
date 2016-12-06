""" Config reader """
import os
current_dir = os.path.dirname(os.path.realpath(__file__))
parent_dir = os.path.join(current_dir, "..")
import sys
sys.path.append(parent_dir)

try:
    import json
except ImportError:
    import simplejson as json

from lib import logger
from lib import error
from lib import list_utils
from lib import json_custom_decode


class Error(error.Generic):
    """Base class for light controller module exceptions"""
    pass

class ConfigError(Error):
    """Config error"""
    pass



class JsonConfig(object):

    mandatory_items = [
        'api',
        'light',
        'jobs'
    ]

    def __init__(self, config_file='config.json'):
        self.logger = logger.Logger('JsonConfig')
        self.config_file = config_file

        f = open(self.config_file, 'r')
        self.logger.log('Reading config file: %s', self.config_file)
        self.config = json.load(f, object_hook=json_custom_decode.decode_unicode_to_str_dict)
        f.close()

        for item in JsonConfig.mandatory_items:
            if not self.config.has_key(item):
                raise ConfigError('\"' + item + '\" not found in config file.')
        if not self.config['api'].has_key('type'):
            raise ConfigError('api \"type\" not found in config file.')
        if not self.config['light'].has_key('type'):
            raise ConfigError('light \"type\" not found in config file.')
        if not list_utils.list_items_unique(self.config['jobs']):
            raise ConfigError('jobs must be unique.')

    def get_jobs(self):
        return self.config['jobs']

    def get_light_config(self):
        return self.config['light']

    def get_api_config(self):
        return self.config['api']
