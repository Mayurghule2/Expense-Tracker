const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const ExpenseRouter = require('./Routes/ExpenseRouter');
const ensureAuthenticated = require('./Middlewares/Auth');

require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: 'https://expense-tracker-orry-aty3lqchc-mayurs-projects-f058cfbf.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.options('*', cors());

app.use(bodyParser.json());

app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);
app.use('/expenses', ensureAuthenticated, ExpenseRouter)

app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})