import bluebird from 'bluebird';
import bodyParser from 'body-parser';
import compression from 'compression'; // compresses requests
import mongo from 'connect-mongo';
import express from 'express';
import flash from 'express-flash';
import session from 'express-session';
import lusca from 'lusca';
import mongoose from 'mongoose';
import passport from 'passport';
import path from 'path';
// API keys and Passport configuration
import * as passportConfig from './config/passport';
import * as airtableFormController from './controllers/airtableForm';
import * as apiController from './controllers/api';
import * as contactController from './controllers/contact';
import * as homeController from './controllers/home';
// Controllers (route handlers)
import * as userController from './controllers/user';
import { MONGODB_URI, SESSION_SECRET } from './util/secrets';

const MongoStore = mongo( session );

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

mongoose.connect( mongoUrl, { useNewUrlParser : true, useCreateIndex : true, useUnifiedTopology : true } )
        .then(
          () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ }
        ).catch( err => {
  console.log( 'MongoDB connection error. Please make sure MongoDB is running. ' + err );
  // process.exit();
} );

// Express configuration
app.set( 'port', process.env.PORT || 3000 );
app.set( 'views', path.join( __dirname, '../views' ) );
app.set( 'view engine', 'pug' );
app.use( compression() );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended : true } ) );
app.use( session( {
  resave            : true,
  saveUninitialized : true,
  secret            : SESSION_SECRET,
  store             : new MongoStore( {
    url           : mongoUrl,
    autoReconnect : true
  } )
} ) );
app.use( passport.initialize() );
app.use( passport.session() );
app.use( flash() );
app.use( lusca.xframe( 'SAMEORIGIN' ) );
app.use( lusca.xssProtection( true ) );

// here the user is accessible in the vue
app.use( ( req, res, next ) => {
  res.locals.user = req.user;
  console.log( req.user );
  next();
} );

app.use( ( req, res, next ) => {
  // After successful login, redirect back to the intended page
  if ( !req.user &&
    req.path !== '/login' &&
    req.path !== '/signup' &&
    !req.path.match( /^\/auth/ ) &&
    !req.path.match( /\./ ) ) {
    req.session.returnTo = req.path;
  } else if ( req.user &&
    req.path == '/account' ) {
    req.session.returnTo = req.path;
  }
  next();
} );

app.use(
  express.static( path.join( __dirname, 'public' ), { maxAge : 31557600000 } )
);

/**
 * Primary app routes.
 */
app.get( '/', homeController.index );

app.get( '/login', userController.getLogin );
app.get( '/loginStart', userController.getLoginStart );
app.post( '/login', userController.postLogin );

app.get( '/logout', userController.logout );

app.get( '/forgot', userController.getForgot );
app.post( '/forgot', userController.postForgot );
app.get( '/reset/:token', userController.getReset );
app.post( '/reset/:token', userController.postReset );

app.get( '/signup', userController.getSignup );
app.post( '/signup', userController.postSignup );

app.get( '/contact', contactController.getContact );
app.post( '/contact', contactController.postContact );
app.get( '/account', passportConfig.isAuthenticated, userController.getAccount );
app.post( '/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile );
app.post( '/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword );
app.post( '/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount );
app.get( '/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink );

/**
 * API examples routes.
 */
app.get( '/api', apiController.getApi );
app.get( '/api/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook );

/**
 * OAuth authentication routes. (Sign in)
 */
app.get( '/auth/facebook', passport.authenticate( 'facebook', { scope : [ 'email', 'public_profile' ] } ) );
app.get( '/auth/facebook/callback', passport.authenticate( 'facebook', { failureRedirect : '/login' } ),
  ( req, res ) => {
    res.redirect( req.session.returnTo || '/' );
  } );

// airtable form
//app.get("/founderForm", airtableFormController.founderForm);
//app.get("/startupForm", airtableFormController.startupForm);
//app.get("/formDirection", airtableFormController.formDirection);
//app.get("/formValidateStartup", airtableFormController.formValidateStartup);

app.get( '/42', passport.authenticate( '42OAuth' ) );
app.get( '/42auth',
  passport.authenticate( '42OAuth', {
    successRedirect : '/authOK',
    failureRedirect : '/bite',
    failWithError   : true
  } ) );

app.get( 'authOK', ( res, req ) => req.send( 'toto' ) );
app.get( '/42auth', userController.auth );

// founder
app.get( '/searchFounder', airtableFormController.searchFounder );

export default app;
