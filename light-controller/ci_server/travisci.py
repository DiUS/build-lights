from travispy import TravisPy
from lib.constants import STATUS
from lib import logger

_STATUS = {
   'created'  : STATUS.UNKNOWN,
   'queued'   : STATUS.UNKNOWN,
   'received' : STATUS.UNKNOWN,
   'started'  : STATUS.BUILDING_FROM_PREVIOUS_STATE,
   'passed'   : STATUS.SUCCESS,
   'failed'   : STATUS.FAILURE,
   'errored'  : STATUS.FAILURE,
   'canceled' : STATUS.ABORTED,
   'ready'    : STATUS.UNKNOWN
}

class Source():

    def __init__(self, username, uri=None):
        kwargs = {}
        if uri: # leave as unspecified to use default
            kwargs['uri'] = uri
        self.client = TravisPy(**kwargs)
        self.username = username
        self.logger = logger.Logger('travis_ci')

    def list_projects(self):
        repos = self.client.repos(owner_name=self.username)
        repos = filter(lambda x: x.active == True, repos)
        return list(map(lambda x: x.slug.split('/')[1], repos))

    def project_status(self, project):
        try:
            state = self.client.repo(self.username + '/' + project).last_build_state
        except Exception, e:
            self.logger.log("Error while computing state for project '%s': %s", project, str(e))
            return STATUS.POLL_ERROR

        if not state:
            return STATUS.UNKNOWN

        return _STATUS[state]
