# Futuristic Dashboard Notebook

A declarative, code-driven notebook application with a futuristic glassmorphic design aesthetic.

## Design Philosophy

Unlike traditional drag-and-drop notebooks, this component is **purely code-driven**. Users define their dashboard layout using a declarative configuration object or JSX structure, making it perfect for:

- Data scientists who prefer code over UI
- Automated report generation
- Version-controlled dashboards
- Reproducible analytics

## Component API

### Basic Usage

```tsx
import { DashboardNotebook, Block } from './components/notebook';

const blocks: Block[] = [
  {
    type: 'markdown',
    content: '# My Dashboard',
    layout: 'col-span-3'
  },
  {
    type: 'graph',
    graphType: 'bar',
    data: [{ month: 'Jan', sales: 4200 }],
    xKey: 'month',
    yKeys: ['sales']
  }
];

function App() {
  return <DashboardNotebook blocks={blocks} />;
}
```

## Block Types

### 1. Markdown Block

Renders formatted markdown content with custom styling.

```tsx
{
  type: 'markdown',
  content: `
    # Title
    This is **bold** and this is *italic*.
    - List item 1
    - List item 2
  `,
  layout: 'col-span-2'  // optional
}
```

**Properties:**
- `type`: `'markdown'`
- `content`: String containing markdown content
- `layout`: Optional Tailwind grid class (default: `'col-span-1'`)

### 2. Code Block

Displays syntax-highlighted code with support for multiple languages.

```tsx
{
  type: 'code',
  code: 'const x = 42;',
  language: 'javascript',
  title: 'Example Code',
  layout: 'col-span-2'
}
```

**Properties:**
- `type`: `'code'`
- `code`: String containing the code to display
- `language`: Optional language for syntax highlighting (default: `'javascript'`)
- `title`: Optional title displayed above the code
- `layout`: Optional Tailwind grid class

**Supported Languages:**
javascript, typescript, python, java, rust, go, css, html, json, sql, bash, and many more.

### 3. Table Block

Renders a data table with custom styling.

```tsx
{
  type: 'table',
  title: 'User Data',
  columns: ['name', 'email', 'status'],
  data: [
    { name: 'Alice', email: 'alice@example.com', status: 'Active' },
    { name: 'Bob', email: 'bob@example.com', status: 'Inactive' }
  ],
  layout: 'col-span-2'
}
```

**Properties:**
- `type`: `'table'`
- `columns`: Array of column names (must match keys in data objects)
- `data`: Array of objects where keys correspond to column names
- `title`: Optional table title
- `layout`: Optional Tailwind grid class

### 4. Graph Block

Creates interactive charts using Recharts.

```tsx
{
  type: 'graph',
  graphType: 'grouped-bar',
  title: 'Revenue Metrics',
  data: [
    { month: 'Jan', revenue: 4200, costs: 2100 },
    { month: 'Feb', revenue: 5100, costs: 2400 }
  ],
  xKey: 'month',
  yKeys: ['revenue', 'costs'],
  colors: ['#06b6d4', '#8b5cf6'],
  layout: 'col-span-2'
}
```

**Properties:**
- `type`: `'graph'`
- `graphType`: `'bar'` or `'grouped-bar'`
- `data`: Array of data objects
- `xKey`: Key to use for X-axis values
- `yKeys`: Array of keys to plot on Y-axis
- `title`: Optional chart title
- `colors`: Optional array of hex colors for bars
- `layout`: Optional Tailwind grid class

## Layout System

The dashboard uses a responsive CSS Grid layout:

- **Mobile**: 1 column
- **Tablet (md)**: 2 columns
- **Desktop (lg)**: 3 columns

You can control how many columns each block spans using the `layout` property:

```tsx
// Spans full width on all screens
layout: 'col-span-1 md:col-span-2 lg:col-span-3'

// Spans 2 columns on tablet+
layout: 'col-span-1 md:col-span-2'

// Default: single column
layout: 'col-span-1'
```

## Design System

The notebook uses a **futuristic glassmorphism** aesthetic:

- **Dark mode background**: Slate-950
- **Glassmorphic cards**: Semi-transparent slate-900 with backdrop blur
- **Accent color**: Cyan (for borders, text highlights, and glows)
- **Typography**: JetBrains Mono (monospaced font for terminal feel)
- **Visual effects**: Glowing borders, subtle gradients, hover animations

## Adding New Block Types

To add a custom block type:

1. **Create the component** in `/components/notebook/`:

```tsx
// MyCustomBlock.tsx
import { BlockWrapper } from './BlockWrapper';

interface MyCustomBlockProps {
  data: string;
  className?: string;
}

export function MyCustomBlock({ data, className }: MyCustomBlockProps) {
  return (
    <BlockWrapper className={className}>
      <div className="text-cyan-400 font-mono">{data}</div>
    </BlockWrapper>
  );
}
```

2. **Define the type** in `DashboardNotebook.tsx`:

```tsx
export interface MyCustomBlockConfig {
  type: 'my-custom';
  data: string;
  layout?: string;
}

export type Block = 
  | MarkdownBlockConfig 
  | CodeBlockConfig 
  | TableBlockConfig 
  | GraphBlockConfig
  | MyCustomBlockConfig;  // Add your type here
```

3. **Add rendering logic**:

```tsx
const renderBlock = (block: Block, index: number) => {
  // ... existing cases ...
  
  case 'my-custom':
    return (
      <div key={key} className={layout}>
        <MyCustomBlock data={block.data} />
      </div>
    );
```

4. **Export from index**:

```tsx
export { MyCustomBlock } from './MyCustomBlock';
export type { MyCustomBlockConfig } from './DashboardNotebook';
```

## Best Practices

1. **Use meaningful data**: Provide real or realistic mock data to make dashboards useful
2. **Optimize layout**: Use responsive `layout` classes to ensure blocks look good on all screen sizes
3. **Consistent styling**: All blocks automatically receive glassmorphic styling via `BlockWrapper`
4. **Type safety**: Define proper TypeScript types for your block configurations
5. **Modular design**: Keep each block component focused on a single responsibility

## Examples

See `/src/app/App.tsx` for a complete working example with all block types.
