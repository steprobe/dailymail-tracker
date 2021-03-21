const express = require('express');
const listEndpoints = require('express-list-endpoints');

const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to the jungle');
});

console.log(listEndpoints(app));

const port = process.env.NODE_ENV === 'test' ? 5001 : process.env.PORT || 5000;
app.listen(port, () => console.log(`Running on ${port}`));
