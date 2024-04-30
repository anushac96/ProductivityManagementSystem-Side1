CREATE TABLE KaryaDB.users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(24) UNIQUE NOT NULL,
    userpwd VARCHAR(255) NOT NULL,
    useremailid VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE KaryaDB.events (
    eventId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    title VARCHAR(255) NOT NULL,
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(userId)
);

CREATE TABLE KaryaDB.usersCurrentTask (
    userId INT,
    date DATE,
    eventName VARCHAR(255) NOT NULL,
    action INT DEFAULT 1, -- Default value is 1 for added events
    FOREIGN KEY (userId) REFERENCES KaryaDB.users(userId)
);