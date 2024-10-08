import { Link, Navigate } from "react-router-dom";
import React from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [redirect, setRedirect] = React.useState(false);
  // Returns the current context value
  const { setUser } = React.useContext(UserContext);
  function loginUser(event) {
    event.preventDefault();
    axios
      .post("/login", { email, password }, { withCredentials: true })
      .then((user) => {
        alert("Login successfull");
        setRedirect(true);
        setUser(user.data);
      })
      .catch((e) => {
        alert("Login failed");
      });
  }

  // if the the user is logged in navigate to home page
  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-32">
        <h1 className="text-4xl text-center my-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={loginUser}>
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
            Login
          </button>
          <div className="text-center text-gray-500">
            Don't have an account yet?{" "}
            <Link className="underline text-black" to={"/register"}>
              Register Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
