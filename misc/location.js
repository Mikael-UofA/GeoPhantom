class Location {
    constructor(name, lat, long) {
        this.name = name;
        this.lat = lat;
        this.long = long;
    }

    getName() {
        return this.name;
    }
    getLat() {
        return this.lat;
    }
    getLong() {
        return this.long;
    }
}

export {Location};