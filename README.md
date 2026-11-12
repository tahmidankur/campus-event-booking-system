# Campus Event Booking System — Part 2

This frontend contains exactly 15 responsive HTML pages:

1. `index.html` — Home.
2. `events.html` — Searchable event catalogue.
3. `event-details.html` — Event information.
4. `book-event.html` — Booking form.
5. `booking-confirmation.html` — Booking summary.
6. `my-bookings.html` — View and cancel demo bookings.
7. `register.html` — Student registration form.
8. `login.html` — Login form.
9. `profile.html` — Editable student profile.
10. `reset-password.html` — Password reset request.
11. `admin.html` — Administrator dashboard.
12. `manage-events.html` — Event management catalogue.
13. `create-event.html` — Create a demo event.
14. `about.html` — Project information.
15. `contact.html` — Contact form and FAQs.

Open `index.html` to start. A compact main navigation links to Home, Events, and My Bookings, with a native HTML Account dropdown. Footer links provide About, Contact, and Admin access; event and administrator pages link to their related workflows. No build or installation is required. Shared styles are in `assets/styles.css`; interactions are in `assets/app.js`.

## Part 2 behavior

Event search filters the sample and locally created events. Booking forms save reservations in localStorage and open a confirmation page; My Bookings supports cancellation. Capacity checks apply only to bookings in this browser. Event creation updates the local catalogue. Registration validates matching passwords without storing them, and the contact form displays a demo acknowledgement without sending messages. Student names and emails in bookings remain in this browser until its site data is cleared. These are demo reservations only.


Forms use browser validation. Profile changes are saved in browser localStorage for demonstration only. Login and password reset display prototype messages; they do not authenticate users or send emails. Passwords are never stored. The admin dashboard displays sample data and is accessible for design review.

## Part 3: PHP and database integration

Convert the HTML files to `.php` and update links. Extract shared headers and footers into PHP includes. Forms already have named inputs and POST methods: replace `action="#"` with PHP handlers and remove the corresponding JavaScript demo handlers.

- Login: query the users table, verify hashed passwords, and start a PHP session.
- Profile: fetch and update the authenticated user's record.
- Password reset: generate an expiring reset token and email a secure reset link. Add token verification and password update handling to this page.
- Admin: check the administrator role on the server, then query dashboard counts and booking records.

Suggested tables: users, events, bookings, and password_resets. Use prepared SQL statements, server-side validation, escaped output, CSRF protection, and PHP password_hash/password_verify. Never trust browser storage for authentication or authorization.
