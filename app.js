const express = require("express");
//require('./mongodb/db')
const appRouter = require('./routers/router')
const port = process.env.PORT || 3000
 
var app = express();
app.use(express.json())
 app.use(appRouter)
 
app.listen(port, () => {
  console.log(`server running on port ${port}`)	
});



