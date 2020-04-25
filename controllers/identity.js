class IdentityThing {
    static object_dict = {};

    constructor(first_user) {
        this.id = this._uuid();
        IdentityThing.object_dict[this.id] = this;

        this.user_list = [first_user]
    }

    _uuid() {
        let d = Date.now();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
}

exports.IdentityThing = IdentityThing