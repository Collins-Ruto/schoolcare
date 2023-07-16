import { Cache } from "./prisma";
import LruMap from "collections/lru-map";

export class LruCache {
  map;

  constructor(size) {
    this.map = new LruMap({}, size);
  }

  read(key) {
    return Promise.resolve(this.map.get(key) ?? null);
  }

  write(key, value) {
    this.map.set(key, value);
    return Promise.resolve();
  }

  flush() {
    this.map.clear();
    return Promise.resolve();
  }
}
