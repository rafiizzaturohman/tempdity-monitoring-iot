# 🌡️ Temperature & Humidity Monitoring

Monitoring Suhu & Kelembapan Realtime Menggunakan DHT22, NestJS & NextJS

Aplikasi ini adalah sistem monitoring suhu (°C) dan kelembapan (%) secara realtime menggunakan sensor **DHT22**. Data dari sensor dikirim melalui mikrokontroler (ESP8266/ESP32/Arduino) menuju **backend NestJS**, lalu ditampilkan melalui **dashboard NextJS**.

---

## 🚀 Fitur Utama

### 🟦 Backend (NestJS)

- REST API untuk menerima dan mengirim data sensor
- Endpoint:
  - `POST /sensor` → menerima suhu & kelembapan dari mikrokontroler
  - `GET /sensor` → mengirim data sensor terbaru ke frontend
- Menggunakan Controller, Service, DTO
- Validasi data dan CORS enable
- Siap integrasi database (opsional)

### 🟧 Frontend (Next.js)

- Dashboard realtime
- Card suhu & kelembapan
- Grafik perubahan data
- Auto-refresh data
- Responsive UI
- Glassmorphism + dark mode (opsional)

### 🔧 Hardware

- Sensor **DHT22**
- ESP8266
- Pengiriman data via HTTP POST

---

## 📁 Struktur Project

```

/project-root
│
├── backend/ # NestJS API
│ ├── src/
│ ├── package.json
│ └── ...
│
└── frontend/ # NextJS Dashboard
├── app/
├── components/
├── package.json
└── ...

```

---

# ⚙️ Instalasi & Menjalankan Proyek

## 1. Clone Repository

```bash
git clone https://github.com/username/temperature-humidity-monitoring.git
cd temperature-humidity-monitoring
```

---

# 🟦 Backend (NestJS)

## Instalasi

```bash
cd backend
npm install
```

## Menjalankan Backend

```bash
npm run start:dev
```

Backend berjalan di:

```
http://localhost:3002
```

---

## 📡 Endpoint API

### GET /sensor

Mengambil data sensor terbaru.

Contoh response:

```json
{
  "temperature": 29.5,
  "humidity": 70.2,
  "time": "2025-11-19T10:00:00Z"
}
```

---

### POST /sensor

Digunakan mikrokontroler untuk mengirim data.

Contoh payload:

```json
{
  "temperature": 28.7,
  "humidity": 66.4
}
```

---

# 🟧 Frontend (Next.js)

## Instalasi

```bash
cd frontend
npm install
```

## Menjalankan Frontend

```bash
npm run dev
```

Frontend berjalan di:

```
http://localhost:3000
```

---

# 🔌 Contoh Kode ESP8266 / ESP32

```cpp
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  WiFi.begin("WiFi-Name", "WiFi-Password");
  dht.begin();
}

void loop() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();

  if (!isnan(t) && !isnan(h)) {
    HTTPClient http;
    http.begin("http://YOUR_SERVER_IP:3002/sensor");
    http.addHeader("Content-Type", "application/json");

    String json = "{\"temperature\":" + String(t) + ",\"humidity\":" + String(h) + "}";
    http.POST(json);

    http.end();
  }

  delay(3000);
}
```

---

# 📐 Arsitektur Sistem

```
[DHT22] → [ESP8266/ESP32] → [NestJS Backend] → [NextJS Dashboard]
```

---

# 📄 Lisensi

Proyek ini menggunakan lisensi **MIT**.

---
