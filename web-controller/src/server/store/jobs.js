
const rethink = require('rethinkdb')

const DB_NAME = 'build_lights'
const HOST = process.env['RETHINKDB_HOST'] ? process.env['RETHINKDB_HOST'] : 'localhost'
const PORT = 28015
const JOBS_TABLE = 'jobs'

const connect = () => {
  return new Promise((resolve, reject) => {
    rethink.connect({host: HOST, port: PORT}, (err, connection) => {
      if (err) reject(err)
      resolve(connection)
    })
  })
}

const insert = (jobs, connection) => {
  return new Promise((resolve, reject) => {
    rethink.db(DB_NAME).table(JOBS_TABLE).insert(jobs).run(connection, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

const update = (job, connection) => {
  return new Promise((resolve, reject) => {
    rethink.db(DB_NAME).table(JOBS_TABLE).filter({name: job.name}).update(job).run(connection, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

const remove = (removals, connection) => {
  removals.forEach((removal) => {
    rethink.db(DB_NAME).table(JOBS_TABLE).filter({name: removal.name}).delete().run(connection, (err, result) => {
      if (err) throw err
    })
  })
}

const removeDeletedJobs = (existingJobs, currentJobs, connection) => {
  const removals = existingJobs.filter((existingJob) => {
    return !currentJobs.find((currentJob) => { return currentJob.name === existingJob.name })
  })
  remove(removals, connection)
}

const insertNewJobs = (existingJobs, currentJobs, connection) => {
  const inserts = currentJobs.filter((job) => {
    return !existingJobs.find((existingJob) => { return existingJob.name === job.name })
  })
  insert(inserts, connection)
}

const updateExistingjobs = (existingJobs, currentJobs, connection) => {
  currentJobs.forEach((job) => {
    const existingJob = existingJobs.find((existingJob) => { return existingJob.name === job.name })
    if (existingJob) {
      if (existingJob.active !== job.active) {
        update(job, connection)
      }
    }
  })
}

exports.setJobs = (jobs) => {
  connect().then((connection) => {
    exports.list().then((existingJobs) => {
      removeDeletedJobs(existingJobs, jobs, connection)
      updateExistingjobs(existingJobs, jobs, connection)
      insertNewJobs(existingJobs, jobs, connection)
    })
  })
}

exports.listenForChanges = (callback) => {
  connect().then((connection) => {
    rethink.db(DB_NAME).table(JOBS_TABLE).changes().run(connection, (err, cursor) => {
      if (err) throw err
      cursor.each((err, row) => {
        if (err) throw err
        callback(row)
      })
    })
  })
}

exports.list = () => {
  return new Promise((resolve, reject) => {
    connect().then((connection) => {
      rethink.db(DB_NAME).table(JOBS_TABLE).orderBy('name').run(connection, (err, cursor) => {
        if (err) reject(err)
        cursor.toArray((err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })
    })
  })
}
