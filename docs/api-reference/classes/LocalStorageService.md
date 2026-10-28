[**LS Service API Reference**](../README.md)

***

[LS Service API Reference](../README.md) / LocalStorageService

# Class: LocalStorageService

Service for interacting with localStorage with a specific namespace.

## Constructors

### Constructor

> **new LocalStorageService**(`namespace`): `LocalStorageService`

Creates an instance of LocalStorageService.

#### Parameters

##### namespace

`string`

The namespace prefix for all storage keys.

#### Returns

`LocalStorageService`

#### Throws

Throws if the namespace is invalid or localStorage is unavailable.

## Methods

### clear()

> **clear**(): `void`

Removes only keys belonging to this namespace.

#### Returns

`void`

***

### entries()

> **entries**\<`T`\>(`withPrefix?`): \[`string`, `T` \| `null`\][]

Returns all key/value pairs in this namespace as an array of tuples.

#### Type Parameters

##### T

`T` = `unknown`

The expected type of the values.

#### Parameters

##### withPrefix?

`boolean` = `false`

Whether to include the namespace prefix in the returned keys.

#### Returns

\[`string`, `T` \| `null`\][]

An array of [key, value] tuples.

***

### get()

> **get**\<`T`\>(`key`, `fallback?`): `T` \| `null`

Returns the parsed value, the raw string if it isn't valid JSON
(e.g. a plain string saved with `set`), or `fallback` when missing.

#### Type Parameters

##### T

`T` = `unknown`

The expected return type.

#### Parameters

##### key

`string`

The storage key.

##### fallback?

`T` \| `null` = `null`

The fallback value to return if the key is missing.

#### Returns

`T` \| `null`

The parsed value, raw string, or fallback.

***

### getOrSet()

> **getOrSet**\<`T`\>(`key`, `factory`): `T`

Returns the stored value, or stores and returns the result of `factory()` if missing.

#### Type Parameters

##### T

`T`

The expected return type.

#### Parameters

##### key

`string`

The storage key.

##### factory

() => `T`

A factory function to generate the value if missing.

#### Returns

`T`

The stored or newly generated value.

***

### has()

> **has**(`key`): `boolean`

Checks if a key exists in this namespace.

#### Parameters

##### key

`string`

The storage key.

#### Returns

`boolean`

True if the key exists, false otherwise.

***

### keys()

> **keys**(`withPrefix?`): `string`[]

Returns keys in this namespace.

#### Parameters

##### withPrefix?

`boolean` = `false`

Whether to include the namespace prefix in the returned keys.

#### Returns

`string`[]

An array of keys.

***

### remove()

> **remove**(`key`): `void`

Removes a key and its associated value from this namespace.

#### Parameters

##### key

`string`

The storage key.

#### Returns

`void`

***

### set()

> **set**(`key`, `value`): `void`

Stores a value under the given key within this namespace.

#### Parameters

##### key

`string`

The storage key.

##### value

`unknown`

The value to store (objects and arrays will be JSON stringified).

#### Returns

`void`

***

### size()

> **size**(): `number`

Returns the number of keys in this namespace.

#### Returns

`number`

The count of keys.

***

### update()

> **update**\<`T`, `R`\>(`key`, `fn`, `fallback?`): `R`

Reads the value (or `fallback`), applies `fn`, stores and returns the result.

#### Type Parameters

##### T

`T` = `unknown`

The type of the current value.

##### R

`R` = `T`

The type of the updated return value.

#### Parameters

##### key

`string`

The storage key.

##### fn

(`current`) => `R`

The function to apply to the current value.

##### fallback?

`T` \| `null` = `null`

The fallback value if the key is missing.

#### Returns

`R`

The updated result.
