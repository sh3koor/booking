import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import axios from "axios";
import React, { useState, useContext } from "react";
import { set } from "mongoose";

export default function Header() {
  const { user } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]); // To hold search results
  const [showSearch, setShowSearch] = useState(false); // Toggle search input

  // Search places function - Fetch data from API as user types
  const searchPlaces = (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (query.length > 0) {
      axios
        .get(`/search-places?q=${query}`, { withCredentials: true })
        .then((response) => {
          setSuggestions(response.data); // Set search results in state
        });
    } else {
      setSuggestions([]); // Clear suggestions if input is empty
    }
  };

  return (
    <header className="flex justify-between">
      {/* Left: Logo */}
      <Link to={"/"} className="flex gap-1 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 -rotate-90"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          />
        </svg>
        <span className="font-bold text-xl">BookSA</span>
      </Link>

      {/* Middle: Search Bar */}
      <div className="flex items-center">
        {!showSearch ? (
          // If search is hidden, show this section
          <div className="flex border border-gray-300 rounded-full py-2 px-4 gap-2 shadow-md shadow-gray-300">
            <div>Anywhere</div>
            <div className="border-l border-gray-300"></div>
            <div>Any week</div>
            <div className="border-l border-gray-300"></div>
            <div>Add guests</div>
            {/* Search Button */}
            <button
              className="bg-primary p-2 text-white rounded-full"
              onClick={() => setShowSearch(true)} // Show search input on click
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </div>
        ) : (
          // If search is active, show this search input
          <div className="relative flex flex-col w-full ">
            <div className="flex border border-gray-300 rounded-full px-4 gap-2 shadow-md shadow-gray-300">
              <input
                type="text"
                value={searchTerm}
                onChange={searchPlaces}
                placeholder="Search places"
                className="w-full outline-none"
              />
              <button
                className="bg-primary px-8 text-white rounded-3xl shadow-md"
                onClick={() => {
                  setShowSearch(false);
                  setSearchTerm(""); // Clear search input on click
                  setSuggestions([]); // Clear search results on click
                }} // Close search input
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Search suggestions dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-lg max-h-64 overflow-y-auto z-10">
                {suggestions.map((place) => (
                  <Link
                    to={`/place/${place._id}`}
                    onClick={() => {
                      setShowSearch(false);
                      setSearchTerm(""); // Clear search input on click
                      setSuggestions([]); // Clear search results on click
                    }} // Close search input on click
                    key={place._id}
                    className="flex items-center p-2 hover:bg-gray-100"
                  >
                    {/* Display place image */}
                    <img
                      src={`http://localhost:4000/uploads/${place.addedPhotos[0]}`}
                      alt={place.title}
                      className="w-12 h-12 rounded-lg mr-4"
                    />
                    {/* Display place title */}
                    <div>
                      <h3 className="font-medium">{place.title}</h3>
                      <p className="text-sm text-gray-500">{place.location}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: User Account */}
      <Link
        to={user ? "/account" : "/login"}
        className="flex items-center border border-gray-300 rounded-full py-2 px-4 gap-2"
      >
        <div>
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
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </div>
        <div className="bg-gray-500 text-white rounded-full p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
          </svg>
        </div>
        {!!user && <div>{user.username}</div>}
      </Link>
    </header>
  );
}
