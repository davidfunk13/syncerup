import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

//Views
import Join from './views/Join/Join.View';
import Chat from './views/Chat/Chat.View';
import Link from './views/Link/Link.View';

import './App.css';
import './utils.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path={'/'} component={Join} />
        <Route exact path={'/chat'} component={Chat} />
        <Route exact path={'/link'} component={Link} />
      </Router>
    </div>
  );
}

export default App;
