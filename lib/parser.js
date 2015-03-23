/**
 * Created by Sergei on 23.03.15.
 */

var InToPostFix = require('./InToPostFix.js');
var postfixEval = require('./PostfixEval.js');
var debug = require('debug')('parser');
var expressionSliceRegexp = /\s*([0-9.]+|\S)\s*/g;
var disallowedRegexp = /[^0-9.\s\\\/\+\-\*\/\(\)]/g;
var spacesRegexp = /\s/g;


var CalcParser = function (prefix) {
    this.init(prefix);
};

CalcParser.prototype = {
    constructor: CalcParser,
    options: {
        prefix: '',
        prefixRegexp: null
    },
    init: function (prefix) {
        this.options.prefix = prefix.trim();
        this.options.prefixRegexp = new RegExp('^' + this.options.prefix + '\\s+(.*)$');
    },
    /**
     *
     * @param {String} message calc {expression}
     * @returns {*}
     */
    onMessage: function (message) {
        debug('message: %s', message);
        var expression, expressionArray, matches, postfixRepresentation, result;
        if (!this.options.prefixRegexp.test(message)) {
            return null;
        }
        matches = message.match(this.options.prefixRegexp);
        if (matches.length > 1) {
            expression = matches[1];
        }

        expressionArray = this.prepareExpression(expression);
        postfixRepresentation = this.inToPostFix(expressionArray);
        result = postfixEval(postfixRepresentation);
        debug('result: %d', result);
        return result;
    },
    prepareExpression: function (expression) {
        var disallowed;
        if (disallowed = expression.match(disallowedRegexp)) {
            throw new Error('Disallowed characters found : ' + disallowed.join(' '));
        }
        return expression
            .replace(spacesRegexp, '')
            .match(expressionSliceRegexp);
    },
    inToPostFix: function (expression) {
        var parser = new InToPostFix();
        return parser.parse(expression);
    }
};


module.exports = CalcParser;