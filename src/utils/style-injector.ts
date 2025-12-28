/**
 * Injects component styles into the document head
 * This is necessary because the dropdown is teleported to <body>
 * and needs access to CSS variables and styles defined in the component
 */

const STYLE_ID = 'perfect-autocomplete-styles'

// Check if styles are already injected
let stylesInjected = false

export function injectStyles(): void {
  if (typeof document === 'undefined') return
  if (stylesInjected) return
  if (document.getElementById(STYLE_ID)) {
    stylesInjected = true
    return
  }

  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = getStyles()
  document.head.appendChild(style)
  stylesInjected = true
}

function getStyles(): string {
  return `
/* Perfect Autocomplete - Injected Styles for Teleported Dropdown */

/* Base Variables */
.pac-dropdown {
  /* Colors */
  --pac-bg-color: #ffffff;
  --pac-text-color: #1f2937;
  --pac-border-color: #e5e7eb;
  --pac-highlight-bg: #f3f4f6;
  --pac-highlight-text: #111827;
  --pac-placeholder-color: #9ca3af;
  --pac-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --pac-error-color: #dc2626;
  --pac-loading-color: #6b7280;

  /* Spacing */
  --pac-padding: 8px 12px;
  --pac-item-padding: 10px 12px;
  --pac-gap: 8px;
  --pac-border-radius: 8px;
  --pac-item-border-radius: 4px;

  /* Typography */
  --pac-font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --pac-font-size: 14px;
  --pac-line-height: 1.5;
  --pac-description-font-size: 12px;

  /* Sizing */
  --pac-max-height: 300px;
  --pac-min-width: 200px;
  --pac-item-min-height: 44px;

  /* Animation */
  --pac-animation-duration: 150ms;
  --pac-animation-easing: cubic-bezier(0.4, 0, 0.2, 1);

  /* Image */
  --pac-image-size: 32px;
  --pac-image-border-radius: 4px;

  /* Spinner */
  --pac-spinner-size: 16px;
  --pac-spinner-border-width: 2px;

  /* Base Styles */
  position: absolute;
  z-index: 9999;
  box-sizing: border-box;
  min-width: var(--pac-min-width);
  max-height: var(--pac-max-height);
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--pac-bg-color);
  border: 1px solid var(--pac-border-color);
  border-radius: var(--pac-border-radius);
  box-shadow: var(--pac-shadow);
  font-family: var(--pac-font-family);
  font-size: var(--pac-font-size);
  line-height: var(--pac-line-height);
  color: var(--pac-text-color);
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .pac-dropdown {
    --pac-bg-color: #1f2937;
    --pac-text-color: #f9fafb;
    --pac-border-color: #374151;
    --pac-highlight-bg: #374151;
    --pac-highlight-text: #ffffff;
    --pac-placeholder-color: #6b7280;
    --pac-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.2);
  }
}

/* Touch devices */
@media (pointer: coarse) {
  .pac-dropdown {
    --pac-item-min-height: 48px;
    --pac-item-padding: 12px 16px;
  }
}

/* Items container */
.pac-items {
  list-style: none;
  margin: 0;
  padding: 4px;
}

/* Individual item */
.pac-item {
  display: flex;
  align-items: center;
  gap: var(--pac-gap);
  min-height: var(--pac-item-min-height);
  padding: var(--pac-item-padding);
  border-radius: var(--pac-item-border-radius);
  cursor: pointer;
  user-select: none;
  transition: background-color var(--pac-animation-duration) var(--pac-animation-easing),
              color var(--pac-animation-duration) var(--pac-animation-easing);
}

.pac-item:hover,
.pac-item--highlighted,
.pac-item[aria-selected="true"] {
  background-color: var(--pac-highlight-bg);
  color: var(--pac-highlight-text);
}

.pac-item:active {
  opacity: 0.8;
}

/* Item image */
.pac-item__image {
  flex-shrink: 0;
  width: var(--pac-image-size);
  height: var(--pac-image-size);
  border-radius: var(--pac-image-border-radius);
  object-fit: cover;
}

/* Item content */
.pac-item__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* Item label */
.pac-item__label {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Item description */
.pac-item__description {
  font-size: var(--pac-description-font-size);
  color: var(--pac-placeholder-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Loading state */
.pac-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--pac-gap);
  padding: var(--pac-padding);
  color: var(--pac-loading-color);
}

/* Empty state */
.pac-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--pac-padding);
  color: var(--pac-placeholder-color);
  text-align: center;
}

/* Error state */
.pac-error {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--pac-padding);
  color: var(--pac-error-color);
  text-align: center;
}

/* Animations */
.pac-dropdown[data-state="open"][data-placement^="bottom"] {
  animation: pac-fade-in-bottom var(--pac-animation-duration) var(--pac-animation-easing);
}

.pac-dropdown[data-state="closing"][data-placement^="bottom"] {
  animation: pac-fade-out-bottom var(--pac-animation-duration) var(--pac-animation-easing);
}

.pac-dropdown[data-state="open"][data-placement^="top"] {
  animation: pac-fade-in-top var(--pac-animation-duration) var(--pac-animation-easing);
}

.pac-dropdown[data-state="closing"][data-placement^="top"] {
  animation: pac-fade-out-top var(--pac-animation-duration) var(--pac-animation-easing);
}

@keyframes pac-fade-in-bottom {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes pac-fade-out-bottom {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }
}

@keyframes pac-fade-in-top {
  from {
    opacity: 0;
    transform: translateY(4px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes pac-fade-out-top {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(4px) scale(0.98);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pac-dropdown[data-state="open"],
  .pac-dropdown[data-state="closing"] {
    animation: none;
  }
}

/* ============= THEMES ============= */

/* Classic Theme (default) */
.pac-theme-classic {
  --pac-bg-color: #ffffff;
  --pac-text-color: #374151;
  --pac-border-color: #d1d5db;
  --pac-highlight-bg: #f3f4f6;
  --pac-highlight-text: #111827;
  --pac-placeholder-color: #6b7280;
  --pac-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --pac-border-radius: 6px;
  --pac-item-border-radius: 4px;
}

@media (prefers-color-scheme: dark) {
  .pac-theme-classic {
    --pac-bg-color: #1f2937;
    --pac-text-color: #f3f4f6;
    --pac-border-color: #4b5563;
    --pac-highlight-bg: #374151;
    --pac-highlight-text: #ffffff;
    --pac-placeholder-color: #9ca3af;
    --pac-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.2);
  }
}

/* Basic Theme */
.pac-theme-basic {
  --pac-bg-color: #ffffff;
  --pac-text-color: #000000;
  --pac-border-color: #cccccc;
  --pac-highlight-bg: #eeeeee;
  --pac-highlight-text: #000000;
  --pac-placeholder-color: #666666;
  --pac-shadow: none;
  --pac-border-radius: 2px;
  --pac-item-border-radius: 0;
  --pac-padding: 4px;
  --pac-item-padding: 8px 10px;
}

@media (prefers-color-scheme: dark) {
  .pac-theme-basic {
    --pac-bg-color: #222222;
    --pac-text-color: #ffffff;
    --pac-border-color: #444444;
    --pac-highlight-bg: #333333;
    --pac-highlight-text: #ffffff;
    --pac-placeholder-color: #999999;
  }
}

/* Modern Theme */
.pac-theme-modern {
  --pac-bg-color: #ffffff;
  --pac-text-color: #0f172a;
  --pac-border-color: #e2e8f0;
  --pac-highlight-bg: #f0f9ff;
  --pac-highlight-text: #0369a1;
  --pac-placeholder-color: #64748b;
  --pac-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.08),
    0 4px 6px -4px rgb(0 0 0 / 0.05),
    0 0 0 1px rgb(0 0 0 / 0.03);
  --pac-border-radius: 12px;
  --pac-item-border-radius: 8px;
  --pac-padding: 8px;
  --pac-item-padding: 12px 14px;
  --pac-animation-duration: 200ms;
  --pac-animation-easing: cubic-bezier(0.34, 1.56, 0.64, 1);
}

@media (prefers-color-scheme: dark) {
  .pac-theme-modern {
    --pac-bg-color: #0f172a;
    --pac-text-color: #f1f5f9;
    --pac-border-color: #334155;
    --pac-highlight-bg: #1e3a5f;
    --pac-highlight-text: #38bdf8;
    --pac-placeholder-color: #94a3b8;
    --pac-shadow:
      0 10px 15px -3px rgb(0 0 0 / 0.3),
      0 4px 6px -4px rgb(0 0 0 / 0.2),
      0 0 0 1px rgb(255 255 255 / 0.05);
  }
}

/* Bootstrap Theme */
.pac-theme-bootstrap {
  --pac-bg-color: #ffffff;
  --pac-text-color: #212529;
  --pac-border-color: #dee2e6;
  --pac-highlight-bg: #e9ecef;
  --pac-highlight-text: #212529;
  --pac-placeholder-color: #6c757d;
  --pac-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  --pac-border-radius: 0.375rem;
  --pac-item-border-radius: 0.25rem;
  --pac-padding: 0.5rem;
  --pac-item-padding: 0.5rem 1rem;
  --pac-font-size: 1rem;
  --pac-line-height: 1.5;
}

.pac-theme-bootstrap .pac-item[aria-selected="true"] {
  --pac-highlight-bg: #0d6efd;
  --pac-highlight-text: #ffffff;
}

@media (prefers-color-scheme: dark) {
  .pac-theme-bootstrap {
    --pac-bg-color: #212529;
    --pac-text-color: #dee2e6;
    --pac-border-color: #495057;
    --pac-highlight-bg: #343a40;
    --pac-highlight-text: #ffffff;
    --pac-placeholder-color: #adb5bd;
    --pac-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.3);
  }

  .pac-theme-bootstrap .pac-item[aria-selected="true"] {
    --pac-highlight-bg: #0d6efd;
    --pac-highlight-text: #ffffff;
  }
}

/* Tailwind Theme */
.pac-theme-tailwind {
  --pac-bg-color: #ffffff;
  --pac-text-color: #1e293b;
  --pac-border-color: #e2e8f0;
  --pac-highlight-bg: #f1f5f9;
  --pac-highlight-text: #0f172a;
  --pac-placeholder-color: #64748b;
  --pac-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
  --pac-border-radius: 0.5rem;
  --pac-item-border-radius: 0.375rem;
  --pac-padding: 0.25rem;
  --pac-item-padding: 0.625rem 0.875rem;
  --pac-font-size: 0.875rem;
  --pac-line-height: 1.25rem;
}

.pac-theme-tailwind .pac-item[aria-selected="true"] {
  --pac-highlight-bg: #3b82f6;
  --pac-highlight-text: #ffffff;
}

@media (prefers-color-scheme: dark) {
  .pac-theme-tailwind {
    --pac-bg-color: #1e293b;
    --pac-text-color: #f1f5f9;
    --pac-border-color: #334155;
    --pac-highlight-bg: #334155;
    --pac-highlight-text: #f8fafc;
    --pac-placeholder-color: #94a3b8;
    --pac-shadow:
      0 10px 15px -3px rgb(0 0 0 / 0.25),
      0 4px 6px -4px rgb(0 0 0 / 0.2);
  }

  .pac-theme-tailwind .pac-item[aria-selected="true"] {
    --pac-highlight-bg: #3b82f6;
    --pac-highlight-text: #ffffff;
  }
}
`
}
