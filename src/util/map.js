class Map {
  constructor() {
    this.list = [];
  }
  set(key, value) {
    const item = this.list.find(item => item.key === key);
    if (item) {
      item.value = value;
    } else {
      this.list.push({ key, value });
    }
  }
  delete(key) {
    const item = this.list.find(item => item.key === key);
    if (item) {
      const index = this.list.indexOf(item);
      this.list.splice(index, 1);
    }
  }
  get(key) {
    const item = this.list.find(item => item.key === key);
    if (item) {
      return item.value;
    }
  }
}

export default Map;
