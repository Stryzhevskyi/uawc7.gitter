/**
 * Created by Sergei on 23.03.15.
 */

var helper = require('./helper.js');
var operators = {
    '+': function (a, b) {
        return a + b
    },
    '-': function (a, b) {
        return a - b
    },
    '*': function (a, b) {
        return a * b
    },
    '/': function (a, b) {
        return a / b
    }
};

module.exports = function (postfixExpression) {

    var stack = [];

    postfixExpression.forEach(function (token) {
        if (helper.isNumber(token)) {
            stack.push(token);
        } else if (token in operators) {
            var b = +stack.pop();
            var a = +stack.pop();
            var value = operators[token](a, b);
            stack.push(value);
        }
    });

    if (stack.length > 1)
        throw new Error('Invalid postfix expression : ' + postfixExpression.join(' '));

    return stack[0];

};