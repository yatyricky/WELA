let _data = [];
let _num = 0;
const callbackList = [];

const registerDataUpdated = (callback) => {
    callbackList.push(callback);
};

const unregisterDataUpdated = (callback) => {
    let index = callbackList.indexOf(callback);
    if (index > -1) {
        callbackList.splice(index, 1);
    } else {
        console.error("unable to remove");
    }
};

const setCombatData = (num) => {
    _num = 0;
    if (_data.length > num) {
        _num = num;
        callbackList.forEach(element => {
            element(_data[num]);
        });
    }
};

const getCurrentCombatData = () => {
    if (_data.length > _num) {
        return _data[_num];
    } else {
        return null;
    }
};

const setAllData = (data) => {
    _data = data;
};

export {
    setAllData,
    setCombatData,
    registerDataUpdated,
    unregisterDataUpdated,
    getCurrentCombatData
};