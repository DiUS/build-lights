.PHONY: all test stop

all: test stop

test:
	python -m unittest discover . -p '*_test.py'

stop: server.PID
	kill `cat $<` && rm $<

server.PID:
	cd fixtures && { python run.py & echo $$! > ../$@; }
