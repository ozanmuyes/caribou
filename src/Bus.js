/**
 * This class forked from [krasimir](https://github.com/krasimir/EventBus)
 * by Ozan Müyesseroğlu on Jun, 16th 2018.
 *
 * Here is the list of modifications;
 * - TODO ...
 * TODO ...
 */

// TODO javascript event bus with proxy?

const debug = require('debug')('caribou:Bus');

class Bus {
  constructor() {
    this.listeners = {};
    //
  }

  addEventListener(...args/* type, callback, scope */) {
    const argments = (args.length > 3 ? args.splice(3, args.length - 1) : []);
    const numOfArgs = args.length;
    for (let i = 0; i < numOfArgs; i += 1) {
      argments.push(args[i]);
    }
    const type = argments[0];
    const callback = argments[1];
    const scope = argments[2];

    if (typeof this.listeners[type] !== 'undefined') {
      this.listeners[type].push({ scope, callback, argments });
    } else {
      this.listeners[type] = [{ scope, callback, argments }];
    }
  }

  removeEventListener(type, callback, scope) {
    if (typeof this.listeners[type] !== 'undefined') {
      const numOfCallbacks = this.listeners[type].length;
      const newArray = [];

      for (let i = 0; i < numOfCallbacks; i += 1) {
        const listener = this.listeners[type][i];

        if (listener.scope === scope && listener.callback === callback) {
          // ???
        } else {
          newArray.push(listener);
        }
      }

      this.listeners[type] = newArray;
    }
  }

  hasEventListener(type, callback, scope) {
    if (typeof this.listeners[type] !== 'undefined') {
      const numOfCallbacks = this.listeners[type].length;

      if (callback === undefined && scope === undefined) {
        return numOfCallbacks > 0;
      }

      for (let i = 0; i < numOfCallbacks; i += 1) {
        const listener = this.listeners[type][i];

        if ((scope ? listener.scope === scope : true) && (listener.callback === callback)) {
          return true;
        }
      }
    }

    return false;
  }

  // TODO https://github.com/ozanmuyes/EventBus/blob/master/src/EventBus.js#L60
  dispatch(...argments/* type, target */) {
    const event = {
      type: argments[0],
      target: argments[1],
    };
    const args = [event].concat(argments.length > 2 ? argments.splice(2, argments.length - 1) : []);
    const numOfArgs = argments.length;

    for (let i = 0; i < numOfArgs; i += 1) {
      args.push(argments[i]);
    }

    if (typeof this.listeners[event.type] !== 'undefined') {
      const listeners = this.listeners[event.type].slice();
      const numOfCallbacks = listeners.length;

      for (let i = 0; i < numOfCallbacks; i += 1) {
        const listener = listeners[i];

        if (listener && listener.callback) {
          const concatArgs = args.concat(listener.args);
          listener.callback.apply(listener.scope, concatArgs);
        }
      }
    }
  }

  getEvents() {
    let str = '';

    // eslint-disable-next-line
    for (let type in this.listeners) {
      const numOfCallbacks = this.listeners[type].length;

      for (let i = 0; i < numOfCallbacks; i += 1) {
        const listener = this.listeners[type][i];

        str += `${(listener.scope && listener.scope.className ? listener.scope.className : 'anonymous')} listen for ${type}\n`;
      }
    }

    return str;
  }
}

module.exports = Bus;
