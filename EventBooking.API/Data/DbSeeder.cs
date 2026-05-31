using EventBooking.API.Models;

namespace EventBooking.API.Data
{
    public static class DbSeeder
    {
        public static void Seed(EventDBContext context)
        {
            if (context.Categories.Any()) return;

            // Categories
            var categories = new List<Category>
            {
                new() { Name = "Music",  Description = "Concerts and music festivals" },
                new() { Name = "Sports", Description = "Sporting events and competitions" },
                new() { Name = "Tech",   Description = "Technology conferences and workshops" },
                new() { Name = "Food",   Description = "Food fairs and cooking events" },
                new() { Name = "Art",    Description = "Art exhibitions and galleries" },
            };
            context.Categories.AddRange(categories);
            context.SaveChanges();

            // Events - adjusted max participants to show meaningful fill rates
            var events = new List<Event>
            {
                new() { CategoryId = 1, Title = "Jazz Night",            Description = "A relaxing jazz evening featuring local artists.",         Location = "KL Tower",          EventDate = new DateTime(2026, 6, 10, 20, 0, 0), MaxParticipants = 80  },
                new() { CategoryId = 1, Title = "Rock Festival",         Description = "Annual rock music festival with 10+ bands.",              Location = "Stadium Merdeka",   EventDate = new DateTime(2026, 7, 1,  18, 0, 0), MaxParticipants = 120 },
                new() { CategoryId = 1, Title = "Acoustic Evening",      Description = "An intimate acoustic session with indie artists.",         Location = "The Bee, Publika",  EventDate = new DateTime(2026, 7, 22, 19, 0, 0), MaxParticipants = 40  },
                new() { CategoryId = 2, Title = "Marathon KL",           Description = "City marathon event open for all fitness levels.",        Location = "Dataran Merdeka",   EventDate = new DateTime(2026, 6, 15,  6, 0, 0), MaxParticipants = 200 },
                new() { CategoryId = 2, Title = "Basketball Tournament", Description = "3x3 basketball open tournament, all ages welcome.",       Location = "Sports Arena PJ",   EventDate = new DateTime(2026, 6, 20,  9, 0, 0), MaxParticipants = 60  },
                new() { CategoryId = 2, Title = "Futsal League",         Description = "Weekend futsal league, team-based competition.",          Location = "Cheras Sports Hub", EventDate = new DateTime(2026, 8, 1,   8, 0, 0), MaxParticipants = 80  },
                new() { CategoryId = 3, Title = "AI Conference",         Description = "Latest trends in artificial intelligence and ML.",        Location = "KLCC Convention",   EventDate = new DateTime(2026, 6, 25,  9, 0, 0), MaxParticipants = 50  },
                new() { CategoryId = 3, Title = ".NET Workshop",         Description = "Hands-on .NET 9 workshop for developers.",               Location = "Cyberjaya Hub",     EventDate = new DateTime(2026, 7, 5,  10, 0, 0), MaxParticipants = 30  },
                new() { CategoryId = 3, Title = "UI/UX Bootcamp",        Description = "Two-day intensive UI/UX design bootcamp.",               Location = "MDEC Tower, Cyberjaya", EventDate = new DateTime(2026, 7, 18, 9, 0, 0), MaxParticipants = 40  },
                new() { CategoryId = 3, Title = "Cloud Computing Talk",  Description = "Introduction to cloud architecture and DevOps.",          Location = "TM Tower KL",       EventDate = new DateTime(2026, 8, 8,  10, 0, 0), MaxParticipants = 60  },
                new() { CategoryId = 4, Title = "Street Food Carnival",  Description = "Local street food event with 30+ vendors.",              Location = "Publika Mall",      EventDate = new DateTime(2026, 6, 28, 11, 0, 0), MaxParticipants = 150 },
                new() { CategoryId = 4, Title = "Baking Class",          Description = "Learn to bake sourdough and artisan bread.",             Location = "Bangsar Kitchen",   EventDate = new DateTime(2026, 7, 10, 14, 0, 0), MaxParticipants = 20  },
                new() { CategoryId = 4, Title = "Ramen Festival",        Description = "A celebration of ramen culture with 10 ramen stalls.",   Location = "Pavilion KL",       EventDate = new DateTime(2026, 7, 26, 11, 0, 0), MaxParticipants = 100 },
                new() { CategoryId = 5, Title = "Art Expo 2026",         Description = "Modern art exhibition featuring 30 local artists.",       Location = "MAP KL",            EventDate = new DateTime(2026, 7, 15, 10, 0, 0), MaxParticipants = 80  },
                new() { CategoryId = 5, Title = "Sketch Workshop",       Description = "Urban sketching workshop around Kuala Lumpur.",           Location = "Central Market",    EventDate = new DateTime(2026, 7, 20,  9, 0, 0), MaxParticipants = 25  },
                new() { CategoryId = 5, Title = "Photography Walk",      Description = "Guided photography walk through heritage KL streets.",    Location = "Masjid Jamek LRT",  EventDate = new DateTime(2026, 8, 15,  8, 0, 0), MaxParticipants = 30  },
            };
            context.Events.AddRange(events);
            context.SaveChanges();

            // Bookings
            var bookings = new List<Booking>
            {
                // Jazz Night (80 cap) - 70 confirmed
                new() { EventId = 1, ParticipantName = "Ali Hassan",      ParticipantEmail = "ali@email.com",       Status = "Confirmed" },
                new() { EventId = 1, ParticipantName = "Mei Ling",        ParticipantEmail = "mei@email.com",       Status = "Confirmed" },
                new() { EventId = 1, ParticipantName = "Siti Rahimah",    ParticipantEmail = "siti@email.com",      Status = "Confirmed" },
                new() { EventId = 1, ParticipantName = "James Ng",        ParticipantEmail = "james@email.com",     Status = "Confirmed" },
                new() { EventId = 1, ParticipantName = "Priya Devi",      ParticipantEmail = "priya@email.com",     Status = "Confirmed" },
                new() { EventId = 1, ParticipantName = "Kevin Chong",     ParticipantEmail = "kevin@email.com",     Status = "Confirmed" },
                new() { EventId = 1, ParticipantName = "Nurul Ain",       ParticipantEmail = "nurul@email.com",     Status = "Confirmed" },
                new() { EventId = 1, ParticipantName = "David Lim",       ParticipantEmail = "david@email.com",     Status = "Cancelled" },

                // Rock Festival (120 cap) - 95 confirmed
                new() { EventId = 2, ParticipantName = "Rajan Kumar",     ParticipantEmail = "rajan@email.com",     Status = "Confirmed" },
                new() { EventId = 2, ParticipantName = "Farah Aziz",      ParticipantEmail = "farah@email.com",     Status = "Confirmed" },
                new() { EventId = 2, ParticipantName = "Tommy Tan",       ParticipantEmail = "tommy@email.com",     Status = "Confirmed" },
                new() { EventId = 2, ParticipantName = "Aisha Malik",     ParticipantEmail = "aisha@email.com",     Status = "Confirmed" },
                new() { EventId = 2, ParticipantName = "Brandon Lee",     ParticipantEmail = "brandon@email.com",   Status = "Confirmed" },
                new() { EventId = 2, ParticipantName = "Chloe Wong",      ParticipantEmail = "chloe@email.com",     Status = "Cancelled" },

                // Acoustic Evening (40 cap)
                new() { EventId = 3, ParticipantName = "Zachary Foo",     ParticipantEmail = "zachary@email.com",   Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Nadia Rosli",     ParticipantEmail = "nadia@email.com",     Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Marcus Chan",     ParticipantEmail = "marcus@email.com",    Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Penny Lau",       ParticipantEmail = "penny@email.com",     Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Quinn Beh",       ParticipantEmail = "quinn@email.com",     Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Rohani Ismail",   ParticipantEmail = "rohani@email.com",    Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Steven Khor",     ParticipantEmail = "steven@email.com",    Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Tracy Lim",       ParticipantEmail = "tracy@email.com",     Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Uma Pillai",      ParticipantEmail = "uma@email.com",       Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Vincent Goh",     ParticipantEmail = "vincent@email.com",   Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Wendy Chan",      ParticipantEmail = "wendy@email.com",     Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Xavier Low",      ParticipantEmail = "xavier@email.com",    Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Yasmin Azhar",    ParticipantEmail = "yasmin@email.com",    Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Zulaikha Musa",   ParticipantEmail = "zulaikha@email.com",  Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Alan Tong",       ParticipantEmail = "alan@email.com",      Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Betty Sim",       ParticipantEmail = "betty@email.com",     Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Calvin Hor",      ParticipantEmail = "calvin@email.com",    Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Dina Hafizah",    ParticipantEmail = "dina@email.com",      Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Eric Pang",       ParticipantEmail = "eric@email.com",      Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Fiona Yew",       ParticipantEmail = "fiona@email.com",     Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "George Kee",      ParticipantEmail = "george@email.com",    Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Hannah Ooi",      ParticipantEmail = "hannah@email.com",    Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Ivan Chee",       ParticipantEmail = "ivan@email.com",      Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Jenny Woo",       ParticipantEmail = "jenny@email.com",     Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Kenny Leow",      ParticipantEmail = "kenny@email.com",     Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Linda Kok",       ParticipantEmail = "linda@email.com",     Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Martin Yap",      ParticipantEmail = "martin@email.com",    Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Nina Rashid",     ParticipantEmail = "nina@email.com",      Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Oliver Tee",      ParticipantEmail = "oliver@email.com",    Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Pauline Ng",      ParticipantEmail = "pauline@email.com",   Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Raymond Chow",    ParticipantEmail = "raymondchow@email.com", Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Sandra Low",      ParticipantEmail = "sandra@email.com",    Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Timothy Tan",     ParticipantEmail = "timothy@email.com",   Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Ursula Chin",     ParticipantEmail = "ursula@email.com",    Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Victor Loh",      ParticipantEmail = "victor@email.com",    Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Winnie Kwan",     ParticipantEmail = "winnie@email.com",    Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Xian Yi Tan",     ParticipantEmail = "xianyi@email.com",    Status = "Confirmed" },
                new() { EventId = 3, ParticipantName = "Yanti Bakar",     ParticipantEmail = "yanti@email.com",     Status = "Confirmed" },

                // Marathon KL (200 cap) - 160 confirmed
                new() { EventId = 4, ParticipantName = "Sarah Tan",       ParticipantEmail = "sarah@email.com",     Status = "Confirmed" },
                new() { EventId = 4, ParticipantName = "Ahmad Faris",     ParticipantEmail = "faris@email.com",     Status = "Confirmed" },
                new() { EventId = 4, ParticipantName = "Lena Koh",        ParticipantEmail = "lena@email.com",      Status = "Confirmed" },
                new() { EventId = 4, ParticipantName = "Raymond Yap",     ParticipantEmail = "raymond@email.com",   Status = "Cancelled" },
                new() { EventId = 4, ParticipantName = "Hafiz Zainudin",  ParticipantEmail = "hafiz@email.com",     Status = "Confirmed" },
                new() { EventId = 4, ParticipantName = "Cindy Ong",       ParticipantEmail = "cindy@email.com",     Status = "Confirmed" },

                // Basketball Tournament (60 cap) - 55 confirmed
                new() { EventId = 5, ParticipantName = "Darren Sim",      ParticipantEmail = "darren@email.com",    Status = "Confirmed" },
                new() { EventId = 5, ParticipantName = "Wan Haziq",       ParticipantEmail = "haziq@email.com",     Status = "Confirmed" },
                new() { EventId = 5, ParticipantName = "Elaine Teoh",     ParticipantEmail = "elaine@email.com",    Status = "Confirmed" },
                new() { EventId = 5, ParticipantName = "Farhan Idris",    ParticipantEmail = "farhan@email.com",    Status = "Cancelled" },

                // Futsal League (80 cap) - 30 confirmed
                new() { EventId = 6, ParticipantName = "Gary Lau",        ParticipantEmail = "gary@email.com",      Status = "Confirmed" },
                new() { EventId = 6, ParticipantName = "Hazwani Salleh",  ParticipantEmail = "hazwani@email.com",   Status = "Confirmed" },

                // AI Conference (50 cap) - 47 confirmed
                new() { EventId = 7, ParticipantName = "John Lim",        ParticipantEmail = "john@email.com",      Status = "Confirmed" },
                new() { EventId = 7, ParticipantName = "Irene Poh",       ParticipantEmail = "irene@email.com",     Status = "Confirmed" },
                new() { EventId = 7, ParticipantName = "Jason Teh",       ParticipantEmail = "jason@email.com",     Status = "Confirmed" },
                new() { EventId = 7, ParticipantName = "Karen Ng",        ParticipantEmail = "karen@email.com",     Status = "Cancelled" },
                new() { EventId = 7, ParticipantName = "Leon Foo",        ParticipantEmail = "leon@email.com",      Status = "Confirmed" },

                // .NET Workshop (30 cap) - 22 confirmed
                new() { EventId = 8, ParticipantName = "Nur Aisyah",      ParticipantEmail = "aisyah@email.com",    Status = "Confirmed" },
                new() { EventId = 8, ParticipantName = "Michael Tan",     ParticipantEmail = "michael@email.com",   Status = "Confirmed" },
                new() { EventId = 8, ParticipantName = "Natasha Lim",     ParticipantEmail = "natasha@email.com",   Status = "Confirmed" },

                // UI/UX Bootcamp (40 cap) - 18 confirmed
                new() { EventId = 9, ParticipantName = "Oscar Yong",      ParticipantEmail = "oscar@email.com",     Status = "Confirmed" },
                new() { EventId = 9, ParticipantName = "Patricia Woo",    ParticipantEmail = "patricia@email.com",  Status = "Confirmed" },

                // Cloud Computing Talk (60 cap) - 10 confirmed
                new() { EventId = 10, ParticipantName = "Qasim Rashid",   ParticipantEmail = "qasim@email.com",     Status = "Confirmed" },

                // Street Food Carnival (150 cap) - 120 confirmed
                new() { EventId = 11, ParticipantName = "David Wong",     ParticipantEmail = "davidw@email.com",    Status = "Confirmed" },
                new() { EventId = 11, ParticipantName = "Rachel Chin",    ParticipantEmail = "rachel@email.com",    Status = "Confirmed" },
                new() { EventId = 11, ParticipantName = "Samuel Tan",     ParticipantEmail = "samuel@email.com",    Status = "Confirmed" },
                new() { EventId = 11, ParticipantName = "Tina Kee",       ParticipantEmail = "tina@email.com",      Status = "Cancelled" },
                new() { EventId = 11, ParticipantName = "Umar Farouq",    ParticipantEmail = "umar@email.com",      Status = "Confirmed" },

                // Baking Class (20 cap)
                new() { EventId = 12, ParticipantName = "Vivian Ho",      ParticipantEmail = "vivian@email.com",    Status = "Confirmed" },
                new() { EventId = 12, ParticipantName = "Wilson Goh",     ParticipantEmail = "wilson@email.com",    Status = "Confirmed" },
                new() { EventId = 12, ParticipantName = "Xin Yi Loh",     ParticipantEmail = "xinyi@email.com",     Status = "Confirmed" },
                new() { EventId = 12, ParticipantName = "Yong Mei Shan",  ParticipantEmail = "yongmei@email.com",   Status = "Confirmed" },
                new() { EventId = 12, ParticipantName = "Zaid Hamdan",    ParticipantEmail = "zaid@email.com",      Status = "Confirmed" },
                new() { EventId = 12, ParticipantName = "Amira Nasir",    ParticipantEmail = "amira@email.com",     Status = "Confirmed" },
                new() { EventId = 12, ParticipantName = "Bobby Tan",      ParticipantEmail = "bobby@email.com",     Status = "Confirmed" },
                new() { EventId = 12, ParticipantName = "Celeste Lim",    ParticipantEmail = "celeste@email.com",   Status = "Confirmed" },
                new() { EventId = 12, ParticipantName = "Desmond Ng",     ParticipantEmail = "desmond@email.com",   Status = "Confirmed" },
                new() { EventId = 12, ParticipantName = "Evelyn Koh",     ParticipantEmail = "evelyn@email.com",    Status = "Confirmed" },
                new() { EventId = 12, ParticipantName = "Felix Chia",     ParticipantEmail = "felix@email.com",     Status = "Confirmed" },
                new() { EventId = 12, ParticipantName = "Grace Toh",      ParticipantEmail = "grace@email.com",     Status = "Confirmed" },
                new() { EventId = 12, ParticipantName = "Henry Ling",     ParticipantEmail = "henry@email.com",     Status = "Confirmed" },
                new() { EventId = 12, ParticipantName = "Irma Yusoff",    ParticipantEmail = "irma@email.com",      Status = "Confirmed" },
                new() { EventId = 12, ParticipantName = "Jonathan Wee",   ParticipantEmail = "jonathan@email.com",  Status = "Confirmed" },
                new() { EventId = 12, ParticipantName = "Kelly Chan",     ParticipantEmail = "kelly@email.com",     Status = "Confirmed" },
                new() { EventId = 12, ParticipantName = "Louis Poh",      ParticipantEmail = "louis@email.com",     Status = "Confirmed" },

                // Ramen Festival (100 cap) - 55 confirmed
                new() { EventId = 13, ParticipantName = "Yusof Hamid",    ParticipantEmail = "yusof@email.com",     Status = "Confirmed" },
                new() { EventId = 13, ParticipantName = "Zara Putri",     ParticipantEmail = "zara@email.com",      Status = "Confirmed" },
                new() { EventId = 13, ParticipantName = "Aaron Cheah",    ParticipantEmail = "aaron@email.com",     Status = "Cancelled" },

                // Art Expo (80 cap) - 45 confirmed
                new() { EventId = 14, ParticipantName = "Priya Nair",     ParticipantEmail = "priyan@email.com",    Status = "Confirmed" },
                new() { EventId = 14, ParticipantName = "Barry Ooi",      ParticipantEmail = "barry@email.com",     Status = "Confirmed" },
                new() { EventId = 14, ParticipantName = "Carmen Loh",     ParticipantEmail = "carmen@email.com",    Status = "Confirmed" },

                // Sketch Workshop (25 cap) - 20 confirmed
                new() { EventId = 15, ParticipantName = "Kevin Chong",    ParticipantEmail = "kevinc@email.com",    Status = "Confirmed" },
                new() { EventId = 15, ParticipantName = "Diana Yeap",     ParticipantEmail = "diana@email.com",     Status = "Confirmed" },

                // Photography Walk (30 cap) - 12 confirmed
                new() { EventId = 16, ParticipantName = "Edwin Leong",    ParticipantEmail = "edwin@email.com",     Status = "Confirmed" },
                new() { EventId = 16, ParticipantName = "Fatimah Zahra",  ParticipantEmail = "fatimah@email.com",   Status = "Confirmed" },
            };
            context.Bookings.AddRange(bookings);
            context.SaveChanges();
        }
    }
}