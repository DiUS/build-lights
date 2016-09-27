""" Sound Player """
import os
current_dir = os.path.dirname(os.path.realpath(__file__))
parent_dir = os.path.join(current_dir, "..")
import sys
sys.path.append(parent_dir)

import time
import signal
import subprocess
import glob
from random import randrange

from lib import logger


class SoundPlayer(object):

    def __init__(self, sound_clips_directory, player_bin='mpg321'):
        self.logger = logger.Logger('SoundPlayer')
        self.sound_clips_directory = sound_clips_directory
        self.player_bin = player_bin
        self.player_proc = None

    def __del__(self):
        self.__kill_player_subprocess()

    def __kill_player_subprocess(self):
        if self.player_proc is not None:
            returncode = self.player_proc.poll()
            if returncode is not None:
                # subprocess terminated
                self.player_proc = None
        if self.player_proc is not None:
            try:
                self.player_proc.kill()
            except OSError, e:
                self.logger.log('kill error: %s', str(e.reason))
            self.player_proc = None

    def play_random_start_sound(self):
        filename = self.__randomly_choose_mp3_in_sub_directory("start_build")
        if filename is not None:
            self.play_this_thing(filename)

    def play_random_success_sound(self):
        filename = self.__randomly_choose_mp3_in_sub_directory("success")
        if filename is not None:
            self.play_this_thing(filename)

    def play_random_failure_sound(self):
        filename = self.__randomly_choose_mp3_in_sub_directory("failure")
        if filename is not None:
            self.play_this_thing(filename)

    def play_this_thing(self, filename):
        self.__kill_player_subprocess()
        self.player_proc = subprocess.Popen([self.player_bin, filename])

    def __randomly_choose_mp3_in_sub_directory(self, sub_directory):
        directory = os.path.join(self.sound_clips_directory, sub_directory)
        files = glob.glob(os.path.join(directory, '*.mp3'))
        if len(files) > 0:
            return files[randrange(len(files))]
        return None
