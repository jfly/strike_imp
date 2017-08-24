'use strict';

const fs = require('fs');
const adb = require('./adb');
const path = require('path');
const mkdirp = require('mkdirp');
const { exec } = require('child_process');

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

                    images = images.filter(image => image.match(/\.jpg$/));
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
    let filenameNoExt = `${SCREENSHOTS_PATH}/${serial}/${date.toISOString()}`;
    let pngFilename = filenameNoExt + ".png";
    let jpgFilename = filenameNoExt + ".jpg";

    mkdirp(path.dirname(pngFilename), function(err) {
        if(err) {
            return callback(err);
        }
        adb.takeScreenshot(serial, pngFilename, function(err) {
            if(err) {
                return callback(err);
            }

            exec(`convert ${pngFilename} -resize 50% ${jpgFilename}`, function(err) {
                if(err) {
                    return callback(err);
                }

                let screenshot = {
                    date,
                    path: jpgFilename,
                };
                lastScreenshotBySerial[serial] = screenshot;
                callback(null, screenshot);
            });
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
