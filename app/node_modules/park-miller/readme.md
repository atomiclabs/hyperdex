# park-miller [![Build Status](https://travis-ci.org/sindresorhus/park-miller.svg?branch=master)](https://travis-ci.org/sindresorhus/park-miller)

> [Park-Miller](https://en.wikipedia.org/wiki/Lehmer_random_number_generator) pseudorandom number generator (PRNG)


## Install

```
$ npm install park-miller
```


## Usage

```js
const ParkMiller = require('park-miller');

const random = new ParkMiller(10);

random.integer();
//=> 2027521326
```


## API

### `const random = new ParkMiller(seed)`

#### seed

Type: `integer`

[Initialization seed.](https://en.m.wikipedia.org/wiki/Random_seed)

### random.integer()
### random.integerInRange(min, max)
### random.float()
### random.floatInRange(min, max)
### random.boolean()


## Related

- [randoma](https://github.com/sindresorhus/randoma) - User-friendly pseudorandom number generator (PRNG)


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
