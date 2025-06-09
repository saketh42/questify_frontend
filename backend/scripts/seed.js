const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Quest = require('../models/Quest');

// Sample data
const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@questify.com',
    password: 'Admin123!',
    role: 'admin',
    profile: {
      firstName: 'Admin',
      lastName: 'User',
      bio: 'System administrator',
    },
    stats: {
      level: 10,
      experience: 10000,
      questsCompleted: 50,
      totalPoints: 15000,
    },
    isEmailVerified: true,
  },
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'Password123!',
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Fitness enthusiast and productivity guru',
    },
    stats: {
      level: 5,
      experience: 4500,
      questsCompleted: 25,
      totalPoints: 6000,
    },
    isEmailVerified: true,
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'Password123!',
    profile: {
      firstName: 'Jane',
      lastName: 'Smith',
      bio: 'Learning enthusiast and creative mind',
    },
    stats: {
      level: 3,
      experience: 2200,
      questsCompleted: 12,
      totalPoints: 3000,
    },
    isEmailVerified: true,
  },
  {
    username: 'mike_wilson',
    email: 'mike@example.com',
    password: 'Password123!',
    profile: {
      firstName: 'Mike',
      lastName: 'Wilson',
      bio: 'Career-focused professional',
    },
    stats: {
      level: 4,
      experience: 3800,
      questsCompleted: 20,
      totalPoints: 4500,
    },
    isEmailVerified: true,
  },
];

const sampleQuests = [
  {
    title: 'Morning Workout Routine',
    description: 'Complete a 30-minute workout every morning for a week. Include cardio and strength training exercises.',
    category: 'fitness',
    difficulty: 'medium',
    type: 'weekly',
    points: 500,
    duration: {
      estimated: 30,
    },
    requirements: [
      'Access to basic workout equipment or bodyweight exercises',
      'Commitment to wake up 30 minutes earlier',
    ],
    tags: ['fitness', 'morning', 'routine', 'health'],
    isPublic: true,
    metadata: {
      featured: true,
    },
  },
  {
    title: 'Learn a New Programming Language',
    description: 'Pick a programming language you\'ve never used before and complete a basic tutorial or course.',
    category: 'learning',
    difficulty: 'hard',
    type: 'one-time',
    points: 1000,
    duration: {
      estimated: 1200, // 20 hours
    },
    requirements: [
      'Access to online learning resources',
      'Computer with internet connection',
      'Dedication to practice coding daily',
    ],
    tags: ['programming', 'learning', 'technology', 'skill'],
    isPublic: true,
    metadata: {
      featured: true,
    },
  },
  {
    title: 'Daily Meditation Practice',
    description: 'Meditate for at least 10 minutes every day for 30 days. Use guided meditation apps or practice mindfulness.',
    category: 'health',
    difficulty: 'easy',
    type: 'habit',
    points: 300,
    duration: {
      estimated: 10,
    },
    requirements: [
      'Quiet space for meditation',
      'Meditation app or timer',
    ],
    tags: ['meditation', 'mindfulness', 'health', 'daily'],
    isPublic: true,
  },
  {
    title: 'Write a Short Story',
    description: 'Write a complete short story of at least 1000 words. Focus on character development and plot structure.',
    category: 'creativity',
    difficulty: 'medium',
    type: 'one-time',
    points: 400,
    duration: {
      estimated: 180, // 3 hours
    },
    requirements: [
      'Word processor or writing app',
      'Basic understanding of story structure',
    ],
    tags: ['writing', 'creativity', 'storytelling', 'literature'],
    isPublic: true,
  },
  {
    title: 'Organize Digital Files',
    description: 'Clean up and organize your computer files, photos, and documents. Create a logical folder structure.',
    category: 'productivity',
    difficulty: 'easy',
    type: 'one-time',
    points: 200,
    duration: {
      estimated: 120, // 2 hours
    },
    requirements: [
      'Computer with files to organize',
      'Time to sort through documents',
    ],
    tags: ['organization', 'productivity', 'digital', 'cleanup'],
    isPublic: true,
  },
  {
    title: 'Connect with Old Friends',
    description: 'Reach out to 5 old friends you haven\'t spoken to in a while. Send meaningful messages or arrange calls.',
    category: 'social',
    difficulty: 'easy',
    type: 'one-time',
    points: 250,
    duration: {
      estimated: 60,
    },
    requirements: [
      'Contact information for old friends',
      'Willingness to be vulnerable and reach out',
    ],
    tags: ['friendship', 'social', 'connection', 'relationships'],
    isPublic: true,
  },
  {
    title: 'Learn to Cook a New Cuisine',
    description: 'Choose a cuisine you\'ve never cooked before and master 3 different recipes from that culture.',
    category: 'hobby',
    difficulty: 'medium',
    type: 'one-time',
    points: 600,
    duration: {
      estimated: 300, // 5 hours
    },
    requirements: [
      'Access to specialty ingredients',
      'Basic cooking skills',
      'Kitchen equipment',
    ],
    tags: ['cooking', 'culture', 'food', 'learning'],
    isPublic: true,
  },
  {
    title: 'Plan a Weekend Trip',
    description: 'Research and plan a weekend getaway to a place you\'ve never been. Include activities and accommodations.',
    category: 'travel',
    difficulty: 'medium',
    type: 'one-time',
    points: 400,
    duration: {
      estimated: 90,
    },
    requirements: [
      'Budget for travel',
      'Time for research',
      'Transportation method',
    ],
    tags: ['travel', 'planning', 'adventure', 'exploration'],
    isPublic: true,
    metadata: {
      trending: true,
    },
  },
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/questify', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    console.log('Seeding users...');
    
    // Clear existing users
    await User.deleteMany({});
    
    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      users.push(user);
      console.log(`Created user: ${user.username}`);
    }
    
    return users;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

