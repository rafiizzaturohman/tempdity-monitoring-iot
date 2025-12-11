#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>
#include <LiquidCrystal_I2C.h>
#include <ArduinoJson.h>
#include <Servo.h>

LiquidCrystal_I2C lcd(0x27, 20, 4);
Servo servo;

// KONFIGURASI WIFI
const char* ssid = "SIB BLOK E3 NO 14";
const char* password = "3783140504Okay";

// const char* ssid = "vivo Y21";
// const char* password = "123456788";

// const char* ssid = "Hotspot";
// const char* password = "1234567890";

// const char* ssid = "izzat";
// const char* password = "satuduadelapan";

#define DHTPIN D4
#define DHTTYPE DHT22
#define LED_PIN_1 D5  // LED indikator Temperature
#define LED_PIN_2 D6  // LED indikator Humidity
#define BUZZER_PIN D3
#define LED_PROCESS_PIN D8  // LED indikator proses
#define SERVO_PIN D7

DHT_Unified dht(DHTPIN, DHTTYPE);

float temperature = 0.0;
float humidity = 0.0;

unsigned long lastDHT = 0;
unsigned long dhtInterval = 3000;

unsigned long lastUpdate = 0;
unsigned long lcdInterval = 3000;

unsigned long lastSend = 0;
unsigned long sendInterval = 3000;

unsigned long lastPoll = 0;
unsigned long pollInterval = 2000;  // Poll setiap 2 detik

unsigned long lastBlink = 0;
unsigned long blinkInterval = 0;

unsigned long lastBlink2 = 0;
unsigned long blinkInterval2 = 0;

unsigned long lastBeep = 0;
unsigned long beepInterval = 0;

bool ledState = LOW;
bool ledState2 = LOW;
bool buzzerState = LOW;
bool isReadingSensor = false;

// DEKLARASI FUNGSI
void checkReadRequest();
// void servoPositioning();
bool readDHT22Immediately();
bool sendSensorDataManual();

void setup() {
  Serial.begin(115200);
  lcd.init();
  lcd.backlight();

  WiFi.begin(ssid, password);
  Serial.print("Connecting");

  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected");
  Serial.println(WiFi.localIP());

  pinMode(LED_PIN_1, OUTPUT);
  pinMode(LED_PIN_2, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PROCESS_PIN, OUTPUT);
  servo.attach(SERVO_PIN);

  digitalWrite(LED_PROCESS_PIN, LOW);

  dht.begin();
}

