import { useEffect, useState } from "react";
import AccountNav from "../AccountNav";
import axios from "axios";
import { differenceInCalendarDays, format } from "date-fns";
import { Link } from "react-router-dom";
import BookingDate from "../BookingDates";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios
      .get("/bookings", { withCredentials: true })
      .then((result) => {
        console.log("Request handled");
        setBookings(result.data);
        console.log(bookings);
      })
      .catch((e) => {
        throw e;
      });
  }, []);
  return (
    <div>
      <AccountNav />
      <div>
        {bookings?.length > 0 &&
          bookings.map((booking) => {
            const checkInDate = new Date(booking.checkIn);
            const checkOutDate = new Date(booking.checkOut);

            return (
              <Link
                to={"/account/bookings/" + booking._id}
                className="flex gap-4 bg-gray-100 rounded-2xl overflow-hidden"
              >
                <div className="w-48">
                  <img
                    className="object-cover"
                    src={
                      "http://localhost:4000/uploads/" +
                      booking.place.addedPhotos[0]
                    }
                  />
                </div>
                <div className="py-3 pr-3 grow">
                  <h2 className="text-xl">{booking.place.title}</h2>
                  <div className="border-t border-gray-300 mt-2 py-2 flex gap-2 items-center text-gray-700">
                    <BookingDate
                      checkInDate={checkInDate}
                      checkOutDate={checkOutDate}
                    />
                  </div>
                  <div className="flex gap-1 text-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                      />
                    </svg>
                    Total Price:{" "}
                    <span className="font-bold">{booking.totalPrice} </span>SAR
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
