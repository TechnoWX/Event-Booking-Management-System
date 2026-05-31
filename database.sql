-- =============================================
-- EventBooking Database Script
-- =============================================

CREATE DATABASE EventBookingDB;
GO

USE EventBookingDB;
GO

-- =============================================
-- Table: Categories
-- =============================================
CREATE TABLE Categories (
    CategoryId   INT           PRIMARY KEY IDENTITY(1,1),
    Name         NVARCHAR(100) NOT NULL,
    Description  NVARCHAR(255)
);

-- =============================================
-- Table: Events
-- =============================================
CREATE TABLE Events (
    EventId         INT            PRIMARY KEY IDENTITY(1,1),
    CategoryId      INT            NOT NULL,
    Title           NVARCHAR(200)  NOT NULL,
    Description     NVARCHAR(1000),
    Location        NVARCHAR(200)  NOT NULL,
    EventDate       DATETIME2      NOT NULL,
    MaxParticipants INT            NOT NULL,
    CreatedAt       DATETIME2      DEFAULT GETDATE(),
    CONSTRAINT FK_Events_Categories FOREIGN KEY (CategoryId)
        REFERENCES Categories(CategoryId)
);

-- =============================================
-- Table: Bookings
-- =============================================
CREATE TABLE Bookings (
    BookingId        INT           PRIMARY KEY IDENTITY(1,1),
    EventId          INT           NOT NULL,
    ParticipantName  NVARCHAR(100) NOT NULL,
    ParticipantEmail NVARCHAR(100) NOT NULL,
    BookingDate      DATETIME2     DEFAULT GETDATE(),
    Status           NVARCHAR(20)  DEFAULT 'Confirmed',
    CONSTRAINT FK_Bookings_Events FOREIGN KEY (EventId)
        REFERENCES Events(EventId)
);
GO

-- =============================================
-- Seed Data: Categories
-- =============================================
INSERT INTO Categories (Name, Description) VALUES
('Music',  'Concerts and music festivals'),
('Sports', 'Sporting events and competitions'),
('Tech',   'Technology conferences and workshops'),
('Food',   'Food fairs and cooking events'),
('Art',    'Art exhibitions and galleries');

-- =============================================
-- Seed Data: Events
-- =============================================
INSERT INTO Events (CategoryId, Title, Description, Location, EventDate, MaxParticipants) VALUES
(1, 'Jazz Night',            'A relaxing jazz evening featuring local artists.',       'KL Tower',              '2026-06-10 20:00', 80),
(1, 'Rock Festival',         'Annual rock music festival with 10+ bands.',             'Stadium Merdeka',       '2026-07-01 18:00', 120),
(1, 'Acoustic Evening',      'An intimate acoustic session with indie artists.',        'The Bee, Publika',      '2026-07-22 19:00', 40),
(2, 'Marathon KL',           'City marathon event open for all fitness levels.',       'Dataran Merdeka',       '2026-06-15 06:00', 200),
(2, 'Basketball Tournament', '3x3 basketball open tournament, all ages welcome.',      'Sports Arena PJ',       '2026-06-20 09:00', 60),
(2, 'Futsal League',         'Weekend futsal league, team-based competition.',         'Cheras Sports Hub',     '2026-08-01 08:00', 80),
(3, 'AI Conference',         'Latest trends in artificial intelligence and ML.',       'KLCC Convention',       '2026-06-25 09:00', 50),
(3, '.NET Workshop',         'Hands-on .NET 9 workshop for developers.',              'Cyberjaya Hub',         '2026-07-05 10:00', 30),
(3, 'UI/UX Bootcamp',        'Two-day intensive UI/UX design bootcamp.',              'MDEC Tower, Cyberjaya', '2026-07-18 09:00', 40),
(3, 'Cloud Computing Talk',  'Introduction to cloud architecture and DevOps.',        'TM Tower KL',           '2026-08-08 10:00', 60),
(4, 'Street Food Carnival',  'Local street food event with 30+ vendors.',             'Publika Mall',          '2026-06-28 11:00', 150),
(4, 'Baking Class',          'Learn to bake sourdough and artisan bread.',            'Bangsar Kitchen',       '2026-07-10 14:00', 20),
(4, 'Ramen Festival',        'A celebration of ramen culture with 10 ramen stalls.', 'Pavilion KL',           '2026-07-26 11:00', 100),
(5, 'Art Expo 2026',         'Modern art exhibition featuring 30 local artists.',      'MAP KL',                '2026-07-15 10:00', 80),
(5, 'Sketch Workshop',       'Urban sketching workshop around Kuala Lumpur.',         'Central Market',        '2026-07-20 09:00', 25),
(5, 'Photography Walk',      'Guided photography walk through heritage KL streets.',  'Masjid Jamek LRT',      '2026-08-15 08:00', 30);

