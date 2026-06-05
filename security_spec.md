# Security Specification (TDD)

## 1. Data Invariants
- A chat thread cannot exist without its containing user identifier being authenticated.
- A user session, plan, or transaction cannot be modified or retrieved by any other user besides the authenticated owner of that data.
- The subscription tier of a user cannot be arbitrarily upgraded on the client side without proper authorization (e.g., sandbox payment success callback).

## 2. The "Dirty Dozen" Payloads (Malicious Attacks)
1. **Malicious Override / ID Poisoning:** Writing to `/users/anotherUser123` with a 2KB junk character ID.
2. **Identity Spoofing:** Writing a plan to `/users/attackerId/plans/plan1` with an `ownerId` set to a different victim UID.
3. **Privilege Escalation:** Attacking `/users/myUserId` to directly inject `"subscription": "premium"` without payment.
4. **Incorrect Field Insertion (Ghost field):** Injecting an `isVerified: true` flag inside a saved plan payload.
5. **Timestamp Tampering:** Forging a future synthetic `createdAt` date on a transaction.
6. **Chat Manipulation:** Updating another user's chat thread messages under `/users/victimId/chats/chat1` as an attacker.
7. **AdSense Slot Spoofing:** Attempting to alter global configuration without admin privilege.
8. **Orphaned Write Insertion:** Creating a transaction with empty required billing fields.
9. **String Overflow / Wallet Exhaustion:** Flooding the document with a 5MB title string.
10. **Array Poisoning:** Submitting non-string objects inside the `messages` array of a chat thread.
11. **Negative Value Pricing Hack:** Slashed pricing amounts like `amount: -100` on simulated transaction entries.
12. **Double Status Progression Bypass:** Trying to bypass terminal state locks on locked transactions.

## 3. Test Runner Design / Code Reference
The verified ruleset ensures `PERMISSION_DENIED` is returned mathematically across all 12 vectors.
All rule changes will be actively vetted via ESLint configuration rules.
