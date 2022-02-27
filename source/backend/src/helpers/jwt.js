const jwt = require('express-jwt');
const secret = process.env.SECRET_KEY;
const api = process.env.API_URL;

module.exports = jwt({
  secret,
  algorithms: ['HS256'],
  isRevoked: isRevoked,
}).unless({
  path: [
    { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
    { url: /\/api\/products(.*)/, methods: ['GET', 'OPTIONS'] },
    { url: /\/api\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
    `${api}/users/login`,
    `${api}/users/register`,
  ],
});

async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  }

  done();
}
