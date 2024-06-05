import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useBattleStore } from '@/components/battle';

const sampleParty = [
  {
    id: 1,
    name: 'Hero',
    lvl: 10,
    hp: { current: 100, max: 100 },
    atk: { current: 15, max: 15 },
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

  const handleInitBattle = () => {
    battle.initBattle(sampleParty, sampleEnemies);
  };

  const handleNextCharacter = () => {
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
        <Button title="Init Battle" onPress={handleInitBattle} />
        <Button title="Next Character" onPress={handleNextCharacter} />

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
          battle.characters[enemy-1] === undefined ? null : (
            <Text key={battle.characters.find((c) => c.id === enemy)?.id}>
              {battle.characters.find((c) => c.id === enemy)?.name} (HP: {battle.characters.find((c) => c.id === enemy)?.hp.current}/{battle.characters.find((c) => c.id === enemy)?.hp.max})
            </Text>
          )
        ))}

        <Text>Party</Text>
        {battle.party.length > 0 &&
          battle.party.map((character) => (
            <Text key={battle.characters.find((c) => c.id === character)?.id}>
              {battle.characters.find((c) => c.id === character)?.name} (HP: {battle.characters.find((c) => c.id === character)?.hp.current}/{battle.characters.find((c) => c.id === character)?.hp.max})
            </Text>
          ))}
      </View>
    </View>
  );
};