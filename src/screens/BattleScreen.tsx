import React, { useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useBattleStore } from '@/components/battle';

const sampleParty = [
  {
    id: 1,
    name: 'Hero',
    lvl: 10,
    hp: { current: 100, max: 100 },
    atk: { current: 30, max: 30 },
    def: { current: 10, max: 10 },
    spd: { current: 5, max: 5 },
  },
];

const sampleEnemies = [
    {
      id: 2,
      name: 'Goblin',
      lvl: 5,
      hp: { current: 50, max: 50 },
      atk: { current: 8, max: 8 },
      def: { current: 5, max: 5 },
      spd: { current: 4, max: 4 },
    },
    {
      id: 3,
      name: 'Orc',
      lvl: 7,
      hp: { current: 70, max: 70 },
      atk: { current: 10, max: 10 },
      def: { current: 7, max: 7 },
      spd: { current: 3, max: 3 },
    },
  ];

export function BattleScreen() {
  const battle = useBattleStore((state) => state);
  const isPlayerTurn = battle.currentCharacter && battle.party.includes(battle.currentCharacter) || false;
  const isEnemyTurn = battle.currentCharacter && battle.enemies.includes(battle.currentCharacter) || false;
  
  useEffect(() => {
    const handleTurn = async () => {
      if (isEnemyTurn) {
        console.log('Battle: Enemy Turn');
        await new Promise((resolve) => setTimeout(resolve, 3000));
        battle.attack();
        battle.nextCharacter();
      } else if (battle.queue.length === 0 && battle.turn > 0) {
          battle.nextTurn();
          console.log('Battle: Loading next turn');
          await new Promise((resolve) => setTimeout(resolve, 3000));
          battle.nextCharacter();
      } else if (battle.queue.length === 0 && battle.turn === 0) {
          console.log('Battle: Initializing battle');
          battle.initBattle(sampleParty, sampleEnemies);
          battle.nextTurn();
          await new Promise((resolve) => setTimeout(resolve, 3000));
          battle.nextCharacter();
      } else {
          console.log('Battle: Player Turn');
      }
    }
    if (battle.state === 'battle') {
      handleTurn();
    }
  }, [battle.currentCharacter]);

  /* handleAction, then */

  const handleAttack = async () => {
    battle.attack();
    battle.nextCharacter();
  };

  return (
    <View className='flex-1 p-4'>
      <View className='justify-start'>
        <Text>Stage: {battle.stage}</Text>
        <Text>Current Turn: {battle.turn}</Text>
        <Text>Current Character: {battle.currentCharacter && battle.characters.find((c) => c.id === battle.currentCharacter)?.name}</Text>
        <Text>Current Target: {battle.currentTarget && battle.characters.find((c) => c.id === battle.currentTarget)?.name}</Text>
        <Text>Queue: {battle.queue.map((character) => character && battle.characters.find((c) => c.id === character)?.name).join(', ')}</Text>
      
        <Text>Log:</Text>
        <FlatList
          data={battle.log}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Text>{item}</Text>}
        />
      </View>

      <View className='justify-center'>
        <Text>Enemies:</Text>
        {battle.enemies.length > 0 && battle.enemies.map((enemy) => (
          <Text key={battle.characters.find((c) => c.id === enemy)?.id}>
            {battle.characters.find((c) => c.id === enemy)?.name} (HP: {battle.characters.find((c) => c.id === enemy)?.hp.current}/{battle.characters.find((c) => c.id === enemy)?.hp.max})
          </Text>
        ))}

        <Text>Party</Text>
        {battle.party.length > 0 && battle.party.map((character) => (
          <Text key={battle.characters.find((c) => c.id === character)?.id}>
            {battle.characters.find((c) => c.id === character)?.name} (HP: {battle.characters.find((c) => c.id === character)?.hp.current}/{battle.characters.find((c) => c.id === character)?.hp.max})
          </Text>
          ))}
      </View>

      {isPlayerTurn && (
        <Button title="Attack" onPress={handleAttack} />
      )}
    </View>
  );
};