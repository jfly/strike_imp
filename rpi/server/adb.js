'use strict';

const { exec } = require('child_process');
const asycMemoize = require('./asyncMemoize');

function adb(command, callback) {
  exec(`adb ${command}`, function(err, stdout, stderr) {
    return callback(err, stdout);
  });
}

function throwIfInvalidSerial(serial) {
  if(!serial.match(/^[A-Za-z0-9]+$/)) {
    throw new Error(`serial: ${serial} must be alphanumeric`);
  }
}

function throwIfNotANumber(n) {
  if(typeof(n) !== "number") {
    throw new Error(`${n} is not a number`);
  }
}

module.exports = {
  getDevices(callback) {
    adb('devices -l', function(err, stdout) {
      if(err) {
        return callback(err);
      }

      let devices = stdout.trim().split("\n").slice(1).map(deviceDesc => {
        let [ _, serial, description ] = deviceDesc.match(/([^ ]+) +(.*)+/);
        return { serial, description };
      });
      callback(null, devices);
    });
  },

  getDeviceResolution: asycMemoize(function(serial, callback) {
    throwIfInvalidSerial(serial);

    adb(`-s ${serial} shell wm size`, function(err, stdout) {
      if(err) {
        return callback(err);
      }

      let [ width, height ] = stdout.trim().split(": ")[1].split("x").map(s => parseInt(s));
      callback(null, { width, height });
    });
  }),

  takeScreenshot(serial, filename, callback) {
    throwIfInvalidSerial(serial);
    if(!filename.match(/^[-:A-Za-z0-9./]+$/)) {
      throw new Error(`Invalid filename ${filename}`);
    }

    adb(`-s ${serial} shell screencap -p | sed 's/\r$//' > ${filename}`, function(err, stdout) {
      if(err) {
        return callback(err);
      }
      callback(null);
    });
  },

  keyevent(serial, keycode, callback) {
    throwIfInvalidSerial(serial);
    if(!keycode.match(/^[A-Za-z0-9_]+$/)) {
      throw new Error(`Invalid keycode ${keycode}`);
    }

    adb(`-s ${serial} shell input keyevent ${keycode}`, function(err, stdout) {
      if(err) {
        return callback(err);
      }
      callback(null);
    });
  },

  tap(serial, x, y, callback) {
    throwIfInvalidSerial(serial);
    throwIfNotANumber(x);
    throwIfNotANumber(y);

    adb(`-s ${serial} shell input tap ${x} ${y}`, function(err, stdout) {
      if(err) {
        return callback(err);
      }
      callback(null);
    });
  },

  swipe(serial, x1, y1, x2, y2, durationMs, callback) {
    throwIfInvalidSerial(serial);
    throwIfNotANumber(x1);
    throwIfNotANumber(y1);
    throwIfNotANumber(x2);
    throwIfNotANumber(y2);
    throwIfNotANumber(durationMs);

    adb(`-s ${serial} shell input touchscreen swipe ${x1} ${y1} ${x2} ${y2} ${durationMs}`, function(err, stdout) {
      if(err) {
        return callback(err);
      }
      callback(null);
    });
  },
};
