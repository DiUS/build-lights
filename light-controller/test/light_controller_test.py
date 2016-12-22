import unittest
import sys
import os.path

from mock import patch

import light_controller

class LightControllerTest(unittest.TestCase):

    @patch.object(light_controller.dlogger, 'log')
    def test_init_without_sys_args(self, mock_log):
        with self.assertRaises(SystemExit) as se:
            light_controller.LightController()
        mock_log.assert_called_with("ERROR: config file config.json not found.")
        self.assertEqual(se.exception.code, -1)

    @patch.object(light_controller.dlogger, 'log')
    @patch.object(sys, 'argv', ["program", "-l"])
    def test_init_with_syslog(self, mock_log):
        with self.assertRaises(SystemExit) as se:
            light_controller.LightController()
        mock_log.assert_called_with("ERROR: config file config.json not found.")
        self.assertEqual(se.exception.code, -1)
        self.assertTrue(light_controller.dlogger.use_syslog)

    @patch.object(light_controller.dlogger, 'log')
    @patch.object(sys, 'argv', ["program", "-c", "/pat/to/config.json"])
    def test_init_with_invalid_file(self, mock_log):
        with self.assertRaises(SystemExit) as se:
            light_controller.LightController()
        mock_log.assert_called_with("ERROR: config file /pat/to/config.json not found.")
        self.assertEqual(se.exception.code, -1)

    @patch.object(light_controller.dlogger, 'log')
    @patch.object(light_controller.daemonize, 'createDaemon')
    @patch.object(sys, 'argv', ["program", "-b"])
    def test_init_with_daemon(self, mock_createDaemon, mock_log):
        with self.assertRaises(SystemExit) as se:
            light_controller.LightController()
        mock_log.assert_called_with("ERROR: config file config.json not found.")
        mock_createDaemon.assert_called_with()
        self.assertTrue(light_controller.dlogger.use_syslog)
        self.assertEqual(se.exception.code, -1)

    @patch.object(light_controller.dlogger, 'log')
    @patch.object(sys, 'argv', ["program", "-k"])
    def test_init_with_invalid_parameter(self, mock_log):
        with self.assertRaises(SystemExit) as se:
            light_controller.LightController()
        mock_log.assert_called_with("Error: getopt error: option -k not recognized")
        self.assertTrue(mock_log.called)
        self.assertEqual(se.exception.code, -1)

    @patch.object(sys, 'argv', ["program", "-c", "./config/config.json.jenkins"])
    def test_init_successful(self):
        lc = light_controller.LightController()
        self.assertIsNotNone(lc.conf)
        self.assertEqual(lc.poll_interval_seconds, 3)
        self.assertIsNotNone(lc.ci)

    @patch.object(sys, 'argv', ["program", "-c", "./config/config.json.jenkins"])
    def test_writes_pid_file(self):
        light_controller.LightController()._write_pid('/tmp/pid')
        self.assertTrue(os.path.isfile('/tmp/pid'))

    @patch.object(light_controller.dlogger, 'log')
    @patch.object(sys, 'argv', ["program", "-c", "./config/config.json.jenkins"])
    def test_fails_to_write_pid_file_on_non_existing_location(self, mock_log):
        light_controller.LightController()._write_pid('/non-existing/location/pid')
        self.assertFalse(os.path.isfile('/non-existing/location/pid'))
        mock_log.assert_called_with("ERROR: unable to write pid file /non-existing/location/pid: [Errno 2] No such file or directory: \'/non-existing/location/pid\'")

    @patch.object(sys, 'argv', ["program", "-c", "./config/config.json.jenkins"])
    def test_list_projects(self):
        lc = light_controller.LightController()

        with patch.object(lc.ci, 'list_projects') as mock_ci:
            mock_ci.return_value = ["project1", "project2"]
            projects = lc.list_projects()

        self.assertIsNotNone(projects)
        self.assertEquals(len(projects), 2)
