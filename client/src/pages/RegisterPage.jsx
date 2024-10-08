import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  //   const [regiserObject, setRegisterObject] = React.useState({
  //     username: "",
  //     email: "",
  //     password: "",
  //   });
  function registerUser(event) {
    // used to send the request to our api
    // we are going to use axios to make a post request
    event.preventDefault();
    axios
      .post("/register", {
        username,
        email,
        password,
      })
      .then(() => {
        alert("Registeration is successfull");
      })
      .catch((e) => {
        alert("Registeration failed please try again");
      });
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-32">
        <h1 className="text-4xl text-center my-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input
            type="text"
            placeholder="Enter your Username"
            required
            value={username}
            onChange={(event) => {
              // Recommended to be done like this
              const userNameValue = event.target.value;
              setUsername(userNameValue);
            }}
          />

          <input
            type="email"
            placeholder="Enter your Email"
            required
            value={email}
            onChange={(event) => {
              const emailValue = event.target.value;
              setEmail(emailValue);
            }}
          />
          <input
            type="password"
            placeholder="Enter your Password"
            required
            value={password}
            onChange={(event) => {
              const passwordValue = event.target.value;
              setPassword(passwordValue);
            }}
          />

          <button className="primary" type="submit">
            Register
          </button>
          <div className="text-center text-gray-500">
            Already a member?{" "}
            <Link className="underline text-black" to={"/login"}>
              Login Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
