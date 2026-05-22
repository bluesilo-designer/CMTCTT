/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        // ── Brand ─────────────────────────────────────────────────────────────
        // Sourced from design-tokens.json → semantic.color.brand
        // Classes: text-brand-primary, bg-brand-primary, border-brand-primary …
        brand: {
          primary:        "var(--color-brand-primary)",
          "primary-hover":"var(--color-brand-primary-hover)",
          navy:           "var(--color-brand-navy)",
          bluesilo:       "var(--color-brand-bluesilo)",
          subtle:         "var(--color-fill-brand-subtle)",
        },

        // ── Semantic · Text ────────────────────────────────────────────────────
        // Sourced from design-tokens.json → semantic.color.text
        // Classes: text-content-primary, text-content-muted …
        content: {
          primary:   "var(--color-content-primary)",
          secondary: "var(--color-content-secondary)",
          muted:     "var(--color-content-muted)",
          disabled:  "var(--color-content-disabled)",
          inverse:   "var(--color-content-inverse)",
          brand:     "var(--color-content-brand)",
          error:     "var(--color-content-error)",
          success:   "var(--color-content-success)",
          warning:   "var(--color-content-warning)",
        },

        // ── Semantic · Background ──────────────────────────────────────────────
        // Sourced from design-tokens.json → semantic.color.bg
        // Classes: bg-surface, bg-surface-page, bg-fill-brand …
        surface: {
          DEFAULT: "var(--color-surface)",
          page:    "var(--color-surface-page)",
          subtle:  "var(--color-surface-subtle)",
        },
        fill: {
          brand:        "var(--color-fill-brand)",
          "brand-hover":"var(--color-fill-brand-hover)",
          "brand-subtle":"var(--color-fill-brand-subtle)",
          error:        "var(--color-fill-error)",
          success:      "var(--color-fill-success)",
          warning:      "var(--color-fill-warning)",
          info:         "var(--color-fill-info)",
        },

        // ── Semantic · Border ──────────────────────────────────────────────────
        // Sourced from design-tokens.json → semantic.color.border
        // Classes: border-line-default, border-line-focus …
        line: {
          default: "var(--color-line-default)",
          strong:  "var(--color-line-strong)",
          muted:   "var(--color-line-muted)",
          focus:   "var(--color-line-focus)",
          brand:   "var(--color-line-brand)",
          error:   "var(--color-line-error)",
        },

        // ── Semantic · Status ──────────────────────────────────────────────────
        // Sourced from design-tokens.json → semantic.color.status
        // Classes: bg-status-upcoming-bg, text-status-upcoming-text …
        status: {
          "upcoming-bg":      "var(--color-status-upcoming-bg)",
          "upcoming-text":    "var(--color-status-upcoming-text)",
          "upcoming-border":  "var(--color-status-upcoming-border)",
          "ongoing-bg":       "var(--color-status-ongoing-bg)",
          "ongoing-text":     "var(--color-status-ongoing-text)",
          "ongoing-border":   "var(--color-status-ongoing-border)",
          "return-bg":        "var(--color-status-return-bg)",
          "return-text":      "var(--color-status-return-text)",
          "return-border":    "var(--color-status-return-border)",
          "completed-bg":     "var(--color-status-completed-bg)",
          "completed-text":   "var(--color-status-completed-text)",
          "completed-border": "var(--color-status-completed-border)",
          "cancelled-bg":     "var(--color-status-cancelled-bg)",
          "cancelled-text":   "var(--color-status-cancelled-text)",
          "cancelled-border": "var(--color-status-cancelled-border)",
          "overdue-bg":       "var(--color-status-overdue-bg)",
          "overdue-text":     "var(--color-status-overdue-text)",
          "overdue-border":   "var(--color-status-overdue-border)",
        },
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
