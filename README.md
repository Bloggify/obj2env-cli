
# `$ obj2env`

 [![Version](https://img.shields.io/npm/v/obj2env-cli.svg)](https://www.npmjs.com/package/obj2env-cli) [![Downloads](https://img.shields.io/npm/dt/obj2env-cli.svg)](https://www.npmjs.com/package/obj2env-cli)

> Create .env files in your terminal.

[![obj2env-cli](http://i.imgur.com/yfKqx6W.gif)](#)

## :cloud: Installation

You can install the package globally and use it as command line tool:


```sh
$ npm i -g obj2env-cli
```


Then, run `obj2env --help` and see what the CLI tool can do.


```
$ obj2env --help
Usage: obj2env [options]

Create .env files in your terminal.

Options:
  -o, --output   Output the content in the stdout.
  -f, --force    Overrides the existing file without user
                 confirmation.
  -d, --dir      Specify the directory where to write the .env file.
  -v, --version  Displays version information.
  -h, --help     Displays this help.

Examples:
  $ obj2env PORT NODE_ENV
  $ obj2env -o PORT=8080 NODE_ENV

Documentation can be found at https://github.com/Bloggify/obj2env-cli#readme.
```

## :yum: How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].



## :scroll: License

[MIT][license] © [Bloggify][website]

[license]: http://showalicense.com/?fullname=Bloggify%20%3Csupport%40bloggify.org%3E%20(https%3A%2F%2Fbloggify.org)&year=2017#license-mit
[website]: https://bloggify.org
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
