/**********************************************************************************
 *  ESP8266 NodeMCU + Blynk IoT
 *  2 x Active-LOW Relays + 2 x Latched Switches (TOGGLE MODE)
 *  Manual Switch Control + Blynk App Control + WiFi Status LED + EEPROM State Memory
 *  
 *  FEATURES:
 *  - Toggle relays with manual switches (press = toggle)
 *  - Control via Blynk app
 *  - WiFi status indicator LED
 *  - EEPROM state persistence
 *  - Real-time feedback from switches to app
 *  - No WiFi blocking (switches work offline)
 *
 *  HARDWARE:
 *  - Relay1: D5 (GPIO14) - Active LOW
 *  - Switch1: D1 (GPIO5) - Latched to GND, INPUT_PULLUP
 *  - WiFi LED: D0 (GPIO16) - Active HIGH
 *
 *  BLYNK SETUP:
 *  - V1: Relay1 Control
 *  - V2: Relay2 Control (if adding second relay)
 *
 ***********************************************************************************/

// ============ BLYNK CREDENTIALS ============
#define BLYNK_TEMPLATE_ID "TMPL35jFMnCZn"
#define BLYNK_TEMPLATE_NAME "nodemcu2relay"
#define BLYNK_AUTH_TOKEN "Zve-GrmX0x7qD8Hqbu0AfjjjbsSA61wq"

// ============ WiFi CREDENTIALS ============
char ssid[] = "ritik";
char pass[] = "12345678";

// ============ INCLUDE LIBRARIES ============
#include <ESP8266WiFi.h>
#include <BlynkSimpleEsp8266.h>
#include <EEPROM.h>

// ============ BLYNK AUTH TOKEN ============
char auth[] = BLYNK_AUTH_TOKEN;

// ============ PIN DEFINITIONS ============
#define RELAY1_PIN    D5     // GPIO14 - Relay 1
#define SWITCH1_PIN   D1     // GPIO5  - Switch 1 (Latched to GND)
#define WIFI_LED_PIN  D0     // GPIO16 - WiFi Status LED (Active HIGH)

// ============ RELAY LOGIC ============
#define RELAY_ON   LOW       // Active-LOW relay: LOW = ON
#define RELAY_OFF  HIGH      // Active-LOW relay: HIGH = OFF

// ============ BLYNK VIRTUAL PINS ============
#define VPIN_RELAY1  V1

// ============ EEPROM ADDRESSES ============
#define EEPROM_RELAY1_ADDR  0
#define EEPROM_SIZE         512

// ============ GLOBAL VARIABLES ============
bool relay1State = false;          // false = OFF, true = ON
bool lastSwitch1State = HIGH;      // Previous switch state (HIGH = released)
unsigned long switch1LastPress = 0; // Timestamp of last switch press
const int DEBOUNCE_DELAY = 50;     // 50ms debounce time

bool wifiConnected = false;
bool blynkConnected = false;

BlynkTimer timer;

// ============ EEPROM FUNCTIONS ============

void initEEPROM() {
  EEPROM.begin(EEPROM_SIZE);
  delay(10);
  Serial.println(F("[EEPROM] Initialized"));
}

void loadRelayStatesFromEEPROM() {
  uint8_t r1 = EEPROM.read(EEPROM_RELAY1_ADDR);
  relay1State = (r1 == 1);

  Serial.print(F("[EEPROM] Loaded - Relay1: "));
  Serial.println(relay1State ? F("ON") : F("OFF"));
}

void saveRelayStatesToEEPROM() {
  EEPROM.write(EEPROM_RELAY1_ADDR, relay1State ? 1 : 0);
  EEPROM.commit();

  Serial.print(F("[EEPROM] Saved - Relay1: "));
  Serial.println(relay1State ? F("ON") : F("OFF"));
}

// ============ RELAY CONTROL FUNCTIONS ============

void applyRelayPin(bool state) {
  digitalWrite(RELAY1_PIN, state ? RELAY_ON : RELAY_OFF);
}

void setRelay1(bool newState, const char* source) {
  relay1State = newState;
  applyRelayPin(relay1State);

  Serial.print(F("[RELAY] Relay1 -> "));
  Serial.print(relay1State ? F("ON") : F("OFF"));
  Serial.print(F(" (Source: "));
  Serial.print(source);
  Serial.println(F(")"));

  // Send state to Blynk if connected
  if (Blynk.connected()) {
    Blynk.virtualWrite(VPIN_RELAY1, relay1State);
  }

  // Save to EEPROM
  saveRelayStatesToEEPROM();
}

void toggleRelay1(const char* source) {
  setRelay1(!relay1State, source);
}

// ============ SWITCH HANDLING ============

void handleSwitches() {
  bool currentSwitch1 = digitalRead(SWITCH1_PIN);

  // Detect state change
  if (currentSwitch1 != lastSwitch1State) {
    unsigned long currentTime = millis();

    // Debounce: ignore if less than DEBOUNCE_DELAY ms has passed
    if ((currentTime - switch1LastPress) > DEBOUNCE_DELAY) {
      lastSwitch1State = currentSwitch1;
      switch1LastPress = currentTime;

      // Only toggle on button PRESS (transition from HIGH to LOW)
      if (currentSwitch1 == LOW) {
        Serial.println(F("[SWITCH] Switch1 Pressed -> Toggling Relay1"));
        toggleRelay1("Switch1");
      }
    }
  }
}

