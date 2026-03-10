const axios = require("axios");

axios.post("http://localhost:5000/api/auth/login", {
    username: "vivek_admin",
    password: "vivek123"
})
.then(res => console.log(res.data))
.catch(err => console.log(err.response.data));