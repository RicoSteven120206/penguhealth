import type { Config } from "tailwindcss";

// Palet warna sesuai Design Brief proposal (bagian G).
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        laut: { DEFAULT: "#1E3A5F", 50: "#EEF3F9", 100: "#D7E2EF", 700: "#16304F", 900: "#0E2036" },
        es: { DEFAULT: "#7FB8E6", 50: "#F2F8FD", 100: "#DCEBF8" },
        rendah: "#2E9E6B",
        sedang: "#F2B705",
        tinggi: "#D9534F",
      },
      fontFamily: {
        judul: ["Poppins", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
