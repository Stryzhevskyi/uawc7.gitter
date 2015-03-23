/**
 * Created by Sergei on 23.03.15.
 */

var helper = require('./helper.js');
var LP = '(';
var RP = ')';

/**
 *
 * @param {Array} inFixExpression
 * @see https://en.wikipedia.org/wiki/Shunting-yard_algorithm
 *
 */
var InToPostFix = function (inFixExpression) {
    this.init(inFixExpression);
};

InToPostFix.prototype = {
    constructor: InToPostFix,
    stack: [],
    queue: [],
    expression: [],
    init: function () {
        this.clear();
    },
    parse: function (inFixExpression) {
        this.checkInput(inFixExpression);
        var postfixArray;
        this.expression = inFixExpression;
        this.walkExpression();
        postfixArray = this.queue;
        this.clear();
        return postfixArray;
    },
    checkInput: function (inFixExpression) {
        var count = function (str) {
            return inFixExpression.filter(function (el) {
                return el == str;
            }).length;
        };
        if (count(LP) !== count(RP)) {
            throw new Error('Number of left end right parenthesis does not equal')
        }
    },
    clear: function () {
        this.stack = [];
        this.queue = [];
        this.expression = null;
    },
    walkExpression: function () {
        while (this.expression.length) {
            var token = this.expression.shift();
            var _token;
            if (helper.isNumber(token)) {
                this.queue.push(token);
            } else if (token === LP) {
                this.stack.push(token);
            } else if (token === RP) {
                while ((_token = this.stack.pop()) !== LP) {
                    this.queue.push(_token);
                }
                if (helper.isOperator(this.stackLast())) {
                    this.queue.push(this.stack.pop());
                }
            } else if (helper.isOperator(token)) {
                var stackLast = this.stackLast();
                while (helper.isOperator(stackLast) && (helper.operatorPriority(token)) <= helper.operatorPriority(stackLast)) {
                    this.queue.push(this.stack.pop());
                    stackLast = this.stackLast();
                }
                this.stack.push(token);
            }
        }
        if (this.stack.length) {
            this.queue = this.queue.concat(this.stack.reverse());
        }
    },
    stackLast: function () {
        return this.stack[this.stack.length - 1];
    }
};


module.exports = InToPostFix;

