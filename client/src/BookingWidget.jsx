import { useContext, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate, redirect } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [phone, setPhone] = useState("");
  const [endPointRedirect, setEndPointRedirect] = useState("");
  const { user } = useContext(UserContext);

  //   if they contain a value

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  function bookThisPlace() {
    const placeObj = {
      checkIn,
      checkOut,
      //   Price of all nights
      totalPrice: place.price * numberOfNights,
      place: place._id,
      fullName: user.username,
      phone,
    };
    axios
      .post("/booking", placeObj, { withCredentials: true })
      .then((result) => {
        const bookingId = result.data._id;
        setEndPointRedirect("/account/bookings/" + bookingId);
      })
      .catch((e) => {
        throw e;
      });
  }

  //   For Redirection

  if (endPointRedirect) {
    return <Navigate to={endPointRedirect} />;
  }

  // Assume number of nights=2
  return (
    <div className="bg-white-300  shadow p-4 rounded-2xl mt-3">
      <div className="font-semibold text-center">Price</div>
      <div className="text-xl text-center ">
        {place.price} SAR <span className="text-gray-500">per night</span>
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className=" py-3 px-4">
            <label>Check in: </label>
            <input
              value={checkIn}
              type="date"
              onChange={(e) => {
                const fieldInput = e.target.value;
                setCheckIn(fieldInput);
              }}
            />
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check out: </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => {
                const fieldInput = e.target.value;
                setCheckOut(fieldInput);
              }}
            />
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Number of Guests </label>
          <input
            type="number"
            value={maxGuests}
            onChange={(e) => {
              const fieldInput = e.target.value;
              setMaxGuests(fieldInput);
            }}
          />
        </div>

        {numberOfNights > 0 && (
          <div>
            <div className="py-3 px-4 border-t">
              <label>Full Name</label>
              <input type="text" value={user.username} disabled />
            </div>
            <div className="py-3 px-4 border-t">
              <label>Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  const fieldInput = e.target.value;
                  setPhone(fieldInput);
                }}
              />
            </div>
          </div>
        )}
      </div>

      <button className="primary mt-4" onClick={bookThisPlace}>
        Book Now{" "}
        {numberOfNights > 0 && (
          <span>for {numberOfNights * place.price} SAR</span>
        )}
      </button>
    </div>
  );
}
