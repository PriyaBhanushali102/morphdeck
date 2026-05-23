# MorphDeck — AI-Powered Presentation Generator

MorphDeck is a full-stack web application that lets users generate professional PowerPoint presentations from a natural language prompt. It combines Google Gemini AI for content generation, a rich in-browser slide editor, Stripe payments for a credit-based monetization model, and server-side PPTX / client-side PDF export.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Architecture Overview](#architecture-overview)
4. [Data Models](#data-models)
5. [Feature Flows](#feature-flows)
   - [Authentication](#authentication-flow)
   - [Presentation Generation](#presentation-generation-flow)
   - [Presentation Editing](#presentation-editing-flow)
   - [Image Upload & AI Images](#image-upload--ai-image-flow)
   - [Export (PPTX & PDF)](#export-flow)
   - [Payments & Credits](#payment--credits-flow)
6. [API Reference](#api-reference)
7. [Client-Side State](#client-side-state)
8. [Theme System](#theme-system)
9. [Security](#security)
10. [Environment Variables](#environment-variables)
11. [Getting Started](#getting-started)

---

## Tech Stack

### Backend (`/server`)
| Layer | Technology |
|---|---|
| Runtime | Node.js + Express 5 |
| Database | MongoDB + Mongoose |
| AI | Google Gemini (`gemini-3-flash-preview`, `gemini-2.5-flash-preview-image-generation`) |
| Payments | Stripe |
| File Storage | Cloudinary |
| Auth | JWT + bcrypt + httpOnly cookies |
| Email | Nodemailer |
| PPTX Generation | pptxgenjs |
| Validation | Joi |
| Security | Helmet, express-rate-limit, CORS |

### Frontend (`/client`)
| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Routing | React Router v7 |
| State | Zustand (persisted) |
| Rich Text | TipTap (with color, highlight, font, align extensions) |
| Styling | Tailwind CSS + Radix UI |
| HTTP | Axios (with interceptors) |
| PDF Export | html2canvas + jsPDF |
| Animations | Framer Motion |
| Notifications | React Hot Toast |

---

## Project Structure

```
morphdeck/
├── client/                     # React frontend (Vite)
│   └── src/
│       ├── App.jsx             # Router + route guards
│       ├── pages/              # Full-page views
│       ├── components/
│       │   ├── auth/           # ProtectedRoute, PublicRoute, forms
│       │   ├── chat/           # ChatInput, MessageList, SuggestionCard
│       │   ├── editor/         # SlideCard, SlideCarousel, SortableList,
│       │   │                   # EditToolbar, TipTapEditor, CustomThemeBuilder
│       │   ├── landing/        # Marketing page sections
│       │   └── ui/             # Radix-based design system components
│       ├── config/             # Theme definitions, editor constants, font sizes
│       ├── hooks/              # useUndoRedo, useSlideManager, useHistory
│       ├── services/           # Axios wrappers (api, auth, ppt, upload, payment, user)
│       └── store/              # Zustand stores (auth, UI, history)
│
└── server/                     # Express backend
    ├── server.js               # Entry point, middleware, route mounting
    ├── config/                 # DB, Cloudinary, env, rate limiters
    ├── controllers/            # authController, pptController, paymentController,
    │                           # uploadController, userController
    ├── middleware/             # authMiddleware, ErrorHandler, upload (multer), validate
    ├── models/                 # User, Presentation (Mongoose schemas)
    ├── routes/                 # authRoutes, pptRoutes, userRoutes,
    │                           # uploadRoutes, paymentRoutes, aiRoutes
    ├── services/               # aiService (Gemini calls)
    ├── utilities/              # AppError, pptExporter, sendEmail, theme colors, wrapAsync
    └── validations/            # Joi schemas for all endpoints
```

---

## Architecture Overview

```
Browser (React)
    │
    │  REST API (Axios + JWT Bearer / httpOnly cookie)
    ▼
Express Server (Node.js)
    ├── Auth routes      → JWT generation, bcrypt, email reset
    ├── PPT routes       → AI generation, CRUD, PPTX export
    ├── Upload routes    → Multer → Cloudinary, Gemini image gen
    ├── Payment routes   → Stripe checkout session + webhook
    ├── AI routes        → Text rewrite via Gemini
    └── User routes      → Profile, password, history
         │
         ├── MongoDB (Mongoose)   — Users, Presentations
         ├── Google Gemini API    — Slide content + image generation
         ├── Cloudinary           — Image storage
         ├── Stripe               — Payment processing
         └── Nodemailer           — Password reset emails
```

---

## Data Models

### User
```js
{
  name:                 String,   // max 30 chars
  email:                String,   // unique, lowercase
  password:             String,   // bcrypt hashed, select: false
  resetPasswordToken:   String,   // SHA-256 hashed token
  resetPasswordExpire:  Date,     // 15-minute window
  credits:              Number,   // default: 5 (free tier)
  createdAt, updatedAt
}
```

### Presentation
```js
{
  userId:      ObjectId,          // ref: User
  topic:       String,            // max 200 chars
  slides: [{
    title:        String,
    content:      [String],       // HTML strings (TipTap output)
    speakerNotes: String,
    images: [{
      url, x, y, w, h,           // CSS units / percentages
      rotate, opacity
    }],
    layout: "default" | "title_center" | "split_left" | "split_right"
  }],
  templateId:  String,            // built-in theme ID or "custom"
  customTheme: Object,            // { colors: {bg, text, accent}, font }
  tone:        String,
  slideCount:  Number,
  status:      "success" | "failed" | "processing" | "deleted",
  createdAt, updatedAt
}
// Indexes: { userId, status } and { userId, createdAt }
```

---

## Feature Flows

### Authentication Flow

```
Register
  → POST /api/auth/register
  → Validate (Joi) → Check email uniqueness
  → bcrypt hash password (salt 10)
  → Create User (5 free credits)
  → Sign JWT (1h expiry)
  → Set httpOnly cookie (7 days)
  → Return { token, user }

Login
  → POST /api/auth/login
  → Find user by email
  → bcrypt.compare password
  → Sign JWT → Set cookie
  → Return { token, user }

Forgot Password
  → POST /api/auth/forgot-password
  → Generate crypto random token
  → SHA-256 hash stored in DB with 15-min expiry
  → Send reset link via Nodemailer
  → POST /api/auth/reset-password/:token
  → Verify hash + expiry → Update password

Client (Zustand useAuthStore)
  → Persists { user, token, isAuthenticated } to localStorage
  → Axios interceptor attaches Bearer token to every request
  → On 401 response → clearAuth() + redirect to /login
```

**Route Guards:**
- `<ProtectedRoute>` — redirects unauthenticated users to `/login`
- `<PublicRoute>` — redirects authenticated users away from login/register

---

### Presentation Generation Flow

```
1. User types prompt in HomeChat → handleSendMessage()
2. Check credits > 0 (client-side guard)
3. POST /api/ppt/generate  { prompt }

Server:
4. parsePresentationRequest(prompt)
   → Gemini extracts: topic, slideCount, tone, detail, instructions, templateId
   → Falls back to defaults if parsing fails

5. Validate credits > 0 (server-side guard)

6. generateSlideContent(topic, slideCount, detail, tone, instructions)
   → Gemini prompt enforces:
      - First slide: "Introduction", last slide: "Conclusion"
      - Bullet points: 8–12 words, scannable
      - Layout per slide: title_center (first/last), split_left/right (visual),
        default (data-heavy)
   → Returns JSON array of slide objects

7. Presentation.create({ userId, topic, slides, templateId, tone, status: "success" })
8. user.credits -= 1  →  user.save()
9. Return { pptId, slides, remainingCredits }

Client:
10. updateUser({ credits: credits - 1 })  (optimistic update)
11. navigate(`/presentation/${pptId}`)  after 1.5s
```

---

### Presentation Editing Flow

```
Load
  → GET /api/ppt/:id  (auth) or GET /api/ppt/view/:id  (public, read-only)
  → setPpt() into useUndoRedo state

Edit (any change)
  → handleSlideUpdate(index, field, value)
  → setPpt() records new state in undo history (max 50 snapshots)
  → isDirty = true

Undo / Redo
  → Ctrl+Z / Ctrl+Y (or Ctrl+Shift+Z)
  → useUndoRedo moves through past[] / future[] arrays

Slide Management (useSlideManager)
  → Add slide:       Enter key or toolbar button
  → Delete slide:    Ctrl+Delete or toolbar button (min 1 slide)
  → Duplicate slide: Ctrl+D

Reorder
  → Drag in SortableList sidebar
  → handleReorder() → debounced PATCH /api/ppt/:id { slides } (1s delay)

Save
  → handleSave() → PATCH /api/ppt/:id { slides, templateId, customTheme }
  → isDirty = false

Theme Change
  → handleThemeChange(themeId | customThemeObject)
  → Immediate PATCH /api/ppt/:id { templateId, customTheme }

Present Mode
  → requestFullscreen() → SlideCarousel in "present" viewMode
  → Click left/right 20% zones to navigate slides
  → ESC exits fullscreen

Share
  → Copy /view/:id URL to clipboard (public read-only link)

Unsaved Changes Guard
  → beforeunload event fires if isDirty = true
```

---

### Image Upload & AI Image Flow

```
Manual Upload
  → User selects file in EditToolbar
  → POST /api/upload  (multipart/form-data)
  → Multer validates: max 5MB, JPEG/PNG/WebP/GIF only
  → Cloudinary upload (folder: "ai-ppt-generator")
  → Return { url }
  → Append image to slide.images[] with default position

AI Image Generation
  → POST /api/upload/generate-ai  { slideTitle, slideContent }
  → Try Gemini image generation first:
      "Professional corporate stock photo for slide titled '...'"
      No text, no watermarks
  → If Gemini fails → fallback to Unsplash API
      (query = first 3 words of title, landscape orientation)
  → Upload result to Cloudinary (folder: "morphdeck/ai-generated")
  → Return { url, source: "ai" | "unsplash" }

Image Positioning (client)
  → react-moveable for drag/resize/rotate
  → Stored as { x, y, w, h, rotate, opacity } in slide.images[]
```

---

### Export Flow

```
PPTX Export (server-side)
  → GET /api/ppt/export/:id
  → Fetch presentation from DB
  → Resolve theme (built-in or customTheme)
  → pptxgenjs:
      For each slide:
        - Set background color
        - Add title text (theme font + color)
        - Add accent line (except title_center layout)
        - Parse HTML content → formatted bullet runs
          (preserves bold, italic, underline, strikethrough,
           color, font-family, font-size, highlight)
        - Add images (base64 fetched from URL, with position/rotation/opacity)
        - Add page number (bottom-right)
  → Stream buffer as .pptx attachment

PDF Export (client-side)
  → Render all slides off-screen at 1280×720px
  → html2canvas captures each slide at 2× scale (high-res)
  → jsPDF assembles landscape PDF (1280×720 per page)
  → Browser downloads .pdf file
```

---

### Payment & Credits Flow

```
Purchase
  → User clicks "Purchase 50 Credits" on /billing
  → POST /api/payments/checkout  { planId: "pro_50_credits" }
  → Stripe checkout session created:
      Product: "Pro Creator Pack (50 Credits)" — $5.00 one-time
      Metadata: { userId, creditsToAdd: "50" }
  → Redirect to Stripe hosted checkout

Success
  → Stripe redirects to /billing?success=true
  → Stripe sends POST /api/payments/webhook
  → Server verifies Stripe signature
  → On "checkout.session.completed":
      user.credits += 50  →  user.save()
  → Client polls GET /api/users/me after 4s delay
  → Updated credit balance shown in UI

Cancel
  → Stripe redirects to /billing?canceled=true
  → Toast notification shown, no credits added
```

---

## API Reference

### Auth  `/api/auth`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | — | Register new user |
| POST | `/login` | — | Login |
| POST | `/logout` | ✓ | Clear session cookie |
| POST | `/forgot-password` | — | Send reset email |
| POST | `/reset-password/:token` | — | Reset password |

### Presentations  `/api/ppt`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/generate` | ✓ | Generate presentation from prompt (costs 1 credit) |
| GET | `/` | ✓ | Get all active presentations |
| GET | `/:id` | ✓ | Get presentation by ID |
| GET | `/view/:id` | — | Public read-only view |
| PATCH | `/:id` | ✓ | Update slides / theme / tone / status |
| DELETE | `/:id` | ✓ | Soft delete (moves to trash) |
| GET | `/deleted/all` | ✓ | Get trashed presentations |
| PATCH | `/restore/:id` | ✓ | Restore from trash |
| DELETE | `/permanent/:id` | ✓ | Permanently delete |
| GET | `/export/:id` | ✓ | Download as .pptx |

### Users  `/api/users`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/me` | ✓ | Get current user profile |
| PATCH | `/me` | ✓ | Update name |
| DELETE | `/me` | ✓ | Delete account + all presentations |
| GET | `/history` | ✓ | All presentations sorted by date |
| PATCH | `/changepassword` | ✓ | Change password |

### Upload  `/api/upload`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | ✓ | Upload image → Cloudinary |
| POST | `/generate-ai` | ✓ | Generate AI image (Gemini → Unsplash fallback) |

### Payments  `/api/payments`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/checkout` | ✓ | Create Stripe checkout session |
| POST | `/webhook` | — | Stripe webhook (raw body) |

### AI  `/api/ai`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/rewrite` | ✓ | Rewrite bullet point (punchy / expand / default) |

### Rate Limits
| Limiter | Window | Max Requests |
|---|---|---|
| General (all `/api`) | 15 min | 100 |
| Auth (login/register) | 15 min | 10 |
| Forgot Password | 1 hour | 5 |
| PPT Generation | 1 hour | 20 |

---

## Client-Side State

### `useAuthStore` (Zustand, persisted)
```js
{
  user:            Object | null,
  token:           String | null,
  isAuthenticated: Boolean,
  setAuth(user, token),
  updateUser(partialUser),
  clearAuth()
}
// Persisted to localStorage as "auth-storage"
```

### `useUIStore` (Zustand)
```js
{
  isSidebarOpen: Boolean,
  toggleSidebar(),
  setSidebar(bool)
}
```

### `useHistoryStore` (Zustand)
```js
{
  history:      Presentation[],
  loading:      Boolean,
  lastFetched:  Date | null,
  fetchHistory(),
  addToHistory(ppt),
  removeFromHistory(id)
}
```

### `useUndoRedo` (custom hook)
```js
// Maintains past[], present, future[] — max 50 snapshots
{ state, set, undo, redo, canUndo, canRedo }
```

### `useSlideManager` (custom hook)
```js
// Keyboard shortcuts: Enter (add), Ctrl+D (duplicate), Ctrl+Delete (remove)
{ addSlide, deleteSlide, duplicateSlide }
```

---

## Theme System

Seven built-in themes are defined in `client/src/config/themes.js`. Each theme provides:

```js
{
  bg:         String,   // background color
  text:       String,   // primary text color
  accent:     String,   // accent / highlight color
  secondary:  String,
  border:     String,
  font:       String    // font family name
}
```

| ID | Name | Font |
|---|---|---|
| `modern_blue` | Modern Blue | Inter |
| `midnight_dark` | Midnight Dark | Inter |
| `sunset_vibes` | Sunset Vibes | Poppins |
| `college_classic` | College Classic | Merriweather |
| `emerald_forest` | Emerald Forest | Poppins |
| `neon_cyber` | Neon Cyber | Inter |
| `royal_elegance` | Royal Elegance | Playfair Display |

Users can also build a **custom theme** via `CustomThemeBuilder`, which stores `{ colors: { background, text, accent }, font }` in `presentation.customTheme`. When `templateId === "custom"`, the custom theme is used for both the editor preview and PPTX export.

---

## Security

| Concern | Implementation |
|---|---|
| Password storage | bcrypt, salt rounds: 10 |
| Session tokens | JWT (1h) + httpOnly cookie (7 days) |
| XSS | httpOnly cookies, Helmet headers |
| CSRF | SameSite: strict cookie |
| Brute force | express-rate-limit on auth + PPT routes |
| Input validation | Joi schemas on every endpoint |
| File uploads | MIME type + size validation (Multer) |
| Stripe webhooks | Signature verification |
| Error leakage | Generic messages in production |
| Image cleanup | Cloudinary assets deleted on permanent presentation delete |

---

## Environment Variables

### Server (`server/.env`)
```env
PORT=5000
MONGO_URI=
NODE_ENV=development

JWT_SECRET=
JWT_EXPIRATION=1h

CORS_ORIGIN=http://localhost:5173

GEMINI_API_KEY=
UNSPLASH_ACCESS_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Accounts / API keys: Google Gemini, Cloudinary, Stripe, Unsplash

### Server
```bash
cd server
npm install
# fill in server/.env
npm run dev        # nodemon server.js on port 5000
```

### Client
```bash
cd client
npm install
# fill in client/.env
npm run dev        # Vite dev server on port 5173
```

### Stripe Webhook (local dev)
```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```
Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

---

## Key Pages

| Route | Page | Access |
|---|---|---|
| `/` | Landing page | Public |
| `/login` | Login | Public only |
| `/register` | Register | Public only |
| `/forgot-password` | Forgot password | Public only |
| `/reset-password/:token` | Reset password | Public only |
| `/home` | Chat — generate presentation | Auth |
| `/presentation/:id` | Presentation editor | Auth |
| `/view/:id` | Read-only presentation viewer | Public |
| `/library` | All presentations | Auth |
| `/trash` | Deleted presentations | Auth |
| `/billing` | Credits & payment | Auth |
| `/profile` | User profile | Auth |
| `/settings` | Settings | Auth |
