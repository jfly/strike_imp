#!/usr/bin/env bash

# Copied from https://gist.github.com/jfly/7b94cba17c04d344d62a7bea916bb55a
function start_screen {
    NAME=$1
    shift
    screen -dmS "$NAME" -s bash # start screen

    while test $# -gt 0
    do
        TITLE="$1"
        shift
        CMD="$1"$'\n'
        shift
        screen -S "$NAME" -X title "$TITLE" # set title of window
        screen -S "$NAME" -X stuff "$CMD" # run command in window
        screen -S "$NAME" -X screen # add new window
    done
}

start_screen rausch localtunnel "lt --port 8000 --subdomain jflytest" server "(cd /home/pi/strike_imp/rpi; (cd web-interface && npm install && npm run build); (cd server && npm install && node server.js))"
