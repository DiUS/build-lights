import jenkinsapi
from jenkinsapi.jenkins import Jenkins
from lib.constants import STATUS
from lib import logger

_STATUS = {
    'aborted'         : STATUS.ABORTED,
    'aborted_anime'   : STATUS.BUILDING_FROM_ABORTED,
    'blue'            : STATUS.SUCCESS,
    'blue_anime'      : STATUS.BUILDING_FROM_SUCCESS,
    'disabled'        : STATUS.DISABLED,
    'disabled_anime'  : STATUS.BUILDING_FROM_DISABLED,
    'grey'            : STATUS.UNKNOWN,
    'grey_anime'      : STATUS.BUILDING_FROM_UNKNOWN,
    'notbuilt'        : STATUS.NOT_BUILT,
    'notbuilt_anime'  : STATUS.BUILDING_FROM_NOT_BUILT,
    'red'             : STATUS.FAILURE,
    'red_anime'       : STATUS.BUILDING_FROM_FAILURE,
    'yellow'          : STATUS.UNSTABLE,
    'yellow_anime'    : STATUS.BUILDING_FROM_UNSTABLE
}

class Source():

    def __init__(self, url):
        self.J = Jenkins(url)
        self.logger = logger.Logger('jenkins_ci')

    def list_projects(self):
        return self.J.keys()

    def project_status(self, project, branch='master'):
        try:
            result = self.J[project].poll(tree='color')
        except Exception, e:
            self.logger.log("Error while computing state for project '%s': %s", project, str(e))
            return STATUS.POLL_ERROR

        return _STATUS[result['color']]
