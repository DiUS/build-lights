import urllib2, base64, json
from lib.constants import STATUS

_STATUS = {
    'Successful': STATUS.SUCCESS,
    'Failed'    : STATUS.FAILURE,
    'Unknown'   : STATUS.UNKNOWN
}

class Source():

    def __init__(self, baseUrl, user = None, password = None):
        self.baseUrl = baseUrl
        self.user = user
        self.password = password

    def list_projects(self):
        return list(map(lambda x: x['plan']['key'], self._fetch_all_projects()))

    def project_status(self, plan):
        try:
            if self._plan_is_building(plan):
                return STATUS.BUILDING_FROM_PREVIOUS_STATE

            builds = self._fetch_all_projects()
            build = next((x for x in builds if x['plan']['key'] == plan), None)
            if build is None:
                return STATUS.UNKNOWN
            else:
                return _STATUS[build['state']]
        except Exception, e:
            return STATUS.POLL_ERROR

    def _fetch_all_projects(self):
        url = self.baseUrl + '/rest/api/latest/result.json'
        data = self._query(url)
        return data['results']['result']

    def _plan_is_building(self, plan):
        url = self.baseUrl + "/rest/api/latest/plan/" + plan + '.json'
        data = self._query(url)
        return data['isBuilding']

    def _query(self, url):
        request = urllib2.Request(url)
        if self.user != None and self.password != None:
            base64string = base64.encodestring('%s:%s' % (self.user, self.password)).replace('\n', '')
            request.add_header("Authorization", "Basic %s" % base64string)
        response = urllib2.urlopen(request)
        return json.loads(response.read())
