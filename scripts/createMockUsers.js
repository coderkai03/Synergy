const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const mockUsers = [
  {
    id: "test1",
    firstName: "Alex",
    lastName: "Smith",
    email: "alex.smith@test.com", 
    profilePicture: "https://api.dicebear.com/6.x/avataaars/svg?seed=Alex",
    bio: "Full stack developer passionate about AI and machine learning",
    school: "Stanford University",
    major: "Computer Science",
    technologies: ["React", "Python", "TensorFlow"],
    category_experience: ["Web Development", "Machine Learning"],
    interests: ["AI", "Web3", "Mobile Apps"],
    linkedin: "https://linkedin.com/in/alexsmith",
    devpost: "https://devpost.com/alexsmith",
    github: "https://github.com/alexsmith",
    number_of_hackathons: "5",
    role_experience: {
      product_management: 2,
      software: 4,
      hardware: 1,
      design: 2
    },
    teams: [],
    invites: []
  },
  {
    id: "test2", 
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@test.com",
    profilePicture: "https://api.dicebear.com/6.x/avataaars/svg?seed=Sarah",
    bio: "UX/UI designer with a coding background",
    school: "MIT",
    major: "Design & Computer Science",
    technologies: ["Figma", "JavaScript", "React"],
    category_experience: ["UI/UX Design", "Frontend Development"],
    interests: ["Design Systems", "Accessibility", "Mobile Design"],
    linkedin: "https://linkedin.com/in/sarahj",
    devpost: "https://devpost.com/sarahj",
    github: "https://github.com/sarahj",
    number_of_hackathons: "3",
    role_experience: {
      product_management: 1,
      software: 2,
      hardware: 0,
      design: 5
    },
    teams: [],
    invites: []
  }
];

// Generate 13 more mock users programmatically
for (let i = 3; i <= 15; i++) {
  const firstName = `TestUser${i}`;
  mockUsers.push({
    id: `test${i}`,
    firstName: firstName,
    lastName: `LastName${i}`,
    email: `testuser${i}@test.com`,
    profilePicture: `https://api.dicebear.com/6.x/avataaars/svg?seed=${firstName}`,
    bio: `Test user ${i} bio description`,
    school: ["Stanford", "MIT", "Berkeley", "Harvard"][Math.floor(Math.random() * 4)],
    major: ["Computer Science", "Electrical Engineering", "Design", "Data Science"][Math.floor(Math.random() * 4)],
    technologies: ["React", "Python", "JavaScript", "TypeScript", "Node.js"].slice(0, Math.floor(Math.random() * 3) + 1),
    category_experience: ["Web Development", "Mobile Development", "AI/ML", "Design"].slice(0, Math.floor(Math.random() * 3) + 1),
    interests: ["AI", "Web3", "Mobile Apps", "Design", "Cloud Computing"].slice(0, Math.floor(Math.random() * 3) + 1),
    linkedin: `https://linkedin.com/in/testuser${i}`,
    devpost: `https://devpost.com/testuser${i}`,
    github: `https://github.com/testuser${i}`,
    number_of_hackathons: String(Math.floor(Math.random() * 10)),
    role_experience: {
      product_management: Math.floor(Math.random() * 5),
      software: Math.floor(Math.random() * 5),
      hardware: Math.floor(Math.random() * 5),
      design: Math.floor(Math.random() * 5)
    },
    teams: [],
    invites: []
  });
}

// Upload users to Firebase
async function uploadUsers() {
  try {
    const batch = db.batch();
    
    mockUsers.forEach((user) => {
      const userRef = db.collection('testUsers').doc(user.id);
      batch.set(userRef, user);
    });

    await batch.commit();
    console.log('Successfully uploaded 15 mock users to Firebase');
    process.exit(0);
  } catch (error) {
    console.error('Error uploading users:', error);
    process.exit(1);
  }
}

uploadUsers();
