# Security Specification - Mr Nexora Lab

## 1. Data Invariants
- A user profile must match the authenticated user's UID.
- Only admins can create/edit Tools, Scripts, and Apps.
- Scripts must have valid code and language tags.
- Chats can only be accessed by the user involved or an admin.
- 'Admin' status is determined by the presence of the user's UID in the `/admins/` collection.

## 2. The Dirty Dozen Payloads (Targeting Firestore)

1. **Identity Spoofing**: Attempt to create a user profile with `uid: "victim_id"` while authenticated as `attacker_id`.
2. **Privilege Escalation**: Attempt to write a document to `/admins/attacker_id` to grant self-admin status.
3. **Ghost Field Update**: Update a tool listing with `isVerified: true` (a field not in schema).
4. **ID Poisoning**: Attempt to create a document with an ID that is a 2KB junk string.
5. **Orphaned Message**: Attempt to send a message to a chat ID that the user is not a participant of.
6. **Immutable Field Manipulation**: Attempt to change the `createdAt` timestamp of a script.
7. **Negative Downloads**: Attempt to update an app's `downloadsCount` to -100.
8. **Malicious Script Injection**: Upload a script with a 5MB text block in the `code` field.
9. **Chat Eavesdropping**: Attempt to list all chats while not an admin.
10. **State Shortcutting**: Change a support ticket status directly to 'resolved' without admin intervention (if applicable).
11. **Denial of Wallet**: Repeatedly call `get()` on a non-existent document in a loop (mitigated by rules structure).
12. **PII Leak**: Attempt to read the entire `users` collection without being an admin.

## 3. Test Runner Concept
The tests will ensure `PERMISSION_DENIED` for all above payloads using `firestore.rules.test.ts`.
