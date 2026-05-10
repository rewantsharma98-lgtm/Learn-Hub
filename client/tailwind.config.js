export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        border: "var(--border)",
        ring: "var(--ring)",
        muted: "var(--muted)",
        darkMode: "class",
        "muted-foreground": "var(--muted-foreground)",
      },
    },
  },
  plugins: [],
}
