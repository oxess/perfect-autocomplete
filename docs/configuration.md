# Configuration

Perfect Autocomplete is configured via HTML attributes. All attributes use kebab-case.

## Connection

### for

**Type:** `string`

The ID of the input element to connect to.

```html
<input id="search" type="search" />
<perfect-autocomplete for="search"></perfect-autocomplete>
```

## Data Fetching

### url

**Type:** `string`

The API endpoint URL for fetching suggestions.

```html
<perfect-autocomplete url="/api/search"></perfect-autocomplete>
```

### query-param

**Type:** `string`
**Default:** `"q"`

The query parameter name for the search term.

```html
<!-- Results in: /api/search?term=hello -->
<perfect-autocomplete url="/api/search" query-param="term"></perfect-autocomplete>
```

### min-chars

**Type:** `number`
**Default:** `2`

Minimum characters before triggering a search.

```html
<perfect-autocomplete min-chars="3"></perfect-autocomplete>
```

### debounce

**Type:** `number`
**Default:** `300`

Debounce delay in milliseconds.

```html
<perfect-autocomplete debounce="500"></perfect-autocomplete>
```

## Behavior

### max-items

**Type:** `number`
**Default:** `10`

Maximum number of items to display.

```html
<perfect-autocomplete max-items="5"></perfect-autocomplete>
```

### close-on-select

**Type:** `boolean`
**Default:** `true`

Whether to close the dropdown after selection.

```html
<perfect-autocomplete close-on-select="false"></perfect-autocomplete>
```

### highlight-first

**Type:** `boolean`
**Default:** `true`

Whether to auto-highlight the first item.

```html
<perfect-autocomplete highlight-first="false"></perfect-autocomplete>
```

## Positioning

### placement

**Type:** `string`
**Default:** `"bottom-start"`

Dropdown placement relative to the input.

**Options:**
- `bottom` | `bottom-start` | `bottom-end`
- `top` | `top-start` | `top-end`
- `left` | `left-start` | `left-end`
- `right` | `right-start` | `right-end`

```html
<perfect-autocomplete placement="top-start"></perfect-autocomplete>
```

### offset

**Type:** `number`
**Default:** `4`

Distance from the input element in pixels.

```html
<perfect-autocomplete offset="8"></perfect-autocomplete>
```

### flip

**Type:** `boolean`
**Default:** `true`

Whether to flip placement when near viewport edges.

```html
<perfect-autocomplete flip="false"></perfect-autocomplete>
```

### shift

**Type:** `boolean`
**Default:** `true`

Whether to shift position to stay in viewport.

```html
<perfect-autocomplete shift="false"></perfect-autocomplete>
```

## Complete Example

```html
<input type="search" id="user-search" placeholder="Search users..." />
<perfect-autocomplete
  for="user-search"
  url="/api/users"
  query-param="name"
  min-chars="1"
  debounce="250"
  max-items="8"
  placement="bottom-start"
  offset="4"
  close-on-select
  highlight-first
  flip
  shift
></perfect-autocomplete>
```
