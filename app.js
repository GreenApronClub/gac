// Core dependencies
const express = require('express');
const loadEnv = require('dotenv');
// Additional dependencies
const app = express();
const port = process.env.PORT || 8080;
const passport = require('passport');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
// Routes
const loginRoutes = require('./api/routes/login');
const signupRoutes = require('./api/routes/signup');
const strainRoutes = require('./api/routes/strains');
const userRoutes = require('./api/routes/user');
const cartRoutes = require('./api/routes/cart');
const manageRoutes = require('./api/routes/manage');

if (process.env.NODE_ENV !== 'production') {
  loadEnv.load();
}

// Handle errors
const ErrorController = require('./controllers/error');

// Mongoose config
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_HOST) // Uses specified url to connect to mongodb
  .then(() => console.log('MongoDb Connection Established: ', process.env.DB_HOST))
  .catch(err => console.log(err));

// Template config
app.set('view engine', 'ejs');

app.use(express.static('public')); // Css/js resources
app.use(express.static('uploads'));
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Enables cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  // res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});
// Passport config
console.log('INITIALIZING PASSPORT...');
app.use(passport.initialize());
// Routes
app.get('/', (req, res) => {
  res.render('home');
});
app.get('/signup', (req, res) => {
  res.render('signup');
});
app.get('/login', (req, res) => {
  res.render('login');
});
app.use('/login', loginRoutes);
app.use('/signup', signupRoutes);
app.use('/manage/strains', manageRoutes);
app.use('/shop/strains', strainRoutes);
app.use('/cart', cartRoutes);
app.use('/user', userRoutes);
app.use((req, res, next) => {
  const error = new Error('Page not really found');
  error.status = 404;
  next(error);
});
// Exception handler
app.use(ErrorController.manage_exceptions);
//  Listens to port 3000 on http://localhost:3000
app.listen(port, () => {
  console.log('Server Started: http://localhost: ', port);
});
