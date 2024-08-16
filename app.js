import express from "express";
import { connectDB } from "./config/database.js";
const app = express();
import { PORT } from "./config/index.js";
import router from "./routes/userRoutes.js";
import ErrorMiddleware from "./middleware/Error.js";
import fileupload from "express-fileupload";
import bodyParser from "body-parser"

import cors from 'cors';

connectDB();

// Use Middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.set('view engine', 'ejs');
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  fileupload({
    useTempFiles: true,
  })
);
// Import User Routes
app.use("/v1", router);


app.listen(PORT, '0.0.0.0', () => {
  console.log(`App is running on port ${PORT}`);
});

app.use(ErrorMiddleware);
