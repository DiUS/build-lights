#!/usr/bin/python
""" light controller server """

import importlib
import BaseHTTPServer
import SocketServer
import json
import light_controller

lightcontroller = light_controller.LightController()

class RequestHandler(BaseHTTPServer.BaseHTTPRequestHandler):
    def do_GET(self):
        projects = lightcontroller.list_projects()
        response = json.dumps(projects)
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Content-length", len(response))
        self.end_headers()
        self.wfile.write(response)

class LightControllerServer(SocketServer.TCPServer):
    allow_reuse_address = True

if __name__ == "__main__":
    server = LightControllerServer(('0.0.0.0', 8005), RequestHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
