const jwt = require('jsonwebtoken');

const generateJWT = ( user_id = '' ) => {
    return new Promise(( resolve, reject ) => {
        const payload = { user_id };

        jwt.sign( payload, process.env.SECRET_KEY, {
            expiresIn: '4h',
        }, ( err, token ) => {
            if ( err ) {
                console.log(err);
                reject('Could not generate token');
            } else {
                resolve( token );
            }
        } )
    });
}

module.exports = {
    generateJWT,
}