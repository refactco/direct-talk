# Direct Talk

A Next.js application that allows users to have conversations with AI personas based on notable figures and thinkers.

## Features

- Chat with AI personas of various intellectuals and thought leaders
- User authentication with Google OAuth
- Chat history and session management
- Resource recommendations based on conversations
- Responsive design for desktop and mobile

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account for database and authentication

### Installation

1. Clone the repository:

```bash
git clone https://github.com/refactco/direct-talk.git
cd direct-talk
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Fill in your Supabase and other API credentials in `.env.local`.

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase
- **Authentication**: Supabase Auth with Google OAuth
- **State Management**: React Context API
- **TypeScript**: Full type safety

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - Reusable React components
- `/contexts` - React context providers for state management
- `/lib` - Utility functions and configurations
- `/types` - TypeScript type definitions
