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
        return instance;
    }

    registerUpdateCombatList(updateCombatListCallback) {
        this.updateCombatListCallback = updateCombatListCallback;
    }

    parseDone() {
        // sort all logs
        const keys = Object.keys(this.originalData);
        for (let i = 0, len = keys.length; i < len; i++) {
            this.originalData[keys[i]].sort((a, b) => (a[0] === b[0] ? 0 : (a[0] < b[0] ? -1 : 1)));
        }

        // update combat list
        const {combat} = this.originalData;
        this.combatList = [];
        for (let i = 0, len = combat.length; i < len; i += 2) {
            this.combatList.push({
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