const seedQuests = async (users) => {
  try {
    console.log('Seeding quests...');
    
    // Clear existing quests
    await Quest.deleteMany({});
    
    // Create quests
    for (let i = 0; i < sampleQuests.length; i++) {
      const questData = {
        ...sampleQuests[i],
        creator: users[i % users.length]._id, // Distribute quests among users
      };
      
      const quest = new Quest(questData);
      
      // Add some participants to make it realistic
      const participantCount = Math.floor(Math.random() * 5) + 1;
      for (let j = 0; j < participantCount; j++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        if (!quest.participants.find(p => p.user.toString() === randomUser._id.toString())) {
          const statuses = ['pending', 'in-progress', 'completed', 'completed', 'completed']; // Bias toward completed
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          
          quest.participants.push({
            user: randomUser._id,
            status,
            progress: status === 'completed' ? 100 : Math.floor(Math.random() * 80) + 10,
            startedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
            completedAt: status === 'completed' ? new Date() : null,
          });
          
          if (status === 'completed') {
            quest.stats.completedCount++;
          }
        }
      }
      
      quest.stats.totalParticipants = quest.participants.length;
      quest.stats.averageRating = Math.random() * 2 + 3; // Random rating between 3-5
      quest.stats.totalRatings = Math.floor(Math.random() * 10) + 1;
      
      await quest.save();
      console.log(`Created quest: ${quest.title}`);
    }
  } catch (error) {
    console.error('Error seeding quests:', error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    const users = await seedUsers();
    await seedQuests(users);
    
    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Seeded data:');
    console.log(`- ${sampleUsers.length} users`);
    console.log(`- ${sampleQuests.length} quests`);
    console.log('\n🔑 Default admin credentials:');
    console.log('Email: admin@questify.com');
    console.log('Password: Admin123!');
    console.log('\n🚀 You can now start the server and test the application!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, seedUsers, seedQuests };
