require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth-routes/index.js");
const mediaRoutes = require("./routes/instructor-routes/media-routes.js");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes.js");
const studentCourseRoutes = require("./routes/student-routes/course-routes.js");
const studentOrderRoutes = require("./routes/student-routes/order-routes.js");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes.js");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes.js");

const app = express();
const port = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const allowedOrigins = [
  'http://localhost:5173',
  'https://lms-frontend-wheat-beta.vercel.app',
  process.env.CLIENT_URL
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};

app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));  

// app.use(cors());  // no options
// app.options("*", cors());


app.use(express.json());

// Database connection
const mongoose = require("mongoose");
mongoose.connect(MONGO_URI).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

app.use('/auth', authRoutes);
app.use('/media', mediaRoutes);
app.use('/instructor/course', instructorCourseRoutes);
app.use('/student/course', studentCourseRoutes);
app.use('/student/order', studentOrderRoutes);
app.use('/student/bought-courses', studentCoursesRoutes);
app.use('/student/course-progress', studentCourseProgressRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!!");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});