# Segment-to-Context Frontend

Next.js frontend application for the Segment-to-Context service.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: React hooks
- **API Client**: Axios

## Features

- **Real-time Dashboard**: Live stream of ingested events with polling
- **Persona Viewer**: Search and view AI-generated user personas
- **Optimistic Updates**: Immediate UI feedback
- **Error Handling**: Graceful error handling and retry logic

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8001
NEXT_PUBLIC_TENANT_ID=your-tenant-id
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── dashboard/         # Real-time dashboard
│   └── personas/          # Persona viewer
├── components/            # React components
│   └── ui/                # Shadcn/ui components
├── lib/                   # Utilities and API client
│   ├── api.ts            # API client
│   └── utils.ts          # Utility functions
└── package.json          # Dependencies
```

## API Integration

The frontend communicates with the backend API at `NEXT_PUBLIC_API_URL`. All requests include the `X-Tenant-ID` header from `NEXT_PUBLIC_TENANT_ID`.

## Development Notes

- The dashboard polls the API every 2 seconds for new events
- Optimistic updates are used for immediate UI feedback
- Error states are handled gracefully with user-friendly messages
