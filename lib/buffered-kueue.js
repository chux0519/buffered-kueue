class BufferedQueueError extends Error {
  constructor (msg) {
    super(msg)
    this.name = BufferedQueueError
  }
}

class BufferedQueue {
  constructor (options = BufferedQueue.defaultOptions) {
    this.init(Object.assign({}, BufferedQueue.defaultOptions, options))
  }
  static get defaultOptions () {
    return {
      willPush: noop,
      didPush: noop,
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
  push (item) {
    this.willPush(item, this.q)
    if (!this.isFull) this.q.push(item)
    else throw new BufferedQueueError(`BufferedQueue length exceeds limit(${this.maxSize}).`)
    if (!this.started) this.start()
    this.didPush(item, this.q)
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

  get items () {
    return this.q
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
  set onFlush (fn) {
    this.options.onFlush = fn
  }
  get willPush () {
    return this.options.willPush
  }
  set willPush (fn) {
    this.options.willPush = fn
  }
  get didPush () {
    return this.options.didPush
  }
  set didPush (fn) {
    this.options.didPush = fn
  }
  get willFlush () {
    return this.options.willFlush
  }
  set willFlush (fn) {
    this.options.willFlush = fn
  }
  get didFlush () {
    return this.options.didFlush
  }
  set didFlush (fn) {
    this.options.didFlush = fn
  }
  get willStart () {
    return this.options.willStart
  }
  set willStart (fn) {
    this.options.willStart = fn
  }
  get didStart () {
    return this.options.didStart
  }
  set didStart (fn) {
    this.options.didStart = fn
  }
  get willStop () {
    return this.options.willStop
  }
  set willStop (fn) {
    this.options.willStop = fn
  }
  get didStop () {
    return this.options.didStop
  }
  set didStop (fn) {
    this.options.didStop = fn
  }
}

module.exports = BufferedQueue

function noop () {}
