const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')


const { PORT, CLIENT_URL } = require('./src/Config/serverConfig');
const { connectToMongoDB } = require('./src/Config/dbConfig');
const authRouter = require('./src/Routes/auth.routes');
const mediaRouter = require('./src/Routes/InstructorRoutes/media.routes');
const { authenticate } = require('./src/Middlewares/auth.middleware');
const instructorRouter = require('./src/Routes/InstructorRoutes/course.routes');
const studentCourseRouter = require('./src/Routes/studentRoutes/course.routes');
const orderRouter = require('./src/Routes/studentRoutes/order.routes');
const studentCoursesRouter = require('./src/Routes/studentRoutes/studentCourses.routes');
const courseProgressRouter = require('./src/Routes/studentRoutes/courseProgress.routes');


const app = express();
const corsOptions = {
    origin: CLIENT_URL || 'http://localhost:5173/',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}

app.use(cors());
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
// Routes
app.use('/auth', authRouter);
app.use('/media', authenticate, mediaRouter);
app.use('/instructor/course', authenticate, instructorRouter);
app.use('/student/course', authenticate, studentCourseRouter);
app.use('/student/order', authenticate, orderRouter);
app.use('/student/enrolled-courses', authenticate, studentCoursesRouter);
app.use('/student/course-progress', authenticate, courseProgressRouter);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        success: false,
        message: 'Something went wrong'
    });
})

app.listen(PORT, async () => {
    await connectToMongoDB();
    console.log(`server started on ${PORT}`);
})