// dummyData.js
const mongoose = require('mongoose');
const Alumni = require('./models/alumni.model.js');
const Student = require('./models/student.model.js');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECT)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Helper function to generate random data
const generateRandomData = (isAlumni = false) => {
  const roll = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const sessions = ['2018-2019', '2019-2020', '2020-2021', '2021-2022'];
  const paymentStatuses = [0, 1, 2]; // Pending, Paid, Rejected

  const baseData = {
    personalInfo: {
      name: `Test User ${roll}`,
      roll: parseInt(roll),
      registrationNo: parseInt(roll) + 1000,
      session: sessions[Math.floor(Math.random() * sessions.length)],
    },
    contactInfo: {
      mobile: `017${Math.floor(Math.random() * 100000000)}`,
      email: `test${roll}@example.com`,
      currentAddress: 'Test Address',
    },
    paymentInfo: {
      totalAmount: isAlumni ? 1000 : 500,
      mobileBankingName: ['Bkash', 'Nagad', 'Rocket'][Math.floor(Math.random() * 3)],
      status: paymentStatuses[Math.floor(Math.random() * 3)],
      transactionId: `TRX${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    },
    profilePictureInfo: {
      image: '/home/tamjid/Codes/Projects/Alumni Reunion - 2025 (Backend)/uploads/images/21102006_1738289782380-dummy_male_image.png'
    }
  };

  if (isAlumni) {
    return {
      ...baseData,
      personalInfo: {
        ...baseData.personalInfo,
        passingYear: '2020'
      },
      professionalInfo: {
        currentDesignation: 'Software Engineer',
        currentOrganization: 'Tech Corp',
        from: new Date('2020-01-01'),
        to: 'Present'
      },
      numberOfParticipantInfo: {
        adult: 2,
        child: 1,
        total: 3
      }
    };
  }

  return {
    ...baseData,
    numberOfParticipantInfo: {
      adult: 1,
      child: 0,
      total: 1
    }
  };
};

// Function to insert dummy data
const insertDummyData = async (numAlumni = 5, numStudents = 5) => {
  try {
    // Insert Alumni data
    const alumniData = Array(numAlumni).fill().map(() => generateRandomData(true));
    await Alumni.insertMany(alumniData);
    console.log(`${numAlumni} alumni records inserted`);

    // Insert Student data
    const studentData = Array(numStudents).fill().map(() => generateRandomData(false));
    await Student.insertMany(studentData);
    console.log(`${numStudents} student records inserted`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error inserting dummy data:', error);
    mongoose.connection.close();
  }
};

// Insert 5 alumni and 5 student records
insertDummyData(10, 10);