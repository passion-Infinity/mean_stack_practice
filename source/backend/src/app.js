const path = require('path');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
require('dotenv/config');
const dbconnect = require('./config/dbconnection');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

const PORT = process.env.PORT || 3000;
const API = process.env.API_URL;

const app = express();

// CORS
app.use(cors());
app.options('*', cors());

// MIDDLEWARE
app.use(logger('tiny'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  '/public/uploads',
  express.static(path.join(__dirname, 'public/uploads')),
);

// AUTHENTICATION JWT
app.use(authJwt);

// CONNECT DATABASE
dbconnect();

// IMPORT ROUTES
const categoriesRouter = require('./routes/categories.route');
const productsRouter = require('./routes/products.route');
const usersRouter = require('./routes/users.route');
const ordersRouter = require('./routes/orders.route');

// USE ROUTES
app.use(`${API}/products`, productsRouter);
app.use(`${API}/categories`, categoriesRouter);
app.use(`${API}/users`, usersRouter);
app.use(`${API}/orders`, ordersRouter);

// ERROR HANDLER
app.use(errorHandler);

// SERVER LISTENING
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
