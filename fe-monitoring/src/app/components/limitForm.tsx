"use client";

import { useState } from "react";

const LimitForm = () => {
  const [minForm, setMinForm] = useState({
    jenis_nilai: "",
    nilai: "",
  });

  const [maxForm, setMaxForm] = useState({
    jenis_nilai: "",
    nilai: "",
  });

  const [loadingMin, setLoadingMin] = useState(false);
  const [loadingMax, setLoadingMax] = useState(false);
  const api = process.env.NEXT_PUBLIC_SENSOR_API;

  const handleSubmitMin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoadingMin(true);

      const res = await fetch(`${api}/sensor/update-nmin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(minForm),
      });

      const result = await res.json();
      console.log("MIN UPDATED:", result);

      alert("Nilai minimum berhasil diperbarui!");

      // Reset form
      setMinForm({ jenis_nilai: "", nilai: "" });
    } catch (error) {
      alert("Gagal memperbarui nilai minimum!");
      console.error(error);
    } finally {
      setLoadingMin(false);
    }
  };

  const handleSubmitMax = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoadingMax(true);

      const res = await fetch(`${api}/sensor/update-nmax`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(maxForm),
      });

      const result = await res.json();
      console.log("MAX UPDATED:", result);

      alert("Nilai maksimum berhasil diperbarui!");

      // Reset form
      setMaxForm({ jenis_nilai: "", nilai: "" });
    } catch (error) {
      alert("Gagal memperbarui nilai maksimum!");
      console.error(error);
    } finally {
      setLoadingMax(false);
    }
  };

  return (
    <section
      id="input-form"
      className="max-w-6xl mx-auto w-11/12 md:w-full bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_25px_rgba(255,255,255,0.05)] hover:shadow-[0_10px_25px_rgba(249,248,246,0.2)] p-6 mt-4 mb-6 hover:scale-[1.02] transition-all duration-300"
    >
      <h2 className="text-2xl text-center font-semibold tracking-wide text-gray-300 mb-6 flex items-center justify-center gap-2">
        <i className="bi bi-thermometer-half text-4xl text-red-400"></i>
        Batas TempDity
        <i className="bi bi-droplet text-4xl text-sky-500"></i>
      </h2>

      <div className="grid grid-cols-none md:grid-cols-2 gap-8">
        {/* MIN VALUE FORM */}
        <form onSubmit={handleSubmitMin} className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="relative flex-1">
              <label
                htmlFor="jenis_nilai"
                className="text-gray-300 text-base mb-1 block"
              >
                Nilai Minimum
              </label>

              <select
                name="jenis_nilai"
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={minForm.jenis_nilai}
                onChange={(e) =>
                  setMinForm({ ...minForm, jenis_nilai: e.target.value })
                }
              >
                <option value="" disabled>
                  Pilih Nilai
                </option>
                <option value="min_temperature">Min Temperature</option>
                <option value="min_humidity">Min Humidity</option>
              </select>
            </div>

            <div className="flex-1">
              <label
                htmlFor="nilai"
                className="text-gray-300 text-base mb-1 block"
              >
                Nilai
              </label>

              <input
                type="number"
                step="0.1"
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                value={minForm.nilai}
                onChange={(e) =>
                  setMinForm({ ...minForm, nilai: e.target.value })
                }
              />
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={loadingMin}
              className="mt-2 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-200 cursor-pointer disabled:opacity-50"
            >
              {loadingMin ? "Menyimpan..." : "Simpan Nilai"}
            </button>
          </div>
        </form>

        {/* MAX VALUE FORM */}
        <form onSubmit={handleSubmitMax} className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="relative flex-1">
              <label
                htmlFor="jenis_nilai"
                className="text-gray-300 text-base mb-1 block"
              >
                Nilai Maksimum
              </label>

              <select
                name="jenis_nilai"
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={maxForm.jenis_nilai}
                onChange={(e) =>
                  setMaxForm({ ...maxForm, jenis_nilai: e.target.value })
                }
              >
                <option value="" disabled>
                  Pilih Nilai
                </option>
                <option value="max_temperature">Max Temperature</option>
                <option value="max_humidity">Max Humidity</option>
              </select>
            </div>

            <div className="flex-1">
              <label
                htmlFor="nilai"
                className="text-gray-300 text-base mb-1 block"
              >
                Nilai
              </label>

              <input
                type="number"
                step="0.1"
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                value={maxForm.nilai}
                onChange={(e) =>
                  setMaxForm({ ...maxForm, nilai: e.target.value })
                }
              />
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={loadingMax}
              className="mt-2 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-200 cursor-pointer disabled:opacity-50"
            >
              {loadingMax ? "Menyimpan..." : "Simpan Nilai"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LimitForm;
