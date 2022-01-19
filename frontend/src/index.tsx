import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';

const startApp = () => {
    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('root')
    );
}

if (window.cordova) {
  document.addEventListener('deviceready', startApp, false);
} else {
    startApp();
}
