from circleclient.circleclient import CircleClient
from lib.constants import STATUS
from lib import logger

# other status values include 'retried' and 'running'
_CURRENT_STATUS = {
    'canceled'            : STATUS.ABORTED,
    'infrastructure_fail' : STATUS.FAILURE,
    'timedout'            : STATUS.FAILURE,
    'not_run'             : STATUS.ABORTED,
    'failed'              : STATUS.FAILURE,
    'queued'              : STATUS.UNKNOWN,
    'scheduled'           : STATUS.UNKNOWN,
    'not_running'         : STATUS.UNKNOWN,
    'no_tests'            : STATUS.FAILURE,
    'fixed'               : STATUS.SUCCESS,
    'success'             : STATUS.SUCCESS
}

_PREVIOUS_STATUS = {
    'retried'             : STATUS.BUILDING_FROM_UNKNOWN,
    'infrastructure_fail' : STATUS.BUILDING_FROM_FAILURE,
    'canceled'            : STATUS.BUILDING_FROM_ABORTED,
    'infrastructure_fail' : STATUS.BUILDING_FROM_FAILURE,
    'timedout'            : STATUS.BUILDING_FROM_FAILURE,
    'not_run'             : STATUS.BUILDING_FROM_ABORTED,
    'failed'              : STATUS.BUILDING_FROM_FAILURE,
    'queued'              : STATUS.BUILDING_FROM_UNKNOWN,
    'scheduled'           : STATUS.BUILDING_FROM_UNKNOWN,
    'not_running'         : STATUS.BUILDING_FROM_UNKNOWN,
    'no_tests'            : STATUS.BUILDING_FROM_FAILURE,
    'fixed'               : STATUS.BUILDING_FROM_SUCCESS,
    'success'             : STATUS.BUILDING_FROM_SUCCESS
}

class Source():

    def __init__(self, api_token, username, endpoint=None):
        self.client = CircleClient(api_token, endpoint)
        self.username = username
        self.logger = logger.Logger('circle_ci')

    def list_projects(self):
        projects  = self.client.projects.list_projects()
        selection = list(filter(lambda x: x['username'] == self.username, projects))
        result    = list(map(lambda x: x['reponame'], selection))
        return result

    def project_status(self, project, branch='master'):
        try:
            result = self.client.build.recent(self.username, project, limit=1, branch=branch)[0]
        except Exception, e:
            self.logger.log("Error while computing state for project '%s': %s", project, str(e))
            return STATUS.POLL_ERROR

        current = result['status']
        previous = result['previous']['status']

        if current == 'running' or current == 'retried':
            return _PREVIOUS_STATUS[previous]
        else:
            return _CURRENT_STATUS[current]
