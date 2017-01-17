import urllib, json
from lib.constants import STATUS
from lib import logger

_STATUS = {
    'running'   : STATUS.BUILDING_FROM_PREVIOUS_STATE,
    'scheduled' : STATUS.UNKNOWN,
    'passed'    : STATUS.SUCCESS,
    'failed'    : STATUS.FAILURE,
    'blocked'   : STATUS.UNKNOWN,
    'canceled'  : STATUS.ABORTED,
    'canceling' : STATUS.ABORTED,
    'skipped'   : STATUS.ABORTED,
    'not_run'   : STATUS.NOT_BUILT,
    'finished'  : STATUS.UNKNOWN
}

class Source():

    def __init__(self, api_token, username, endpoint=None):
        self.api_token = api_token
        self.username  = username
        self.endpoint  = endpoint if endpoint else 'https://api.buildkite.com'
        self.logger = logger.Logger('buildkite_ci')

    def list_projects(self):
        params = {'access_token': self.api_token}
        url = self.endpoint + "/v2/organizations/" + self.username + "/pipelines"
        data = self._query(url, params)
        return list(map(lambda x: x['slug'], data))

    def project_status(self, pipeline, branch='master'):
        params = {'access_token': self.api_token, 'branch': branch}
        url = self.endpoint + "/v2/organizations/" + self.username + "/pipelines/" + pipeline + "/builds"
        try:
            data = self._query(url, params)
            state = data[0]['state']
        except Exception, e:
            self.logger.log("Error while computing state for pipeline '%s': %s", pipeline, str(e))
            return STATUS.POLL_ERROR

        return _STATUS[state]

    def _query(self, url, params):
        response = urllib.urlopen(url + "?%s" % urllib.urlencode(params))
        return json.loads(response.read())
