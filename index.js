const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
require('./models/User');
require('./models/Story');
const path = require('path');
const authRoutes = require('./routes/auth');
const storyRoutes = require('./routes/stories');
const passport = require('passport');
//const cookieSession = require('cookie-session');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const keys = require('./config/keys');
const requireLogin = require('./middlewares/requireLogin');
const ensureGuest = require('./middlewares/ensureGuest');

const Story = mongoose.model('stories');


const app = express();

require('./config/passport')(passport);

const{truncate, stripTags, formatDate, select, editIcon} = require('./middlewares/hbs');


mongoose.connect('mongodb://jatin:jatin@ds227565.mlab.com:27565/storybook-dev')
.then(()=>console.log("Mongodb connected"))
.catch((error)=>console.log("Error: ", error));


app.engine('handlebars', exphbs({
    
    helpers:{truncate: truncate, stripTags: stripTags, formatDate:formatDate, select:select, editIcon:editIcon},
    
    defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


//Method override middleware
app.use(methodOverride('_method'));


// Express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


//Global variables

app.use((req, res, next)=>{
    
    res.locals.user = req.user;
    next();
});



// Set static Folder

app.use(express.static(path.join(__dirname, 'public')));



app.get('/', ensureGuest, (req, res)=>{
    
    res.render('index/welcome');
    
});


app.get('/dashboard', requireLogin, async (req, res)=>{
    
    const stories = await Story.find({user:req.user.id}).populate('user');
    
    res.render('index/dashboard', {stories});
    
});

app.get('/about', (req, res)=>{
    
    res.render('index/about');
    
});




// use routes

app.use('/auth', authRoutes);
app.use('/stories', storyRoutes);


app.listen(5000);