const API_BASE_URL = 'http://localhost:8000';

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
