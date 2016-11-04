#!/usr/bin/env python2

from flask import Flask, send_from_directory
app = Flask(__name__, static_url_path='')

@app.route("/")
def root():
    return app.send_static_file('index.html')

@app.route("/august/unlock")
def august_unlock():
    return "yep, i'm definitely unlocking that door"

@app.route("/august/lock")
def august_lock():
    return "yep, i'm definitely locking that door"

if __name__ == "__main__":
    app.run()
