import React, { useState } from 'react';
    import axios from 'axios';

    const Login = () => {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('/login', { username, password });
          console.log(response.data);
          // Handle login success
        } catch (err) {
          console.error(err);
          // Handle login failure
        }
      };

      return (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <br />
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <br />
            <button type="submit">Login</button>
          </form>
        </div>
      );
    };

    export default Login;
