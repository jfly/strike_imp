'use strict';

const fs = require('fs');
const adb = require('./adb');
const path = require('path');
const mkdirp = require('mkdirp');

const SCREENSHOTS_PATH = './public/screenshots';
let lastScreenshotBySerial = {};

// fetch the last screenshots once on startup, afterwards, we just remember them =)
fs.readdir(SCREENSHOTS_PATH, function(err, items) {
    if(err) {
        throw err;
    }

    items.forEach(deviceSerial => {
        let deviceScreenshotsPath = path.join(SCREENSHOTS_PATH, deviceSerial);
        fs.stat(deviceScreenshotsPath, function(err, stats) {
            if(err) {
                throw err;
            }

            if(stats.isDirectory()) {
                fs.readdir(deviceScreenshotsPath, function(err, images) {
                    if(err) {
                        throw err;
                    }

                    if(images.length == 0) {
                        return;
                    }

                    images.sort();
                    let latestImage = images[images.length - 1];
                    let date = new Date(path.parse(latestImage).name);
                    if(isNaN(date.getTime())) {
                        throw new Error(`${latestImage} is not a valid date format`);
                    }
                    lastScreenshotBySerial[deviceSerial] = {
                        date,
                        path: path.join(deviceScreenshotsPath, latestImage),
                    };
                });
            }
        });
    });
});

function takeScreenshot(serial, callback) {
    let date = new Date();
    let filename = `${SCREENSHOTS_PATH}/${serial}/${date.toISOString()}.png`;

    mkdirp(path.dirname(filename), function(err) {
        if(err) {
            return callback(err);
        }
        adb.takeScreenshot(serial, filename, function(err, data) {
            if(err) {
                return callback(err);
            }

            let screenshot = {
                date,
                path: filename,
            };
            lastScreenshotBySerial[serial] = screenshot;
            callback(null, screenshot);
        });
    });
}

function getLastScreenshot(serial) {
    return lastScreenshotBySerial[serial];
}

module.exports = {
    takeScreenshot,
    getLastScreenshot,
};
