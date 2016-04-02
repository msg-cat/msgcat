import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './Layout';

import _ from 'strophe';
import __ from 'strophejs-plugins/roster/strophe.roster';

ReactDOM.render(<Layout {...msgcatConfig} />, document.querySelector('#wrapper'));

