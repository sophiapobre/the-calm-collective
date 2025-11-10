const bcrypt = require('bcrypt');

const password = process.argv[2];

if (!password) {
  console.log('Usage: node generateHash.js <password>');
  process.exit(1);
}

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error:', err);
    process.exit(1);
  } else {
    console.log('\nHashed password:');
    console.log(hash);
    console.log('\nCopy the hash above and use it in MongoDB shell:');
    console.log(`db.users.updateOne({email: "user@example.com"}, {$set: {password: "${hash}"}})`);
    process.exit(0);
  }
});