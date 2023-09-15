const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const dotenv = require('dotenv');
const DB = require("./config/DB");
const helmet = require('helmet');
const { verifyToken } = require("./middleware/verifyToken");
const roles = require('./config/AllowRoles');

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

app.use("/auth", require("./routers/Auth"));
app.use("/user" , verifyToken(roles.User),require("./routers/User"));


DB()
  .then((connect) => {
    server.listen(8080, () => {
      console.log(
        `server running on port 8080 and DB ${connect.connection.host}`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
