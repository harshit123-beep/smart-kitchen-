#ifndef CONFIG_H
#define CONFIG_H

// WiFi Configuration
#define WIFI_SSID "YOUR_SSID"
#define WIFI_PASSWORD "YOUR_PASSWORD"

// MQTT Configuration
#define MQTT_BROKER "broker.example.com"
#define MQTT_PORT 8883
#define MQTT_USER "mqtt_user"
#define MQTT_PASSWORD "mqtt_password"

// Device Configuration
#define DEVICE_ID "SKD-001"
#define DEVICE_NAME "Smart Cooker - Kitchen A"
#define DEVICE_TYPE "COOKER"
#define DEVICE_LOCATION "Kitchen A"

// GPIO Pins
#define COOKER_RELAY_PIN 12          // GPIO12 for relay control
#define COOKER_BUTTON_PIN 14         // GPIO14 for manual button
#define TEMPERATURE_SENSOR_PIN 36    // GPIO36 (ADC0) for temperature
#define GAS_SENSOR_PIN 39            // GPIO39 (ADC3) for gas sensor
#define LED_PIN 2                    // GPIO2 for status LED

// Timing Configuration (milliseconds)
#define SENSOR_READ_INTERVAL 5000    // Read sensors every 5 seconds
#define STATUS_PUBLISH_INTERVAL 10000 // Publish status every 10 seconds
#define MQTT_RECONNECT_INTERVAL 5000  // Try reconnect every 5 seconds
#define OTA_CHECK_INTERVAL 60000      // Check for OTA updates every minute

// Sensor Configuration
#define TEMP_SENSOR_CALIBRATION 0    // Temperature calibration offset
#define GAS_SENSOR_THRESHOLD 400     // Gas alert threshold
#define TEMPERATURE_MAX 100          // Maximum safe temperature in Celsius

// OTA Configuration
#define OTA_ENABLED true
#define OTA_PORT 3232
#define OTA_PASSWORD "your_ota_password"

// Firmware Version
#define FIRMWARE_VERSION "1.0.0"
#define BUILD_NUMBER "001"

// Device Features
#define FEATURE_COOKER_CONTROL true
#define FEATURE_TEMPERATURE_MONITORING true
#define FEATURE_GAS_DETECTION true
#define FEATURE_SCHEDULED_CONTROL true
#define FEATURE_OTA_UPDATE true

// Debug Configuration
#define DEBUG_MODE true
#define SERIAL_BAUD 115200

// JSON Buffer Size
#define JSON_BUFFER_SIZE 256

// Retry Configuration
#define WIFI_MAX_RETRY 20
#define MQTT_MAX_RETRY 5

// Struct for device state
struct DeviceState {
  char device_id[32];
  char device_name[64];
  char device_type[32];
  bool is_online;
  bool cooker_state;
  float temperature;
  int gas_level;
};

#endif // CONFIG_H