-- =============================================
-- Seed Data: Bookings
-- =============================================

-- Jazz Night (80 cap)
INSERT INTO Bookings (EventId, ParticipantName, ParticipantEmail, Status) VALUES
(1, 'Ali Hassan',    'ali@email.com',    'Confirmed'),
(1, 'Mei Ling',      'mei@email.com',    'Confirmed'),
(1, 'Siti Rahimah',  'siti@email.com',   'Confirmed'),
(1, 'James Ng',      'james@email.com',  'Confirmed'),
(1, 'Priya Devi',    'priya@email.com',  'Confirmed'),
(1, 'Kevin Chong',   'kevin@email.com',  'Confirmed'),
(1, 'Nurul Ain',     'nurul@email.com',  'Confirmed'),
(1, 'David Lim',     'david@email.com',  'Cancelled');

-- Rock Festival (120 cap)
INSERT INTO Bookings (EventId, ParticipantName, ParticipantEmail, Status) VALUES
(2, 'Rajan Kumar',  'rajan@email.com',   'Confirmed'),
(2, 'Farah Aziz',   'farah@email.com',   'Confirmed'),
(2, 'Tommy Tan',    'tommy@email.com',   'Confirmed'),
(2, 'Aisha Malik',  'aisha@email.com',   'Confirmed'),
(2, 'Brandon Lee',  'brandon@email.com', 'Confirmed'),
(2, 'Chloe Wong',   'chloe@email.com',   'Cancelled');

-- Acoustic Evening (40 cap)
INSERT INTO Bookings (EventId, ParticipantName, ParticipantEmail, Status) VALUES
(3, 'Zachary Foo',   'zachary@email.com', 'Confirmed'),
(3, 'Nadia Rosli',   'nadia@email.com',   'Confirmed'),
(3, 'Marcus Chan',   'marcus@email.com',  'Confirmed'),
(3, 'Penny Lau',     'penny@email.com',   'Confirmed'),
(3, 'Quinn Beh',     'quinn@email.com',   'Confirmed'),
(3, 'Rohani Ismail', 'rohani@email.com',  'Confirmed'),
(3, 'Steven Khor',   'steven@email.com',  'Confirmed'),
(3, 'Tracy Lim',     'tracy@email.com',   'Confirmed'),
(3, 'Uma Pillai',    'uma@email.com',     'Confirmed'),
(3, 'Vincent Goh',   'vincent@email.com', 'Confirmed'),
(3, 'Wendy Chan',    'wendy@email.com',   'Confirmed'),
(3, 'Xavier Low',    'xavier@email.com',  'Confirmed'),
(3, 'Yasmin Azhar',  'yasmin@email.com',  'Confirmed'),
(3, 'Zulaikha Musa', 'zulaikha@email.com','Confirmed'),
(3, 'Alan Tong',     'alan@email.com',    'Confirmed'),
(3, 'Betty Sim',     'betty@email.com',   'Confirmed'),
(3, 'Calvin Hor',    'calvin@email.com',  'Confirmed'),
(3, 'Dina Hafizah',  'dina@email.com',    'Confirmed'),
(3, 'Eric Pang',     'eric@email.com',    'Confirmed'),
(3, 'Fiona Yew',     'fiona@email.com',   'Confirmed'),
(3, 'George Kee',    'george@email.com',  'Confirmed'),
(3, 'Hannah Ooi',    'hannah@email.com',  'Confirmed'),
(3, 'Ivan Chee',     'ivan@email.com',    'Confirmed'),
(3, 'Jenny Woo',     'jenny@email.com',   'Confirmed'),
(3, 'Kenny Leow',    'kenny@email.com',   'Confirmed'),
(3, 'Linda Kok',     'linda@email.com',   'Confirmed'),
(3, 'Martin Yap',    'martin@email.com',  'Confirmed'),
(3, 'Nina Rashid',   'nina@email.com',    'Confirmed'),
(3, 'Oliver Tee',    'oliver@email.com',  'Confirmed'),
(3, 'Pauline Ng',    'pauline@email.com', 'Confirmed'),
(3, 'Raymond Chow',  'raymondchow@email.com', 'Confirmed'),
(3, 'Sandra Low',    'sandra@email.com',  'Confirmed'),
(3, 'Timothy Tan',   'timothy@email.com', 'Confirmed'),
(3, 'Ursula Chin',   'ursula@email.com',  'Confirmed'),
(3, 'Victor Loh',    'victor@email.com',  'Confirmed'),
(3, 'Winnie Kwan',   'winnie@email.com',  'Confirmed'),
(3, 'Xian Yi Tan',   'xianyi@email.com',  'Confirmed'),
(3, 'Yanti Bakar',   'yanti@email.com',   'Confirmed');

