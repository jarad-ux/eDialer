# eDialer

AI-powered dialer platform with Retell AI voice agents and Twilio integration.

## Features

- **AI Voice Agents**: Powered by Retell AI for natural conversations
- **Twilio Integration**: Reliable telephony infrastructure
- **Campaign Management**: Organize and track outbound calling campaigns
- **Contact Management**: Store and manage contact information
- **Call Analytics**: AI-powered call analysis with Claude
- **Webhook Processing**: Real-time call status updates

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Voice AI**: Retell AI
- **Telephony**: Twilio
- **AI Analysis**: Anthropic Claude
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Retell AI account
- Twilio account
- Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jarad-ux/eDialer.git
cd eDialer
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp env.example .env
```

4. Configure your `.env` file with your API keys and database URL.

5. Push the database schema:
```bash
npm run db:push
```

6. Generate Prisma client:
```bash
npm run db:generate
```

7. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## API Endpoints

### Calls
- `POST /api/calls` - Create a new outbound call
- `GET /api/calls` - List calls with filtering

### Webhooks
- `POST /api/webhooks/retell` - Retell AI webhook handler
- `POST /api/webhooks/twilio` - Twilio status callback handler

## Database Schema

Key models:
- **User** - System users (admins, managers, agents)
- **Contact** - Customer/prospect contact information
- **Call** - Call records with transcripts and analytics
- **Campaign** - Calling campaign configuration
- **WebhookLog** - Audit log for incoming webhooks

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
```

## License

MIT