void loop() {
  unsigned long now = millis();

  if (now - lastPoll >= pollInterval) {
    lastPoll = now;
    checkReadRequest();
  }

  if (now - lastDHT >= dhtInterval && !isReadingSensor) {
    lastDHT = now;

    sensors_event_t event;
    dht.temperature().getEvent(&event);
    temperature = event.temperature;

    dht.humidity().getEvent(&event);
    humidity = event.relative_humidity;

    if (isnan(temperature) || isnan(humidity)) {
      Serial.println("Undetected DHT");
    } else {
      Serial.print("Temperature: "); 
      Serial.print(temperature); 
      Serial.println("°C"); 

      Serial.print("Humidity: "); 
      Serial.print(humidity); 
      Serial.println("%");
    }
  }

  if (blinkInterval > 0 && (now - lastBlink >= blinkInterval)) {
    lastBlink = now;
    ledState = !ledState;
    digitalWrite(LED_PIN_1, ledState);
  }

  if (blinkInterval2 > 0 && (now - lastBlink2 >= blinkInterval2)) {
    lastBlink2 = now;
    ledState2 = !ledState2;
    digitalWrite(LED_PIN_2, ledState2);
  }

  if (beepInterval > 0 && (now - lastBeep >= beepInterval)) {
    lastBeep = now;
    buzzerState = !buzzerState;
    digitalWrite(BUZZER_PIN, buzzerState);
  }

  if (now - lastUpdate >= lcdInterval) {
    lastUpdate = now;

    lcd.clear();

    if (!isnan(temperature) && !isnan(humidity)) {
      lcd.setCursor(0, 0);
      lcd.print("Temp:");
      lcd.print(temperature, 1);
      lcd.print((char)223);
      lcd.print("C");

      lcd.setCursor(0, 1);
      lcd.print("Humi:");
      lcd.print(humidity, 1);
      lcd.print("%");

      lcd.setCursor(0, 2);
      if (isReadingSensor) {
        lcd.print("PROSES MANUAL...");
      } else {
        lcd.print("SIAP");
      }
    } else {
      lcd.setCursor(0, 0);
      lcd.print("Undetected DHT");
    }
  }

  if (now - lastSend >= sendInterval && !isReadingSensor) {
    lastSend = now;

    if (WiFi.status() == WL_CONNECTED) {
      WiFiClient client;
      HTTPClient http1;

      String url = "http://10.108.138.11/DHT22-main/public/update-data/";
      url += String(temperature, 1) + "/" + String(humidity, 1);

      // -----------------------------
      // API 1
      // -----------------------------
      http1.begin(client, url);
      int httpCode1 = http1.GET();

      Serial.print("Mengirim data ke "); 
      Serial.println(url);

      if (httpCode1 > 0) {
        Serial.printf("HTTP Response Code: %d\n", httpCode1); 
        String payload1 = http1.getString();

        StaticJsonDocument<255> doc;
        DeserializationError error = deserializeJson(doc, payload1);
        
        String message = doc["message"];

        Serial.print("Response: "); 
        Serial.println(message);
        
        JsonObject data = doc["data"];

        if(error){
          Serial.print("deserialization json gagal: ");
          Serial.println(error.f_str());
          http1.end();
          return;
        }

        int id = data["id"];
        float tempVal = data["temperature"].as<float>();
        float humVal = data["humidity"].as<float>();
        const char* createdAt = data["created_at"];
        const char* updatedAt = data["updated_at"];
        float maxTempVal = data["max_temperature"].as<float>();
        float maxHumVal = data["max_humidity"].as<float>();
        float minTempVal = data["min_temperature"].as<float>();
        float minHumVal = data["min_humidity"].as<float>();

        servoPositioning();

        if (tempVal > maxTempVal) {
          blinkInterval = 150;
          beepInterval = 150;
        } else if (tempVal < minTempVal) {
          blinkInterval = 300;
          beepInterval = 300;
        } else {
          blinkInterval = 0;
          beepInterval = 0;
          digitalWrite(LED_PIN_1, LOW);
          digitalWrite(BUZZER_PIN, LOW);
        }

        if (humVal > maxHumVal) {
          blinkInterval2 = 150;
          beepInterval = 150;
        } else if (humVal < minHumVal) {
          blinkInterval2 = 300;
          beepInterval = 300;
        } else {
          blinkInterval2 = 0;
          digitalWrite(LED_PIN_2, LOW);
        }
      } else {
        Serial.printf("Gagal mengirim data ke API 1. Error: %s\n", http1.errorToString(httpCode1).c_str());
      }
      http1.end();

      Serial.print("\n");
    }
  }
}

// FUNGSI UNTUK PEMOSISIAN SERVO
void servoPositioning() {
  if (WiFi.status() == WL_CONNECTED && !isReadingSensor) {
        WiFiClient client;
        HTTPClient http;
        
        String url = "http://10.108.138.11/DHT22-main/public/update-data/";
        
        http.begin(client, url);
        int httpCode = http.GET();

        if (httpCode > 0) {
            String payload = http.getString();
            
            StaticJsonDocument<128> doc;
            DeserializationError error = deserializeJson(doc, payload);

            JsonObject data = doc["data"];
            
            int id = data["id"];
            float tempVal = data["temperature"].as<float>();
            float maxTempVal = data["max_temperature"].as<float>();
            float minTempVal = data["min_temperature"].as<float>();
            
            if (tempVal > maxTempVal) {
                Serial.print("Jendela terbuka");
                servo.write(90);
            } else if (tempVal < minTempVal) {
                Serial.print("Jendela tertutup");
                servo.write(0);
            } else {
                Serial.print("Jendela setengah terbuka");
                servo.write(45);
            }
        } else {
          Serial.print("❌ Failed to get data");
          Serial.printf("❌ Gagal terkoneksi. Error: %s\n", http.errorToString(httpCode).c_str());
        }

        http.end();

        Serial.print("\n");
  }
}

