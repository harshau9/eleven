const express = require("express")
const {connection} = require("./configs/db");
const {userRouter} = require("./routes/User.route");
const cors=require("cors");
require("dotenv").config();
const app = express();

app.use(cors({
  origin:"*"
}))
app.use(express.json());
app.get("/", (req, res) => {
  res.send("HomePage");
});
app.use("/user", userRouter);

app.listen(8080, async()=>{
  try {
    await connection
    console.log("Connected to DB")
  } catch (err) {
    console.log("Error connecting to DB")
    console.log(err)
  }
  console.log("server is running on port 8080");
})


/*



{
  "msg": "Login successfull",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzczMTExOTl9.FxFyNIi-0TnZ6Hki23Qc62wf8I5W9rzj8JzP6f_VUBE"
}

//edit
{
  "image":"https://www.lingpad.com/wp-content/uploads/2023/02/dummy-user.jpg",
  "name":"jon",
  "bio":"focusing",
  "phone":1231231230,
  "email":"jon@gmail.com",
  "password":"jon"
}

*/