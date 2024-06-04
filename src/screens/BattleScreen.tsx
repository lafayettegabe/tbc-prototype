import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useBattleStore } from '@/components/game';

export function BattleScreen() {
  const battle = useBattleStore((state) => state);

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
  ];

  const handleInitBattle = () => {
    battle.initBattle(sampleParty, sampleEnemies);
  };

  const handleNextTurn = () => {
    battle.nextTurn();
  };

  return (
    <View style={styles.container}>
      <Text>Stage: {battle.stage}</Text>
      <Text>Current Turn: {battle.currentTurn}</Text>
      <Text>Current Character: {battle.currentCharacter?.name}</Text>
      <Text>Current Target: {battle.currentTarget?.name}</Text>
      <Button title="Init Battle" onPress={handleInitBattle} />
      <Button title="Next Turn" onPress={handleNextTurn} />

      <Button title="Attack" onPress={battle.attack} />
      <Button title="Defend" onPress={battle.defend} />

      <Text>Party:</Text>
      <FlatList
        data={battle.party}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>
            {item.name} (HP: {item.hp.current}/{item.hp.max})
          </Text>
        )}
      />

      <Text>Enemies:</Text>
      <FlatList
        data={battle.enemies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>
            {item.name} (HP: {item.hp.current}/{item.hp.max})
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});