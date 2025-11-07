# Scientific Research Tokenization DApp

Discover scientific publications, assess impact with an on-platform Research Impact Score (RIS), and simulate funding to mint RES tokens. Built with Next.js (App Router), TailwindCSS, and TypeScript. Blockchain and AI integrations are currently mocked for a smooth demo experience.

## Features

- **Research discovery (mocked)**
  Search relevant publications via a simulated TARS AI service.
  File: `src/services/tarsAI.ts` (mock data, easy to swap to a real API).

- **Impact scoring (RIS)**
  Deterministic scoring using weighted metrics with configurable threshold.
  File: `src/utils/researchScoreCalculator.ts`.
  Weights: Novelty 0.4, Citations 0.3, Peer Reviews 0.2, Journal Impact 0.1.
  Threshold: `TOKENIZATION_THRESHOLD = 6.0`.

- **Funding flows (simulated)**
  - Crypto: simulate funding and token minting; returns a mock tx signature and RES token amount.
  - Fiat: simulate payment and token amount.
  File: `src/components/tokenization/FundingPanel.tsx` + `src/services/solanaService.ts`.

- **Token mint calculation**
  Shared utility ensures consistent math across the app:
  `calculateTokenAmount(risScore, fundingAmount)`.

- **Wallet connect (Phantom-like, simulated)**
  Minimal provider that detects `window.solana` and offers connect/disconnect state.
  File: `src/providers/WalletProvider.tsx`.

- **Toasts & UX**
  App-level toast system for success/error messages.
  File: `src/providers/ToastProvider.tsx`.

- **UI & animations**
  TailwindCSS + Framer Motion + Lucide icons with a clean App Router layout.

## Tech Stack

- Next.js 13 (App Router) • React 18 • TypeScript 5
- TailwindCSS 3 • Framer Motion • Lucide Icons
- Optional Solana stack (future): `@solana/web3.js`, Anchor (see `program/`)

## Project Structure

```
src/
  app/
    layout.tsx         # App shell with global providers (Wallet, Toast)
    page.tsx           # Home page -> renders Dashboard view
    globals.css        # Tailwind base layers
  views/
    Dashboard.tsx      # Main experience (search, list, fund)
  components/
    layout/            # Header, Footer
    research/          # SearchSection, ResearchList, ResearchCard
    tokenization/      # FundingPanel
  providers/           # WalletProvider, ToastProvider
  services/            # tarsAI (mock), solanaService (mock), programService (Anchor skeleton)
  utils/               # researchScoreCalculator (RIS + token math)
program/               # Solana program workspace (not wired to UI yet)
```

## Getting Started

### Prerequisites

- Node.js 18.x (see `.nvmrc`)

### Install & Run

```bash
npm install
npm run dev
# http://localhost:3000
```

### Build & Lint

```bash
npm run build
npm run lint
```

## How It Works

- **Search**: `SearchSection` calls `PublicationService.searchScientificPublications` (mock) and renders results in `ResearchList`/`ResearchCard`.
- **RIS**: `calculateRIS(publication)` normalizes inputs and applies weights to compute a 0–10 score. Tokenization eligibility is `score >= TOKENIZATION_THRESHOLD`.
- **Funding**:
  - Crypto path simulates a Solana transaction (`solanaService.tokenizeResearch`) and yields a mock signature + RES amount.
  - Fiat path simulates a delay and uses the same token calculation utility for parity.
- **Tokens**: `calculateTokenAmount(risScore, fundingAmount)` computes RES awarded (e.g., baseline 10 tokens per SOL scaled by RIS threshold factor).

## Configuration & Env

- The app runs with mock services by default—no env required.
- To integrate a real AI backend later, prefer these public env names (client-safe):
  - `NEXT_PUBLIC_TARS_API_KEY`
  - `NEXT_PUBLIC_TARS_API_URL`
  Update `src/services/tarsAI.ts` accordingly (the old Vite-style `import.meta.env` is not used).

## Solana Program (Optional / Future)

- The `program/` workspace contains an Anchor-based program scaffold. The UI does not call it yet.
- `src/services/programService.ts` shows how an Anchor client could be organized; it is not wired into the app.
- When you decide to integrate on-chain flows:
  - Replace `solanaService` mocks with real `@solana/web3.js`/Anchor calls.
  - Surface real tx signatures and explorer links.

## Roadmap

- Connect to a real TARS AI or LLM-powered research index.
- Implement real on-chain tokenization via Anchor program.
- Add tests and CI typechecking.
- Upgrade Next.js and align ESLint config if desired.

## Notes & Safety

- Current blockchain and AI actions are simulated for demo purposes. No real funds are moved.
- Ensure you understand and audit any on-chain integration before going live.

