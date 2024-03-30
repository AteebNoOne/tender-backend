import express from "express";
import { connectDB } from "./config/database.js";
const app = express();
import { PORT,BASE_URL } from "./config/index.js";
import router from "./routes/userRoutes.js";
import ErrorMiddleware from "./middleware/Error.js";
import fileupload from "express-fileupload";
import paypal from "paypal-rest-sdk"
import bodyParser from "body-parser"

import cors from 'cors';


connectDB();

paypal.configure({
  mode: "sandbox",
  client_id:
    "ATqtRNT_53lXPvjjJeh85jNGYhDVfaIzWxPZvZiJio6iA7CyYn74PWvctNDwwgda3VQVfDT0UmJy0o6T",
  client_secret:
    "EFFQ-lydMXHO4rd8HoXwpn7qaVZEr8bv7eR7xZvLucsrFy6iFOTH34GKLyAI1BP7sCy761K234O0zn5f",
});

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

// Serve your HTML file
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

app.post("/pay", (req, res) => {
  const { itemName, itemPrice, currency } = req.body;

  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: `${BASE_URL}/success`, 
      cancel_url: `${BASE_URL}/cancel`,
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: itemName,
              price: itemPrice,
              currency: currency,
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: currency,
          total: itemPrice, // Make sure this matches the itemPrice
        },
        description: `${itemName} for purchase`,
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.json({ approval_url: payment.links[i].href });
        }
      }
    }
  });
});

// ...

app.get("/success", (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  // Define the correct currency and itemPrice based on your request parameters
  const currency = "USD"; // Replace with the correct currency
  const itemPrice = "35.00"; // Replace with the correct itemPrice

  // Execute the payment
  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: currency,
          total: itemPrice, // Make sure this matches the itemPrice
        },
      },
    ],
  };

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        console.log("Payment execution failed:");
        console.log(error.response);
        // res.json({
        //   success: false,
        //   data: error.response
        // })
        res.render("cancel")
      } else {
        console.log("Payment executed successfully:");
        console.log(JSON.stringify(payment));
        // res.send(JSON.stringify(payment));
        res.render("success")
      }
    }
  );
});

// Handle the cancel callback
app.get("/cancel", (req, res) => {
  console.log("Payment canceled by user");
  res.send("Payment canceled");
  res.json({
    success: false,
    data: "Payment canceled",
    code: 201
  })
});



app.listen(PORT, '0.0.0.0', () => {
  console.log(`App is running on port ${PORT}`);
});

app.use(ErrorMiddleware);
