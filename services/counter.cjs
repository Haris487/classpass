const axios = require('axios');


module.exports =  class Counter {
  static count = 0;
  constructor() {
    Counter.increment()
  }

  static increment() {
    Counter.count++;
  }

  getCount() {
    return Counter.count % 10;
  }
}