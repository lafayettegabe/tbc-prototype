import { create } from 'zustand';

type Character = {
  id: number;
  name: string;
  lvl: number;
  hp: {
    current: number;
    max: number;
  };
  atk: {
    current: number;
    max: number;
  };
  def: {
    current: number;
    max: number;
  };
  spd: {
    current: number;
    max: number;
  };
};

type BattleState = {
  stage: number;
  party: Character[];
  enemies: Character[];
  currentTurn: number;
  currentCharacter: Character;
  queue: Character[];
  currentTarget: Character;
  initBattle: (party: Character[], enemies: Character[]) => void;
  nextTurn: () => void;
  nextCharacter: () => void;
  attack: () => void;
  defend: () => void;
  onCharacterDeath: (character: Character) => void;
  onEnemyDeath: (enemy: Character) => void;
  onBattleEnd: () => void;
};

export const useBattleStore = create<BattleState>((set, get) => ({
  stage: 0,
  party: [],
  enemies: [],
  currentTurn: 0,
  queue: [],
  currentCharacter: {} as Character,
  currentTarget: {} as Character,
  initBattle: (party, enemies) => {
    set((state) => ({
      ...state,
      stage: 1,
      party,
      enemies,
      currentTurn: 0,
      currentCharacter: party[0],
      currentTarget: enemies[0],
    }));
  },
  nextTurn: () => {
    set((state) => {
      state.party.forEach((character) => {
        state.queue.push(character);
      });
      state.enemies.forEach((enemy) => {
        state.queue.push(enemy);
      });
      state.queue.sort((a, b) => b.spd.current - a.spd.current);

      const currentTurn = state.currentTurn + 1;
      const currentCharacter = state.queue.pop() as Character;

      return {
        ...state,
        currentTurn,
        currentCharacter,
      };
    });
  },
  nextCharacter: () => {
    set((state) => {
      let currentCharacter;
      if (state.queue.length === 0) {
        state.nextTurn();
      } else {
        currentCharacter = state.queue.pop() as Character;
      }
      return {
        ...state,
        currentCharacter,
      };
    });
  },
  attack: () => {
    set((state) => {
      const attacker = state.currentCharacter;
      const target = state.currentTarget;
      const damage = attacker.atk.current - target.def.current;
      target.hp.current = Math.max(target.hp.current - damage, 0);
      if (target.hp.current <= 0) {
        if (state.enemies.includes(target)) {
          state.onEnemyDeath(target);
        } else {
          state.onCharacterDeath(target);
        }
      }
      return {
        ...state,
        currentTarget: target,
      };
    });
  },
  defend: () => {
    set((state) => {
      const defender = state.currentCharacter;
      defender.def.current += 5; // Example buff
      return {
        ...state,
        currentCharacter: defender,
      };
    });
  },
  onCharacterDeath: (character) => {
    set((state) => {
      state.party = state.party.filter((c) => c.id !== character.id);
      if (state.party.length === 0) {
        state.onBattleEnd();
      }
      return {
        ...state,
      };
    });
  },
  onEnemyDeath: (enemy) => {
    set((state) => {
      state.enemies = state.enemies.filter((e) => e.id !== enemy.id);
      if (state.enemies.length === 0) {
        state.onBattleEnd();
      }
      return {
        ...state,
      };
    });
  },
  onBattleEnd: () => {
    set((state) => ({
      ...state,
      stage: 0,
      party: [],
      enemies: [],
      currentTurn: 0,
      queue: [],
      currentCharacter: {} as Character,
      currentTarget: {} as Character,
    }));
  },
}));