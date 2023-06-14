// Generate activity data for 10 users over 12 months
const userActivityData = [];

for (let userIndex = 1; userIndex <= 10; userIndex++) {
  for (let month = 1; month <= 12; month++) {
    userActivityData.push({
      user: `user${userIndex}@example.com`, // The user's email
      month: month,
      timeSpent: Math.floor(Math.random() * 101), // Generates a random number between 0 and 100
    });
  }
}

module.exports = userActivityData;
