const bcrypt = require('bcrypt');

/* -------------------------------------------------------------------------- */
/*                                Hash and Salt                               */
/* -------------------------------------------------------------------------- */

async function hashAndSalt(password, saltRounds = 10) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return { salt, hash };
}

async function compareHash(password, hash) {
  const checkHash = await bcrypt.compare(password, hash);
  return checkHash;
}

module.exports = {
  hashAndSalt,
  compareHash,
};
