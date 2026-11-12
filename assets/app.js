"use strict";

// 1. Find the form on the current page.
// Home and admin pages have no form, so no form code runs there.
const form = document.querySelector("form");
const profileKey = "campus-profile";

// 2. Load saved demo profile information.
// localStorage saves data in this browser only. PHP will replace it in Part 3.
if (form && form.dataset.form === "profile") {
  try {
    const savedProfile = localStorage.getItem(profileKey);

    if (savedProfile) {
      const profile = JSON.parse(savedProfile);

      form.elements.full_name.value = profile.full_name;
      form.elements.email.value = profile.email;
      form.elements.student_id.value = profile.student_id;
      form.elements.department.value = profile.department;
    }
  } catch {
    // Keep the sample profile if browser storage is unavailable.
  }
}

// 3. Handle form submission after the browser validates required fields.
if (form) {
  form.addEventListener("submit", function (event) {
    // Prevent a page reload while this project uses demo behavior.
    event.preventDefault();

    const formType = form.dataset.form;
    const message = form.querySelector(".form-message");

    // 3a. Profile: save student details without storing any passwords.
    if (formType === "profile") {
      const profile = {
        full_name: form.elements.full_name.value,
        email: form.elements.email.value,
        student_id: form.elements.student_id.value,
        department: form.elements.department.value
      };

      try {
        localStorage.setItem(profileKey, JSON.stringify(profile));
        message.textContent = "Profile saved in this browser for the demo.";
      } catch {
        message.textContent =
          "Browser storage is unavailable. Changes could not be saved.";
      }
    }

    // 3b. Login: display a demo message. Real login needs PHP.
    if (formType === "login") {
      message.textContent =
        "Login form validated. PHP authentication will be added in Part 3.";
    }

    // 3c. Password reset: display a demo message. No email is sent yet.
    if (formType === "reset-password") {
      message.textContent =
        "Reset request validated. Secure reset links and email delivery will be added in Part 3.";
    }
  });
}

