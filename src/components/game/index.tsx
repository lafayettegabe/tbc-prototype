import { createLevel } from "@/components/game/createLevel";
import { Card } from "@/types";

import { create } from "zustand"

type GameState = {
    level: number;
    cards: Card[];
    flippedCards: Card[];
    init: (level: number) => void;
    flipCard: (card: Card) => void;
    checkMatch: (flippedCards: Card[], cards: Card[]) => void;
    checkWin: () => boolean;
}

export const useGame: any = create<GameState>((set) => ({
    level: 1,
    cards: createLevel(1),
    flippedCards: [],
    init: (level: number) => {
        set({ level, cards: createLevel(level), flippedCards: [] });
    },
    flipCard: (card: Card) => {
        set((state) => {
            const flippedCards = [...state.flippedCards, card];
            if (flippedCards.length > 2) {
                return state;
            }
            const cards = state.cards.map(c => {
                if (c.id === card.id) {
                    return { ...c, isFlipped: true, canFlip: false };
                }
                return c;
            });

            if (flippedCards.length === 2) {
                const { checkMatch } = useGame.getState();
                setTimeout(() => checkMatch(flippedCards, cards), 500);
            }

            return { ...state, flippedCards, cards };
        });
    },
    checkMatch: (flippedCards: Card[], cards: Card[]) => {
        const [firstCard, secondCard] = flippedCards;

        if (firstCard.value === secondCard.value) {
            console.log("Matched", firstCard.value);
            const newCards = cards.map(card => {
                if (card.value === firstCard.value) {
                    return { ...card, isFlipped: true, canFlip: false };
                }
                return card;
            });

            set((state) => ({ ...state, cards: newCards }));
        } else {
            console.log("Not matched", firstCard.value, secondCard.value);
            setTimeout(() => {
                const newCards = cards.map(card => {
                    if (card.id === firstCard.id || card.id === secondCard.id) {
                        return { ...card, isFlipped: false, canFlip: true };
                    }
                    return card;
                });

                set((state) => ({ ...state, cards: newCards }));
            }, 100);
        }

        set((state) => ({ ...state, flippedCards: [] }));
    },
    checkWin: () => {
        return useGame.getState().cards.every((card: Card) => !card.canFlip);
    }
}));