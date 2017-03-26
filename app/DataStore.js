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
        // update combat list
        this.combatList = [1,2,3,4,5];
        this.updateCombatListCallback.call();
    }

    parseFile(e) {
        const lines = e.target.result.split("\n");
        for(let i = 0; i < lines.length; i++) {
            const tokens = lines[i].split(/[\",]/);
            if (tokens.length > 3) {
                tokens.shift();
                tokens.pop();
                if (this.originalData.hasOwnProperty(tokens[0])) {
                    this.originalData[tokens[0]].push(tokens);
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
        for (var i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.readAsText(files[i]);
            reader.onload = this.parseFile;
        }
    }

    hasData() {
        return (this.doneFiles == this.numFiles && this.numFiles > 0);
    }

}
