const express = require('express');
const dotenv = require('dotenv').config();
const errorHandler = require("./middleware/errorHandler");


const app = express();

const port = process.env.PORT || 5000

app.use(express.json());
app.use("/api/chat", require('./routes/routes'));
app.use(errorHandler);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

