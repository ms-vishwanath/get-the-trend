import "dotenv/config"
import express from "express"
import cors from "cors"
import bot from "./bot/botModule.js"
const app = express()
const port = process.env.PORT || 4001
app.use(cors({
    origin: "*"
}))
app.use(express.json())

app.get("/", (req, res) => {
    res.send("WORKING COOL BRO !");
});

app.listen(port, async () => {
    console.log("SERVER IS RUNNING ON PORT", port)
})

