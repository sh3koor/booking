import { useParams } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDate from "../BookingDates";

export default function BookingPage() {
  const [booking, setBooking] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios.get("/bookings/" + id).then((result) => {
        console.log(result.data);
        setBooking(result.data);
      });
    }
  }, [id]);

  if (!booking) return;
  console.log(booking);
  return (
    <div className="my-8">
      <h1 className="text-3xl">{booking.place.title}</h1>
      <AddressLink>{booking.place.address}</AddressLink>
      <div className="bg-gray-200 p-4 mb-4 rounded-2xl p-6 my-6 flex justify-between items-center">
        <div>
          <h2 className="mb-6 text-2xl">Your booking Information: </h2>
          <BookingDate
            checkInDate={new Date(booking.checkIn)}
            checkOutDate={new Date(booking.checkOut)}
          />
        </div>
        <div className="p-6 bg-primary text-white rounded-2xl">
          <div>Total Price</div>
          <div className="text-3xl">{booking.totalPrice} SAR</div>
        </div>
      </div>

      <PlaceGallery place={booking.place} />
    </div>
  );
}
