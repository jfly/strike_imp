const API_BASE_URL = ''; //<<< http://localhost:8000

export function fetchDevices() {
  return fetch(`${API_BASE_URL}/devices`).then(response => response.json());
};

export function fetchDeviceInfo(serial) {
  return fetch(`${API_BASE_URL}/devices/${serial}`).then(response => response.json());
};

export function takeScreenshot(serial) {
  return fetch(`${API_BASE_URL}/devices/${serial}/screenshot`, {
    method: "POST",
  }).then(response => response.json());
}

export function keyevent(serial, keycode) {
  return fetch(`${API_BASE_URL}/devices/${serial}/keyevent?keycode=${keycode}`, {
    method: "POST",
  }).then(response => response.json());
}

export function tap(serial, x, y) {
  return fetch(`${API_BASE_URL}/devices/${serial}/tap?x=${x}&y=${y}`, {
    method: "POST",
  }).then(response => response.json());
}

export function swipe(serial, x1, y1, x2, y2, durationMs) {
  return fetch(`${API_BASE_URL}/devices/${serial}/swipe?x1=${x1}&y1=${y1}&x2=${x2}&y2=${y2}&durationMs=${durationMs}`, {
    method: "POST",
  }).then(response => response.json());
}
