import SimpleHTTPServer
import signal
import SocketServer
import sys

class MyRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/travisci/repos/DiUS/build-lights':
            self.path = '/travisci/repos-build-lights'
        return SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)

class MyServer(SocketServer.TCPServer):
    allow_reuse_address = True

if __name__ == "__main__":
    server = MyServer(('0.0.0.0', 8000), MyRequestHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
