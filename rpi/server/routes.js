'use strict';

const Joi = require('joi');
const adb = require('./adb');
const Boom = require('boom');
const path = require('path');
const screenshot = require('./screenshot');

module.exports = function(server) {
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'public',
            },
        },
    });

    server.route({
        method: 'GET',
        path: '/devices',
        handler: function(request, reply) {
            adb.getDevices(function(err, devices) {
                if(err) {
                    return reply(Boom.boomify(err, { statusCode: 503 }));
                }

                reply(devices);
            });
        }
    });

    function addDeviceAction(actionName, method, handler) {
        server.route({
            method,
            path: '/devices/{serial}' + (actionName ? `/${actionName}` : ''),
            config: {
                validate: {
                    params: {
                        serial: Joi.string().alphanum(),
                    },
                },
            },
            handler,
        });
    }

    function urlifyScreenshot(screenshot, request) {
        let pathToScreenshot = path.relative('./public', screenshot.path);
        let url = `${request.connection.info.protocol}://${request.info.host}/${pathToScreenshot}`;
        return {
            date: screenshot.date,
            url,
        };
    }

    addDeviceAction(null, "GET", function(request, reply) {
        adb.getDeviceResolution(request.params.serial, function(err, resolution) {
            if(err) {
                return reply(Boom.boomify(err, { statusCode: 503 }));
            }

            reply({
                serial: request.params.serial,
                screenshot: urlifyScreenshot(screenshot.getLastScreenshot(request.params.serial), request),
                resolution,
            });
        });
    });

    addDeviceAction("screenshot", "POST", function(request, reply) {
        const url = `${request.connection.info.protocol}://${request.info.host}`;
        screenshot.takeScreenshot(request.params.serial, function(err, screenshot) {
            if(err) {
                return reply(Boom.boomify(err, { statusCode: 503 }));
            }

            reply({
                serial: request.params.serial,
                screenshot: urlifyScreenshot(screenshot, request),
            });
        });
    });

    addDeviceAction("unlock", "POST", function(request, reply) {
        // TODO <<< adb shell input keyevent KEYCODE_POWER && adb shell input touchscreen swipe 350 1000 350 400 50 && adb shell input text 8137 && adb shell input keyevent KEYCODE_ENTER && adb shell input keyevent KEYCODE_HOME >>>
        // TODO <<< can check if phone is already locked via: adb shell dumpsys power | grep mHolding
        return reply({
            serial: request.params.serial,
            status: "unlocked",
        });
    });
};