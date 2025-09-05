# Table Component

A fully self-contained, high-performance table component with the following features:

## Features

- **Virtualization & Pagination**: Support for both rendering strategies
- **Sorting & Filtering**: Client-side and server-side data processing
- **Column Management**: Resizable, reorderable, and hideable columns
- **Inline Editing**: Cell-level editing with validation
- **Responsive Design**: Optimized for various screen sizes

## Self-Contained Architecture

This table component is completely decoupled and self-contained with:

### 📁 Structure

```
/Table
├── Table.tsx                 # Main component
├── Table.css                 # Styles
├── constants.ts              # Local constants
├── types/                    # Type definitions
│   ├── index.ts             # Exports
│   ├── table.ts             # Table-specific types
│   └── api.ts               # Data types
├── components/              # Sub-components
├── hooks/                   # Custom hooks
└── Icons/                   # Icon components
```

### 🔗 External Dependencies

- **Only App.tsx**: The table is imported and used only in App.tsx
- **No global dependencies**: All types, constants, and utilities are local
- **Pure React**: Only depends on React and its hooks

### 📋 Usage

```tsx
import Table from "@/components/Table/Table"
import { CLIENT_SIDE, VIRTUALIZATION } from "@/components/Table/constants"
import type { FetchingMode, RenderStrategy } from "@/components/Table/types"

// Use the table component
;<Table
  colDefs={colDefs}
  apiData={data}
  loading={isLoading}
  error={error}
  fetchingMode={fetchingMode}
  renderStrategy={renderStrategy}
  onApiParamsChange={onApiParamsChange}
/>
```

### 🎯 Benefits

- **Modularity**: Can be easily moved to a separate package
- **Maintainability**: All related code is co-located
- **Reusability**: No external dependencies beyond React
- **Type Safety**: Complete TypeScript support with local types
