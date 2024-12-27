const express = require('express');
    const mongoose = require('mongoose');
    const jwt = require('jsonwebtoken');
    const cookieParser = require('cookie-parser');
    const cors = require('cors');

    const app = express();
    app.use(cors());
    app.use(cookieParser());

    // Connect to MongoDB
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => console.log('Connected to MongoDB')).catch(err => console.error(err));

    // Define User schema
    const userSchema = new mongoose.Schema({
      username: { type: String, required: true },
      password: { type: String, required: true }
    });

    const User = mongoose.model('User', userSchema);

    // Middleware to check if the token is valid and not expired
    const verifyToken = (req, res, next) => {
      const authHeader = req.headers['authorization'];
      if (!authHeader) return res.status(401).json({ message: 'No token provided' });

      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = decoded;
        next();
      });
    };

    // Middleware to check for CSRF tokens
    const csrfProtection = (req, res, next) => {
      const csrfToken = req.headers['x-csrf-token'];
      if (!csrfToken || csrfToken !== process.env.CSRF_TOKEN) return res.status(403).json({ message: 'Invalid CSRF token' });
      next();
    };

    // Register user
    app.post('/register', async (req, res) => {
      const { username, password } = req.body;
      try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    // Login user
    app.post('/login', async (req, res) => {
      const { username, password } = req.body;
      try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        res.cookie('jwt', token, { httpOnly: true, secure: false, sameSite: 'strict' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, sameSite: 'strict' });

        res.json({ message: 'Login successful', token, refreshToken });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    // Refresh token
    app.post('/refresh-token', async (req, res) => {
      const { refreshToken } = req.body;
      try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) return res.status(401).json({ message: 'Invalid refresh token' });

        const newToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Refresh token successful', token: newToken });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    // Protected route
    app.get('/protected', verifyToken, (req, res) => {
      res.json({ message: 'Protected route accessed successfully' });
    });

    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
