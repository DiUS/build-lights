import rethinkdb as rethink
import os

class JobSynchronizer():

    RETHINK_DB = 'build_lights'
    RETHINK_JOBS_TABLE = 'jobs'

    def update_ci_jobs(self, jobs):
        rethink.connect(os.getenv('RETHINKDB_HOST', 'localhost'), 28015).repl()

        cursor = rethink.db(RETHINK_DB).table(RETHINK_JOBS_TABLE).run()
        existingJobs = []
        for document in cursor:
            existingJobs.append(document)

        for existingJob in existingJobs:
            job = [x for x in jobs if existingJob['name'] == x]
            if not job:
                rethink.db(RETHINK_DB).table(RETHINK_JOBS_TABLE).filter(rethink.row["name"] == existingJob["name"]).delete().run()

        for job in jobs:
            existingJob = [x for x in existingJobs if x['name'] == job]
            if not existingJob:
                rethink.db(RETHINK_DB).table(RETHINK_JOBS_TABLE).insert([{'name': job, 'active': False}]).run()
