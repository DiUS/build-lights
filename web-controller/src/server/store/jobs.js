
const rethink = require('rethinkdb')

const DB_NAME = 'build-lights'
const HOST = process.env['RETHINKDB_HOST'] ? process.env['RETHINKDB_HOST'] : 'localhost'
const PORT = 28015
const JOBS_TABLE = 'jobs'

exports.createTables = (connection) => {
  return new Promise((resolve, reject) => {
    rethink.db(DB_NAME).tableCreate(JOBS_TABLE).run(connection, (err, result) => {
      if (err) reject(err)
      resolve(connection)
    })
  })
}

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
    rethink.table(JOBS_TABLE).insert(jobs).run(connection, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

const truncate = (connection) => {
  return new Promise((resolve, reject) => {
    rethink.table(JOBS_TABLE).delete().run(connection, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

exports.setJobs = (jobs) => {
  connect().then((connection) => {
    truncate(connection).then(() => {
      insert(jobs, connection)
    })
  })
}

exports.listenForChanges = (callback) => {
  connect().then((connection) => {
    rethink.table(JOBS_TABLE).changes().run(connection, (err, cursor) => {
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
      rethink.table(JOBS_TABLE).orderBy('name').run(connection, (err, cursor) => {
        if (err) reject(err)
        cursor.toArray((err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })
    })
  })
}
