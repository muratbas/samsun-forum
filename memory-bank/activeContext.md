# Active Context: Samsun Forum

## Current Status
**Project Phase**: Initialization  
**Last Updated**: November 14, 2025  
**Focus**: Setting up project foundation and implementing core functionality

## What We're Working On Right Now

### Immediate Next Steps
1. ✅ Memory bank initialization (COMPLETED)
2. ⏳ Create Next.js project with proper structure
3. ⏳ Set up Firebase project and configuration
4. ⏳ Implement basic layout (Header, Sidebars, Feed structure)
5. ⏳ Create static version of homepage matching provided design

### Current Sprint Goal
Build the visual foundation of the forum with static components before implementing dynamic functionality.

## Recent Decisions

### Tech Stack Finalized
- **Frontend**: Next.js 14 + React + Tailwind CSS
- **Backend**: Firebase (Auth + Firestore + Storage)
- **Hosting**: Vercel
- **Language**: Turkish only
- **Approach**: Build functionality first, optimize later

**Rationale**: 
- Easiest for school project timeline
- 100% free hosting and backend
- Rapid development with Firebase SDK
- Professional-looking final product
- Good learning experience

### Authentication Strategy
- **Initial Registration**: Google OAuth (simplest onboarding)
- **Nickname Selection**: After first Google login, user picks unique nickname
- **Subsequent Logins**: Nickname + password OR continue with Google
- **Public Reading**: No login required to view posts
- **Authenticated Actions**: Login required to post, vote, comment

**Rationale**:
- Low barrier to entry (single Google click)
- Unique nicknames create community identity
- Flexible login options after registration
- Public reading increases content visibility

### Design Approach
Using the provided HTML design as the visual reference:
- Dark mode as default (can add light mode toggle later)
- Material Symbols Outlined icons
- Tailwind CSS with custom theme colors
- Plus Jakarta Sans font
- Reddit-inspired card layout

### Content Moderation Strategy
**Phase 1 (MVP)**: 
- Admin-only topic creation
- Basic profanity filter (temp ban trigger)
- Manual moderation by admins

**Phase 2 (Future)**:
- Automated content filtering
- User reporting system
- Moderator dashboard
- Appeal system

## Important Patterns & Preferences

### Component Organization
- **Server Components**: For layouts and initial data fetching (SEO-friendly)
- **Client Components**: For interactive elements (voting, forms, real-time updates)
- **Shared Components**: Reusable UI pieces (buttons, cards, inputs)

### Data Fetching Strategy
- Use SWR for client-side data fetching and caching
- Real-time Firestore listeners only for critical updates (votes)
- Pagination for feeds (20 posts per page)
- Optimistic updates for instant UI feedback

### Styling Conventions
- Use Tailwind utility classes directly in components
- Custom colors via Tailwind config (no inline hex values)
- Responsive design with mobile-first approach
- Dark mode classes: `dark:` prefix

### File Naming
- Components: PascalCase (e.g., `PostCard.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Pages: lowercase with dashes (e.g., `new-post/page.tsx`)
- Types: PascalCase interfaces (e.g., `Post`, `User`)

## Active Considerations

### Image Upload Considerations
- **Question**: Client-side compression vs. Cloud Functions?
- **Leaning Toward**: Client-side (simpler, faster for MVP)
- **Implementation**: `browser-image-compression` library before Firebase Storage upload
- **Max Size**: 5MB after compression

### Search Implementation
- **Question**: Implement search now or later?
- **Decision**: Start without search, add if time permits
- **Alternative**: Use Firestore basic queries (limited but functional)
- **Future**: Algolia or Typesense for better search

### Comment System Priority
- **Question**: Include comments in MVP?
- **Decision**: Posts and voting first, comments second priority
- **Reason**: Core functionality > Nice-to-have for school project demo
- **Timeline**: Add after basic posting works

### Events Section Data Source
- **Acknowledged**: Will address after core features work
- **Options to Explore**:
  1. Manual entry by admins (simplest)
  2. Web scraping (requires backend)
  3. Integration with event APIs (if available for Samsun)
- **Current Plan**: Leave placeholder in sidebar, implement later

## Learnings & Insights

### From Requirements Gathering
1. **School Project Context**: Prioritize getting something working over perfect architecture
2. **User Familiarity**: Reddit-like UI reduces learning curve
3. **Local Focus**: Every design decision should reinforce Samsun identity
4. **Mobile-First**: Turkish users heavily mobile-oriented
5. **Turkish Language**: All UI text, error messages, and content in Turkish

### Design Insights
- Primary red (#E30613) is bold and memorable - use sparingly for CTAs
- Dark mode by default aligns with modern preferences
- Card-based layout makes content scannable
- Left sidebar for navigation, right sidebar for discovery (trending, events)

## Known Challenges

### Potential Issues to Watch
1. **Firebase Free Tier**: Monitor usage as user count grows
2. **Image Storage**: Need compression to stay within storage limits
3. **Profanity Filtering**: Turkish language requires careful word list
4. **Nickname Uniqueness**: Need proper validation to prevent duplicates
5. **Ban System**: Temporary bans need expiration logic

### Technical Debt (Acceptable for Now)
- No automated tests initially
- Basic error handling
- No caching beyond SWR
- Simple moderation tools
- No analytics initially

## Questions to Resolve

### Open Questions
1. Should we implement real-time vote count updates or just refetch?
2. How long should temporary bans last? (24 hours? 7 days?)
3. Should posts be editable after creation?
4. Should there be a character limit on post content?
5. Do we need post deletion or just hide/archive?

### Awaiting User Input
- Design code confirmation (user mentioned they will provide)
- Initial topic list preferences beyond examples given
- Admin user setup preferences
- Events section priority and data source

## Next Action Items (Priority Order)

### High Priority (This Session)
1. Create Next.js 14 project with TypeScript
2. Set up Tailwind CSS with custom theme
3. Initialize Firebase project (Auth, Firestore, Storage)
4. Create basic layout structure (Header, Sidebars, Main)
5. Implement static PostCard component

### Medium Priority (Next Session)
1. Implement authentication flow (Google OAuth + nickname selection)
2. Create post submission form and logic
3. Set up Firestore collections and documents
4. Implement voting system
5. Build feed sorting (Popular, New, Most Voted)

### Low Priority (Future)
1. Add comment system
2. Build admin dashboard
3. Implement moderation tools
4. Add events section
5. Optimize performance and caching

## Development Environment Notes
- **OS**: Windows 10
- **Shell**: PowerShell
- **Workspace**: `C:\Users\Murat\OneDrive\Masaüstü\projects\samsun-forum`
- **Existing Files**: AGENTS.md, CNAME, README.md (placeholder)
- **Git**: Repository exists (GitHub Pages configured via CNAME)

## Communication Preferences
- User may communicate in Turkish when English loses meaning
- Focus on practical implementation over theoretical discussion
- Prefer seeing working code to extensive planning
- School project context: good enough > perfect

