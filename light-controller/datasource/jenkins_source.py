import jenkinsapi
from jenkinsapi.jenkins import Jenkins
from lights import job2light_translator

STATUS = {
    'aborted'         : job2light_translator.STATUS.ABORTED,
    'aborted_anime'   : job2light_translator.STATUS.BUILDING_FROM_ABORTED,
    'blue'            : job2light_translator.STATUS.SUCCESS,
    'blue_anime'      : job2light_translator.STATUS.BUILDING_FROM_SUCCESS,
    'disabled'        : job2light_translator.STATUS.DISABLED,
    'disabled_anime'  : job2light_translator.STATUS.BUILDING_FROM_DISABLED,
    'grey'            : job2light_translator.STATUS.UNKNOWN,
    'grey_anime'      : job2light_translator.STATUS.BUILDING_FROM_UNKNOWN,
    'notbuilt'        : job2light_translator.STATUS.NOT_BUILT,
    'notbuilt_anime'  : job2light_translator.STATUS.BUILDING_FROM_NOT_BUILT,
    'red'             : job2light_translator.STATUS.FAILURE,
    'red_anime'       : job2light_translator.STATUS.BUILDING_FROM_FAILURE,
    'yellow'          : job2light_translator.STATUS.UNSTABLE,
    'yellow_anime'    : job2light_translator.STATUS.BUILDING_FROM_UNSTABLE
}

class JenkinsSource():

    def __init__(self, baseurl):
        self.J = Jenkins(baseurl)

    def list_projects(self):
        return self.J.keys()

    def project_status(self, project):
        result = self.J[project].poll(tree='color')
        return STATUS[result['color']]
