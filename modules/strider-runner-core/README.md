# strider-runner-core

Just run those jobs. Decoupled from load balancing, job queues, etc.

[![Build Status](https://travis-ci.org/Strider-CD/strider-runner-core.svg?branch=master)](https://travis-ci.org/Strider-CD/strider-runner-core)

## Usage

```js
var core = require('strider-runner-core');

core.process(data, provider, plugins, config, next);
```

## API

- `data` is the mongoose job object. See the main strider repo for a schema.
- `provider` is an instantiated provider, such as [strider-git](https://github.com/Strider-CD/strider-git).
- `plugins` is a map of instantiated plugins (such as [strider-node](https://github.com/Strider-CD/strider-node)) `{id: plugin, ...}`
- `config` - object attributes:
  - env - a map for augmenting the ENV variables in all commands run
  - io - an eventemitter for communication.
  - dataDir - the directory to hold your code
  - baseDir - base directory for this job
  - cacheDir - cache directory
  - cachier (see [this file](https://github.com/Strider-CD/strider-simple-runner/blob/master/lib/cachier.js))
  - logger
  - log - log fn
  - error - log errors
- `next` is called with any errors as the first argument.

