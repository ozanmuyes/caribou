// TODO See the screenshots on the phone

const fs = require('fs');

const debug = require('debug')('caribou');
const SortedArray = require('sorted-array');

const importDir = require('./src/importDir');
const errors = require('./src/errors');

const Bus = require('./src/Bus');
const Container = require('./src/Container');
/* const Provider = require('./src/Container/Provider'); */
// No need for registrar

// TODO Get providers array (consists of objects of `register` and/or `boot` methods) by paths array (absolute or root relative) \
//      Use it in ctor

// TODO Returned object will be called as 'app', \
//      so export something can act like one.
class Kernel {
  constructor(paths) {
    this._id = Math.floor(Math.random() * 99999);
    console.log(`ID: ${this._id}`);

    /**
     * Absolute path to project root (where
     * the 'package.json') file stays.
     */
    this._paths = paths;

    let _config;
    // TODO Import config path with its contents somewhere near here
    if (paths.config) {
      // TODO Ses kaydını dinle
      const filePath = `${paths.config}/providers.js`;

      if (fs.existsSync(filePath)) {
        const exports = require(filePath); // eslint-disable-line

        if (typeof exports === 'object') {
          if (Array.isArray(exports)) {
            // TODO get filename of export
          } else {
            /* const imports = {}; // This SHOULD be sorted array */
            const imports = new SortedArray([], (lhs, rhs) => {
              if (lhs.priority && rhs.priority) {
                return (lhs.priority - rhs.priority);
              }

              return lhs.name
                ? lhs.name.localeCompare((rhs.name ? rhs.name : ''))
                : 1
            });

            let imported = null;
            Object.entries(exports).forEach((exported) => {
              imported = require(exported[1]);
              /* if (!imported.name) {
                imported.name = exported[0];
              } */
              /* imports[(imported.name ? imported.name : exported[0])] = imported; */
              imports.insert({
                name: exported[0], // TODO ???
                ...imported,
              });

              /* if (imported.name) {
                imports[imported.name] = imported;
              } else {
                imports[exported[0]] = imported;
              } */
            });

            this._providers = imports.array;
          }
        }
      }
    }
    const config = _config;

    // TODO Export something related with this,
    //      the "context of the kernel.". The
    //      context is essence of the value
    //      that will be exported (will be
    //      the `app`).
    const ctx = {
      // TODO
    };
    // The context (`ctx`) MAY include functions.
    ctx.debug = debug.bind(/* FIXME Maybe `this` here??? */);
    /**
     * TODO Use the function above by;
     * `
     *  const app = (new Kernel('./app')).boot();
     * `
     */

    // TODO Make them so that they can not alter \
    //      the context. They SHOULD just read
    //      its values (maybe more).
    const bus = new Bus(ctx);
    const container = new Container(ctx);

    if (!this._providers) {
      // Since providers array
      const providersObj = (require('./src/importDir'))(this._paths.providers); // eslint-disable-line

      // NOTE What the code does below?
      /* const providers = new SortedArray([], (lhs, rhs) => {
        /* if (lhs.priority && rhs.priority) {
          return (lhs.priority - rhs.priority);
        }

        return lhs.name
          ? lhs.name.localeCompare((rhs.name ? rhs.name : ''))
          : 1; *

        if (lhs[1].priority && rhs[1].priority) {
          return (lhs[1].priority - rhs[1].priority);
        }

        return lhs[0]
          ? lhs[0].localeCompare((rhs[0] ? rhs[0] : ''))
          : 1;
      }); */
      const providers = [];
      Object.entries(providersObj).forEach((provider) => {
        /* providers.insert(provider); */
        providers.push(provider);
      });
      this._providers = providers/* .array */; // This one (`this._providers`) MUST be an array
    }

    //

    this._config = config;
    this._ctx = ctx;
    this._bus = bus;
    this._container = container;
    /* this._providers = providersObj; */
    const providerCtx = {
      container: this._container,
      config: this._config,
    };
    this._providerCtx = providerCtx;

    const selfKernelInst = this;

    // -TODO Register providers by the 'registrar' // Do NOT use a registrar
    /* Object.entries(this._providers) // [x][0] = name (e.g. 'Test1'), [x][1] = its export obj (i.e. has `register` and maybe `boot`)
      .filter((provider) => {
        return (typeof provider[1].register === 'function');
      })
      /* .filter((provider) => (typeof provider[1].register === 'function')) *
      .forEach(([name, provider]) => {
        provider.register(/* selfKernelInst * providerCtx);
        // NOTE Handle provider register return value here
      }); */
    this._providers
      .filter(provider => (typeof provider[1].register === 'function'))
      .forEach((provider) => {
        console.log(provider);
      });
    // See https://github.com/poppinss/adonis-fold/blob/develop/src/Registrar/index.js
    // See https://github.com/adonisjs/adonis-framework/blob/1b72f83f806e48c5068b7fc1f3b2e388ef4b1a60/test/integration/setup.js#L18
  }

