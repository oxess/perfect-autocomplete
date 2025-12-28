# Accessibility

Perfect Autocomplete implements the [WAI-ARIA Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) for full accessibility support.

## ARIA Attributes

The component automatically manages these ARIA attributes:

### On the Input Element

| Attribute | Value | Description |
|-----------|-------|-------------|
| `role` | `combobox` | Identifies as a combobox |
| `aria-autocomplete` | `list` | Indicates list-based autocomplete |
| `aria-haspopup` | `listbox` | Has a listbox popup |
| `aria-expanded` | `true/false` | Whether dropdown is open |
| `aria-controls` | `{listbox-id}` | References the listbox |
| `aria-activedescendant` | `{item-id}` | Currently focused item |
| `aria-busy` | `true/false` | Loading state |

### On the Listbox

| Attribute | Value | Description |
|-----------|-------|-------------|
| `role` | `listbox` | Identifies as a listbox |
| `id` | `{unique-id}` | Unique identifier |
| `aria-label` | `Suggestions` | Accessible name |

### On Each Option

| Attribute | Value | Description |
|-----------|-------|-------------|
| `role` | `option` | Identifies as an option |
| `id` | `{unique-id}` | Unique identifier |
| `aria-selected` | `true/false` | Selection state |

## Keyboard Navigation

Full keyboard support is provided:

| Key | Action |
|-----|--------|
| `↓` Arrow Down | Move to next item / Open dropdown |
| `↑` Arrow Up | Move to previous item |
| `Home` | Move to first item |
| `End` | Move to last item |
| `Enter` | Select current item |
| `Escape` | Close dropdown |
| `Tab` | Close dropdown and move focus |

## Screen Reader Announcements

The component uses an ARIA live region to announce:

- **Loading state**: "Loading suggestions..."
- **Results count**: "5 suggestions available. Use arrow keys to navigate."
- **No results**: "No suggestions available"

## Focus Management

- Focus remains on the input while navigating
- `aria-activedescendant` tracks the visually focused item
- Focus returns to input after selection
- Dropdown closes on focus loss

## Color Contrast

Default colors meet WCAG 2.1 AA contrast requirements:

- Text on background: 7:1+
- Highlighted text: 7:1+
- Error text: 4.5:1+

## Motion Preferences

The component respects `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  perfect-autocomplete {
    --pac-animation-duration: 0ms;
  }
}
```

## High Contrast Mode

Windows High Contrast mode is supported:

```css
@media (forced-colors: active) {
  .pac-dropdown {
    border: 2px solid CanvasText;
  }
  .pac-item--highlighted {
    background: Highlight;
    color: HighlightText;
  }
}
```

## Touch Accessibility

- Minimum touch target size: 44x44px
- Touch gestures don't interfere with screen reader gestures
- Swipe-to-dismiss is supplementary, not required

## Testing Accessibility

### Using axe-core

```javascript
import { axe } from 'axe-core'

const results = await axe.run(document.querySelector('perfect-autocomplete'))
console.log(results.violations)
```

### Manual Testing

1. **Keyboard only**: Navigate using only keyboard
2. **Screen reader**: Test with NVDA, JAWS, or VoiceOver
3. **High contrast**: Enable Windows High Contrast mode
4. **Zoom**: Test at 200% zoom level
5. **Motion**: Enable reduced motion preference

## Best Practices

### Label the Input

Always provide a label for the connected input:

```html
<label for="search">Search users</label>
<input type="search" id="search" />
<perfect-autocomplete for="search" url="/api/users"></perfect-autocomplete>
```

### Placeholder is Not a Label

Don't rely on placeholder text alone:

```html
<!-- Bad -->
<input placeholder="Search..." />

<!-- Good -->
<label for="search">Search</label>
<input id="search" placeholder="Type to search..." />
```

### Announce Errors

Errors are automatically announced via the live region, but you can also add visual indication:

```javascript
autocomplete.addEventListener('pac:error', (e) => {
  showErrorMessage(e.detail.error.message)
})
```
