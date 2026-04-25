# Security Specification - Mr Nexora Lab

## Data Invariants
1. A user can only create their own profile.
2. Only designated admins (mahamudurrahman778@gmail.com) can be assigned the 'admin' role.
3. Users can only access chat sessions where they are participants.
4. Support messages must belong to an existing chat session.
5. Public listings (Tools, Scripts, Apps) are read-only for public, write-only for admins.
6. App download counts can be incremented by anyone.

## The Dirty Dozen Payloads (Targeting Rejection)

1. **Identity Spoofing**: Try to create a user profile with a different UID.
2. **Privilege Escalation**: Try to create a user profile with `role: 'admin'` as a non-admin email.
3. **Ghost Field Injection**: Add `isVerified: true` to a user profile update.
4. **Chat Hijacking**: Try to read a `chats/{chatId}` where the user's UID is not in `participants`.
5. **Message PEE**: Try to write a message to a chat the user doesn't belong to.
6. **Relational Orphan**: Create a message in a chat that doesn't exist.
7. **Resource Poisoning**: Create a script with a 2MB `code` field (exceeding string limits).
8. **Immutability Breach**: Try to update `createdAt` on a user profile.
9. **Role Theft**: An admin trying to update their own `role` to something else (if immutable).
10. **Query Scraping**: Try to list all `users` without admin privileges.
11. **App Metadata Tampering**: Try to update the `link` or `title` of an app listing without being an admin.
12. **ID Poisoning**: Try to create a chat with a 2KB long string as ID.

## Test Runner (Conceptual)
All the above payloads will be tested against the security rules and must return `PERMISSION_DENIED`.
