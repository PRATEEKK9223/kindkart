require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const morgan = require('morgan');
const flash = require('connect-flash');
const ejsMate = require('ejs-mate'); 

const indexRoutes = require('./routes/index');
const itemRoutes = require('./routes/items');
const ngoRoutes = require('./routes/ngos');
const donationRoutes = require('./routes/donations');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('error', console.error);
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// View engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// static
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'changeme',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// make flash & session available in templates
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.session = req.session;
  next();
});

// Routes
app.use('/', indexRoutes);
app.use('/items', itemRoutes);
app.use('/ngos', ngoRoutes);
app.use('/donations', donationRoutes);
app.use('/admin', adminRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('errors/404', { url: req.originalUrl });
});

// Start
app.listen(PORT, () => {
  console.log(`KindKart running on http://localhost:${PORT}`);
});
