import { createLevel } from "@/components/game/createLevel";
import { Card } from "@/types";

export class Game {
    private level: number;
    private cards: Card[];
    private flippedCards: Card[];

    constructor(level: number) {
        this.level = level;
        this.cards = [];
        this.flippedCards = [];
        this.init();
    }

    private init() {
        this.cards = createLevel(this.level);
        console.log("init cards", this.cards);
    }

    public nextLevel() {
        this.level += 1;
        this.init();
    }

    public async flipCard(card: Card) {
        console.log("Card flipped", card.id)

        this.flippedCards.push(card);
        this.cards = this.cards.map(c => {
            if (c.id === card.id) {
                return { ...c, isFlipped: true, canFlip: false };
            }
            return c;
        });

        if (this.flippedCards.length === 2) {
            await this.checkMatch();
        }

        await delay(500);
    }

    private async checkMatch() {
        const [firstCard, secondCard] = this.flippedCards;

        if (firstCard.value === secondCard.value) {
            console.log("Matched", firstCard.value);
            this.cards = this.cards.map(card => {
                if (card.value === firstCard.value) {
                    return { ...card, isFlipped: true, canFlip: false };
                }
                return card;
            });
        } else {
            console.log("Not matched", firstCard.value, secondCard.value);
            
            await delay(1000).then(() => {
                this.cards = this.cards.map(card => {
                    if (card.id === firstCard.id || card.id === secondCard.id) {
                        return { ...card, isFlipped: false, canFlip: true };
                    }
                    return card;
                });
            });
        }

        this.flippedCards = [];
    }

    public getCards() {
        return this.cards;
    }

    public getLevel() {
        return this.level;
    }

    public checkWin() {
        return this.cards.every(card => !card.canFlip);
    }
}

const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));