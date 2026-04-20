const bcrypt = require('bcryptjs');

const hash = "$2b$10$fQtnoszhT1RRlA5AwgeQlu5axICb9QFFuRON6dLNiwg4TUUHaY6eS";

bcrypt.compare('admin123', hash).then(match => {
  console.log('Password "admin123" matches:', match);
  process.exit(match ? 0 : 1);
});
