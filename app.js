const express = require('express');
const path = require('path');
const logger = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const filmsServiceUrl = process.env.FILMS_SERVICE_URL || 'http://localhost:3001';

app.use(logger('dev'));

app.use('/api/v1', createProxyMiddleware({
  target: filmsServiceUrl,
  changeOrigin: true,
}));

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
