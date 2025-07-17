# urlz.lat - Smart URL Shortening Platform

A modern, full-featured URL shortening service built with React, TypeScript, and Supabase. Create short, trackable links with advanced analytics, custom branding, and comprehensive link management.

## 🚀 Features

### Core Functionality
- **Smart URL Shortening**: Generate short, memorable links instantly
- **Anonymous Shortening**: No signup required for basic link creation
- **Link Expiration**: Anonymous links expire after 7 days to encourage signup
- **Custom Slugs**: Create branded, memorable links (Pro feature)
- **QR Code Generation**: Automatic QR codes for all logged-in user links
- **Link Verification**: Google Safe Browsing API integration for URL safety
- **Bulk Operations**: Manage multiple links efficiently

### Analytics & Tracking
- **Real-time Analytics**: Track clicks, geographic data, and user behavior
- **Interactive Charts**: Pie charts for browsers, bar charts for countries
- **Geographic Mapping**: Interactive world map showing click locations
- **Device Analytics**: Browser, OS, and device type tracking
- **Click History**: Detailed logs with timestamps and user data
- **Performance Metrics**: Average clicks, total statistics, and trends

### User Experience
- **Responsive Design**: Optimized for all devices and screen sizes
- **Dark/Light Mode**: System-aware theme switching
- **Link Preview**: Safe preview of destination URLs before clicking
- **Copy to Clipboard**: One-click copying of shortened URLs
- **Link Management**: Organize, edit, and delete links from dashboard
- **Search & Filter**: Find links quickly with advanced filtering

### Security & Privacy
- **Row Level Security (RLS)**: Database-level access control
- **URL Verification**: Automatic safety checking with Google Safe Browsing
- **Secure Authentication**: Supabase Auth with email/password and OAuth
- **Data Encryption**: All data encrypted in transit and at rest
- **Privacy Controls**: Transparent data handling and user rights

### Pro Features
- **Custom Domains**: Use your own domain for branded links
- **Advanced Analytics**: Deep insights with conversion tracking
- **Team Collaboration**: Share and manage links across teams
- **API Access**: Programmatic link creation and management
- **Priority Support**: 24/7 dedicated customer support
- **Bulk Import/Export**: Manage large link collections

## 🏗️ Website Structure

### Public Pages
- **Landing Page** (`/`): Hero section with anonymous shortening, value propositions, and QR generator
- **Features** (`/features`): Comprehensive feature overview and pricing plans
- **About** (`/about`): Company information and founder details
- **Contact** (`/contact`): Contact form and support information
- **Transparency** (`/transparency`): Privacy policy and data handling practices

### Authenticated Pages
- **Dashboard** (`/dashboard`): Main user interface with statistics and link management
- **Profile** (`/profile`): Account settings and subscription management
- **Analytics Detail** (`/dashboard/analytics/:linkId`): Detailed analytics for individual links

### Utility Pages
- **Login/Signup** (`/login`): Authentication interface
- **Redirect Handler** (`/:shortCode`): Handles short link redirects with analytics tracking

### Component Architecture
```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── globe-demo.tsx     # Interactive 3D globe
│   │   └── globe.tsx          # Globe implementation
│   ├── Auth.tsx               # Authentication component
│   ├── ConfirmDialog.tsx      # Confirmation dialogs
│   ├── Footer.tsx             # Site footer
│   ├── LinkList.tsx           # Link management table
│   ├── LinkPreviewModal.tsx   # URL preview modal
│   ├── MostActiveLinks.tsx    # Top performing links
│   ├── Navigation.tsx         # Main navigation
│   ├── ProtectedRoute.tsx     # Route protection
│   └── ShortenerForm.tsx      # URL shortening form
├── contexts/
│   ├── AuthContext.tsx        # Authentication state
│   └── ThemeContext.tsx       # Theme management
├── pages/
│   ├── Home.tsx               # Landing page
│   ├── Dashboard.tsx          # Main dashboard
│   ├── About.tsx              # About page
│   ├── Contact.tsx            # Contact page
│   ├── Features.tsx           # Features page
│   ├── ProfilePage.tsx        # User profile
│   ├── TransparencyPage.tsx   # Privacy policy
│   ├── AnalyticsDetailPage.tsx # Detailed analytics
│   └── Redirect.tsx           # Redirect handler
└── lib/
    ├── supabase.ts            # Supabase client
    └── utils.ts               # Utility functions
```

## 🛠️ Technical Stack

### Frontend
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Full type safety and enhanced developer experience
- **Vite**: Lightning-fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **React Router**: Client-side routing with protected routes
- **Chart.js**: Interactive charts and data visualization
- **React Leaflet**: Interactive maps for geographic analytics
- **QR Code Generation**: Real-time QR code creation and display
- **Framer Motion**: Smooth animations and micro-interactions

### Backend & Database
- **Supabase**: Backend-as-a-Service with PostgreSQL database
- **Edge Functions**: Serverless functions for API endpoints
- **Row Level Security**: Database-level access control
- **Real-time Subscriptions**: Live data updates
- **File Storage**: QR code and asset storage
- **Database Functions**: Custom PostgreSQL functions for analytics

### Infrastructure
- **Netlify**: Static site hosting with global CDN
- **Supabase Edge Runtime**: Serverless function execution
- **PostgreSQL**: Robust relational database with ACID compliance
- **Global CDN**: Fast content delivery worldwide

