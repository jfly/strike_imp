# strike_imp
e-imp based strike plate controller

Squirrel code by Kasia Hayden for using an electric imp to conrol an electric strike plate.

## What is this flask directory?

[Flask](http://flask.pocoo.org/) is a python microframework. It provides an API to run augustctl.
Note: We're using Python2, not Python3!

### Dependencies

- [Flask](http://flask.pocoo.org/) - `sudo pip2 install flask`

## Getting the august secret from a rooted android phone

We're using [sretlawd/augustctl](https://github.com/sretlawd/augustctl) to control the august lock.
Some configuration is required before you can use `augustctl`, and their readme
is somewhat out of date. Here are updated instructions for a rooted phone (see
[here](https://community.smartthings.com/t/raspberry-pi-augustlock-st/40079/82) and
[here](https://git.ethitter.com/open-source/augustctl)).

```
> adb shell su - bash -c 'cat /data/data/com.august.luna/shared_prefs/PeripheralInfoCache.xml' | python3 -c 'import html, sys; print(html.unescape(sys.stdin.read()))
<?xml version='1.0' encoding='utf-8' standalone='yes' ?>
<map>
    <string name="...">{"handshakeKeyIndex":1,"bluetoothAddress":"...","peripheralType":"Lock","handshakeKey":"...","lockId":"..."}</string>
</map>
```

To create a `config.json` for augustctl, `handshakeKey` becomes `offlineKey`,
and `handshakeKeyIndex` becomes `offlineKeyOffset`. We discovered `lockUuid`
through printf debugging of augustctl itself.
