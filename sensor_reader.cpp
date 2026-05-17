#include "sensor_reader.h"
#include "config.h"
#include <Arduino.h>

extern DeviceState deviceState;

void read_temperature() {
  // Read analog value from temperature sensor
  int raw_value = analogRead(TEMPERATURE_SENSOR_PIN);
  
  // Convert ADC reading to temperature (simplified for DHT/LM35 equivalent)
  // For LM35: 10mV per degree Celsius
  // For 12-bit ADC (0-4095): 3.3V / 4095 = 0.805mV per step
  // Temperature = (ADC * 3.3 / 4095) / 0.01 - 40
  deviceState.temperature = (raw_value * 3.3 / 4095 / 0.01) - 40;
  deviceState.temperature += TEMP_SENSOR_CALIBRATION;
  
  // Check for temperature alert
  if (deviceState.temperature > TEMPERATURE_MAX) {
    Serial.print("ALERT: Temperature too high! ");
    Serial.print(deviceState.temperature);
    Serial.println("°C");
    // Trigger emergency shutdown or alert
  }
  
  Serial.print("Temperature: ");
  Serial.print(deviceState.temperature);
  Serial.println("°C");
}

void read_gas_level() {
  // Read analog value from gas sensor
  int raw_value = analogRead(GAS_SENSOR_PIN);
  
  // Convert to percentage (0-100%)
  deviceState.gas_level = map(raw_value, 0, 4095, 0, 100);
  
  // Check for gas leak alert
  if (deviceState.gas_level > GAS_SENSOR_THRESHOLD) {
    Serial.print("ALERT: Gas detected! Level: ");
    Serial.print(deviceState.gas_level);
    Serial.println("%");
    // Trigger alert and ventilation
  }
  
  Serial.print("Gas Level: ");
  Serial.print(deviceState.gas_level);
  Serial.println("%");
}

float read_single_temperature() {
  int raw_value = analogRead(TEMPERATURE_SENSOR_PIN);
  float temp = (raw_value * 3.3 / 4095 / 0.01) - 40;
  return temp + TEMP_SENSOR_CALIBRATION;
}

int read_single_gas_level() {
  int raw_value = analogRead(GAS_SENSOR_PIN);
  return map(raw_value, 0, 4095, 0, 100);
}
