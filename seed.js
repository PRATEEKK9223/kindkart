require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('./models/Item');
const NGO = require('./models/NGO');
const Story = require('./models/Story');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seed() {
  try {
    await Item.deleteMany({});
    await NGO.deleteMany({});
    await Story.deleteMany({});
    await User.deleteMany({});

    const items = [
      { name: 'Rice 1kg', category: 'Food', description: 'Staple rice packet (1kg)', impact: 'Feeds 2 people' },
      { name: 'Hygiene Kit', category: 'Hygiene', description: 'Soap, toothbrush, sanitary items', impact: '1 hygiene kit' },
      { name: 'Notebooks', category: 'Education', description: 'Pack of 5 notebooks', impact: 'Supports 3 students' },
      { name: 'Sanitary Pack', category: 'Hygiene', description: 'Sanitary pads + disposal bag', impact: '1 person/month' },
      { name: 'Blanket', category: 'Clothing', description: 'Warm blanket', impact: '1 family' },
      { name: 'Medicine Kit', category: 'Medical', description: 'Basic first aid kit', impact: 'Emergency care' }
    ];

    const savedItems = await Item.insertMany(items);

    const ngos = [
      { name: 'Hope Relief', city: 'Bengaluru', accepts: ['Food','Hygiene','Clothing'], description: 'Local NGO helping families in need', address: 'Koramangala', verified: true },
      { name: 'EduCare Foundation', city: 'Bengaluru', accepts: ['Education'], description: 'Supports childrens education', address: 'Jayanagar', verified: true },
      { name: 'HealthHands', city: 'Mysuru', accepts: ['Medical','Hygiene'], description: 'Medical outreach and free camps', address: 'Chamrajpet', verified: false },
    ];

    const savedNGOs = await NGO.insertMany(ngos);

    const stories = [
      { title: 'Winter Supplies Drive', content: 'We distributed 200 blankets to families in outskirts.', ngo: savedNGOs[0]._id, date: new Date() },
      { title: 'School Kits for Students', content: 'Notebooks and pens distributed to 150 students.', ngo: savedNGOs[1]._id, date: new Date() }
    ];
    await Story.insertMany(stories);

    // create admin user (for demo)
    const adminUser = new User({
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: process.env.ADMIN_PASSWORD || 'admin123' // plain text for demo only
    });
    await adminUser.save();

    console.log('Seed complete.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
