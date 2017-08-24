'use strict';

let memoizeCache = {};

module.exports = function asycMemoize(asyncFunc) {
    return function() {
        let args = Array.from(arguments).slice(0, arguments.length - 1);
        let key = JSON.stringify(args);
        let callback = arguments[arguments.length - 1];
        if(memoizeCache[key]) {
            return callback.apply(null, memoizeCache[key]);
        }
        asyncFunc(...args, function(err, ...result) {
            // Don't memoize errors.
            if(err) {
                return callback(err);
            }

            memoizeCache[key] = [ err, ...result ];
            return callback.apply(null, memoizeCache[key]);
        });
    };
};
