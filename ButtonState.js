import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

const EnergyButtonSection = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleCalculate = () => {
    setIsCalculating(true);
    // Simulate processing
    setTimeout(() => {
      setIsCalculating(false);
      alert('Energy calculated!');
    }, 2000);
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      alert('Device saved!');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isCalculating && styles.buttonDisabled]}
        onPress={handleCalculate}
        disabled={isCalculating}
      >
        {isCalculating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Calculate Energy</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, isSaving && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Energy</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default EnergyButtonSection;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    gap: 10,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A9A9A9',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
