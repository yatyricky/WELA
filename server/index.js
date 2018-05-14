const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();

app.listen(3000, () => {
    console.log("--- server running on 3000 ---");
});

app.use(express.static(path.join(__dirname, "..", "public")));

const dataDir = path.join(__dirname, "..", "data");

app.get("/api/getdata", (req, res) => {
    const files = fs.readdirSync(dataDir);
    const raw = [];
    for (let i = 0; i < files.length; i++) {
        const whole = fs.readFileSync(path.join(dataDir, files[i]), "utf-8");
        const regex = /"(.+)"/g;
        let match = regex.exec(whole);
        while (match != null) {
            const tokens = match[1].split("|");
            tokens[0] = parseFloat(tokens[0]);
            raw.push(tokens);
            match = regex.exec(whole);
        }
    }
    raw.sort((a, b) => {
        return a[0] - b[0];
    });
    const data = [];
    let inCombat = false;
    let combatObj = {};
    for (let i = 0; i < raw.length; i++) {
        if (inCombat === false && raw[i][1] == "combat") {
            inCombat = true;
            combatObj = {
                start: raw[i][0],
                end: 0,
                damages: [],
                healings: [],
                manas: [],
                casts: [],
                dtakens: []
            };
        }
        if (inCombat === true && raw[i][1] == "combat") {
            inCombat = false;
            combatObj.end = raw[i][0];
            data.push(combatObj);
        }
        if (raw[i][1] == "damage") {
            combatObj.damages.push({
                time: raw[i][0],
                
            });
        }
    }
    res.status(200).send(data);
});

app.get("*", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "..", "client", "index.html"));
});