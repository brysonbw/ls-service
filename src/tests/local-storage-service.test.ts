import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { LocalStorageService } from "../local-storage-service.ts";
import { ERROR_MESSAGE } from "../constants.ts";

// Polyfill global localStorage for Node.js test environment if needed
if (typeof globalThis.localStorage === "undefined") {
  class LocalStorageMock implements Storage {
    private store = new Map<string, string>();

    get length(): number {
      return this.store.size;
    }

    clear(): void {
      this.store.clear();
    }

    getItem(key: string): string | null {
      return this.store.get(key) ?? null;
    }

    key(index: number): string | null {
      return Array.from(this.store.keys())?.at(index) ?? null;
    }

    removeItem(key: string): void {
      this.store.delete(key);
    }

    setItem(key: string, value: string): void {
      this.store.set(key, String(value));
    }

    [name: string]: any;
  }

  globalThis.localStorage = new LocalStorageMock() as unknown as Storage;
}

describe("LocalStorageService", () => {
  const namespace = "test-app";
  let storageService: LocalStorageService;

  beforeEach(() => {
    localStorage.clear();
    storageService = new LocalStorageService(namespace);
  });

  describe("Constructor & Initialization", () => {
    it("should throw an error if namespace is missing or invalid", () => {
      assert.throws(() => {
        // @ts-expect-error testing invalid input
        new LocalStorageService(null);
      }, new Error(ERROR_MESSAGE.STORAGE_NAMESPACE_INVALID));

      assert.throws(() => {
        new LocalStorageService("");
      }, new Error(ERROR_MESSAGE.STORAGE_NAMESPACE_INVALID));
    });

    it("should throw an error if localStorage is completely unavailable", () => {
      const originalLocalStorage = globalThis.localStorage;

      const brokenStorage: Storage = {
        length: 0,
        key: () => null,
        getItem: () => {
          throw new Error("Blocked");
        },
        setItem: () => {
          throw new Error("Blocked");
        },
        removeItem: () => {},
        clear: () => {},
      };

      globalThis.localStorage = brokenStorage;

      assert.throws(() => {
        new LocalStorageService("fail");
      }, new Error(ERROR_MESSAGE.STORAGE_UNAVAILABLE));

      globalThis.localStorage = originalLocalStorage;
    });
  });

  describe("Basic Operations (set, get, has, remove)", () => {
    it("should store and retrieve string values correctly", () => {
      storageService.set("greeting", "hello world");
      assert.strictEqual(storageService.get("greeting"), "hello world");
    });

    it("should store and retrieve JSON parseable objects/arrays correctly", () => {
      const user = { name: "Alice", age: 30 };
      storageService.set("user", user);
      assert.deepStrictEqual(storageService.get("user"), user);
    });

    it("should return fallback when key does not exist", () => {
      assert.strictEqual(
        storageService.get("missing", "default-val"),
        "default-val",
      );
      assert.strictEqual(storageService.get("missing"), null);
    });

    it("should correctly check if a key exists", () => {
      assert.strictEqual(storageService.has("foo"), false);
      storageService.set("foo", "bar");
      assert.strictEqual(storageService.has("foo"), true);
    });

    it("should remove keys successfully", () => {
      storageService.set("foo", "bar");
      storageService.remove("foo");
      assert.strictEqual(storageService.has("foo"), false);
      assert.strictEqual(storageService.get("foo"), null);
    });
  });

  describe("Namespacing Isolation", () => {
    it("should only affect keys within its own namespace", () => {
      const otherService = new LocalStorageService("other-app");

      storageService.set("key", "value-from-test-app");
      otherService.set("key", "value-from-other-app");

      assert.strictEqual(storageService.get("key"), "value-from-test-app");
      assert.strictEqual(otherService.get("key"), "value-from-other-app");

      assert.strictEqual(
        localStorage.getItem("test-app:key"),
        "value-from-test-app",
      );
      assert.strictEqual(
        localStorage.getItem("other-app:key"),
        "value-from-other-app",
      );
    });
  });

  describe("Advanced Helpers (keys, entries, size, clear)", () => {
    it("should return namespaced keys with or without prefix correctly", () => {
      storageService.set("a", 1);
      storageService.set("b", 2);

      const keysWithoutPrefix = storageService.keys().sort();
      assert.deepStrictEqual(keysWithoutPrefix, ["a", "b"]);

      const keysWithPrefix = storageService.keys(true).sort();
      assert.deepStrictEqual(keysWithPrefix, [
        `${namespace}:a`,
        `${namespace}:b`,
      ]);
    });

    it("should return all entries with or without prefix", () => {
      storageService.set("x", 10);
      storageService.set("y", 20);

      const entriesWithoutPrefix = storageService.entries();
      assert.deepStrictEqual(entriesWithoutPrefix, [
        ["x", 10],
        ["y", 20],
      ]);

      const entriesWithPrefix = storageService.entries(true);
      assert.deepStrictEqual(entriesWithPrefix, [
        [`${namespace}:x`, 10],
        [`${namespace}:y`, 20],
      ]);
    });

    it("should return correct size", () => {
      assert.strictEqual(storageService.size(), 0);
      storageService.set("a", 1);
      storageService.set("b", 2);
      assert.strictEqual(storageService.size(), 2);
    });

    it("should clear only keys belonging to its namespace", () => {
      const otherService = new LocalStorageService("other-app");

      storageService.set("a", 1);
      otherService.set("b", 2);

      storageService.clear();

      assert.strictEqual(storageService.size(), 0);
      assert.strictEqual(otherService.size(), 1);
      assert.strictEqual(otherService.get("b"), 2);
    });
  });

  describe("Utility Operations (getOrSet, update)", () => {
    it("should get existing value or set via factory if missing", () => {
      let callCount = 0;
      const factory = (): string => {
        callCount++;
        return "generated-value";
      };

      const val1 = storageService.getOrSet("dynamic", factory);
      assert.strictEqual(val1, "generated-value");
      assert.strictEqual(callCount, 1);

      const val2 = storageService.getOrSet("dynamic", factory);
      assert.strictEqual(val2, "generated-value");
      assert.strictEqual(callCount, 1);
    });

    it("should update values using a transformation function", () => {
      storageService.set("counter", 5);

      const result = storageService.update<number, number>(
        "counter",
        (current) => (current ?? 0) + 1,
      );

      assert.strictEqual(result, 6);
      assert.strictEqual(storageService.get("counter"), 6);
    });

    it("should use fallback in update if key is missing", () => {
      const result = storageService.update<number, number>(
        "missing-counter",
        (current) => (current ?? 10) * 2,
        10,
      );

      assert.strictEqual(result, 20);
      assert.strictEqual(storageService.get("missing-counter"), 20);
    });
  });
});
