const net = require("./axios");

const Parkrun = require("./classes/parkrun");
const Tokens = require("./classes/tokens");

const auth = async (id, password) => {
  // ID checking here

  const params = new URLSearchParams();
  params.append("username", id);
  params.append("password", password);
  params.append("scope", "app");
  params.append("grant_type", "password");
  try {
    const res = await net.post("/user_auth.php", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    // Success, continue
    console.log(res.status);
    console.log(res.data);

    if (res.status == 200) {
      // Login successful, tokens recieved
      return new Parkrun(new Tokens(res.data, res.headers.date));
    }
  } catch (error) {
    if (error.response != undefined) {
      // A request was made and the server responsed with a non 2xx status code.
      if (error.response.status == 400) {
        throw new Error("invalid username or password!");
      }
    } else {
      throw new Error("unspecified error during auth flow");
    }
  }
};

module.exports = {
  auth
};