// Shared event catalogue and browser-only booking demonstration.
const readDemo = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const samples = [
  {id:'innovation',title:'Campus Innovation Summit',date:'2026-12-04',time:'10:00',venue:'Main Auditorium',category:'Academic',capacity:200,description:'Meet student innovators, explore research demonstrations, and join a discussion on building useful technology. Doors open 30 minutes before the session.'},
  {id:'music',title:'Live Music Session',date:'2026-12-11',time:'18:00',venue:'Student Union Hall',category:'Music',capacity:120,description:'Enjoy an evening of acoustic sets and performances by campus musicians. Bring your student ID and arrive 15 minutes before the show.'},
  {id:'social',title:'Campus Social',date:'2026-12-15',time:'16:00',venue:'Student Centre',category:'Social',capacity:80,description:'Meet other students through board games, conversation, and club introductions. All departments and year groups are welcome.'}
];
const storedEvents = readDemo('campus-events', []);
const events = [...samples, ...(Array.isArray(storedEvents) ? storedEvents.filter(e => e && e.id && e.title && Number(e.capacity)>0) : [])];
const storedBookings = readDemo('campus-bookings', []);
let bookings = Array.isArray(storedBookings) ? storedBookings.filter(b => b && b.id && b.event_id) : [];
const selectedId = new URLSearchParams(location.search).get('event');
const selectedEvent = events.find(e => e.id === selectedId) || events[0];
const eventLink = e => `event-details.html?event=${encodeURIComponent(e.id)}`;
const eventInfo = e => `<p>${escapeHTML(e.category)} · ${escapeHTML(e.date)} at ${escapeHTML(e.time)}</p><p>Venue: ${escapeHTML(e.venue)}</p>`;
function renderEvents(query = '') {
  const target = document.getElementById('event-list');
  if (!target) return;
  const matches = events.filter(e => `${e.title} ${e.category} ${e.venue}`.toLowerCase().includes(query.toLowerCase()));
  target.innerHTML = matches.map(e => `<article class="panel"><span class="status">${escapeHTML(e.category)}</span><h2>${escapeHTML(e.title)}</h2>${eventInfo(e)}<a class="button" href="${eventLink(e)}">View event</a></article>`).join('');
  document.getElementById('search-status').textContent = `${matches.length} event${matches.length === 1 ? '' : 's'} found.`;
}
renderEvents();
document.getElementById('event-search')?.addEventListener('input', e => renderEvents(e.target.value));
const detail = document.getElementById('event-detail');
if (detail) detail.innerHTML = `<h2>${escapeHTML(selectedEvent.title)}</h2>${eventInfo(selectedEvent)}<p>${escapeHTML(selectedEvent.description)}</p><p>Capacity: ${escapeHTML(selectedEvent.capacity)} places. Free admission.</p><a class="button" href="book-event.html?event=${encodeURIComponent(selectedEvent.id)}">Book this event</a>`;
const eventSelect = document.getElementById('event_id');
if (eventSelect) {
  eventSelect.innerHTML = events.map(e => `<option value="${escapeHTML(e.id)}">${escapeHTML(e.title)} — ${escapeHTML(e.date)}</option>`).join('');
  eventSelect.value = selectedEvent.id;
}
const management = document.getElementById('manage-event-rows');
if (management) management.innerHTML = events.map(e => `<tr><td>${escapeHTML(e.title)}</td><td>${escapeHTML(e.date)}</td><td>${escapeHTML(e.venue)}</td><td>${escapeHTML(e.capacity)}</td><td><a href="${eventLink(e)}">View details</a></td></tr>`).join('');
function bookingCard(b, cancel = false) {
  const e = events.find(e => e.id === b.event_id);
  return `<article class="panel"><h2>${escapeHTML(e?.title || 'Unavailable event')}</h2><p>Reference: ${escapeHTML(b.id)}</p><p>Attendee: ${escapeHTML(b.attendee)} · Places: ${escapeHTML(b.tickets)}</p>${e ? eventInfo(e) : ''}<p><span class="status">${escapeHTML(b.status)}</span></p>${cancel && b.status === 'Confirmed' ? `<button type="button" data-cancel="${escapeHTML(b.id)}">Cancel booking</button>` : ''}</article>`;
}
function renderBookings() {
  const target = document.getElementById('my-bookings');
  if (target) target.innerHTML = bookings.length ? bookings.map(b => bookingCard(b,true)).join('') : '<section class="panel"><h2>No bookings yet</h2><p>Choose an event to make your first demo reservation.</p></section>';
}
renderBookings();
document.getElementById('my-bookings')?.addEventListener('click', event => {
  const button = event.target.closest('[data-cancel]');
  if (!button) return;
  const updated = bookings.map(b => b.id === button.dataset.cancel ? {...b,status:'Cancelled'} : b);
  try {
    localStorage.setItem('campus-bookings',JSON.stringify(updated));
    bookings = updated;
    renderBookings();
    document.getElementById('booking-status').textContent = 'Demo booking cancelled.';
  } catch { document.getElementById('booking-status').textContent = 'Browser storage is unavailable. Booking could not be cancelled.'; }
});
const confirmation = document.getElementById('booking-confirmation');
if (confirmation) {
  const b = bookings.find(b => b.id === new URLSearchParams(location.search).get('booking'));
  confirmation.innerHTML = b ? bookingCard(b) : '<h2>No booking selected</h2><p>Book an event or open My Bookings to see your reservations.</p>';
}
if (form) form.addEventListener('submit', event => {
  event.preventDefault();
  const type = form.dataset.form;
  const data = Object.fromEntries(new FormData(form));
  const message = form.querySelector('.form-message');
  if (type === 'register') {
    message.textContent = data.password === data.confirm_password ? 'Registration validated. This prototype does not create accounts or save passwords.' : 'Passwords do not match. Please re-enter them.';
  }
  if (type === 'contact') message.textContent = 'Message validated for the demo. No message has been sent.';
  if (type === 'booking') {
    const e = events.find(e => e.id === data.event_id);
    const tickets = Number(data.tickets);
    const reserved = bookings.filter(b => b.event_id === e?.id && b.status === 'Confirmed').reduce((sum,b) => sum + Number(b.tickets), 0);
    if (!e || !Number.isInteger(tickets) || tickets < 1 || tickets > 4 || tickets + reserved > Number(e.capacity)) {
      message.textContent = 'The requested places are unavailable. Choose fewer places or another event.';
      return;
    }
    const booking = {id:`CB-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,event_id:e.id,attendee:data.attendee,email:data.email,tickets,status:'Confirmed'};
    try {
      localStorage.setItem('campus-bookings', JSON.stringify([...bookings,booking]));
      location.href = `booking-confirmation.html?booking=${encodeURIComponent(booking.id)}`;
    } catch { message.textContent = 'Browser storage is unavailable. Booking could not be saved.'; }
  }
  if (type === 'create-event') {
    const e = {...data,id:`event-${Date.now()}`,capacity:Number(data.capacity)};
    try {
      localStorage.setItem('campus-events',JSON.stringify([...events.filter(e => !samples.some(s => s.id === e.id)),e]));
      location.href = 'manage-events.html';
    } catch { message.textContent = 'Browser storage is unavailable. Event could not be saved.'; }
  }
});
