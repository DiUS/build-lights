import SimpleHTTPServer
import signal
import SocketServer
import sys

class MyRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/travisci/repos/DiUS/build-lights':
            self.path = '/travisci/repos-build-lights'
        if self.path == '/buildkite/v2/organizations/my_username/pipelines/project1/builds?access_token=some_token&branch=master':
            self.path = '/buildkite/v2/organizations/my_username/pipelines-project1/builds'
        return SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)

class MyServer(SocketServer.TCPServer):
    allow_reuse_address = True

if __name__ == "__main__":
    server = MyServer(('0.0.0.0', 8000), MyRequestHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
