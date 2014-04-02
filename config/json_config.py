""" Config reader """
import sys
sys.path.append("../lib")

try:
    import json
except ImportError:
    import simplejson as json

import logger
import json_custom_decode


class JsonConfig(object):

    def __init__(self, config_file='config.json'):
        self.logger = logger.Logger('JsonConfig')
        self.config_file = config_file

        f = open(self.config_file, 'r')
        #self.config = json.load(f, object_hook=json_custom_decode.decode_unicode_to_str_dict)
        self.config = json.load(f)
        f.close()

    def get_jobs(self):
        return self.config['jobs']

    def get_light_config(self):
        return self.config['light']

    def get_api_config(self):
        return self.config['api']
