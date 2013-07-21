
How to get setup (if you're using the [docker
image](https://github.com/Strider-CD/strider-dockerfile) you can skip this:

- grab the repo
- run the tests with `npm test` to make sure your environment is setup
  properly. If you don't have it already, install
  [mongodb](http://docs.mongodb.org/manual/installation/). You could dev using
  and externally hosten mongo db if you want, but it's a pain.

Here are the technologies to be familiar with:
- [angular](http://angularjs.com)
- [less css](http://lesscss.org)
- [twitter bootstrap](http://twitter.github.io/bootstrap)

**Don't** make changes to the compiled CSS. It's compiled from less; please
edit that and then run `make less` before you submit. To simplify things for
development, install [watch](https://github.com/visionmedia/watch) and then 
run `make watch`. It will then check for changes to the `.less` files every
second, and compile if needed.

Before submitting pull requests, please run `npm test` to make sure you didn't
break anything. If you're adding or changing backend functionality, include tests.

If you're adding or changing the front-end, please include one or more
explanitory screenshots in the pull request.
