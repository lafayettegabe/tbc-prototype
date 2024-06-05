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
};

export const useBattleStore = create<BattleState>((set, get) => ({
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

    console.log(`
      characters: ${JSON.stringify(get().characters)}
      party: ${JSON.stringify(get().party)}
      enemies: ${JSON.stringify(get().enemies)}
    `)

    get().nextTurn();
  },

  nextTurn: () => {
    console.log('Next Turn');
    set((state) => {
      const turn = state.turn + 1;
      const queue = [...state.characters].sort((a, b) => a.spd.current - b.spd.current).map((c) => c.id);
      console.log(`Queue: ${queue}`)
      const currentCharacter: number = queue.pop() as number;
      console.log(`Queue: ${queue}`)
      
      const currentTarget = state.party.includes(currentCharacter)
          ? state.enemies[0]
          : state.party[0]
      
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
    console.log('Next Character');
    if (get().queue.length === 0) {
      get().nextTurn();
    } else {
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
    }
  },
  /*
  attack: () => {
    set((state) => {
      const attacker = state.currentCharacter;
      const target = state.currentTarget;
      if (!attacker || !target) return state;

      const damage = Math.max(state.characters[attacker].atk.current - state.characters[target].def.current, 0);

      const updatedTarget = {
        ...state.characters[target],
        hp: {
          ...state.characters[target].hp,
          current: Math.max(state.characters[target].hp.current - damage, 0),
        },
      };

      if (updatedTarget.hp.current === 0) {
        //state.onCharacterDeath(target);
        return {
          ...state,
          characters: state.characters.map((c) => (c.id === target ? updatedTarget : c)),
          log: [...state.log, `${state.characters[attacker].name} attacked ${state.characters[target].name} for ${damage} damage`],
        };
      } else {
        return {
          ...state,
          characters: state.characters.map((c) => (c.id === target ? updatedTarget : c)),
          log: [...state.log, `${state.characters[attacker].name} attacked ${state.characters[target].name} for ${damage} damage`],
        };
      }
    });
  },

  defend: () => {
    set((state) => {
      const defender = state.currentCharacter;
      if (!defender) return state;

      console.log(`${state.characters[defender].name} defended`);

      return {
        ...state,
        log: [...state.log, `${state.characters[defender].name} defended`],
      };
    });
  },
  
  onCharacterDeath: (character) => {
    set((state) => {
      const updatedCharacters = state.characters.filter((c) => c.id !== character.id);
      if (updatedCharacters.length === 0) {
        state.onBattleEnd();
      }

      return {
        ...state,
        characters: updatedCharacters,
        log: [...state.log, `${character.name} has died`],
      };
    });
  },
  
  onEnemyDeath: (enemy) => {
    set((state) => {
      const updatedEnemies = state.enemies.filter((e) => e !== enemy.id);
      if (updatedEnemies.length === 0) {
        state.onBattleEnd();
      }

      return {
        ...state,
        enemies: updatedEnemies,
        log: [...state.log, `${enemy.name} has died`],
      };
    });
  },
  
  onBattleEnd: () => {
    set({
      stage: 0,
      turn: 0,
      party: [],
      enemies: [],
      queue: [],
      currentCharacter: null,
      currentTarget: null,
      log: ['The battle has ended'],
    });
  },
  */
}));