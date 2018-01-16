const debug = require('debug')('caribou');

const errors = require('./src/errors');

const Bus = require('./src/Bus');
const Container = require('./src/Container');
const Provider = require('./src/Container/Provider');
// No need for registrar

// TODO Returned object will be called as 'app', \
//      so export something can act like one.
class Kernel {
  constructor(rootPath) {
    /**
     * Absolute path to project root (where
     * the 'package.json') file stays.
     */
    this._rootPath = rootPath;

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
     *  // TODO `bootstrap` function MAY be called a context \
     *  //      (the initial app context), which the kernel \
     *  //      will append.
     *  const app = (new Kernel('./app')).bootstrap(ctx);
     * `
     */

    // TODO Make them so that they can not alter \
    //      the context. They SHOULD just read
    //      its values (maybe more).
    const bus = new Bus(ctx);
    const container = new Container(ctx);

    //

    this._ctx = ctx;
    this._bus = bus;
    this._container = container;
  }

  // TODO Test this function
  bootstrap(baseCtx = null) {
    //

    if (typeof baseCtx !== 'undefined' && baseCtx !== null) {
      // The context defined here MAY overwrite the base's.
      // TODO DOC Users MUST be warned.
      this._ctx = Object.assign({}, baseCtx, this._ctx);
    }

    //

    // TODO DOC This return (the `app`) MUST be passed to the providers.
    const app = {
      /* bus: this._bus, */
      on: this._bus.addEventListener.bind(this._bus),
      // TODO `once`
      emit: this._bus.dispatch.bind(this._bus),
      // TODO `off`
      //
      /* container: this._container, */
      register: this._container.bind.bind(this._container), // hi-hi :)
      resolve: this._container.make.bind(this._container),
      //
      ...this._ctx,
      //
      Provider,
    };

    //

    return app;
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
module.exports = Kernel;
