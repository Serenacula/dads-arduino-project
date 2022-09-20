import bodyParser from "body-parser"
import express from "express"
import fs from "fs/promises"

const app = express()
const port = 3000
const lineBreak = `
`

app.use(bodyParser.text())

app.get("/", async (req, res) => {
    const records = await fs.readFile(
        "./records.txt",
        "utf8",
        function (err, data) {
            if (err) {
                return console.log(err)
            }
        }
    )
    console.log(`sending data: ${records}`)
    const splitRecords = records.split(lineBreak)
    let recordsAsHtml = ""
    for (const record of splitRecords) {
        recordsAsHtml += `<li>${record}</li>
        `
    }
    res.send(
        `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <title>Arduino Readout</title>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width,initial-scale=1" />
                </head>

                <body>
                    <h1>List of Records</h1>
                    <ol>${recordsAsHtml}</ol>
                </body>
            </html>
        `
    )
})

app.post("/", async (req, res) => {
    const body = req.body
    await fs.appendFile("./records.txt", lineBreak + body, function (err) {
        if (err) {
            return console.log(err)
        }
        console.log(`wrote new record to file: ${body}`)
    })
    res.send("records updated")
})

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})
