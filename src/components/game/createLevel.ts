import { Card } from '@/types';

export function createLevel(level: number) {
    const cards = Array.from({ length: level * 2 }, (_, index) => ({
        id: index,
        value: Math.floor(index / 2),
        isFlipped: false,
        canFlip: true,
    })) as Card[];

    return cards.sort(() => Math.random() - 0.5);
}