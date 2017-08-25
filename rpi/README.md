# Code to run on the raspberry pi

The basic idea is to plug a an android phone into a raspberry pi, and have the
RPI drive the August android app via ADB.

In here, there is a Nodejs server meant to be run on a raspberry pi to provide an
api for controlling the connected android phone.

Instructions for setting up the raspberry pi are documented in
[this Google Doc](https://docs.google.com/document/d/1wT1HwUQTFC6LCbeyVrfwZFvgv9Np-SCh2G-A4r2T9yA/edit#heading=h.26mcst2v5me3).

## Directory Structure

- `server/` contains a nodejs api server that basically is a thin wrapper around ADB.
- `web-interface/` is a React application that is meant to talk to the above api server.

It is a bit strange that we have 2 separate node projects here, it might make
sense to combine them sometime. [next.js](https://github.com/zeit/next.js)
might be a good candidate for this.

## Development

- `cd server/ && npm start` - Run api server, accessible at http://localhost:8000.
- `cd web-interface && npm start` - Run create-react-app server. TODO - you need to edit `API_BASE_URL` in `web-interface/src/api.js`.

## Deploying

- ssh to the server, `screen -r`, `git pull` somewhere, and restart the command in window 2.
