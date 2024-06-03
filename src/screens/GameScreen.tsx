import React, { useState, useEffect } from 'react';
import { Pressable, View, Text } from 'react-native';
import { createScreen } from '@/components/createScreen';
import { Game } from '@/components/game';
import { ResultModal } from '@/components/game/resultModal';
import { Card } from '@/types';

export const GameScreen = createScreen('Game', ({ route, navigation }) => {
  const { level } = route.params;
  const [game] = useState(new Game(level));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cards, setCards] = useState<Card[]>(game.getCards());

  useEffect(() => {
    console.log('Game Screen - Level', level);
    if (level !== game.getLevel()) {
      console.log('Next level');
      game.nextLevel();
      setCards([...game.getCards()]);
    }
  }, [level]);

  const goToNextLevel = () => {
    navigation.navigate('Game', { level: level + 1 });
    setIsModalVisible(false);
  };

  const handleCardPress = async (card: Card) => {
    if (card.canFlip) {
      await game.flipCard(card).then(() => {
        setCards([...game.getCards()]);
        console.log('Cards', cards);
      });

      if (game.checkWin()) {
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
        {cards.map((card, index) => (
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
