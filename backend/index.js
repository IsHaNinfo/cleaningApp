import mongoose from "mongoose";
import express from "express"
import cors from "cors"
import bodyParser from "body-parser";
import adminRoutes from "./routes/adminRoute.js"
import dotenv from 'dotenv';
const app = express();


dotenv.config();

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));



app.use(
    cors()
);

app.use(express.json());
mongoose.set("strictQuery", true);

app.use("/admin",adminRoutes)



mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("Connected to the database and listening on port", process.env.PORT);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });