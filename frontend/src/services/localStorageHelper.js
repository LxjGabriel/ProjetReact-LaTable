export default class localStorageHelper {
    static storeData(key, data) {
        let parsed = JSON.stringify(data);
        localStorage.setItem(key, parsed);
    }

    static getData(key) {
        if (localStorage.getItem(key)) {
        try {
            const result = JSON.parse(localStorage.getItem(key));
            return result;
        } catch (e) {
            localStorage.removeItem(key);
            return null;
        }
        }
    }

    static removeData(key) {
        localStorage.removeItem(key);
    }
}