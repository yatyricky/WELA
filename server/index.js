const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const config = require("./config.js");

app.listen(config.port, () => {
    console.log(`--- server running on ${config.port} ---`);
});

app.use(express.static(path.join(__dirname, "..", "public")));

const dataDir = path.join(config.dataDir);

app.get("/api/getdata", (req, res) => {
    const files = fs.readdirSync(dataDir);
    const raw = [];
    for (let i = 0; i < files.length; i++) {
        if (files[i].match(/combatLog\-\d+\.pld/g)) {
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
    }
    raw.sort((a, b) => {
        return a[0] - b[0];
    });
    const data = [];
    let combatObj = {
        start: 0,
        end: 0,
        damages: [], // source|career|target|career|abilName|amount
        healings: [], // source|career|target|career|abilName|amount|overflow
        manas: [], // source|mana|maxMana
        casts: [], // source|career|target|career|abilName
        count: 0
    };
    for (let i = 0; i < raw.length; i++) {
        if (raw[i][1] == "combat") {
            if (combatObj.count > 0) {
                combatObj.end = raw[i][0];
                data.push(combatObj);
                combatObj = {
                    start: 0,
                    end: 0,
                    damages: [],
                    healings: [],
                    manas: [],
                    casts: [],
                    count: 0
                };
            }
        } else {
            if (combatObj.count == 0) {
                combatObj.start = raw[i][0];
            }
            combatObj.count += 1;
            if (raw[i][1] == "damage") {
                combatObj.damages.push({
                    time: raw[i][0],
                    source: raw[i][2],
                    sourceT: raw[i][3],
                    target: raw[i][4],
                    targetT: raw[i][5],
                    name: raw[i][6],
                    amount: parseFloat(raw[i][7])
                });
            } else if (raw[i][1] == "heal") {
                combatObj.healings.push({
                    time: raw[i][0],
                    source: raw[i][2],
                    sourceT: raw[i][3],
                    target: raw[i][4],
                    targetT: raw[i][5],
                    name: raw[i][6],
                    amount: parseFloat(raw[i][7]),
                    overflow: parseFloat(raw[i][8])
                });
            } else if (raw[i][1] == "cast") {
                combatObj.casts.push({
                    time: raw[i][0],
                    source: raw[i][2],
                    sourceT: raw[i][3],
                    target: raw[i][4],
                    targetT: raw[i][5],
                    name: raw[i][6]
                });
            } else if (raw[i][1] == "mana") {
                combatObj.manas.push({
                    time: raw[i][0],
                    source: raw[i][2],
                    mana: parseFloat(raw[i][3]),
                    maxMana: parseFloat(raw[i][4])
                });
            }
        }
    }
    if (combatObj.count > 0) {
        combatObj.end = raw[raw.length - 1][0];
        data.push(combatObj);
    }
    res.status(200).send(data);
});

app.get("*", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "..", "client", "index.html"));
});