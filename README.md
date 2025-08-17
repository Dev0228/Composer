# Image Text Editor

A web-based image editor that allows users to upload PNG images and add customizable text layers with real-time editing capabilities.

## Setup and Run Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd composer

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Architecture

### Component Structure

```
src/
├── components/
│   ├── ImageTextEditor/
│   │   ├── index.tsx          # Main editor component
│   │   ├── Toolbar/           # Side panel with controls
│   │   └── canvasArea.tsx     # Canvas rendering area
│   └── ui/                    # Reusable UI components
├── hooks/
│   └── useRefState.ts         # Custom hook for ref-based state
├── constants/
│   └── constants.ts           # Font weights and Google Fonts list
└── type/
    └── type.ts               # TypeScript definitions
```

### Data Flow

1. **Canvas Management**: Fabric.js handles the canvas rendering and object manipulation
2. **State Management**: React state manages history, selected objects, and UI state
3. **Persistence**: localStorage automatically saves canvas state on every change
4. **Event Handling**: Fabric.js events trigger React state updates and history saves

## Technology Choices and Trade-offs

### Core Technologies

- **Next.js 14**: App router for modern React development
- **Fabric.js**: Canvas manipulation library
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: Pre-built accessible components

### Key Trade-offs

#### Fabric.js vs Canvas API

- **Chosen**: Fabric.js
- **Pros**: Rich object model, built-in transformations, event handling
- **Cons**: Larger bundle size, learning curve
- **Alternative**: Native Canvas API (lighter but more complex to implement)

#### State Management

- **Chosen**: React useState + useRef
- **Pros**: Simple, no external dependencies
- **Cons**: Can lead to stale closures (solved with custom useRefState hook)
- **Alternative**: Zustand/Redux (overkill for this scope)

#### Persistence

- **Chosen**: localStorage
- **Pros**: Simple, works offline, no backend needed
- **Cons**: Limited storage, browser-specific
- **Alternative**: IndexedDB (more complex) or backend storage

## Bonus Points Implemented

✅ **Multi-select with group transforms**

✅ **Ability to edit line-height, letter-spacing**

✅ **Text shadow (customizable color, blur, and offset)**

❌ **Custom font upload (TTF/OTF/WOFF)**

❌ **Smart spacing hints between selected layers**

❌ **Warp or curved text along a path**

## Known Limitations

### Technical Limitations

1. **Font Loading**: Google Fonts load asynchronously, may cause brief layout shifts
2. **Memory Usage**: History system keeps 20 states in memory, could impact performance with large images
3. **Browser Compatibility**: Requires modern browsers with Canvas support
4. **File Size**: Only supports PNG uploads (by design)

### UX Limitations

1. **Mobile Support**: Not optimized for touch devices
2. **Keyboard Shortcuts**: No keyboard shortcuts for common operations
3. **Multi-selection**: Cannot select and edit multiple text layers simultaneously
4. **Text Formatting**: No support for rich text (bold, italic, underline within same text)

### Performance Considerations

1. **Large Images**: Performance may degrade with very large images (>4K resolution)
2. **Many Text Layers**: Canvas rendering slows down with 50+ text objects
3. **Font Picker**: Loading 1000+ Google Fonts can cause initial delay
