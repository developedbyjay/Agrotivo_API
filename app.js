require('./db/mongoose')
require('dotenv').config()
const express = require('express')
const app = express();
const port = process.env.PORT || 3000
const cors = require("cors");

const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const productRoute = require('./routes/product')
const orderRoute = require('./routes/order')
const vendorRoutes = require('./routes/vendor')
const withdrawRoutes = require('./routes/withdraw')

app.use(cors());
app.use(express.json());


app.use('/users', userRoute);
app.use("/auth/user", authRoute)
app.use('/product', productRoute)
app.use('/order', orderRoute)
app.use('/vendor', vendorRoutes)
app.use('/withdraw', withdrawRoutes)


app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})


