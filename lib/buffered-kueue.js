class QueueError extends Error {
  constructor (msg) {
    super(msg)
    this.name = QueueError
  }
}

class Queue {
  constructor (options = Queue.defaultOptions) {
    this.init(Object.assign({}, Queue.defaultOptions, options))
  }
  static get defaultOptions () {
    return {
      willAdd: noop,
      didAdd: noop,
      willFlush: noop,
      didFlush: noop,
      willStart: noop,
      didStart: noop,
      willStop: noop,
      didStop: noop,
      maxSize: Infinity,
      flushSize: Infinity,
      flushInterval: 1000,
      onFlush: noop
    }
  }
  init (options) {
    this.options = options
    this.q = []
    this.started = false
  }
  add (item) {
    this.willAdd(item, this.q)
    if (!this.isFull) this.q.push(item)
    else throw new QueueError(`Queue length exceeds limit(${this.maxSize}).`)
    this.didAdd(item, this.q)
    if (!this.started) this.start()
  }

  flush () {
    const items = this.q.slice(0, this.flushSize)
    this.willFlush(items, this.q)
    if (!this.isEmpty) {
      this.onFlush(items, this.q)
      this.q.splice(0, this.flushSize)
    } else {
      this.stop()
    }
    this.didFlush(items, this.q)
  }

  start () {
    /* istanbul ignore next */
    if (this.started) return
    this.willStart()
    this.interval = setInterval(this.flush.bind(this), this.flushInterval)
    this.started = true
    this.didStart()
  }
  stop () {
    /* istanbul ignore next */
    if (!this.started) return
    this.willStop()
    clearInterval(this.interval)
    this.started = false
    this.didStop()
  }

  get isEmpty () {
    return this.q.length === 0
  }
  get isFull () {
    return this.q.length >= this.maxSize
  }
  get flushInterval () {
    return this.options.flushInterval
  }
  get flushSize () {
    return this.options.flushSize
  }
  get maxSize () {
    return this.options.maxSize
  }
  get onFlush () {
    return this.options.onFlush
  }
  get willAdd () {
    return this.options.willAdd
  }
  get didAdd () {
    return this.options.didAdd
  }
  get willFlush () {
    return this.options.willFlush
  }
  get didFlush () {
    return this.options.didFlush
  }
  get willStart () {
    return this.options.willStart
  }
  get didStart () {
    return this.options.didStart
  }
  get willStop () {
    return this.options.willStop
  }
  get didStop () {
    return this.options.didStop
  }
}

module.exports = Queue

function noop () {}