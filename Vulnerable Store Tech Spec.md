# Vulnerable Store Tech Spec

> The mock e-commerce app that serves as the "target" for all heist scenarios.

---

## Purpose
Players interact with this store to complete missions. Each scenario exploits or interacts with a specific feature.

---

## Core Features Needed

### User System
- [ ] Account creation/login
- [ ] Credit balance (the "dirty money")
- [ ] Transaction history log

### Store System
- [ ] Product catalog with prices
- [ ] Shopping cart
- [ ] Checkout flow
- [ ] Gift card / promo code redemption (for Two Sum scenario)

### Admin System
- [ ] Admin console (locked - unlocked via Scenario 1)
- [ ] Refund button (exploitable - Scenario 2)
- [ ] Audit logs

### Shadow Market
- [ ] Hidden marketplace (unlocked via Scenario 5)
- [ ] Rare items with price history (for Scenario 3)
- [ ] Seller leaderboard (for Scenario 4)

---

## Tech Stack (DECIDED)

> **Built with Lovable.dev**

### Live App
https://shadow-market-node.lovable.app/

### Repository
https://github.com/dev-woc/shadow-market-node.git

### Why Lovable
- Fast iteration
- AI-assisted development
- Deployed and shareable immediately

---

## Visual Style

### Aesthetic Goals
- Terminal/hacker vibe
- Dark mode default
- Glitch effects on "exploits"
- ASCII art elements

### Color Palette
- Background: `#0a0a0a`
- Primary: `#00ff00` (matrix green)
- Accent: `#ff0040` (alert red)
- Text: `#e0e0e0`

---

## Scenario Integration Points

| Scenario | Feature Used |
|----------|--------------|
| 1 - Gatekeeper | Gift card + cart total |
| 2 - Money Glitch | Refund button |
| 3 - The Wash | Price history chart |
| 4 - Bot Swarm | Voting/leaderboard |
| 5 - Secret Knock | Hidden door input |
| 6 - Takeover | Inventory merge UI |
| 7 - Glitched ID | Shipment tracker |
| 8 - Leaderboard | Rich list display |
| 9 - Paper Trail | Transaction log view |
| 10 - Cooking Books | Profit report |

---

## Related
- [[Digital Heist Rollout]]
- [[Content Production Pipeline]]

