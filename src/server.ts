// src/server.ts
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
import { errorHandler } from './_middleware/errorHandler';
import { initialize } from './_helpers/db';
import { swaggerDocs } from './_helpers/swagger';
import accountsController from './accounts/accounts.controller';
import usersController from './users/users.controller';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: '*', credentials: true }));

// API Routes
app.use('/accounts', accountsController);
app.use('/users', usersController);

// Swagger docs
swaggerDocs(app);

// Global Error Handler (must be last)
app.use(errorHandler);

// Start server + initialize database
const PORT = process.env.PORT || 4000;

initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📄 Swagger docs at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to initialize database:', err);
    process.exit(1);
  });