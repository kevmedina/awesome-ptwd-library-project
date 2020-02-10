const mongoose = require('mongoose');

const DB_NAME = 'awesome-ptwd-library-project';

mongoose
  .connect(`mongodb://localhost/${DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => {
    console.error(`An error ocurred trying to connect to the database : ${DB_NAME}`, error);
  process.exit(1);
});
