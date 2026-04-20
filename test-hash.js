const bcrypt = require('bcryptjs');

const hash = "$2b$10$JtwZ8qpYXLcx9zxDrmJdbufrB6pJ0tFlftIJiOW4wYjhtfO1K1Cz6";

bcrypt.compare('admin123', hash).then(match => {
  console.log('Password "admin123" matches:', match);
  process.exit(match ? 0 : 1);
});
