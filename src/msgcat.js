import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './Layout';

import Strophe from 'strophe';
import StropheRoster from 'strophejs-plugins/roster/strophe.roster';
import StropheRegister from 'strophejs-plugins/register/strophe.register';

ReactDOM.render(<Layout />, document.querySelector('#wrapper'));

