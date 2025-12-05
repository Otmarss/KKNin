const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const fs = require('fs');
const path = require('path');
const os = require('os');
const app = express();

// Global error handlers to capture crashes during startup/runtime
process.on('uncaughtException', (err) => {
  try {
    const p = path.join(os.tmpdir(), 'kknin-debug.log');
    fs.appendFileSync(p, `${new Date().toISOString()} - UNCAUGHT_EXCEPTION ${err.stack}\n`);
  } catch (e) {}
  console.error('UNCAUGHT EXCEPTION', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  try {
    const p = path.join(os.tmpdir(), 'kknin-debug.log');
    fs.appendFileSync(p, `${new Date().toISOString()} - UNHANDLED_REJECTION ${reason}\n`);
  } catch (e) {}
  console.error('UNHANDLED REJECTION', reason);
});

// Middleware
app.use(cors());
app.use(express.json());

// Temporary request logger for debugging 'Failed to fetch'
app.use((req, res, next) => {
  try {
    const log = `${new Date().toISOString()} - REQ ${req.method} ${req.url} body=${JSON.stringify(req.body)}\n`;
    const p = path.join(os.tmpdir(), 'kknin-debug.log');
    try { fs.appendFileSync(p, log); } catch (e) {}
    try { fs.appendFileSync('C:\kknin-debug.log', log); } catch(e) {}
    console.log(log.trim());
  } catch (e) {
    console.error('Request logger error', e);
  }
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/data', require('./routes/groups'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'KKNin Backend is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  try {
    const p = path.join(os.tmpdir(), 'kknin-debug.log');
    fs.appendFileSync(p, `${new Date().toISOString()} - SERVER_ERROR ${err.stack}\n`);
  } catch (e) {}
  console.error('Server error', err);
});
