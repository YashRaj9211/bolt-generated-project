import React, { useState } from 'react';
    import axios from 'axios';

    const Register = () => {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('/register', { username, password });
          console.log(response.data);
          // Handle registration success
        } catch (err) {
          console.error(err);
          // Handle registration failure
        }
      };

      return (
        <div>
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <br />
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <br />
            <button type="submit">Register</button>
          </form>
        </div>
      );
    };

    export default Register;