// ============ WiFi & BLYNK STATUS ============

void checkConnectionStatus() {
  bool isWiFiConnected = (WiFi.status() == WL_CONNECTED);
  bool isBlynkConnected = Blynk.connected();

  // WiFi disconnected
  if (!isWiFiConnected) {
    wifiConnected = false;
    blynkConnected = false;
    digitalWrite(WIFI_LED_PIN, LOW);  // LED OFF
    Serial.println(F("[STATUS] WiFi Disconnected"));
    return;
  }

  wifiConnected = true;

  // WiFi connected, check Blynk
  if (!isBlynkConnected) {
    blynkConnected = false;
    digitalWrite(WIFI_LED_PIN, LOW);  // LED OFF
    Serial.println(F("[STATUS] WiFi OK, Blynk Disconnected"));
  } else {
    blynkConnected = true;
    digitalWrite(WIFI_LED_PIN, HIGH); // LED ON
    Serial.println(F("[STATUS] WiFi + Blynk Connected"));
  }
}

// ============ BLYNK EVENTS ============

// Called when Blynk connects to cloud
BLYNK_CONNECTED() {
  Serial.println(F("[BLYNK] Connected to Blynk Server"));
  // Send current relay states to app
  Blynk.virtualWrite(VPIN_RELAY1, relay1State);
}

// Blynk Virtual Pin V1 - Relay1 Control
BLYNK_WRITE(VPIN_RELAY1) {
  int value = param.asInt();  // 0 or 1
  bool newState = (value == 1);

  Serial.print(F("[BLYNK] V1 Received: "));
  Serial.println(newState ? F("ON") : F("OFF"));

  setRelay1(newState, "BlynkApp");
}

// ============ SETUP ============

void setup() {
  Serial.begin(115200);
  delay(100);
  Serial.println();
  Serial.println(F("\n\n================================"));
  Serial.println(F("  ESP8266 NodeMCU + Blynk IoT"));
  Serial.println(F("  2-Relay Toggle Control"));
  Serial.println(F("================================\n"));

  // Initialize EEPROM
  initEEPROM();

  // Configure pins
  pinMode(RELAY1_PIN, OUTPUT);
  pinMode(SWITCH1_PIN, INPUT_PULLUP);  // Latched switch to GND
  pinMode(WIFI_LED_PIN, OUTPUT);

  // Set initial states
  relay1State = false;
  applyRelayPin(relay1State);
  digitalWrite(WIFI_LED_PIN, LOW);  // LED OFF initially

  // Load previous states from EEPROM
  loadRelayStatesFromEEPROM();
  applyRelayPin(relay1State);

  // Read initial switch state
  lastSwitch1State = digitalRead(SWITCH1_PIN);
  Serial.print(F("[INIT] Switch1 State: "));
  Serial.println(lastSwitch1State ? F("Released (HIGH)") : F("Pressed (LOW)"));

  // WiFi connection
  Serial.println(F("\n[WiFi] Connecting..."));
  WiFi.begin(ssid, pass);

  // Blynk configuration
  Blynk.config(auth);

  // Timer callback every 2 seconds to check connection status
  timer.setInterval(2000L, checkConnectionStatus);

  Serial.println(F("[SETUP] Complete\n"));
}

// ============ MAIN LOOP ============

void loop() {
  // Handle manual switches (ALWAYS works, even offline)
  handleSwitches();

  // Only run Blynk if WiFi is connected (non-blocking)
  if (WiFi.status() == WL_CONNECTED) {
    Blynk.run();
  }

  // Run timer callbacks
  timer.run();
}

/**********************************************************************************
 *  TROUBLESHOOTING GUIDE:
 *  
 *  1. RELAY NOT TURNING OFF:
 *     - Check if relay wiring is correct (COM to appliance, NO to power)
 *     - Verify relay is Active-LOW (RELAY_ON = LOW, RELAY_OFF = HIGH)
 *     - Check pin continuity with multimeter
 *
 *  2. SWITCH NOT RESPONDING:
 *     - Use Serial Monitor to see "Switch1 Pressed" message
 *     - Verify switch is wired to GND properly
 *     - Check if pin is set to INPUT_PULLUP
 *     - Try increasing DEBOUNCE_DELAY if bouncing occurs
 *
 *  3. BLYNK NOT CONNECTING:
 *     - Verify WiFi credentials (ssid/pass)
 *     - Check Blynk auth token is correct
 *     - Ensure NodeMCU has stable power
 *     - Check serial monitor for connection messages
 *
 *  4. STATE NOT PERSISTING AFTER POWER OFF:
 *     - EEPROM saving is automatic after every relay change
 *     - Check EEPROM.commit() is called
 *     - Try factory reset: uncomment line below in setup() once, upload, then comment it out
 *     - // EEPROM.write(EEPROM_RELAY1_ADDR, 0); EEPROM.commit();
 *
 ***********************************************************************************/