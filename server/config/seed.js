const User = require('../apis/user/userModel');
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10);
try {
  User.findOne({ email: "admin@gmail.com" }).then(userData => {
    try {
      if (userData == null) {
        let userData = {
          userId: 1,
          name: "Admin",
          email: "admin@gmail.com",
          password: bcrypt.hashSync("Admin1234#",salt),
          userType: 1
        };
        let user = new User(userData);
        user.save().then(res => {
          console.log("Admin created");
        }).catch(err => {
          console.log("Admin create err", err);
        });
      } else {
        console.log("Admin Already Exists");
      }
    } catch (err) {
      console.log("Error in processing user data:", err);
    }
  }).catch(err => {
    console.log("Error in finding user:", err);
  });
} catch (err) {
  console.log("Top-level error:", err);
}
