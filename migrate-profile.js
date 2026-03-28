const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'jwt-auth-backend/db.json');

console.log('🛠️  Profile migration script - ONE TIME USE ONLY');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let updated = 0;
db.users.forEach(user => {
  if (!user.fullName && (user.name || user.username)) {
    user.fullName = user.name || user.username;
    updated++;
  }
  if (!user.createdAt) {
    user.createdAt = new Date(parseInt(user.id)).toISOString();
    updated++;
  }
  if (!user.phone && user.phone !== '') {
    user.phone = '';
  }
  if (!user.address && user.address !== '') {
    user.address = '';
  }
  if (!user.avatar) {
    user.avatar = '';
  }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`✅ Migration complete: Updated ${updated} user fields`);
console.log('💡 Now restart backend server and test registration/profile flow');
