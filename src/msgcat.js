import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './Layout';
import Client from './Client';

let client = new Client(window.msgcatConfig);
ReactDOM.render(<Layout client={client} />, document.querySelector('#wrapper'));

