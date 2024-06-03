import React, { useState, useEffect } from 'react';
import { Pressable, View, Text } from 'react-native';
import { createScreen } from '@/components/createScreen';
import { useGame } from '@/components/game';
import { ResultModal } from '@/components/game/resultModal';
import { Card } from '@/types';

export const GameScreen = createScreen('Game', ({ route, navigation }) => {
  const { level } = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { init, level: gamelevel, cards, flipCard, checkWin } = useGame();

  useEffect(() => {
    console.log('Game Screen - Level', level);
    if (level !== gamelevel) {
      console.log('Next level');
      init(level);
    }
  }, [level]);

  const goToNextLevel = () => {
    navigation.navigate('Game', { level: level + 1 });
    setIsModalVisible(false);
  };

  const handleCardPress = async (card: Card) => {
    if (card.canFlip) {
      await flipCard(card);

      if (checkWin()) {
        setIsModalVisible(true);
      }
    }
  }

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text className="text-white text-2xl mb-8">
        Game Screen - Level {level}
      </Text>

      {/* Display cards in a matrix */}
      <View className="flex flex-wrap justify-center">
        {cards.map((card: Card, index: any) => (
          <Pressable
            key={index}
            className="m-2"
            onPress={() => handleCardPress(card)}
          >
            <View className={`w-20 h-20 bg-white flex items-center justify-center ${card.isFlipped ? 'bg-blue-500' : ''}`}>
              <Text className="text-black text-lg font-bold">
                {card.isFlipped ? card.value : 'X'}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Modal for displaying win message */}
      <ResultModal
        visible={isModalVisible}
        onNextLevel={goToNextLevel}
        onClose={closeModal}
      />
    </View>
  );
});