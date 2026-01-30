const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/',(req,res)=>{
    res.json({
        msg:"hello form server"
    })
})

app.listen(PORT,()=>{
    console.log(`server is listening on http://localhost:${PORT}`);
    
})