import { Link, Navigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Perks from "../Perks";

import PhotoUploader from "../PhotoUploader";
import axios from "axios";
import PlacesFormPage from "./PlacesFormPage";
import AccountNav from "../AccountNav";

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/user-places", { withCredentials: true }).then((result) => {
      // list of all places is returned
      setPlaces(result.data);
    });
  }, []);
  return (
    <div>
      <AccountNav />
      {/* Didn't press the (Add new place) link yet */}
      <div className="text-center">
        <div>List of my places</div>
        <Link
          className="inline-flex bg-primary px-4 py-2 text-white rounded-full gap-1"
          to={"/account/places/new"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add new place
        </Link>
        {/* if you have places display then */}
        <div className="mt-4">
          {places.length > 0 &&
            places.map((place) => {
              return (
                <Link
                  className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl m-4  "
                  to={"/account/places/" + place._id}
                >
                  {/* show the first photo if it has photos */}
                  <div className="flex w-32 h-32 bg-gray-300 shrink-0  rounded-xl ">
                    {" "}
                    {place.addedPhotos.length > 0 && (
                      <img
                        className="object-cover  rounded-xl"
                        src={
                          "http://localhost:4000/uploads/" +
                          place.addedPhotos[0]
                        }
                        alt="place main Image"
                      />
                    )}
                  </div>
                  <div className="grow ">
                    <h2 className="text-xl">{place.title}</h2>
                    <p className="text-sm mt-2">{place.description}</p>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
      {/* if he pressed new place link */}
    </div>
  );
}
