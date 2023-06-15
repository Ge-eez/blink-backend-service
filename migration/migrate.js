const Symbol = require("../models/Symbol");
const User = require("../models/User"); // Replace with the actual path to the User model
const Lesson = require("../models/Lesson");
const lettersData = require("../data/lettersData");
const lessonCharacters = require("../data/lessonsData");
const challengeCharacters = require("../data/lessonsData");
const usersData = require("../data/userData");
const Challenge = require("../models/Challenge");
const getSymbol = require("../utils/getSymbol");
const UserActivity = require("../models/UserActivity");
const userActivityData = require("../data/userActivityData");

const migrateUserActivity = async () => {
  const existingUserActivityCount = await UserActivity.countDocuments();

  if (existingUserActivityCount >= userActivityData.length) {
    console.log("User activity data already migrated, skipping...");
    return;
  }

  let userActivityCount = 0;

  for (const activityData of userActivityData) {
    const { user, month } = activityData;
    const userInstance = await User.findOne({ email: user });

    if (userInstance) {
      const existingUserActivity = await UserActivity.findOne({
        user: userInstance._id,
        month: month,
      });

      if (!existingUserActivity) {
        await UserActivity.create({
          user: userInstance._id,
          month: month,
          timeSpent: activityData.timeSpent,
        });
        userActivityCount += 1;
      }
    }
  }

  console.log(`Migration of ${userActivityCount} user activities completed!`);
};

const migrateLetters = async () => {
  const existingSymbolsCount = await Symbol.countDocuments();

  if (existingSymbolsCount >= lettersData.length) {
    console.log("Symbols already migrated, skipping...");
    return;
  }

  let lettersCount = 0;

  for (const letterData of lettersData) {
    const { character } = letterData;
    const letter = await Symbol.findOne({ character });
    if (!letter) {
      await Symbol.create(letterData);
      lettersCount += 1;
    }
  }

  console.log(`Migration of ${lettersCount} letters completed!`);
};

let usersCount = 0;

const migrateUsers = async () => {
  const existingUsersCount = await User.countDocuments();

  if (existingUsersCount >= usersData.length) {
    console.log("Users already migrated, skipping...");
    return;
  }
  for (const userData of usersData) {
    const { email } = userData;
    const user = await User.findOne({ email });
    if (!user) {
      await User.create(userData);
      usersCount += 1;
    }
  }
  console.log(`Migration of ${usersCount} users completed!`);
};

const migrateLessons = async () => {
  const existingLessonsCount = await Lesson.countDocuments();
  if (existingLessonsCount >= lessonCharacters.length) {
    console.log("Lessons already migrated, skipping...");
    return;
  }

  const createBeginnerLessons = async () => {
    try {
      let previousLesson = null; // We start with no prerequisite

      // Loop through each group of characters and create a lesson
      for (let i = 0; i < lessonCharacters.length; i++) {
        // Get the symbol IDs
        const symbolIds = [];
        let firstCharacterRepresentation;
        for (let j = 0; j < lessonCharacters[i].length; j++) {
          const symbol = await getSymbol(lessonCharacters[i][j]);
          if (j === 0) firstCharacterRepresentation = symbol.representation;
          symbolIds.push(symbol._id);
        }

        // Create a lesson
        const lesson = new Lesson({
          name: `Beginner Lesson ${i + 1}`,
          description: `In this lesson, you will learn the forms of the characters starting with ${firstCharacterRepresentation}`,
          level: "Beginner",
          symbols: symbolIds,
          prerequisites: previousLesson ? [previousLesson._id] : [], // If there's a previous lesson, it's a prerequisite
          createdBy: "647b5492e479376c196a6d66", // Replace this with the ObjectId of the admin user
        });

        // Save the lesson
        await lesson.save();
        console.log(`Created ${lesson.name}`);

        // This lesson becomes the prerequisite for the next one
        previousLesson = lesson;
      }
    } catch (err) {
      console.error(err);
    }
  };

  await createBeginnerLessons();
};
const migrateChallenges = async () => {
  const existingChallengesCount = await Challenge.countDocuments();
  if (existingChallengesCount >= challengeCharacters.length) {
    console.log("Challenges already migrated, skipping...");
    return;
  }
  const createChallenges = async () => {
    try {
      let previousChallenge = null; // We start with no requirements

      // Loop through each group of characters and create a challenge
      for (let i = 0; i < challengeCharacters.length; i++) {
        // Get the symbol IDs
        const symbolIds = [];
        for (const character of challengeCharacters[i]) {
          const symbol = await getSymbol(character);
          symbolIds.push(symbol._id);
        }

        // Create a challenge
        const challenge = new Challenge({
          name: `Beginner Challenge ${i + 1}`,
          description: `In this challenge, you will be tested on the forms of the characters learned in Beginner Lesson ${
            i + 1
          }`,
          level: "Beginner",
          requirements: previousChallenge ? [previousChallenge._id] : [], // If there's a previous challenge, it's a requirement
          symbols: symbolIds,
          createdBy: "6489ee24c802a99b0e3c47a7", // Replace this with the ObjectId of the admin user
        });

        // Save the challenge
        await challenge.save();
        console.log(`Created ${challenge.name}`);

        // This challenge becomes the requirement for the next one
        previousChallenge = challenge;
      }
    } catch (err) {
      console.error(err);
    }
  };

  await createChallenges();
};

const migrate = async () => {
  await migrateLetters();
  await migrateUsers();
  await migrateLessons();
  await migrateChallenges();
  await migrateUserActivity();
};

module.exports = migrate;
