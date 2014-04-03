""" AWS SQS poller """
import os
current_dir = os.path.dirname(os.path.realpath(__file__))
parent_dir = os.path.join(current_dir, "..")
import sys
sys.path.append(parent_dir)

import boto.sqs
from boto.sqs.message import RawMessage
from boto.exception import SQSError

from lib import logger


class AwsSqsPoller(object):

    def __init__(self, monitor, sqs_region, sqs_queue_name, aws_access_key_id=None, aws_secret_access_key=None):
        self.logger = logger.Logger('AwsSqsPoller')
        self.sqs_region = sqs_region
        self.sqs_queue_name = sqs_queue_name
        self.aws_access_key_id = aws_access_key_id
        self.aws_secret_access_key = aws_secret_access_key
        self.monitor = monitor

    def poll(self):
        response_body = None
        try:
            kwargs = {}
            kwargs['region_name'] = self.sqs_region
            if self.aws_access_key_id is not None:
                kwargs['aws_access_key_id'] = self.aws_access_key_id
            if self.aws_secret_access_key is not None:
                kwargs['aws_secret_access_key'] = self.aws_secret_access_key
            conn = boto.sqs.connect_to_region(**kwargs)
            sqs_q = conn.get_queue(self.sqs_queue_name)
            sqs_q.set_message_class(RawMessage)

            self.logger.log('Polling queue: %s/%s', self.sqs_region, self.sqs_queue_name)
            job = sqs_q.read()
            if job is not None:
                response_body = job.get_body()
                self.logger.log('Job found with content: %s', response_body)
                sqs_q.delete_message(job)

        # FIXME: what other exceptions does boto raise? We need to catch them here.
        except SQSError, e:
            self.logger.log('SQS error: %s', str(e.reason))
            response_body = None

        self.monitor.process_build(response_body)

