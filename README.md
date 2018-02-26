# Buffered Kueue

[![Build Status](https://travis-ci.org/chux0519/buffered-kueue.svg?branch=master)](https://travis-ci.org/chux0519/buffered-kueue)
[![codecov](https://codecov.io/gh/chux0519/buffered-kueue/branch/master/graph/badge.svg)](https://codecov.io/gh/chux0519/buffered-kueue)

Help you to buffer your tasks

## Features

- Having lifecycle hooks
- Flushing specific amount of items when interval reached

## Install

> npm install --save buffered-kueue
>
> yarn add buffered-kueue

## Intro

## Quick Start

Using class `BufferedQueue`.

```javascript
const BufferedQueue = require('buffered-kueue')
let result = null
const queue = new BufferedQueue({onFlush: (items) => { result = items }, flushInterval: 1000, flushSize: 1})

queue.push(1) // after 1000ms result -> [1]
queue.push(2) // after 2000ms result -> [2]
```

## API

### class `BufferedQueue`

#### constructor(options) => bufferedQueue: BufferedQueue

The options beginning with the symbol `*` are required.

- *`options.maxSize`: Max size of queue. *Default: Infinity*
  - number
- *`options.flushSize`: Flush size of queue. *Default: Infinity*
  - number
- *`options.flushInterval`: Flush interval(ms) of queue. *Default: 1000*
  - number
- *`options.onFlush`: Flush handler. *Default: noop*
  - function: (flushItems, allItems) => any
- `options.willPush`: Lifecycle events, called before pushing new item. *Default: noop*
  - function: (item, allItems) => any
- `options.didPush`: Lifecycle events, called after pushing new item. *Default: noop*
  - function: (item, allItems) => any
- `options.willFlush`: Lifecycle events, called before flushing. *Default: noop*
  - function: (flushItems, allItems) => any
- `options.didFlush`: Lifecycle events, called after flushing. *Default: noop*
  - function: (flushItems, allItems) => any
- `options.willStart`: Lifecycle events, called before start. *Default: noop*
  - function: () => any
- `options.didStart`: Lifecycle events, called after start. *Default: noop*
  - function: () => any
- `options.willStop`: Lifecycle events, called before stop. *Default: noop*
  - function: () => any
- `options.didStop`: Lifecycle events, called after stop. *Default: noop*
  - function: () => any
- `options.autoStart`: Should auto start when pushing item. You have to manage start manualy when setting this to false. *Default: true*
  - boolean

#### push(item)

- `item`: Item which would be pushed into the queue.