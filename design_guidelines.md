# Lawly Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from professional legal platforms like LegalZoom, Avvo, and modern SaaS platforms like Linear and Notion for clean, trustworthy interfaces that convey expertise and reliability.

## Core Design Principles
- **Trust & Professionalism**: Legal services require utmost credibility
- **Clarity & Accessibility**: Complex legal processes made simple
- **Nigerian Context**: Culturally relevant while maintaining international standards

## Color Palette

### Primary Colors
- **Deep Navy**: 220 85% 15% (primary brand color for headers, CTAs)
- **Professional Blue**: 210 70% 45% (secondary actions, links)

### Supporting Colors
- **Warm Gray**: 25 8% 95% (light backgrounds)
- **Charcoal**: 220 15% 25% (body text)
- **Success Green**: 145 65% 45% (verification, success states)
- **Warning Amber**: 35 85% 55% (alerts, pending states)

### Gradients
- **Hero Gradient**: Subtle overlay from Deep Navy to Professional Blue
- **Card Gradients**: Light warm gray to white for elevated sections

## Typography
- **Primary**: Inter (Google Fonts) - clean, professional, excellent readability
- **Headings**: Inter 600-700 weight for strong hierarchy
- **Body**: Inter 400-500 weight for comfortable reading
- **Legal Text**: Inter 400 weight, slightly smaller sizing for terms/disclaimers

## Layout System
**Tailwind Spacing**: Primarily use units of 4, 6, 8, 12, 16 for consistent rhythm
- Sections: py-16, py-20 for generous vertical spacing
- Components: p-6, p-8 for internal padding
- Margins: mb-8, mb-12 for element separation

## Component Library

### Navigation
- Clean horizontal navbar with logo, main navigation, and prominent "Get Started" CTA
- Sticky header with subtle shadow on scroll
- Mobile: Hamburger menu with slide-out drawer

### Cards & Containers
- Subtle shadows and rounded corners (rounded-lg)
- Lawyer profile cards with photo, specialization badges, and rating display
- Case status cards with clear progress indicators

### Forms
- Multi-step forms with progress indicators
- Generous spacing and clear field labels
- File upload areas with drag-and-drop styling
- Real-time validation with gentle error states

### Buttons
- Primary: Solid Deep Navy with white text
- Secondary: Outline Professional Blue
- Success: Solid Success Green
- Text buttons for tertiary actions

## Images

### Hero Section
- **Large Hero Image**: Professional image of Nigerian legal professionals or courthouse
- **Placement**: Full-width hero with gradient overlay
- **Style**: High-quality, diverse representation, warm and approachable

### Feature Sections
- **Lawyer Profiles**: Professional headshots placeholder with consistent sizing
- **Case Management**: Screenshots or illustrations of dashboard interfaces
- **Document Icons**: Clean line icons representing legal documents

### Trust Indicators
- **Verification Badges**: Nigerian Bar Association logos and certification icons
- **Security Icons**: Lock icons, encryption symbols for data protection

## Mobile Responsiveness
- **Mobile-First Design**: Start with mobile layout, scale up
- **Touch Targets**: Minimum 44px for all interactive elements
- **Simplified Navigation**: Collapsible menus and prioritized content
- **Readable Text**: Minimum 16px base font size on mobile

## Accessibility
- **High Contrast**: Ensure 4.5:1 ratio for all text
- **Focus States**: Clear keyboard navigation indicators
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Independence**: Never rely solely on color for information

## Page-Specific Guidelines

### Landing Page (Marketing)
- **Hero**: Large professional image with gradient overlay, centered content
- **Features**: 3-column grid showcasing AI assistance, lawyer matching, secure payments
- **Trust Section**: Lawyer verification process with step-by-step visual
- **CTA Sections**: Strong call-to-action with contrast buttons

### Dashboard (Utility)
- **Clean Layout**: Sidebar navigation with main content area
- **Data Visualization**: Simple charts for case progress and analytics
- **Quick Actions**: Prominent buttons for common tasks
- **Status Indicators**: Clear visual feedback for case stages

This design system balances the need for professional credibility in the legal sector while maintaining modern usability standards and Nigerian market relevance.