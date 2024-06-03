import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

export const ResultModal = ({ visible, onNextLevel, onClose }: { visible: boolean, onNextLevel: () => void, onClose: () => void }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black bg-opacity-50">
        <View className="bg-white p-8 rounded-lg">
          <Text className="text-black text-2xl mb-4 font-bold">You Won!</Text>
          <Pressable style={[styles.button, styles.nextButton]} onPress={onNextLevel}>
            <Text className="text-white text-lg font-bold">Next Level</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    width: 120,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: 'green',
    marginTop: 20,
  },
});