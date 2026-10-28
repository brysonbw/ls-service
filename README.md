# ls-service

[![Version](https://img.shields.io/github/v/tag/brysonbw/ls-service?style=flat&label=version)](https://github.com/brysonbw/ls-service/releases) ![NPM Downloads](https://img.shields.io/npm/dy/ls-service?style=flat&label=npm%20downloads) ![CI](https://img.shields.io/github/actions/workflow/status/brysonbw/ls-service/ci.yml?branch=main&style=flat&logo=github&label=ci)

Minimal, namespaced, and typed `localStorage` wrapper.

## Install

### pnpm

```sh
pnpm add ls-service
```

### npm

```sh
npm install ls-service
```

### yarn

```sh
yarn add ls-service
```

## Examples

### Load or Initialize

```js
const settings = storage.getOrSet("settings", () => ({
  theme: "dark",
  lang: "en",
}));
```

### Counters and Read-Modify-Write

```js
storage.update("visits", (n) => n + 1, 0); // 1, then 2, ...

storage.update("settings", (s) => ({ ...s, theme: "light" }));
```

### Lists

```js
storage.update("todos", (list) => [...list, { id: 2, text: "Ship it" }], []);
```

### Inspect and Export a Namespace

```js
storage.keys(); // ['settings', 'visits']
storage.keys(true); // ['my-app:settings', 'my-app:visits']

storage.entries(); // [['settings', {...}], ['visits', 3]]
Object.fromEntries(storage.entries()); // plain object snapshot

storage.size(); // 2
```

### Isolated Namespaces

```js
const auth = new LocalStorageService("auth");
const ui = new LocalStorageService("ui");

auth.set("token", "abc");
ui.set("token", "xyz"); // no collision

ui.clear(); // auth:token is untouched
```

## TypeScript

Pass type arguments to type the result:

```ts
import { LocalStorageService } from "ls-service";

interface User {
  id: number;
  name: string;
}

const storage = new LocalStorageService("my-app");

storage.set("user", { id: 1, name: "Ada" });

const user = storage.get<User>("user"); // User | null
const safe = storage.get<User>("user", defaultUser); // User (fallback given)
const theme = storage.getOrSet<string>("theme", () => "dark"); // string
const count = storage.update<number>("count", (n) => (n ?? 0) + 1, 0); // number
const all = storage.entries<User>(); // [string, User | null][]
```

The type is a compile-time assertion only; stored data is not validated at runtime, so treat it as untrusted if its shape may have changed between releases.

## Error Handling

Storage problems always throw; there is no in-memory fallback.

- **Unavailable** (SSR, privacy mode, access denied): The constructor throws `STORAGE_UNAVAILABLE`, with the original underlying error attached as `cause`.
- **Invalid namespace:** The constructor throws `STORAGE_NAMESPACE_INVALID`.
- **Quota exceeded / write failure:** `set` (and `getOrSet` / `update`) throw the standard storage error, e.g., `QuotaExceededError`.
- **Unserializable values** (e.g. circular objects): `set` throws a `TypeError`.

```js
import { LocalStorageService } from "ls-service";

try {
  const storage = new LocalStorageService("my-app");
  storage.set("big", data);
} catch (error) {
  if (error.message.includes("unavailable")) {
    // localStorage blocked or missing; check error.cause for details
  } else if (error.name === "QuotaExceededError") {
    // storage limit reached
  } else {
    throw error;
  }
}
```

## API

For more detailed documentation, please view the [API Reference](docs/api-reference/README.md).

## Contributing

If you have suggestions for how this project could be improved, or want to report a bug, feel free to open an issue! We welcome all contributions.

Likewise, before contributing please read the [contribution guide](CONTRIBUTING.md).

## Motivation

After implementing this simple service wrapper across several client-side projects, I decided to publish it as a public package rather than repeatedly copying the code.

## Resources

- [Changelog](CHANGELOG.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)
- [API Reference](docs/api-reference/README.md)

## License

[MIT](LICENSE)
