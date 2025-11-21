"use client";

import { useEffect, useState } from "react";

const Dht22Page = () => {
  const [sensor, setSensor] = useState<{
    temperature: number;
    humidity: number;
  } | null>(null);

  const getData = async () => {
    try {
      const res = await fetch("/api/sensor/");
      const data = await res.json();

      setSensor(data);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  useEffect(() => {
    getData();

    const interval = setInterval(getData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Sensor DHT22</h1>

      {sensor ? (
        <div className="space-y-2">
          <p>
            Temperature: <b>{sensor.temperature}°C</b>
          </p>
          <p>
            Humidity: <b>{sensor.humidity}%</b>
          </p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dht22Page;
