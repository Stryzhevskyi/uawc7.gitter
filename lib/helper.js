/**
 * Created by Sergei on 23.03.15.
 */

module.exports = {
    operators: {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2
    },

    isNumber: function (str) {
        return (str - parseFloat(str) + 1) >= 0;
    },
    isOperator: function (str) {
        return str in this.operators;
    },
    operatorPriority: function (op) {
        if (!op in this.operators)
            throw new Error('Unknown operator ' + op);
        return this.operators[op];
    }
};