/**
 * Service for interacting with localStorage with a specific namespace.
 */
declare class LocalStorageService {
    #private;
    /**
     * Creates an instance of LocalStorageService.
     *
     * @param {string} namespace The namespace prefix for all storage keys.
     * @throws {Error} Throws if the namespace is invalid or localStorage is unavailable.
     */
    constructor(namespace: string);
    /**
     * Stores a value under the given key within this namespace.
     *
     * @param {string} key The storage key.
     * @param {unknown} value The value to store (objects and arrays will be JSON stringified).
     */
    set(key: string, value: unknown): void;
    /**
     * Returns the parsed value, the raw string if it isn't valid JSON
     * (e.g. a plain string saved with `set`), or `fallback` when missing.
     *
     * @template T The expected return type.
     * @param {string} key The storage key.
     * @param {T | null} [fallback=null] The fallback value to return if the key is missing.
     * @returns {T | null} The parsed value, raw string, or fallback.
     */
    get<T = unknown>(key: string, fallback?: T | null): T | null;
    /**
     * Checks if a key exists in this namespace.
     *
     * @param {string} key The storage key.
     * @returns {boolean} True if the key exists, false otherwise.
     */
    has(key: string): boolean;
    /**
     * Removes a key and its associated value from this namespace.
     *
     * @param {string} key The storage key.
     */
    remove(key: string): void;
    /**
     * Returns keys in this namespace.
     *
     * @param {boolean} [withPrefix=false] Whether to include the namespace prefix in the returned keys.
     * @returns {string[]} An array of keys.
     */
    keys(withPrefix?: boolean): string[];
    /**
     * Returns the stored value, or stores and returns the result of `factory()` if missing.
     *
     * @template T The expected return type.
     * @param {string} key The storage key.
     * @param {() => T} factory A factory function to generate the value if missing.
     * @returns {T} The stored or newly generated value.
     */
    getOrSet<T>(key: string, factory: () => T): T;
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
    update<T = unknown, R = T>(key: string, fn: (current: T | null) => R, fallback?: T | null): R;
    /**
     * Returns all key/value pairs in this namespace as an array of tuples.
     *
     * @template T The expected type of the values.
     * @param {boolean} [withPrefix=false] Whether to include the namespace prefix in the returned keys.
     * @returns {[string, T | null][]} An array of [key, value] tuples.
     */
    entries<T = unknown>(withPrefix?: boolean): [string, T | null][];
    /**
     * Returns the number of keys in this namespace.
     *
     * @returns {number} The count of keys.
     */
    size(): number;
    /**
     * Removes only keys belonging to this namespace.
     *
     * @returns {void}
     */
    clear(): void;
}

export { LocalStorageService };