  // TODO Test this function
  boot() {
    this._bus.dispatch.call(this._bus, 'beforeBoot');

    // TODO See 'src/Container/Registrar:200'
    const selfKernelInst = this;
    let currProviderRet = null;
    /* Object.entries(this._providers) // [x][0] = name (e.g. 'Test1'), [x][1] = its export obj (i.e. has `register` and maybe `boot`)
      .filter((provider) => {
        return (typeof provider[1].boot === 'function');
      })
      /* .filter((provider) => (typeof provider[1].boot === 'function')) *
      .forEach(([name, provider]) => {
        currProviderRet = provider.boot(/* selfKernelInst * selfKernelInst._providerCtx);

        if (currProviderRet) {
          selfKernelInst._ctx[name.toLowerCase()] = currProviderRet;
        }
      }); */
      this._providers
        .filter(provider => (typeof provider[1].boot === 'function'))
        .forEach((provider) => {
          console.log(provider);
        });

    // TODO DOC This return (the `app`) MUST be passed to the providers.
    const app = {
      /* bus: this._bus, */
      on: this._bus.addEventListener.bind(this._bus),
      // TODO `once`
      emit: this._bus.dispatch.bind(this._bus),
      // TODO `off`
      //
      /* container: this._container, */
      // NOTE Its not advised to use `register' function outside
      //      outside of the kernel - in other words register
      //      things with the container only by providers.
      // If the last argument is a boolean, it will be treated as
      // 'isSingleton', and if true then the
      register: (...args) => {
        const lastArg = (args.length ? args[args.length - 1] : null);

        if (typeof lastArg === 'boolean') {
          const filteredArgs = args.slice(0, -1);

          if (lastArg) {
            // singleton
            return this._container.singleton(...filteredArgs);
          } else {
            // normal register (`bind`)
            return this._container.bind(...filteredArgs);
          }
        } else {
          /* // default - singleton
          return this._container.singleton(...args); */

          // default - bind
          return this._container.bind(...args);
        }
      },
      resolve: this._container.make.bind(this._container),

      //
      ...this._ctx,
      //
      /* Provider, */
    };

    //

    this._bus.dispatch.call(this._bus, 'afterBoot', app);

    return app;
  }

  on(...args) {
    this._bus.addEventListener.apply(this._bus, args);
  }

  //
}

// NOTE Even though we exported the class (not an
//      instance of it) caller SHOULD only
//      create one instance.
/* export default Kernel;
export {
  errors,
  //
  // NOTE For now there is no any idea of exporting
  //      the bus and the container, since they
  //      are instantiated by the class.
}; */
/* module.exports = { // [XPRTJSTTHKRNL]: export just the kernel
  Kernel,
  /* Provider, *
  //
}; */
module.exports = Kernel; // [XPRTJSTTHKRNL]
