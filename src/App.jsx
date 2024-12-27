import React from 'react';
    import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
    import Login from './Login';
    import Register from './Register';
    import ProtectedRoute from './ProtectedRoute';

    const App = () => {
      return (
        <Router>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <ProtectedRoute path="/protected" component={ProtectedRoute} />
          </Switch>
        </Router>
      );
    };

    export default App;
