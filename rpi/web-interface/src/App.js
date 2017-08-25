import React from 'react';
import * as api from 'api';
import moment from 'moment';
import {
  Link,
  Route,
  Redirect,
  withRouter,
  BrowserRouter as Router,
} from 'react-router-dom';

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

const About = () => (
  <div>
    <h2>About</h2>
    <div>TODO TODO TODO</div>
  </div>
);

class AsyncTaskButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'resting',
    };
  }

  cancelWait() {
    if(this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  waitAndReset() {
    const DISPLAY_TIMEOUT_MS = 200;
    this.timeoutId = setTimeout(() => {
      this.setState({ status: 'resting' });
    }, DISPLAY_TIMEOUT_MS);
  }

  render() {
    let { invokeTask } = this.props;
    return (
      <button className={"async-task-button " + this.state.status} onClick={() => {
        this.cancelWait();
        this.setState({ status: 'working' });

        invokeTask().then(() => {
          this.setState({ status: 'success' });
          this.waitAndReset();
        }).catch(err => {
          console.error(err);
          this.waitAndReset();
        });
      }}>{this.props.children}</button>
    );
  }
}

class DebugDevice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceInfo: null,
    }
  }

  componentWillMount() {
    let { serial } = this.props.match.params;
    api.fetchDeviceInfo(serial).then(deviceInfo => {
      this.setState({ deviceInfo });
    }).catch(error => console.error(error));
  }

  render() {
    let { serial } = this.props.match.params;
    let { deviceInfo } = this.state;

    const AndroidButton = ({ keycode, children }) => {
      return (
        <AsyncTaskButton invokeTask={() => {
          return api.keyevent(serial, keycode).catch(err => console.error(err));
        }}>{children}</AsyncTaskButton>
      );
    };

    if(!deviceInfo) {
      return (
        <div>
          <h3>Connecting to {serial}...</h3>
        </div>
      );
    } else {
      return (
        <div>
          <h3>Connecting to {serial}... connected!</h3>

          <AndroidButton keycode="KEYCODE_POWER">Power</AndroidButton>
          <AndroidButton keycode="KEYCODE_VOLUME_UP">+</AndroidButton>
          <AndroidButton keycode="KEYCODE_VOLUME_DOWN">-</AndroidButton>

          <br />
          <AsyncTaskButton invokeTask={() => {
            return api.swipe(serial, 600, 1500, 600, 500, 50).catch(err => console.error(err)); //<<< TODO compute for any device, this is just for nexus 5 >>>
          }}>Swipe ↑</AsyncTaskButton>

          {deviceInfo.screenshot && (
            <div>
              <div>
                Screenshot taken {moment(deviceInfo.screenshot.date).fromNow()}
                <AsyncTaskButton invokeTask={() => {
                  return api.takeScreenshot(serial).then(screenshot => {
                    this.setState({ deviceInfo: { ...deviceInfo, screenshot } });
                  }).catch(err => console.error(err));
                }}>Refresh</AsyncTaskButton>
              </div>
              <img
                src={deviceInfo.screenshot.url}
                alt={`Screenshot taken at ${deviceInfo.screenshot.date}`}
                style={{maxHeight: '500px'}}
                onClick={e => {
                  let img = e.target;
                  let x = e.pageX - img.offsetLeft;
                  let y = e.pageY - img.offsetTop;

                  let phoneX = (x/img.width) * deviceInfo.resolution.width;
                  let phoneY = (y/img.height) * deviceInfo.resolution.height;
                  api.tap(serial, phoneX, phoneY).catch(err => console.error(err));
                }}
              />
            </div>
          )}

          <AndroidButton keycode="KEYCODE_BACK">Back</AndroidButton>
          <AndroidButton keycode="KEYCODE_HOME">Home</AndroidButton>
          <AndroidButton keycode="KEYCODE_APP_SWITCH">List</AndroidButton>
        </div>
      );
    }
  }
}

class Debug extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
    };
  }

  componentWillMount() {
    api.fetchDevices().then(devices => {
      this.setState({ devices });
    }).catch(error => console.error(error));
  }

  render() {
    let { match } = this.props;
    return (
      <div>
        <h2>Select a device to connect to</h2>
        <ul>
          {this.state.devices.map(device => (
            <li key={device.serial}>
              <Link to={`${match.url}/${device.serial}`}>
                {device.description}
              </Link>
            </li>
          ))}
        </ul>

        <Route path={`${match.url}/:serial`} component={DebugDevice}/>
        <Route exact path={match.url} render={() => (
          <h3>Please select a device.</h3>
        )}/>
      </div>
    );
  }
}

const RemoveTrailingSlash = withRouter(props => {
  let pathname = props.location.pathname;
  if(pathname !== "/" && pathname.endsWith("/")) {
    return <Redirect to={pathname.substring(0, pathname.length - 1)}/>;
  }
  return null;
});

const App = () => (
  <Router>
    <div>
      <RemoveTrailingSlash/>

      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/debug">Debug</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>

      <hr/>

      <Route exact path="/" component={Home}/>
      <Route path="/debug" component={Debug}/>
      <Route path="/about" component={About}/>
    </div>
  </Router>
);

export default App;
