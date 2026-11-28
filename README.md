# SuperINI<br>[![GitHub Actions][actions-img]][actions-url] [![NPM][npm-img]][npm-url] [![Patreon][patreon-img]][patreon-url] [![PayPal][paypal-img]][paypal-url] [![Discord][discord-img]][discord-url]

SuperINI is a simple but easy to use INI parser and dumper library for Node, Bundlers, Browsers and anything that runs JS, written in TypeScript and with no runtime dependencies.

## Usage

### Parser

```ts
import { parse } from "superini";
const ini = "[hi]\nkey=value";
parse(ini);  // { hi: { key: "value" } }
```

### Dumper

```ts
import { dump } from "superini";
const obj = { hi: { key: "value" } }
dump(obj)  // '[hi]\nkey = value\n'
```

## Remarks

Please note that inline comments are currently not supported.

[actions-img]: https://img.shields.io/github/actions/workflow/status/justalemon/SuperINI/main.yml?branch=master&label=actions
[actions-url]: https://github.com/justalemon/SuperINI/actions
[npm-img]: https://img.shields.io/npm/v/superini
[npm-url]: https://www.npmjs.com/package/superini
[patreon-img]: https://img.shields.io/badge/support-patreon-FF424D.svg
[patreon-url]: https://www.patreon.com/lemonchan
[paypal-img]: https://img.shields.io/badge/support-paypal-0079C1.svg
[paypal-url]: https://paypal.me/justalemon
[discord-img]: https://img.shields.io/badge/discord-join-7289DA.svg
[discord-url]: https://discord.gg/Cf6sspj
