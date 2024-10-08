import { Link } from "react-router-dom";
import Header from "../Header";
import { UserContext } from "../UserContext";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/places").then((result) => {
      setPlaces(result.data);
    });
  }, []);
  return (
    <div className="grid grid-cols-2 md: grid-cols-3 lg:grid-cols-4 mt-8 gap-x-6 gap-y-8">
      {places.length > 0 &&
        places.map((place) => {
          return (
            <Link to={"/place/" + place._id}>
              <div className="bg-gray-500 rounded-2xl flex">
                {place.addedPhotos.length > 0 && (
                  <img
                    className="rounded-2xl aspect-square object-cover"
                    src={
                      "http://localhost:4000/uploads/" + place.addedPhotos[0]
                    }
                    alt="main"
                  />
                )}
              </div>
              <div className="mt-2">
                <h2 className="font-bold">{place.address} </h2>
                <h3 className="text-sm  text-gray-500">{place.title}</h3>
                <div className="mt-1">
                  <span className="font-bold">{place.price} SAR</span> per night
                </div>
              </div>
            </Link>
          );
        })}
    </div>
  );
}
