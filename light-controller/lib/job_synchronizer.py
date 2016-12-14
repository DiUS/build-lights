import rethinkdb as rethink

class JobSynchronizer():

    def update_ci_jobs(self, jobs):
        rethink.connect("localhost", 28015).repl()

        cursor = rethink.db('build_lights').table("jobs").run()
        existingJobs = []
        for document in cursor:
            existingJobs.append(document)

        for existingJob in existingJobs:
            job = [x for x in jobs if existingJob["name"] == x]
            if not job:
                rethink.db('build_lights').table("jobs").filter(rethink.row["name"] == existingJob["name"]).delete().run()

        for job in jobs:
            existingJob = [x for x in existingJobs if x["name"] == job]
            if not existingJob:
                rethink.db('build_lights').table("jobs").insert([{'name': job, 'active': False}]).run()
