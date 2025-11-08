/**
 * Script to insert 40 mock reports into Supabase
 * 
 * Usage:
 * 1. Make sure you have a user account created
 * 2. Update SUPABASE_URL and SUPABASE_ANON_KEY below
 * 3. Run: node scripts/insertMockReports.js
 */

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// You need to get a user ID first - login to your app and check the user ID
const USER_ID = 'YOUR_USER_ID'; // Replace with actual user ID

const types = ['incident', 'hazard', 'maintenance', 'other'];
const statuses = ['pending', 'in-progress', 'resolved', 'closed'];
const priorities = ['low', 'medium', 'high', 'critical'];
const locations = [
  'Main Street & 5th Ave',
  'Central Park',
  'Downtown Plaza',
  'Industrial Zone',
  'Residential Area',
  'Highway 101',
  'Shopping District',
  'University Campus',
  'City Hall',
  'Medical Center',
];
const titles = [
  'Broken Street Light',
  'Pothole on Road',
  'Suspicious Activity',
  'Water Leak',
  'Graffiti on Wall',
  'Damaged Sidewalk',
  'Fallen Tree',
  'Noise Complaint',
  'Illegal Parking',
  'Traffic Signal Malfunction',
];

async function insertMockReports() {
  const reports = [];

  for (let i = 1; i <= 40; i++) {
    const type = types[i % types.length];
    const status = statuses[i % statuses.length];
    const priority = priorities[i % priorities.length];
    const location = locations[i % locations.length];
    const title = titles[i % titles.length];
    const daysAgo = Math.floor(Math.random() * 30);
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

    reports.push({
      user_id: USER_ID,
      title: `Report #${i}: ${title}`,
      description: `Detailed description of the ${type} that occurred at ${location}. This requires immediate attention and proper handling.`,
      type,
      status,
      priority,
      location,
      latitude: 40.7128 + (Math.random() * 0.1 - 0.05),
      longitude: -74.0060 + (Math.random() * 0.1 - 0.05),
      created_at: createdAt,
    });
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(reports),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to insert reports: ${error}`);
    }

    console.log('✅ Successfully inserted 40 mock reports!');
  } catch (error) {
    console.error('❌ Error inserting reports:', error.message);
  }
}

insertMockReports();
