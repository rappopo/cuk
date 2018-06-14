# @rappopo/cuk

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/ardhilukianto)

[Rappopo CUK](https://docs.rappopo.com/cuk/) core loaders.

It loads all installed packages, assign & merge all configs, and prepare all functions to become callable throughout all packages.

## Setup

Invoke this command in your CUK project directory:

```
$ npm install --save @rappopo/cuk-core
```

And put all your function helpers in **./cuks/core/helper**

## Function Helper

A function helper needs to be written according to the following rules:

- One function per file
- Use folders to categorize your helpers
- CUK Core will generate camel cased name based on relative file path to the functions folder above
- You can call those function helpers later from anywhere like this:

```js
const { helper } = cuk.lib
helper('<camelCasedName>')(<arguments>)
```

To call a package helper from your project, prepend its name with **`<package-id>:`**, e.g.:

```js
const { helper } = cuk.lib
let merged = helper('core:merge')({}, { key: 'value' })
```


## Tutorial

```
$ cd <project>/cuks/core/helper
$ mkdir -p my/secret
$ cd my/secret
$ nano function.js
```

And enter the following content:

```js
'use strict'

module.exports = function(cuk) {
  return (name) => {
    console.log(name)
  }
}
```

Save it, run your project. You can now call your helper like this:

```js
...
const { helper } = cuk.lib
helper('mySecretFunction')('Hello!')
...
```

## Links

* [Documentation](https://docs.rappopo.com/cuk/)
* [Changelog](CHANGELOG.md)

## Donation
* [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/ardhilukianto)
* Bitcoin **16HVCkdaNMvw3YdBYGHbtt3K5bmpRmH74Y**

## License

[MIT](LICENSE.md)
