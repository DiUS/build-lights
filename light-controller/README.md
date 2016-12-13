## Running the app locally

If you don't have a Pi handy, you can run in 'console' mode:

    python light_controller -c ./config/config.json.jenkins

## Running tests

Install python requirements

    pip install -r requirements.txt

Start the stub server for testing

    cd fixtures
    python run.py

Run the tests

    make test
