import axios from "axios";
import React, { useEffect } from "react";
export const UserContext = React.createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    // if user info is empty get it from the /profile endpoint
    if (!user) {
      axios
        .get("/profile", { withCredentials: true })
        .then((userData) => {
          setUser(userData.data);
          setReady(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  return (
    // useContext will return the value of this provider which is in this case is an object
    // the value of value is going to be shared
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}
