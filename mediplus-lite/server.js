const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
// Create a MySQL connection
const dbConfig = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'appointments'
});

// Connect to the database
dbConfig.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ', err);
    return;
  }
  console.log('Connected to database');
});

// Middleware to parse JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Define a route to handle database queries
app.get('/', (req, res) => {
   res.sendFile(__dirname + '/index.html');
});

app.post('/form', (req, res) => {
    try {
      
        const formData = {
            name:req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            date: req.body.date,
            message: req.body.message,
            doctor: req.body.doctor,
            department: req.body.department
        }
        const data = 
        [
            formData.name,
            formData.email,
            formData.phone,
            formData.department,
            formData.doctor,
            formData.date,
            formData.message
        ];

      //save selected services in the database
      const insertQuery = 'insert into appointments (name, email, phone, department, doctor, appointment_date, message ) values  (?,?, ?, ?, ?, ?, ?)';
  
      //insert the selected service into the database
      dbConfig.query(insertQuery, data, (err, result) => {
        if (err) {
          console.log('error inserting data into the database', err);
          return;
  
        } else {
          console.log('data inserting in the database sucessfully');
        }
      });
  
    //send email.
    const nodemailer = require('nodemailer');

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        host: 'host', // Your SMTP server host
        port: 25, // Your SMTP server port
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'your@example.com', // Your email address
            pass: 'yourpassword' // Your email password
        }
    });
    
    // Inside the form submission handler
    // After inserting data into the database
    
    // Send email to the user
    const mailOptions = {
        from: 'your@example.com', // Your email address
        to: formData.email,
        subject: 'Appointment Confirmation',
        text: `Dear ${formData.name},\n\nYour appointment has been booked successfully.\n\nThank you.`,
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
    
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  });

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
