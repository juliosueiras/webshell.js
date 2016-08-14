'use strict'

const defaultState = require('./defaultState')
const createStore = require('redux').createStore
const reducers = require('./reducers/index')
const commands = require('./commands/index')

const splitStatement = (line) => {
  const parts = line.split(' ')
  return {
    command: parts.shift(),
    input: parts.join(' ')
  }
}

module.exports = (initialState) => {
  const state = Object.assign(defaultState(), initialState)
  const store = createStore(reducers, state)
  let nextCommand
  return (line, buffer) => {
    const statement = splitStatement(line)
    buffer.reset()
    if (typeof nextCommand === 'function') {
      nextCommand = nextCommand(statement.input, buffer, store)
    } else if (typeof commands[statement.command] === 'function') {
      nextCommand = commands[statement.command](statement.input, buffer, store)
    } else if (statement.command !== '') {
      buffer.print(statement.command + ': command not found')
    }
    return store.getState()
  }
}