### APIs & Integrations
- **Google Safe Browsing API**: URL safety verification
- **IP Geolocation**: Anonymous location data for analytics
- **Supabase Auth**: Authentication and user management
- **Supabase Storage**: File upload and management

## 📊 Database Schema

### Core Tables
```sql
-- Users table (managed by Supabase Auth)
-- Stores authentication data

-- Profiles table
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  subscription_tier subscription_tier DEFAULT 'free',
  updated_at TIMESTAMPTZ DEFAULT now()
)

-- URLs table
urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  long_url TEXT NOT NULL,
  short_code VARCHAR(10) UNIQUE,
  custom_slug VARCHAR(50) UNIQUE,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  is_verified BOOLEAN DEFAULT false,
  qr_code_path TEXT
)

-- Click analytics table
clicks_log (
  id BIGINT PRIMARY KEY,
  url_id UUID REFERENCES urls(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  country TEXT,
  city TEXT,
  browser_name TEXT,
  os_name TEXT,
  device_type TEXT
)
```

### Custom Types
```sql
-- Subscription tiers
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'business');
```

## 🔧 Edge Functions

### Core Functions
- **`shorten-url`**: Creates shortened URLs with QR code generation
- **`redirect`**: Handles redirects with analytics tracking and expiration checks
- **`get-dashboard-stats`**: Aggregates user statistics and metrics
- **`preview-url`**: Fetches URL metadata for safe previewing
- **`verify-url`**: Checks URL safety using Google Safe Browsing API

### Function Features
- **CORS Support**: Cross-origin request handling
- **Authentication**: JWT token validation
- **Error Handling**: Comprehensive error responses
- **Rate Limiting**: Built-in protection against abuse
- **Logging**: Detailed function execution logs

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- Google API key for Safe Browsing (optional)

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/urlz-lat.git
   cd urlz-lat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Run database migrations**
   ```bash
   # Run the SQL migrations in your Supabase dashboard
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_URL=http://localhost:5173
GOOGLE_API_KEY=your_google_api_key (optional)
```

## 📈 Analytics Features

### User Analytics
- **Click Tracking**: Real-time click counting and analytics
- **Geographic Data**: Country and city-level location tracking
- **Device Analytics**: Browser, OS, and device type identification
- **Time-based Analytics**: Click patterns over time
- **Referrer Tracking**: Source of traffic identification

### Visual Analytics
- **Interactive Charts**: Pie charts for browser distribution
- **Geographic Maps**: World map with click markers
- **Bar Charts**: Country-wise click distribution
- **Trend Analysis**: Performance over time
- **Export Capabilities**: Data export for external analysis

## 🔐 Security Features

### Data Protection
- **Encryption**: All data encrypted in transit (TLS 1.3) and at rest (AES-256)
- **Access Controls**: Role-based access with multi-factor authentication
- **Regular Audits**: Quarterly security assessments
- **Monitoring**: 24/7 security monitoring and incident response

### URL Safety
- **Google Safe Browsing**: Automatic URL safety verification
- **Malware Detection**: Protection against malicious links
- **Phishing Protection**: Advanced threat detection
- **User Warnings**: Clear safety indicators for users

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#2563eb) for main actions and branding
- **Secondary**: Purple (#9333ea) for premium features
- **Success**: Green (#10b981) for positive actions
- **Warning**: Orange (#f59e0b) for cautions
- **Error**: Red (#ef4444) for errors and deletions

### Typography
- **Headings**: Inter font family with multiple weights
- **Body**: System font stack for optimal readability
- **Code**: Monospace fonts for technical content

### Components
- **Consistent Spacing**: 8px grid system
- **Rounded Corners**: 8px border radius for modern feel
- **Shadows**: Layered shadows for depth and hierarchy
- **Animations**: Smooth transitions and micro-interactions

## 📱 Mobile Optimization

### Responsive Design
- **Mobile-First**: Designed for mobile devices first
- **Touch-Friendly**: Large touch targets and gestures
- **Fast Loading**: Optimized images and lazy loading
- **Offline Support**: Service worker for offline functionality

### Performance
- **Code Splitting**: Lazy loading of route components
- **Image Optimization**: WebP format with fallbacks
- **Caching**: Aggressive caching strategies
- **Bundle Size**: Optimized bundle splitting

## 🔄 Deployment

### Production Deployment
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   # Connect your repository to Netlify
   # Set environment variables in Netlify dashboard
   # Deploy automatically on push to main branch
   ```

3. **Configure redirects**
   ```toml
   # netlify.toml
   [[redirects]]
   from = "/r/:short_code"
   to = "https://your-supabase-url/functions/v1/redirect/:short_code"
   status = 302
   ```

### Environment Setup
- **Production**: Netlify with Supabase backend
- **Staging**: Preview deployments for testing
- **Development**: Local development with Supabase

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Comprehensive guides and API docs
- **Community**: Discord server for community support
- **Email Support**: support@urlz.lat for direct assistance
- **Bug Reports**: GitHub issues for bug tracking

### Contact Information
- **Website**: https://urlz.lat
- **Email**: hello@urlz.lat
- **Twitter**: @urlzlat
- **LinkedIn**: /company/urlzlat

---

Built with ❤️ by the urlz.lat team. Making the web more connected, one link at a time.