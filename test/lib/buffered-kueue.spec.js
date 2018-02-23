const Queue = require('../../index')

describe('BufferedQueue', () => {
  describe('Given no params', () => {
    const queue = new Queue()
    it('Should not be started', () => {
      expect(queue.started).toBe(false)
    })
    it('Should stopped after calling start at first flushing', () => {
      queue.start()
      expect(queue.started).toBe(true)
      return sleep(1000).then(() => {
        expect(expect(queue.started).toBe(false))
      })
    })
  })
  describe('Given onFlush function, interval to 1000ms, flush size to 1', () => {
    let result = null
    const queue = new Queue({onFlush: (items) => { result = items }, flushInterval: 1000, flushSize: 1})
    it('Should flush every 1000 ms', () => {
      expect(queue.started).toBe(false)
      return sleep(1000)
      .then(() => expect(result).toBe(null))
      .then(() => {
        queue.push(1)
        queue.push(2)
        expect(queue.started).toBe(true)
        expect(queue.items.length).toBe(2)
        return sleep(1000)
      })
      .then(() => expect(result).toEqual([1]))
      .then(() => sleep(1000))
      .then(() => expect(result).toEqual([2]))
      .then(() => sleep(1000))
      .then(() => expect(queue.started).toBe(false))
    })
  })
  describe('Given max size to 1, interval to 1000ms', () => {
    let result = null
    const queue = new Queue({onFlush: (items) => { result = items }, flushInterval: 1000, maxSize: 1, flushSize: 1})
    it('Should throws when max size setted to 1', () => {
      return sleep(1000)
      .then(() => expect(result).toBe(null))
      .then(() => {
        queue.push(1)
        queue.push(2)
        queue.push(3)
        return sleep(1000)
      })
      .catch(e => expect(e.message).toMatch(/BufferedQueue length exceeds limit/))
    })
    it('Should runs well after setting didPush lifecycle event', () => {
      queue.didPush = (item, q) => {
        if (q.length >= queue.flushSize) queue.flush()
      }
      return sleep(1000)
      .then(() => {
        queue.push(1)
        queue.push(2)
        queue.push(3)
        return sleep(1000)
      })
      .then(() => expect(result).toEqual([3]))
    })
  })
})

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
