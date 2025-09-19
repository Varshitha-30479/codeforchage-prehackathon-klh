# Pivora Design Guidelines

## Design Approach
**System-Based Approach**: Using Material Design principles adapted for financial applications. The tool prioritizes data clarity, professional trust, and efficient workflow - essential for CFO-level financial planning.

## Core Design Elements

### Color Palette
**Primary**: 220 85% 25% (Deep professional blue)
**Secondary**: 220 15% 95% (Light neutral gray)  
**Accent**: 142 76% 36% (Success green for positive metrics)
**Warning**: 25 95% 53% (Orange for alerts)
**Error**: 0 84% 60% (Red for negative trends)

**Dark Mode**: Consistent implementation with 220 15% 8% backgrounds and 220 10% 92% text.

### Typography
**Primary**: Inter (Google Fonts) - clean, readable for data-heavy interfaces
**Headings**: 600-700 weight
**Body**: 400-500 weight  
**Data/Numbers**: 500-600 weight for emphasis

### Layout System
**Spacing Units**: Tailwind 2, 4, 6, 8, 12 (p-2, m-4, gap-6, h-8, py-12)
**Grid**: 12-column responsive grid with consistent gutters

### Component Library

**Dashboard Layout**:
- Sidebar navigation with collapsible sections
- Main content area with card-based metric displays
- Top header with user account and usage counter

**Financial Controls**:
- Range sliders with live value display for scenario variables
- Input groups with currency formatting and validation
- Toggle switches for scenario assumptions

**Data Visualization**:
- Chart containers with subtle borders and rounded corners
- Color-coded metrics using semantic colors (green/red for positive/negative)
- Responsive tables with sticky headers for financial data

**Interactive Elements**:
- Primary CTAs use the deep blue primary color
- Secondary actions use outline buttons with transparent backgrounds
- Floating action button for "Generate AI Recommendation"

**Cards & Containers**:
- Subtle shadows (shadow-sm) for depth without distraction
- Rounded corners (rounded-lg) for modern feel
- White/dark mode appropriate backgrounds

**Usage Tracking Display**:
- Prominent counter showing scenarios remaining
- Progress bars for usage limits
- Clear upgrade/purchase prompts when approaching limits

## Professional Financial Aesthetic
- Clean, spacious layouts that don't overwhelm with data
- Consistent iconography using Heroicons for clarity
- Subtle animations only for state changes and loading
- High contrast text for accessibility in data-dense views
- Card-based organization for different financial scenarios and metrics

This design creates a trustworthy, professional tool that CFOs can confidently use for critical financial planning while maintaining modern usability standards.