-- Marathon KL (200 cap)
INSERT INTO Bookings (EventId, ParticipantName, ParticipantEmail, Status) VALUES
(4, 'Sarah Tan',      'sarah@email.com',   'Confirmed'),
(4, 'Ahmad Faris',    'faris@email.com',   'Confirmed'),
(4, 'Lena Koh',       'lena@email.com',    'Confirmed'),
(4, 'Raymond Yap',    'raymond@email.com', 'Cancelled'),
(4, 'Hafiz Zainudin', 'hafiz@email.com',   'Confirmed'),
(4, 'Cindy Ong',      'cindy@email.com',   'Confirmed');

-- Basketball Tournament (60 cap)
INSERT INTO Bookings (EventId, ParticipantName, ParticipantEmail, Status) VALUES
(5, 'Darren Sim',   'darren@email.com', 'Confirmed'),
(5, 'Wan Haziq',    'haziq@email.com',  'Confirmed'),
(5, 'Elaine Teoh',  'elaine@email.com', 'Confirmed'),
(5, 'Farhan Idris', 'farhan@email.com', 'Cancelled');

-- Futsal League (80 cap)
INSERT INTO Bookings (EventId, ParticipantName, ParticipantEmail, Status) VALUES
(6, 'Gary Lau',       'gary@email.com',    'Confirmed'),
(6, 'Hazwani Salleh', 'hazwani@email.com', 'Confirmed');

-- AI Conference (50 cap)
INSERT INTO Bookings (EventId, ParticipantName, ParticipantEmail, Status) VALUES
(7, 'John Lim',   'john@email.com',  'Confirmed'),
(7, 'Irene Poh',  'irene@email.com', 'Confirmed'),
(7, 'Jason Teh',  'jason@email.com', 'Confirmed'),
(7, 'Karen Ng',   'karen@email.com', 'Cancelled'),
(7, 'Leon Foo',   'leon@email.com',  'Confirmed');

-- .NET Workshop (30 cap)
INSERT INTO Bookings (EventId, ParticipantName, ParticipantEmail, Status) VALUES
(8, 'Nur Aisyah',   'aisyah@email.com',  'Confirmed'),
(8, 'Michael Tan',  'michael@email.com', 'Confirmed'),
(8, 'Natasha Lim',  'natasha@email.com', 'Confirmed');

-- UI/UX Bootcamp (40 cap)
INSERT INTO Bookings (EventId, ParticipantName, ParticipantEmail, Status) VALUES
(9, 'Oscar Yong',    'oscar@email.com',   'Confirmed'),
(9, 'Patricia Woo',  'patricia@email.com','Confirmed');

