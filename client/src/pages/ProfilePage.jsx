import { Link, Navigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import React from "react";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";
export default function ProfilePage() {
  const { user, ready, setUser } = React.useContext(UserContext);
  const [redirect, setRedirect] = React.useState(null);
  // const [style, setStyle] = React.useState(
  //   "bg-primary text-white rounded-full"
  // );
  // get the subpage parameter from all parameters of the route
  let { subpage } = useParams();
  console.log(subpage);

  if (subpage === undefined) {
    subpage = "profile";
  }

  function logoutUser() {
    axios.post("/logout", {}, { withCredentials: true }).then((result) => {
      console.log(result);
      setUser(null);
      setRedirect("/");
    });
  }

  // Check if you logged out to send you to home page

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  if (!ready) {
    return "Loading...";
  } else if (ready && !user) {
    return <Navigate to={"/login"} />;
  } else {
    return (
      <div>
        <AccountNav />
        <div className="text-center max-w-lg mx-auto">
          <div className="py-3 px-4 border-b">
            <label>Username</label>
            <input type="text" value={user.username} disabled />
          </div>
          <div className="py-3 px-4 border-b">
            <label>Email</label>
            <input type="text" value={user.email} disabled />
          </div>
          <button className="primary max-w-sm mt-2" onClick={logoutUser}>
            Logout
          </button>
        </div>

        {/* deleted by me */}
        {/* {subpage === "places" && <PlacesPage />} */}
      </div>
    );
  }
}
