function checkLocalStorage(arg: string) {
    const storage = localStorage.getItem(arg);

    if (!storage) {
        return console.warn(`localStorage for ${arg} not found.`);
    }

    return JSON.parse(storage);
}

export default checkLocalStorage;