-- Cloud Computing Talk (60 cap)
INSERT INTO Bookings (EventId, ParticipantName, ParticipantEmail, Status) VALUES
(10, 'Qasim Rashid', 'qasim@email.com', 'Confirmed');

-- Street Food Carnival (150 cap)
INSERT INTO Bookings (EventId, ParticipantName, ParticipantEmail, Status) VALUES
(11, 'David Wong',  'davidw@email.com', 'Confirmed'),
(11, 'Rachel Chin', 'rachel@email.com', 'Confirmed'),
(11, 'Samuel Tan',  'samuel@email.com', 'Confirmed'),
(11, 'Tina Kee',    'tina@email.com',   'Cancelled'),
(11, 'Umar Farouq', 'umar@email.com',   'Confirmed');

-- Baking Class (20 cap)
INSERT INTO Bookings (EventId, ParticipantName, ParticipantEmail, Status) VALUES
(12, 'Vivian Ho',      'vivian@email.com',   'Confirmed'),
(12, 'Wilson Goh',     'wilson@email.com',   'Confirmed'),
(12, 'Xin Yi Loh',     'xinyi@email.com',    'Confirmed'),
(12, 'Yong Mei Shan',  'yongmei@email.com',  'Confirmed'),
(12, 'Zaid Hamdan',    'zaid@email.com',     'Confirmed'),
(12, 'Amira Nasir',    'amira@email.com',    'Confirmed'),
(12, 'Bobby Tan',      'bobby@email.com',    'Confirmed'),
(12, 'Celeste Lim',    'celeste@email.com',  'Confirmed'),
(12, 'Desmond Ng',     'desmond@email.com',  'Confirmed'),
(12, 'Evelyn Koh',     'evelyn@email.com',   'Confirmed'),
(12, 'Felix Chia',     'felix@email.com',    'Confirmed'),
(12, 'Grace Toh',      'grace@email.com',    'Confirmed'),
(12, 'Henry Ling',     'henry@email.com',    'Confirmed'),
(12, 'Irma Yusoff',    'irma@email.com',     'Confirmed'),
(12, 'Jonathan Wee',   'jonathan@email.com', 'Confirmed'),
(12, 'Kelly Chan',     'kelly@email.com',    'Confirmed'),
(12, 'Louis Poh',      'louis@email.com',    'Confirmed'),
(12, 'Mandy Teoh',     'mandy@email.com',    'Confirmed'),
(12, 'Nelson Kok',     'nelson@email.com',   'Confirmed'),
(12, 'Olivia Soh',     'olivia@email.com',   'Confirmed');

-- Ramen Festival (100 cap)
INSERT INTO Bookings (EventId, ParticipantName, ParticipantEmail, Status) VALUES
(13, 'Yusof Hamid', 'yusof@email.com', 'Confirmed'),
(13, 'Zara Putri',  'zara@email.com',  'Confirmed'),
(13, 'Aaron Cheah', 'aaron@email.com', 'Cancelled');

-- Art Expo (80 cap)
INSERT INTO Bookings (EventId, ParticipantName, ParticipantEmail, Status) VALUES
(14, 'Priya Nair',   'priyan@email.com', 'Confirmed'),
(14, 'Barry Ooi',    'barry@email.com',  'Confirmed'),
(14, 'Carmen Loh',   'carmen@email.com', 'Confirmed');

-- Sketch Workshop (25 cap)
INSERT INTO Bookings (EventId, ParticipantName, ParticipantEmail, Status) VALUES
(15, 'Kevin Chong', 'kevinc@email.com', 'Confirmed'),
(15, 'Diana Yeap',  'diana@email.com',  'Confirmed');

-- Photography Walk (30 cap)
INSERT INTO Bookings (EventId, ParticipantName, ParticipantEmail, Status) VALUES
(16, 'Edwin Leong',   'edwin@email.com',   'Confirmed'),
(16, 'Fatimah Zahra', 'fatimah@email.com', 'Confirmed');