/**
 *
 * @param {String} name
 * @param {Function|Object} _class
 * @param {Function} [_base]
 * @returns {*}
 * @constructor
 */
var Class = function(name, _class, _base) {
	"use strict";

    var context = this,
	    construct = _class.construct || _class,
	    _staticItems = _class.Static || null,
        _static = {},
	    _prototype = {},
        parent,
	    prop;

    if (construct) {
        //create static methods/attributes
        _class.typeOf = name;
	    _class.instanceOf = construct;
        if (typeof _class == "object") {
	        _prototype = _class;
        }

	    if (_staticItems !== null) {
		    for(prop in _staticItems) if (_staticItems.hasOwnProperty(prop)) {
			    construct[prop] = _staticItems[prop];
		    }
	    }

	    construct.Class = function(name) {
		    return Class.apply(construct, arguments);
	    };

        if (_class.extends !== undefined) {
            _base = _class.extends;
        }

        //extend and set parent
        if (_base && (parent = _base.prototype)) {
            for (prop in parent) if (parent.hasOwnProperty(prop) && prop !== 'construct') {
	            _prototype[prop] = _class[prop] || parent[prop];
            }
            //set parent attribute to what is being inherited
	        _prototype.parent = parent;
        }

        //make ability to extend as anon
        construct.extend = function(typeOrChild, child) {
            var type = 'anon';
            if (child) {
                type = typeOrChild;
            } else {
                child = typeOrChild;
            }
            return Class.call(context, type, child, construct);
        };

        construct.prototype = _prototype;

        //this defaults to window, extend with name, and return;
        return (this || window)[name] = construct;
    }
};