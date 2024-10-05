const express = require('express');
const app = express();
const routes = require('./routes');
// Define routes and middleware here
// ...

const PORT = process.env.PORT || 3000;

app.use(routes);
app.use(express.static("client/build"));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

