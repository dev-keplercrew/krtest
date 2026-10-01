/* ============================================================
   Locations — 4 scoop shops, mock data
   ============================================================ */
window.LOCATIONS = [
  {
    id: 'loc001',
    name: 'Frost & Cream — Hawthorne',
    address: '2418 SE Hawthorne Blvd',
    city: 'Portland', state: 'OR', zip: '97214',
    phone: '(503) 555-0142',
    hours: {
      mon: '12:00 — 9:00', tue: '12:00 — 9:00', wed: '12:00 — 9:00',
      thu: '12:00 — 9:00', fri: '12:00 — 10:00', sat: '11:00 — 10:00', sun: '11:00 — 9:00'
    },
    lat: 45.5120, lng: -122.6370,
    notes: 'Flagship. Indoor seating, dog-friendly patio.'
  },
  {
    id: 'loc002',
    name: 'Frost & Cream — Pearl District',
    address: '1017 NW Glisan St',
    city: 'Portland', state: 'OR', zip: '97209',
    phone: '(503) 555-0188',
    hours: {
      mon: 'Closed', tue: '12:00 — 8:00', wed: '12:00 — 8:00',
      thu: '12:00 — 9:00', fri: '12:00 — 10:00', sat: '11:00 — 10:00', sun: '11:00 — 8:00'
    },
    lat: 45.5275, lng: -122.6840,
    notes: 'Quick-serve window, espresso bar.'
  },
  {
    id: 'loc003',
    name: 'Frost & Cream — Capitol Hill',
    address: '512 E Pine St',
    city: 'Seattle', state: 'WA', zip: '98122',
    phone: '(206) 555-0119',
    hours: {
      mon: '12:00 — 9:00', tue: '12:00 — 9:00', wed: '12:00 — 9:00',
      thu: '12:00 — 10:00', fri: '12:00 — 11:00', sat: '11:00 — 11:00', sun: '11:00 — 10:00'
    },
    lat: 47.6149, lng: -122.3195,
    notes: 'Late-night scoop window open till 11 Fri/Sat.'
  },
  {
    id: 'loc004',
    name: 'Frost & Cream — Mission',
    address: '2842 Mission St',
    city: 'San Francisco', state: 'CA', zip: '94110',
    phone: '(415) 555-0103',
    hours: {
      mon: '12:00 — 9:00', tue: '12:00 — 9:00', wed: '12:00 — 9:00',
      thu: '12:00 — 10:00', fri: '12:00 — 10:00', sat: '11:00 — 10:00', sun: '11:00 — 9:00'
    },
    lat: 37.7515, lng: -122.4180,
    notes: 'Soft-sake bar, dairy-free flight on Sundays.'
  }
];