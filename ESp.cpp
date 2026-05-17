#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include "config.h"
#include "mqtt_handler.h"
#include "device_control.h"
#include "sensor_reader.h"
#include "ota_update.h"

// WiFi and MQTT clients
WiFiClient espClient;
PubSubClient mqttClient(espClient);

// Device state
DeviceState deviceState;

// Function prototypes
void setup_wifi();
void reconnect_mqtt();
void handle_mqtt_message(char* topic, byte* payload, unsigned int length);
void publish_telemetry();

void setup() {
  Serial.begin(115200);
  delay(100);
  
  Serial.println("\n\n=== Smart Kitchen IoT Device ===");
  Serial.println("Initializing...");
  
  // Initialize GPIO pins
  pinMode(COOKER_RELAY_PIN, OUTPUT);
  pinMode(COOKER_BUTTON_PIN, INPUT_PULLUP);
  pinMode(TEMPERATURE_SENSOR_PIN, INPUT);
  pinMode(GAS_SENSOR_PIN, INPUT);
  
  // Initialize device state
  deviceState.device_id = DEVICE_ID;
  deviceState.device_name = DEVICE_NAME;
  deviceState.device_type = DEVICE_TYPE;
  deviceState.is_online = false;
  deviceState.cooker_state = false;
  deviceState.temperature = 0;
  deviceState.gas_level = 0;
  
  // Setup WiFi
  setup_wifi();
  
  // Setup MQTT
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  mqttClient.setCallback(handle_mqtt_message);
  
  // Setup OTA
  setup_ota();
  
  Serial.println("Setup complete!");
}

void loop() {
  // Handle OTA updates
  ArduinoOTA.handle();
  
  // Ensure WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected, reconnecting...");
    setup_wifi();
  }
  
  // Ensure MQTT connection
  if (!mqttClient.connected()) {
    reconnect_mqtt();
  }
  
  // Maintain MQTT connection
  mqttClient.loop();
  
  // Handle manual button press
  if (digitalRead(COOKER_BUTTON_PIN) == LOW) {
    delay(50); // Debounce
    if (digitalRead(COOKER_BUTTON_PIN) == LOW) {
      deviceState.cooker_state = !deviceState.cooker_state;
      control_cooker(deviceState.cooker_state);
      publish_status();
      delay(500); // Debounce delay
    }
  }
  
  // Read sensors periodically
  static unsigned long last_sensor_read = 0;
  if (millis() - last_sensor_read > SENSOR_READ_INTERVAL) {
    read_temperature();
    read_gas_level();
    
    // Publish telemetry data
    publish_telemetry();
    
    last_sensor_read = millis();
  }
  
  // Publish status periodically
  static unsigned long last_status_publish = 0;
  if (millis() - last_status_publish > STATUS_PUBLISH_INTERVAL) {
    publish_status();
    last_status_publish = millis();
  }
  
  delay(10);
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to WiFi: ");
  Serial.println(WIFI_SSID);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  Serial.println();
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("WiFi connected");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    deviceState.is_online = true;
  } else {
    Serial.println("WiFi connection failed!");
    deviceState.is_online = false;
  }
}

void reconnect_mqtt() {
  int attempts = 0;
  while (!mqttClient.connected() && attempts < 5) {
    Serial.print("Attempting MQTT connection...");
    
    // Create a random client ID
    String clientId = "SK-";
    clientId += String(DEVICE_ID);
    
    // Attempt to connect
    if (mqttClient.connect(clientId.c_str(), MQTT_USER, MQTT_PASSWORD)) {
      Serial.println("connected");
      
      // Subscribe to control topics
      mqttClient.subscribe("kitchen/device/*/control");
      mqttClient.subscribe("kitchen/device/*/settings");
      
      // Publish online status
      publish_status();
    } else {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
    attempts++;
  }
}

void handle_mqtt_message(char* topic, byte* payload, unsigned int length) {
  // Convert payload to string
  String message;
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(" -> ");
  Serial.println(message);
  
  // Parse and handle control commands
  if (String(topic).indexOf("control") > 0) {
    if (message == "ON") {
      deviceState.cooker_state = true;
      control_cooker(true);
    } else if (message == "OFF") {
      deviceState.cooker_state = false;
      control_cooker(false);
    } else if (message.startsWith("TEMP:")) {
      int target_temp = message.substring(5).toInt();
      Serial.print("Setting temperature to: ");
      Serial.println(target_temp);
      // Implement PID temperature control
    }
  }
  
  publish_status();
}

void publish_status() {
  StaticJsonDocument<256> doc;
  doc["device_id"] = deviceState.device_id;
  doc["device_name"] = deviceState.device_name;
  doc["device_type"] = deviceState.device_type;
  doc["is_online"] = deviceState.is_online;
  doc["cooker_state"] = deviceState.cooker_state ? "ON" : "OFF";
  doc["temperature"] = deviceState.temperature;
  doc["gas_level"] = deviceState.gas_level;
  doc["uptime"] = millis() / 1000;
  doc["signal_strength"] = WiFi.RSSI();
  doc["timestamp"] = millis();
  
  String topic = "kitchen/device/";
  topic += DEVICE_ID;
  topic += "/status";
  
  String payload;
  serializeJson(doc, payload);
  
  mqttClient.publish(topic.c_str(), payload.c_str());
}

void publish_telemetry() {
  StaticJsonDocument<256> doc;
  doc["device_id"] = deviceState.device_id;
  doc["temperature"] = deviceState.temperature;
  doc["gas_level"] = deviceState.gas_level;
  doc["timestamp"] = millis();
  
  String topic = "kitchen/device/";
  topic += DEVICE_ID;
  topic += "/telemetry";
  
  String payload;
  serializeJson(doc, payload);
  
  mqttClient.publish(topic.c_str(), payload.c_str());
}
