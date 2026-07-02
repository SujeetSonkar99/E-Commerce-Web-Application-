const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

const initData = async () => {
  try {
    // Create default users if they don't exist
    const users = [
      { userName: 'user1', email: 'user1@example.com', password: 'password1', roles: ['ROLE_USER'] },
      { userName: 'seller1', email: 'seller1@example.com', password: 'password2', roles: ['ROLE_SELLER'] },
      { userName: 'admin', email: 'admin@example.com', password: 'adminPass', roles: ['ROLE_USER', 'ROLE_SELLER', 'ROLE_ADMIN'] },
    ];

    for (const u of users) {
      const exists = await User.findOne({ userName: u.userName });
      if (!exists) {
        const hashed = await bcrypt.hash(u.password, 10);
        await User.create({ ...u, password: hashed });
        console.log(`Created default user: ${u.userName}`);
      }
    }
  } catch (err) {
    console.error('Error seeding initial data:', err.message);
  }
};

module.exports = { initData };
