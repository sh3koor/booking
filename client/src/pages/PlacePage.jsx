import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import BookingWidget from "../BookingWidget";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";

export default function PlacePage() {
  const [place, setPlace] = useState({});
  const id = useParams().id;
  useEffect(() => {
    if (!id) {
      return;
    } else {
      axios.get("/places/" + id).then((result) => {
        setPlace(result.data);
      });
    }
  }, [id]);

  return (
    <div className="mt-8 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl">{place.title}</h1>
      <AddressLink>{place.address}</AddressLink>
      <PlaceGallery place={place} />
      {/* Check In, Check Out */}

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 mb-8">
        <div className="mt-2">
          {/* Description  && Check In,out*/}
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description</h2>
            {place.description}
          </div>
          <div>
            <span className="font-semibold">Check In :</span> {place.checkIn}
          </div>
          <div>
            <span className="font-semibold">Check Out :</span> {place.checkOut}
          </div>
          <div>
            <span className="font-semibold">Maximum Number of Guests :</span>
            {place.maxGuests}
          </div>
        </div>
        <BookingWidget place={place} />
      </div>
      <div className="mt-2 bg-white -mx-8 px-8 px-8 py-8 border-t">
        <h2 className="font-semibold text-2xl">Extra Information</h2>
        <div className="text-sm text-gray-700 leading-5 mt-1 mb-4">
          {place.extraInfo}
        </div>
      </div>
    </div>
  );
}
