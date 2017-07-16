let instance = null;

export default class DataStore {

    constructor() {
        if (!instance) {
            instance = this;
        }
        this.parseFile = this.parseFile.bind(this);
        this.numFiles = 0;
        this.doneFiles = 0;
        this.originalData = {
            "damage": [],
            "heal": [],
            "cast": [],
            "mana": [],
            "combat": []
        };
        this.combatList = [];
        this.activeLog = -1;
        this.updateDamageCallback = null;
        return instance;
    }

    registerUpdateCombatList(updateCombatListCallback) {
        this.updateCombatListCallback = updateCombatListCallback;
    }

    registerUpdateDamage(updateDamageCallback) {
        this.updateDamageCallback = updateDamageCallback;
    }

    setActiveLog(id) {
        this.activeLog = id;

        if (this.updateDamageCallback !== null) {
            this.updateDamageCallback.call();
        }
    }

    fetchLog(type) {
        let findCombat = null;
        for (var i = this.combatList.length - 1; i >= 0; i--) {
            if (this.combatList[i].id === this.activeLog) {
                findCombat = this.combatList[i];
            }
        }
        if (findCombat !== null) {
            let log = this.originalData[type];
            // find start point
            let l = 0, r = log.length - 1;
            let m = 0;
            while (l <= r) {
                m = Math.floor((l + r) / 2.0);
                if (parseFloat(log[m][0]) < parseFloat(findCombat.start)) {
                    l = m + 1;
                } else if (parseFloat(log[m][0]) > parseFloat(findCombat.start)) {
                    r = m - 1;
                } else {
                    l = r + 1;
                }
            }
            if (parseFloat(log[m][0]) < parseFloat(findCombat.start)) {
                m += 1;
            }
            let s = m;
            // find end point
            l = s + 1;
            r = log.length - 1;
            if (l > r) {
                m = r;
            }
            while (l <= r) {
                m = Math.floor((l + r) / 2.0);
                if (parseFloat(log[m][0]) < parseFloat(findCombat.end)) {
                    l = m + 1;
                } else if (parseFloat(log[m][0]) > parseFloat(findCombat.end)) {
                    r = m - 1;
                } else {
                    l = r + 1;
                }
            }
            return log.slice(s, m + 1);
        } else {
            return [];
        }
    }

    parseDone() {
        // sort all logs
        const keys = Object.keys(this.originalData);
        for (let i = 0, len = keys.length; i < len; i++) {
            this.originalData[keys[i]].sort((a, b) => (a[0] === b[0] ? 0 : (parseFloat(a[0].split("-")[0]) < parseFloat(b[0].split("-")[0]) ? -1 : 1)));
        }

        // update combat list
        const {combat} = this.originalData;
        this.combatList = [];
        this.activeLog = -1;
        for (let i = 0, len = combat.length; i < len; i += 2) {
            this.combatList.push({
                "id": i,
                "name": "",
                "start": combat[i][0],
                "end": (i + 1 < len) ? combat[i+1][0] : 9999
            });
        }

        this.updateCombatListCallback.call();
    }

    parseFile(e) {
        const lines = e.target.result.split("\n");
        for(let i = 0, len = lines.length; i < len; i++) {
            const tokens = lines[i].split(/[\"|]/);
            if (tokens.length > 3) {
                tokens.shift();
                tokens.pop();
                if (this.originalData.hasOwnProperty(tokens[1])) {
                    this.originalData[tokens[1]].push(tokens);
                }
            }
        }

        this.doneFiles += 1;
        this.callback.call();

        if (this.hasData()) {
            this.parseDone();
        }
    }

    parse(files, progressCallBack) {
        this.callback = progressCallBack;
        this.numFiles = files.length;
        this.doneFiles = 0;
        this.originalData = {
            "damage": [],
            "heal": [],
            "cast": [],
            "mana": [],
            "combat": []
        };
        this.callback.call();
        for (let i = 0, len = files.length; i < len; i++) {
            const reader = new FileReader();
            reader.readAsText(files[i]);
            reader.onload = this.parseFile;
        }
    }

    hasData() {
        return (this.doneFiles === this.numFiles && this.numFiles > 0);
    }

}
