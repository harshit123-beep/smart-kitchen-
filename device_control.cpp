#include "device_control.h"
#include "config.h"
#include <Arduino.h>

void control_cooker(bool state) {
  if (state) {
    digitalWrite(COOKER_RELAY_PIN, HIGH);
    Serial.println("Cooker turned ON");
  } else {
    digitalWrite(COOKER_RELAY_PIN, LOW);
    Serial.println("Cooker turned OFF");
  }
}

void set_cooker_temperature(float target_temp) {
  // Implementation for temperature control using PID
  // This would send PWM signals to a heating element controller
  Serial.print("Setting cooker temperature to: ");
  Serial.print(target_temp);
  Serial.println("°C");
  
  // Placeholder for PID control logic
  // In real implementation, would adjust PWM based on current vs target temp
}

void emergency_shutdown() {
  Serial.println("EMERGENCY SHUTDOWN!");
  digitalWrite(COOKER_RELAY_PIN, LOW);
  digitalWrite(LED_PIN, HIGH); // Turn on alert LED
}