// FUNGSI CHECK READ REQUEST
void checkReadRequest() {
    if (WiFi.status() == WL_CONNECTED && !isReadingSensor) {
        WiFiClient client;
        HTTPClient http;
        
        String url = "http://10.108.138.11/DHT22-main/public/check-read-request";
        
        http.begin(client, url);
        int httpCode = http.GET();
        
        if (httpCode > 0) {
            String payload = http.getString();
            
            StaticJsonDocument<128> doc;
            DeserializationError error = deserializeJson(doc, payload);
            
            if (!error) {
                bool readRequest = doc["read_request"];
                
                if (readRequest) {
                    isReadingSensor = true;
                    digitalWrite(LED_PROCESS_PIN, HIGH);
                    Serial.println("🟡 READ REQUEST: Memulai pembacaan sensor manual...");
                    
                    if(readDHT22Immediately()) {
                        Serial.println("📊 BACA MANUAL - Sensor berhasil dibaca");
                        
                        if(sendSensorDataManual()) {
                            Serial.println("🟢 READ REQUEST: Data berhasil dikirim ke server");
                        } else {
                            Serial.println("❌ READ REQUEST: Gagal mengirim data ke server");
                        }
                    } else {
                        Serial.println("❌ READ REQUEST: Gagal membaca sensor");
                    }
                    
                    digitalWrite(LED_PROCESS_PIN, LOW);
                    isReadingSensor = false;
                    Serial.println("🔵 READ REQUEST: Proses selesai");
                }
            } else {
                Serial.print("❌ Error parsing read request: ");
                Serial.println(error.f_str());
            }
        } else {
            Serial.printf("❌ Gagal polling read request. Error: %s\n", http.errorToString(httpCode).c_str());
        }
        
        http.end();

	      Serial.print("\n");
    }
}

// FUNGSI BACA SENSOR MANUAL
bool readDHT22Immediately() {
    sensors_event_t event;
    
    dht.temperature().getEvent(&event);
    temperature = event.temperature;
    
    dht.humidity().getEvent(&event);
    humidity = event.relative_humidity;
    
    if (isnan(temperature) || isnan(humidity)) {
        Serial.println("❌ Gagal membaca DHT22");
        return false;
    } else {
        Serial.print("📊 BACA MANUAL - Temperature: "); 
        Serial.print(temperature); 
        Serial.println("°C"); 
        
        Serial.print("📊 BACA MANUAL - Humidity: "); 
        Serial.print(humidity); 
        Serial.println("%");
        return true;
    }
}

// FUNGSI KIRIM DATA MANUAL
bool sendSensorDataManual() {
    if (WiFi.status() == WL_CONNECTED) {
        WiFiClient client;
        HTTPClient http1;

        String url = "http://10.108.138.11/DHT22-main/public/update-data/";
        url += String(temperature, 1) + "/" + String(humidity, 1);

        http1.begin(client, url);
        int httpCode1 = http1.GET();

        Serial.print("Mengirim data manual ke "); 
        Serial.println(url);

        if (httpCode1 > 0) {
            Serial.printf("HTTP Response Code: %d\n", httpCode1); 
            String payload1 = http1.getString();

            StaticJsonDocument<255> doc;
            DeserializationError error = deserializeJson(doc, payload1);
            
            String message = doc["message"];
            Serial.print("Response: "); 
            Serial.println(message);
            
            http1.end();
            return true;
        } else {
            Serial.printf("Gagal mengirim data manual. Error: %s\n", http1.errorToString(httpCode1).c_str());
            http1.end();
            return false;
        }
    }
    return false;
}