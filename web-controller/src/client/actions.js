'use strict'

export function willLoadTasks (data, present) {
  present(data)
}

export function loadTasks (data, present) {
  setTimeout(() => {
    fetch('data/tasks.json')
      .then(res => res.json())
      .then(json => {
        data.tasks = json.tasks
        data.lastRetrieved = new Date().toJSON()

        present(data)
      })
  }, 1000)
}
