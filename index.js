/**
 * Created by Sergei on 23.03.15.
 */

var Gitter = require('node-gitter');
var debug = require('debug')('index');
var CalcParser = require('./lib/parser');

var args = parseArgs();
var gitter = new Gitter(args.token);
var roomId = args.room;
var currentRoom;
var parser;


gitter.rooms
    .join(roomId)
    .then(function (room) {
        currentRoom = room;
        var events = room.listen();
        parser = new CalcParser('calc');
        events.on('message', function (message) {
            debug('message %s', message.text);
            var res = parseAttempt(message.text);
            room.send(res);
        });
    });

function parseAttempt(message) {
    var res;
    try {
        res = parser.onMessage(message);
        debug('response %s', res);
    } catch (e) {
        console.error(e);
        res = e.message;
    }
    return res;
}


function shutdown() {
    console.log('Exit from room...');
    if (currentRoom) {
        gitter
            .currentUser()
            .then(function (currentUser) {
                currentRoom
                    .removeUser(currentUser.id)
                    .then(function () {
                        process.exit();
                    });
            });
    } else {
        process.exit();
    }
}

function parseArgs() {
    var args;
    args = process.argv.slice(2);
    if (!process.env.TOKEN) {
        throw new Error('run this app with token : TOKEN={GITTER_TOKEN} node index.js {ROOM_NAME}');
    }
    if (args.length !== 1) {
        throw new Error('run this app with token : TOKEN={GITTER_TOKEN} node index.js {ROOM_NAME}');
    }
    return {
        token: process.env.TOKEN,
        room: args[0]
    };
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);