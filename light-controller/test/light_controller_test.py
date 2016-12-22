import unittest
import sys
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
        self.assertEqual(se.exception.code, -1)

    @patch.object(light_controller.dlogger, 'log')
    @patch.object(sys, 'argv', ["program", "-k"])
    def test_init_with_invalid_parameter(self, mock_log):
        with self.assertRaises(SystemExit) as se:
            light_controller.LightController()
        mock_log.assert_called_with("Error: getopt error: option -k not recognized")
        self.assertTrue(mock_log.called)
        self.assertEqual(se.exception.code, -1)
