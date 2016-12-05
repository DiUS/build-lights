import unittest
import os
current_dir = os.path.dirname(os.path.realpath(__file__))
parent_dir = os.path.join(current_dir, "../..")
import sys
sys.path.append(parent_dir)

from datasource import jenkins_source
from lights import job2light_translator

class TestStringMethods(unittest.TestCase):

    def setUp(self):
        self.jenkins = jenkins_source.JenkinsSource('http://localhost:8000/jenkins/')

    def test_list_projects(self):
        self.assertGreater(len(self.jenkins.list_projects()), 0)

    def test_successful_build(self):
        self.assertEqual(self.jenkins.project_status('debian-stablepkg'), job2light_translator.STATUS.SUCCESS)

if __name__ == '__main__':
    unittest.main()
