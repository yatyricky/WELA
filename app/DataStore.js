let instance = null;

export default class DataStore {

    constructor() {
        if (!instance) {
            instance = this;
        }
        this.parseFile = this.parseFile.bind(this);
        this.numFiles = 0;
        this.doneFiles = 0;
        return instance;
    }

    parseFile() {
        this.doneFiles += 1;
        this.callback.call();
    }

    parse(files, progressCallBack) {
        this.callback = progressCallBack;
        this.numFiles = files.length;
        this.doneFiles = 0;
        this.callback.call();
        for (var i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.readAsText(files[i]);
            reader.onload = this.parseFile;
        }
    }

}
