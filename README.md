# XMR Meet

**XMR Meet** is an open-source, community-driven platform for Monero enthusiasts who enjoy connecting with others **in person and exchanging Monero and cash**. The website is designed for hobbyists and enthusiasts to discover fellow community members in their area who are open to casual, in-person exchanges.

This project is built for **fun, education, and community engagement**—a simple way to see who’s around, share your interest in meeting up, and connect with like-minded peers who enjoy exchanging value in person.

## How It Works

- Users can create a profile and indicate:

  - Their city or general location
  - Whether they are available to hang out
  - Whether they are available to exchange **Monero for cash, cash for Monero, or both**

- All communication and meetup details happen **offline**, via any third-party messaging service (Signal, WhatsApp, Telegram, email, etc.). XMR Meet is just a directory for those interested in meeting up - it does not handle trades directly.

- The platform does **not** facilitate pricing, trading rates, or commercial transactions. It’s purely for hobbyists who enjoy **in-person P2P exchanges as a fun, community activity**.

## Features

- Quickly see who in your area is open to discussing Monero and/or helping out with casual Monero-cash exchanges
- Open-source and freely available under the **AGPLv3 License**
- Focused on community, connection, and shared enthusiasm for Monero

# XMR Meet: Rules & Safety Guide

XMR Meet is for Monero enthusiasts who enjoy casual, in-person exchanges. While the platform is for fun and community, personal safety should always come first. Follow these guidelines to make your meetups safe, secure, and enjoyable.

---

## General Safety

- **Meet in public, busy places**: Parks, cafés, co-working spaces, or shopping areas are ideal. Avoid secluded locations, parking lots, or private homes for first-time meetings.
- **Daytime is best**: If possible, schedule meetups during daylight hours when visibility is higher and more people are around.
- **Bring a friend**: Let someone know where you’re going and who you’re meeting. If you can, bring a trusted friend along for your first meetup.
- **Stay alert**: Keep your phone accessible, be aware of your surroundings, and trust your instincts. If something feels off, cancel or leave.
- **Limit distractions**: Avoid headphones or being too engrossed in your phone during the meetup.

---

## Transaction Limits & Handling

- **Start small**: For first-time meetups, keep transactions under $300 USD worth of Monero. Gradually increase amounts once trust is established.
- **Count and verify cash discreetly**: Ensure both parties agree on the amount before completing the exchange.
- **Verify Monero transfers**: Double-check wallet addresses and amounts. Confirm transactions have been completed before handing over cash.
- **Separate your funds**: Don’t carry more cash or Monero than necessary for a single meetup.

---

## Communication & Planning

- **Use secure messaging apps**: Signal, Telegram, WhatsApp, or email. Avoid sharing sensitive info publicly.
- **Confirm details before meeting**: Double-check location, time, and amount. Consider sending a photo of the meetup spot if needed.
- **Have a backup plan**: Agree on what to do if one party is late or cancels.

---

## Street-Smart Tips

- **Scout the location first**: Check the area for safety, foot traffic, and exit routes.
- **Sit near exits**: In cafés or public spaces, pick a table near the door or in clear view of staff.
- **Be aware of surroundings**: Keep an eye out for suspicious behavior or anyone following you.
- **Limit personal info**: Only share what’s necessary for the meetup. Avoid giving your home address or sensitive identifiers.
- **Use cash wisely**: Don’t flash large bills; keep it discreet.
- **Split large transactions**: For repeat meetups, break larger amounts into smaller transactions for safety.
- **Park smart**: If driving, park in well-lit areas with visibility from the street.

---

## Conduct

- **Respect boundaries**: Everyone is there to safely exchange Monero. Be polite, professional, and friendly.
- **No pricing discussion on the platform**: Discuss prices and rates privately offline.
- **Be punctual**: Respect others’ time; communicate delays immediately.
- **Avoid risky behavior**: Don’t agree to exchanges that feel unsafe, pressured, or suspicious.

---

## Building Trust

- **Start with small amounts**: Test the process before committing to larger exchanges.
- **Repeat meetups**: Trust builds over time—don’t feel pressured to transact large amounts immediately.
- **Reference mutual contacts if possible**: If you have community connections, it can help establish credibility.
- **Report unsafe behavior**: If someone behaves inappropriately, block them and report to the platform.

---

## Final Note

XMR Meet is all about community, fun, and safe in-person exchanges. By following these street-smart tips and guidelines, you can enjoy connecting with fellow Monero enthusiasts while keeping yourself and others safe.

---

# Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Setup

1. **Fork or Clone the Repository**

   ```bash
   git clone https://github.com/zechnologic/xmrmeet.git
   cd xmrmeet
   ```

2. **Install Dependencies**

   ```bash
   npm install
   cd client && npm install && cd ..
   ```

3. **Configure Environment Variables**

   Copy `.env.example` to `.env` and configure your local settings:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your local PostgreSQL credentials and other settings.

4. **Set Up the Database**

   Create a PostgreSQL database and run the initialization:

   ```bash
   npm run reset-db
   ```

### Running Locally

#### Option 1: Full Production-Like Build

Run the full build and serve from backend (localhost:3000):

```bash
npm run dev
```

#### Option 2: Development Mode (Recommended for Frontend Work)

Run both servers separately for hot-reload during development:

**Terminal 1 - Backend Server:**

```bash
npm run dev:server
```

Backend runs at `http://localhost:3000`

**Terminal 2 - Vite Dev Server:**

```bash
npm run dev:client
```

Frontend runs at `http://localhost:5173` with hot-reload

API requests from `:5173` are automatically proxied to `:3000`.

### Project Structure

```
xmrmeet/
├── client/          # React frontend (Vite + TypeScript)
├── server/          # Express backend (TypeScript)
│   ├── index.ts     # Main server entry point
│   ├── routes/      # API routes
│   ├── middleware/  # Custom middleware
│   └── services/    # Business logic
├── .env.example     # Example environment variables
└── package.json     # Root package.json with scripts
```

### Making Changes

1. Create a new branch for your feature or fix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test them locally

3. Commit your changes with clear, descriptive commit messages:

   ```bash
   git commit -m "Add feature: description of what you added"
   ```

4. Push to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a Pull Request on GitHub with a description of your changes

### Guidelines

- Follow the existing code style and conventions
- Test your changes thoroughly before submitting
- Keep PRs focused on a single feature or fix
- Update documentation if you're changing functionality
- Be respectful and constructive in discussions

### Questions?

If you have questions or need help getting started, feel free to open an issue on GitHub.

---

## License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. See the LICENSE file for details.
