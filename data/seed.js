const mysqlConnection = require("../data/dbConnectors");
const _ = require("lodash");
// Dummy data
const casual = require("casual");

// SQL Query Function
function sqlQuery(query) {
  mysqlConnection.query(
    {
      sql: query,
      timeout: 4000,
    },
    (err) => {
      if (err) {
        console.error("Error creating tables: " + err.stack);
        return;
      }
    }
  );
}

// SQL table seed
exports.tables = function () {
  // SQL Table: User
  sqlQuery(
    `
  CREATE TABLE IF NOT EXISTS User (
  UserID INT NOT NULL AUTO_INCREMENT,
  Email VARCHAR(255) NOT NULL,
  UserName VARCHAR(255) NOT NULL,
  Password VARCHAR(255) NOT NULL,
  PRIMARY KEY (UserID)
);
`
  );

  // SQL Table: Profile
  sqlQuery(
    `
  CREATE TABLE IF NOT EXISTS Profile (
  ProfileID INT UNSIGNED NOT NULL AUTO_INCREMENT,
  FirstName VARCHAR(255) NOT NULL,
  LastName VARCHAR(255) NOT NULL,
  PRIMARY KEY (ProfileId),
  UserID INT UNSIGNED NOT NULL REFERENCES User(UserID)
);
`
  );
  // SQL Table: Post
  sqlQuery(
    `
  CREATE TABLE IF NOT EXISTS Post (
    PostID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    EntryDate DATE NOT NULL,
    Content MEDIUMBLOB NOT NULL,
    EntryImage MEDIUMBLOB,
    Published BOOLEAN NOT NULL DEFAULT 0,
    PRIMARY KEY (PostId),
    UserID INT UNSIGNED NOT NULL REFERENCES User(UserID)
);
`
  );
};

//SQL Dummy data seed
exports.data = function () {
  const dummyEntries = 10;
  _.times(dummyEntries, () => {
    sqlQuery(
      `INSERT INTO User (Email, UserName, Password)
        VALUES ("${casual.email}", "${casual.username}", "${casual.password}");`
    );
    sqlQuery(
      `INSERT INTO Profile (FirstName, LastName, UserID)
        VALUES ("${casual.first_name}", "${
        casual.last_name
      }", "${casual.integer((from = 1), (to = 10))}");`
    );
  });
  _.times(dummyEntries * 100, () => {
    sqlQuery(
      `INSERT INTO Post (EntryDate, Content, EntryImage, Published, UserID)
      VALUES (
        "${casual.date((format = "YYYY-MM-DD"))}",
        "${casual.description}",
        "../public/images/WP-header-image-size-1024x536.jpg",
        "${casual.integer((from = 0), (to = 1))}",
        "${casual.integer((from = 1), (to = 10))}"
      );`
    );
  });
};
