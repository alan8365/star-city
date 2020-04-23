const suit_list = ['s', 'h', 'd', 'c'];

class TenPointHalfGame {
    constructor() {
        this.card_list = this.generate_new_card_libraries();
    }

    generate_new_card_libraries() {
        let card_list = [];

        suit_list.forEach(function (e) {
            for (let i = 1; i <= 13; i++) {
                card_list.push(e + i);
            }
        });

        card_list.sort(() => Math.random() - 0.5);

        return card_list;
    }
}

