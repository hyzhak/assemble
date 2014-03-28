var _ = require('lodash');
var boson = require('boson');


/**
 * Register mixins with Lo-Dash so they can
 * be used in config values.
 *
 * @param   {Object} assemble
 * @param   {Function} next
 *
 * @api private
 */

module.exports = function(assemble, nextStep) {
  if (!_.isEmpty(assemble.mixins)) {
    var mixins = boson(assemble.mixins, assemble);
    if (assemble.options.noconflict) {
      var prefix = assemble.options.noconflict === true ? 'fn' : assemble.options.noconflict;

      // wrapper constructor from Lo-Dash tests
      var Wrapper = function (value) {
        if (!(this instanceof Wrapper)) {
          return new Wrapper(value);
        }
        this.__wrapped__ = value;
      };

      // allows getting the value when using chaining
      Wrapper.prototype.value = function() {
        return this.__wrapped__;
      };

      // add the mixins to the Wrapper
      _.mixin(Wrapper, mixins);

      // add the Wrapper to a namespaced object
      _[prefix] = Wrapper;

    } else {
      _.mixin(mixins);
    }
  }
  nextStep();
};