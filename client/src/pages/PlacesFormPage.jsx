import React, { useEffect, useState } from "react";
import Perks from "../Perks";
import { Navigate, useParams } from "react-router-dom";
import PhotoUploader from "../PhotoUploader";
import axios from "axios";
import AccountNav from "../AccountNav";
export default function PlacesFormPage() {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [address, setAddress] = React.useState("");
  // addedPhotos is list of photo names
  const [addedPhotos, setAddedPhotos] = React.useState([]);

  const [perks, setPerks] = React.useState([]);
  const [extraInfo, setExtraInfo] = React.useState("");
  const [checkIn, setCheckIn] = React.useState("");
  const [checkOut, setCheckOut] = React.useState("");
  const [maxGuests, setMaxGuests] = React.useState(1);
  const [redirect, setRedirect] = React.useState(false);
  const [price, setPrice] = useState(100);
  const { id } = useParams();
  // if id changes useEffect will run
  useEffect(() => {
    if (!id) {
      return;
    }

    axios.get(`/places/${id}`, { withCredentials: true }).then((result) => {
      const placeObj = result.data;
      setTitle(placeObj.title);
      setDescription(placeObj.description);
      setAddress(placeObj.address);
      setCheckIn(placeObj.checkIn);
      setCheckOut(placeObj.checkOut);
      setExtraInfo(placeObj.extraInfo);
      setPerks(placeObj.perks);
      setMaxGuests(placeObj.maxGuests);
      setAddedPhotos(placeObj.addedPhotos);
      setPrice(placeObj.price);
    });
  }, [id]);
  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  function savePlace(event) {
    event.preventDefault();
    const data = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };
    if (id) {
      // update
      console.log("Updating...");
      axios
        .put("/places/" + id, data, { withCredentials: true })
        .then((result) => {
          setRedirect(true);
        });
    } else {
      // adding a new place

      axios.post("/places", data, { withCredentials: true }).then((result) => {
        setRedirect(true);
      });
    }
  }

  // The return of Navigate should be for the main function
  if (redirect) {
    console.log("Redirecting");
    return <Navigate to={"/account/places"} />;
  }
  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        {/* we could put preInput as a sepreate component */}
        {preInput(
          "Title",
          "Title for your place, it should be short and simple"
        )}
        <input
          value={title}
          onChange={(event) => {
            const fieldValue = event.target.value;
            setTitle(fieldValue);
          }}
          type="text"
          placeholder="title, for example my own best apartment"
        />

        {preInput("Address", "Address to this place")}

        <input
          type="text"
          placeholder="address"
          value={address}
          onChange={(event) => {
            const fieldValue = event.target.value;
            setAddress(fieldValue);
          }}
        />

        {preInput("Photos", "The more the better")}
        <PhotoUploader onChange={setAddedPhotos} addedPhotos={addedPhotos} />

        {preInput("Description", "Description about the place")}
        <textarea
          value={description}
          onChange={(event) => {
            const fieldValue = event.target.value;
            setDescription(fieldValue);
          }}
        />

        {preInput("Perks", "Select your perks")}
        <Perks selected={perks} onChange={setPerks} />
        {preInput("Extra Information", "House rules, things to know, etc..")}
        <textarea
          value={extraInfo}
          onChange={(event) => {
            const fieldValue = event.target.value;
            setExtraInfo(fieldValue);
          }}
        />

        {preInput(
          "Check in, Check out, Max Guests, Price",
          "Important to avoid possible issues"
        )}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Check In</h3>
            <input
              type="text"
              placeholder="for example 15:00"
              value={checkIn}
              onChange={(event) => {
                const fieldValue = event.target.value;
                setCheckIn(fieldValue);
              }}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Check out</h3>
            <input
              type="text"
              placeholder="for example 13:00"
              value={checkOut}
              onChange={(event) => {
                const fieldValue = event.target.value;
                setCheckOut(fieldValue);
              }}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1 truncate">Maximum Number of Guests</h3>
            <input
              type="number"
              placeholder="for example 3"
              value={maxGuests}
              onChange={(event) => {
                const fieldValue = event.target.value;
                setMaxGuests(fieldValue);
              }}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price per night in SAR</h3>
            <input
              type="number"
              placeholder="for example 300 SAR"
              value={price}
              onChange={(event) => {
                const fieldValue = event.target.value;
                setPrice(fieldValue);
              }}
            />
          </div>
        </div>
        <button type="submit" className="primary my-4">
          Save
        </button>
      </form>
    </div>
  );
}
