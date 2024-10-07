const express = require("express");
const app = express();

const mysql = require("mysql2");
const dotenv = require("dotenv");
const cors = require('cors');


app.use(express.json());
app.use(cors());
dotenv.config();


const host = process.env.DB_HOST;
const user = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;
const port = process.env.PORT;
const portDB = process.env.DB_PORT


const db = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database,
    port: portDB
});

//Check if db connection works
db.connect((err) => {
    if(err) return console.log("Error connecting to database.")

    console.log("Server connected successful to database.")

    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);

        //Send message to the browser
        console.log("Sending message to browser... ");

        app.get("/", (request, response) => {
            response.send("Server started Successfully!");
        });
	});
});

// Question 1rstname
app.get('/patients', (req, res) => {
    let sql =
			"SELECT patient_id, first_name, last_name, date_of_birth FROM patients;";
    db.query(sql, (err, result) => {
            if (err) throw err;
            // console.log(result)
			res.send(result);
		});
})

// Question 2
app.get("/providers", (req, res) => {
	let sql = "SELECT first_name, last_name, provider_specialty FROM providers;";
	db.query(sql, (err, result) => {
		if (err) throw err;
		// console.log(result)
		res.send(result);
	});
});

// Question 3
app.get("/patients/firstname/", (req, res) => {
	let sql =
		"SELECT first_name FROM patients;";
	db.query(sql, (err, result) => {
		if (err) throw err;
		// console.log(result)
		res.send({result:result});
	});
});

// Question 4
app.get("/providers/specialty/", (req, res) => {
    let sql_1 =
			"SELECT first_name, provider_specialty FROM providers ORDER BY provider_specialty";
    
    db.query(sql_1, (err, result) => {
		if (err) throw err;
        const p = result.reduce((acc, specialty) => {
					if (!acc[specialty.provider_specialty]) {
						acc[specialty.provider_specialty] = [];
					}
					acc[specialty.provider_specialty].push(specialty);
					return acc;
				}, {});
        // console.log(p)
        res.send(p)
    })
});
