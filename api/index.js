const express = require("express");
const cors = require("cors");
const { json } = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = "salemalharbi";
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const Place = require("./models/Place");
const Booking = require("./models/Booking");
const { log } = require("console");

// generating salt and passing the number of rounds
const bcyrptSalt = bcrypt.genSaltSync(10);
// to configure .env file
dotenv.config();

mongoose.connect(process.env.MONGO_URL);

app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(cookieParser());

// get requests

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      else {
        res.json(userData);
      }
    });
  } else {
    res.json(null);
  }
});

app.get("/user-places", (req, res) => {
  // places for a specifc user
  const { token } = req.cookies;

  jwt.verify(token, jwtSecret, {}, (err, userData) => {
    if (err) throw err;
    else {
      const id = userData.id;
      console.log("Id is " + id);
      Place.find({ owner: id }).then((result) => {
        res.json(result);
      });
    }
  });
});

app.get("/places", (req, res) => {
  // places of all users to be rendered in the homepage
  Place.find().then((result) => {
    res.json(result);
  });
});

app.get("/places/:id", (req, res) => {
  // specific place
  const { id } = req.params;
  Place.findById(id).then((result) => {
    res.json(result);
  });
});

// app.get("/place/:id", (req, res) => {
//   // specifc place page for all users
//   const {id}=req.params;
//   Place.findBy

// });

app.get("/bookings", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, (err, userData) => {
    if (err) throw err;
    else {
      Booking.find({ user: userData.id })
        .populate(["place", "user"])
        .then((result) => {
          res.json(result);
        })
        .catch((e) => {
          throw e;
        });
    }
  });
});

app.get("/bookings/:id", (req, res) => {
  Booking.findById(req.params.id)
    .populate(["place", "user"])
    .then((result) => {
      res.json(result);
    });
});

// The new search route
app.get("/search-places", (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm) {
    return res.status(400).json({ message: "Search term is required" });
  }

  // Search using regex in title, description, and location fields
  Place.find({
    $or: [
      { title: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
      { location: { $regex: searchTerm, $options: "i" } },
    ],
  })
    .then((places) => {
      res.json(places); // Return the found places
    })
    .catch((error) => {
      console.error("Error during search:", error);
      res.status(500).json({ error: "Something went wrong" });
    });
});
// put requests

app.put("/places/:id", (req, res) => {
  const { token } = req.cookies;
  const placeId = req.params.id;
  const placeObj = req.body;
  console.log("In server");

  jwt.verify(token, jwtSecret, {}, (err, userData) => {
    if (err) throw err;
    else {
      // to verify that the user making the update is the owner of the place
      Place.findById(placeId).then((placeDoc) => {
        if (placeDoc.owner.toString() === userData.id) {
          // the user is the owner
          // verifed
          placeDoc.set(placeObj);
          placeDoc.save().then(() => {
            console.log("Updated Successfully");
            res.json("Ok");
          });
        }
      });
    }
  });
});

// Post requests

app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  User.create({
    username,
    email,
    password: bcrypt.hashSync(password, bcyrptSalt),
  })
    .then((newUser) => {
      res.json(newUser);
    })
    .catch((e) => res.status(422).json(e));

  //   Or I could to this

  //   const newUser=await User.create({
  //     username,
  //     email,
  //     password: bcrypt.hashSync(password, bcyrptSalt),
  //   })

  //   res.json(newUser)
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  //   checking if the email exist in the DB
  User.findOne({ email })
    .then((foundUser) => {
      // if null, failed
      if (foundUser) {
        const isPassOk = bcrypt.compareSync(password, foundUser.password);
        if (isPassOk) {
          jwt.sign(
            {
              email: foundUser.email,
              id: foundUser._id,
              username: foundUser.username,
            },
            jwtSecret,
            {},
            (err, token) => {
              if (err) throw err;
              else {
                // Sending the token with the cookie
                // sending the User back as response to the post request
                res.cookie("token", token).json(foundUser);
              }
            }
          );
        } else {
          res.status(422).json("password is wrong");
        }
      } else {
        res.status(422).json("Email not Found");
      }
    })
    .catch((e) => {
      res.status(422).json("ERROR email couldn't get checked");
    });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/upload-by-link", (req, res) => {
  const { link } = req.body;
  // we want to download the image and then put it  in the uploads folder with the name of the time its uploaded
  const newName = "photo " + Date.now() + ".jpg";
  const path = __dirname + "/uploads/" + newName;
  imageDownloader
    .image({
      url: link,
      dest: path,
    })
    .then(() => {
      res.json(newName);
    })
    .catch((e) => {
      console.log(e);
    });
});

const photoMiddleware = multer({ dest: "uploads/" });
// 100 is the max number of files
app.post("/upload", photoMiddleware.array("photos", 100), (req, res) => {
  // to add file extision in the path, we grap the extision from the orignalname then add it to the path
  const uploadFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadFiles.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadFiles);
});

app.post("/places", (req, res) => {
  // To get the id of the user that made the request
  console.log("Post request received");
  const { token } = req.cookies;
  const {
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
  } = req.body;
  jwt.verify(token, jwtSecret, {}, (err, userData) => {
    if (err) throw err;
    else {
      // here
      Place.create({
        owner: userData.id,
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
      }).then((result) => {
        res.json(result);
      });
    }
  });
});

app.post("/booking", (req, res) => {
  const bookingObject = req.body;
  console.log(bookingObject);
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, (err, userData) => {
    if (err) throw err;
    else {
      Booking.create({ ...bookingObject, user: userData.id })
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          throw err;
        });
    }
  });
});

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
