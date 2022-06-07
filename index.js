const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

let users = [];
let uc_counter = 0;

let exercises = [];

app.post('/api/users', (req, res) => {
  let user = {
    username: req.body.username,
    _id: String(uc_counter++)
  }

  users.push(user);
  res.json(user);
});

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users/:_id/exercises', (req, res) => {
  let user = users.find((val) => val._id == Number(req.params._id));
  if (user == undefined) res.json({error: "user not found"});

  let exercise = {
    _id: user._id,
    username: user.username,
    date: (new Date(req.body.date)).toDateString(),
    duration: Number(req.body.duration),
    description: req.body.description
  };

  exercises.push(exercise);
  res.json(exercise);
});

app.get('/api/users/:_id/logs', (req, res) => {
  let id = req.params._id;
  let from = new Date(req.query.from);
  let to = new Date(req.query.to);
  let limit = Number(req.query.limit);

  let fusers = users.filter((val) => {
    let date = new Date(val.date);
    return date >= from && date <= to;
  });

  fusers = fusers.filter((val, i) => i < limit);

  res.json(fusers);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
