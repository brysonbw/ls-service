/*! ls-service v1.0.0 Copyright (c) 2026 Bryson Ward and contributors MIT License*/
const ERROR_MESSAGE = {
    STORAGE_NAMESPACE_INVALID: "Storage namespace must be a non-empty string.",
    STORAGE_UNAVAILABLE: "localStorage is unavailable.",
};

/**
 * Service for interacting with localStorage with a specific namespace.
 */
class LocalStorageService {
    #namespace;
    #storage;
    /**
     * Creates an instance of LocalStorageService.
     *
     * @param {string} namespace The namespace prefix for all storage keys.
     * @throws {Error} Throws if the namespace is invalid or localStorage is unavailable.
     */
    constructor(namespace) {
        if (!namespace || typeof namespace !== "string") {
            throw new Error(ERROR_MESSAGE.STORAGE_NAMESPACE_INVALID);
        }
        this.#namespace = `${namespace}:`;
        let storage;
        try {
            storage = globalThis.localStorage;
            const probe = `__storage_test_${Date.now()}_${Math.random()}__`;
            storage.setItem(probe, probe);
            storage.removeItem(probe);
        }
        catch (error) {
            throw new Error(ERROR_MESSAGE.STORAGE_UNAVAILABLE, {
                cause: error,
            });
        }
        if (!storage) {
            throw new Error(ERROR_MESSAGE.STORAGE_UNAVAILABLE);
        }
        this.#storage = storage;
    }
    /**
     * Stores a value under the given key within this namespace.
     *
     * @param {string} key The storage key.
     * @param {unknown} value The value to store (objects and arrays will be JSON stringified).
     */
    set(key, value) {
        this.#storage.setItem(`${this.#namespace}${key}`, typeof value === "string" ? value : JSON.stringify(value));
    }
    /**
     * Returns the parsed value, the raw string if it isn't valid JSON
     * (e.g. a plain string saved with `set`), or `fallback` when missing.
     *
     * @template T The expected return type.
     * @param {string} key The storage key.
     * @param {T | null} [fallback=null] The fallback value to return if the key is missing.
     * @returns {T | null} The parsed value, raw string, or fallback.
     */
    get(key, fallback = null) {
        const item = this.#storage.getItem(`${this.#namespace}${key}`);
        if (item === null)
            return fallback;
        try {
            return JSON.parse(item);
        }
        catch {
            return item;
        }
    }
    /**
     * Checks if a key exists in this namespace.
     *
     * @param {string} key The storage key.
     * @returns {boolean} True if the key exists, false otherwise.
     */
    has(key) {
        return this.#storage.getItem(`${this.#namespace}${key}`) !== null;
    }
    /**
     * Removes a key and its associated value from this namespace.
     *
     * @param {string} key The storage key.
     */
    remove(key) {
        this.#storage.removeItem(`${this.#namespace}${key}`);
    }
    /**
     * Returns keys in this namespace.
     *
     * @param {boolean} [withPrefix=false] Whether to include the namespace prefix in the returned keys.
     * @returns {string[]} An array of keys.
     */
    keys(withPrefix = false) {
        const result = [];
        for (let i = 0; i < this.#storage.length; i++) {
            const key = this.#storage.key(i);
            if (key?.startsWith(this.#namespace)) {
                result.push(withPrefix ? key : key.slice(this.#namespace.length));
            }
        }
        return result;
    }
    /**
     * Returns the stored value, or stores and returns the result of `factory()` if missing.
     *
     * @template T The expected return type.
     * @param {string} key The storage key.
     * @param {() => T} factory A factory function to generate the value if missing.
     * @returns {T} The stored or newly generated value.
     */
    getOrSet(key, factory) {
        const item = this.get(key);
        if (item !== null)
            return item;
        const value = factory();
        this.set(key, value);
        return value;
    }
    /**
     * Reads the value (or `fallback`), applies `fn`, stores and returns the result.
     *
     * @template T The type of the current value.
     * @template R The type of the updated return value.
     * @param {string} key The storage key.
     * @param {(current: T | null) => R} fn The function to apply to the current value.
     * @param {T | null} [fallback=null] The fallback value if the key is missing.
     * @returns {R} The updated result.
     */
    update(key, fn, fallback = null) {
        const next = fn(this.get(key, fallback));
        this.set(key, next);
        return next;
    }
    /**
     * Returns all key/value pairs in this namespace as an array of tuples.
     *
     * @template T The expected type of the values.
     * @param {boolean} [withPrefix=false] Whether to include the namespace prefix in the returned keys.
     * @returns {[string, T | null][]} An array of [key, value] tuples.
     */
    entries(withPrefix = false) {
        const rawKeys = this.keys(false);
        return rawKeys.map((cleanKey) => [
            withPrefix ? `${this.#namespace}${cleanKey}` : cleanKey,
            this.get(cleanKey),
        ]);
    }
    /**
     * Returns the number of keys in this namespace.
     *
     * @returns {number} The count of keys.
     */
    size() {
        return this.keys().length;
    }
    /**
     * Removes only keys belonging to this namespace.
     *
     * @returns {void}
     */
    clear() {
        for (const key of this.keys()) {
            this.remove(key);
        }
    }
}

export { LocalStorageService };
