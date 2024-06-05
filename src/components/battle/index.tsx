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
  state: 'battle' | 'victory' | 'defeat';
  stage: number;
  turn: number;
  log: string[];
  characters: Character[];
  currentCharacter: number | null;
  party: number[];
  enemies: number[];
  queue: number[];
  currentTarget: number | null;
  initBattle: (party: Character[], enemies: Character[]) => void;
  nextTurn: () => void;
  nextCharacter: () => void;
  attack: () => void;
  onDeath: (id: number) => void;
  checkEnd: () => void;
};

export const useBattleStore = create<BattleState>((set, get) => ({
  state: 'battle',
  stage: 0,
  turn: 0,
  log: [],
  characters: [],
  party: [],
  enemies: [],
  queue: [],
  currentCharacter: null,
  currentTarget: null,
  
  initBattle: (party, enemies) => {
    set({
      stage: 1,
      turn: 0,
      characters: [...party, ...enemies],
      party: party.map((c) => c.id),
      enemies: enemies.map((e) => e.id),
      queue: [],
      currentCharacter: null,
      currentTarget: null,
      log: ['The battle has begun'],
    });
  },

  nextTurn: () => {
    console.log('Store: Next Turn');
    set((state) => {
      const turn = state.turn + 1;
      const queue = [...state.characters].sort((a, b) => a.spd.current - b.spd.current).map((c) => c.id);
      console.log(`Queue: ${queue}`)
      const currentCharacter = null;
      const currentTarget = null;
      return {
        ...state,
        turn,
        queue,
        currentCharacter,
        currentTarget,
      };
    });
  },

  nextCharacter: () => {
    console.log('Store: Next Character');
    set((state) => {
      const currentCharacter: number = state.queue.pop() as number;
      const currentTarget = state.party.includes(currentCharacter)
          ? state.enemies[0]
          : state.party[0]

      return {
        ...state,
        currentCharacter,
        currentTarget,
      }
    });
  },

  attack: () => {
    set((state) => {
      const attacker = state.currentCharacter;
      const target = state.currentTarget;
      if (!attacker || !target) return state;
  
      const damage = Math.max(
        state.characters.find((c) => c.id === attacker)?.atk.current || 0,
        0
      );
  
      const targetCharacter = state.characters.find((c) => c.id === target);
      if (!targetCharacter) return state;
  
      const updatedTarget = {
        ...targetCharacter,
        hp: {
          ...targetCharacter.hp,
          current: Math.max(targetCharacter.hp.current - damage, 0),
        },
      };
  
      return {
        ...state,
        characters: state.characters.map((c) =>
          c.id === target ? updatedTarget : c
        ),
        log: [
          ...state.log,
          `${state.characters.find((c) => c.id === attacker)?.name} attacked ${
            targetCharacter.name
          } for ${damage} damage`,
        ],
      };
    });

    const target = get().currentTarget;
    const targetCharacter = get().characters.find((c) => c.id === target) as Character;
    if (target && targetCharacter.hp.current <= 0) {
      get().onDeath(target);
    }
  },

  onDeath: (id) => {
    console.log(`Store: Character ${id} has died`);
    const { name } = get().characters.find((c) => c.id === id) as Character;
    
    set((state) => {
      return {
        ...state,
        characters: state.characters.filter((c) => c.id !== id),
        party: state.party.filter((p) => p !== id),
        enemies: state.enemies.filter((e) => e !== id),
        queue: state.queue.filter((q) => q !== id),
        log: [...state.log, `${name} has been defeated`],
      };
    });
    get().checkEnd();
  },

  checkEnd: () => {
    const party = get().party;
    const enemies = get().enemies;

    if (party.length === 0) {
      console.log('Store: Defeat');
      set({
        state: 'defeat',
        log: ['You have been defeated'],
      });
    } else if (enemies.length === 0) {
      console.log('Store: Victory');
      set({
        state: 'victory',
        log: ['You have emerged victorious'],
      });
    }
  },
}));