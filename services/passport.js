const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const knex = require('../knexDB');
const config = require('../config');

const localOptions = { usernameField: 'email'};

const localLogin = new LocalStrategy(localOptions, function(email, password, done){
    knex('usuario').where('email', email).select('email')
    .then(resultado => {
        if(resultado.length === 0){
            console.log("No existe el email");
            return done(null, false);
        }
        console.log(resultado);
        return done(null, resultado);
    });
});

// setup options for jwtLogin strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
}

// middleware for authenticated request over api endpoints
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
    console.log(jwtOptions);
    console.log('Payload', payload);
    knex('usuario').where('email', payload.sub).select('email')
    .then(resultado => {
        if(resultado.length !== 0){
            done(null, resultado);
        }else{
            done(null, false)
        }
    })
    .catch(err => {
        done(null, false);
    });
});

passport.use(localLogin);
passport.use(jwtLogin);