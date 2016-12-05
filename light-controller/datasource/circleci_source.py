from circleclient.circleclient import CircleClient
from lib.constants import STATUS

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

class CircleCISource():

   def __init__(self, api_token, endpoint):
       self.client = CircleClient(api_token, endpoint)

   def list_projects(self, username):
       projects  = self.client.projects.list_projects()
       selection = list(filter(lambda x: x['username'] == username, projects))
       result    = list(map(lambda x: x['reponame'], selection))
       return result

   def project_status(self, username, project):
       result = self.client.build.recent(username, project, limit=1, branch='master')[0]

       current = result['status']
       previous = result['previous']['status']

       if current == 'running' or current == 'retried':
           return _PREVIOUS_STATUS[previous]
       else:
           return _CURRENT_STATUS[current]
