require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();
const path = require("path");
const { engine } = require("express-handlebars");
const { data } = require("./public/data");

// Schema
const UserSchema = new mongoose.Schema({}, { strict: false });

const User = mongoose.model("mydatas", UserSchema);

// MongoDB Connection using env variable
mongoose
	.connect(process.env.MONGO_URI, {
		// useNewUrlParser: true,
		// useUnifiedTopology: true
	})
	.then(async () => {
		console.log("MongoDB Connected");
		// const db = mongoose.connection.db;
		// // List all collections
		// const collections = await db.listCollections().toArray();
		// collections.forEach((col) => console.log(col.name));
	})
	.catch((err) => console.log("DB Connection Error:", err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.engine("hbs", engine({ extname: ".hbs", defaultLayout: "main" }));

app.set("view engine", "hbs");

router.get("/", async (req, res) => {
	await User.find()
		.then((users) => {
			// console.log(users[0].portfolio, "users");
			res.status(200).render("index", {
				docTitle: "Portfolio",
				data: users[0]?.portfolio,
				roles: users[0]?.portfolio?.roles[0],
				pageIndex: true,
			});
		})
		.catch((err) => res.send(err.name + " " + err.message));
});

router.use((req, res, next) => {
	res.status(404).render("404", {
		docTitle: "404 Page not found",
		page404: true,
	});
});

app.use(router);

app.listen(8000, () => {
	console.log("Running on 8000");
});
