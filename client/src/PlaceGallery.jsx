import { useState } from "react";
export default function PlaceGallery({ place }) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  function presentAllPhotos() {
    return (
      <div className="absolute inset-0 bg-black min-h-screen">
        <div className="grid justify-center gap-4 p-8 bg-black">
          <div className="">
            <h2 className="text-3xl mr-48">Photos of {place?.title}</h2>
            <button
              onClick={() => {
                setShowAllPhotos(false);
              }}
              className="flex gap-2 bg-gray-300 py-2 px-4 shadow shadow-black rounded-2xl"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Close Photos
            </button>
          </div>
          {place?.addedPhotos.length > 0 &&
            place.addedPhotos.map((photo) => {
              return (
                <div>
                  <img src={"http://localhost:4000/uploads/" + photo} />
                </div>
              );
            })}
        </div>
      </div>
    );
  }

  // if the show all photos button state is true
  if (showAllPhotos) {
    return presentAllPhotos();
  }
  return (
    <div className="relative">
      <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
        <div>
          {place.addedPhotos?.[0] && (
            <img
              onClick={() => {
                setShowAllPhotos(true);
              }}
              className="aspect-square object-cover cursor-pointer"
              src={"http://localhost:4000/uploads/" + place.addedPhotos[0]}
            />
          )}
        </div>
        <div className="grid">
          {place.addedPhotos?.[1] && (
            <div>
              <img
                onClick={() => {
                  setShowAllPhotos(true);
                }}
                className="aspect-square object-cover cursor-pointer"
                src={"http://localhost:4000/uploads/" + place.addedPhotos[1]}
              />
            </div>
          )}
          <div className="overflow-hidden">
            {place.addedPhotos?.[2] && (
              <img
                onClick={() => {
                  setShowAllPhotos(true);
                }}
                className="aspect-square object-cover relative top-2 cursor-pointer"
                src={"http://localhost:4000/uploads/" + place.addedPhotos[2]}
              />
            )}
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          setShowAllPhotos(true);
        }}
        className="flex absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow shadow-md shadow-gray-500 text-sm"
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
            d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
          />
        </svg>
        <div className="px-1">Show more photos</div>
      </button>
    </div>
  );
}
