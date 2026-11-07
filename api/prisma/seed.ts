import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting library database seeding...");

  // 1. Create genres
  const genres = [
    "Horror / Thriller",
    "Technology",
    "Classics",
    "Science",
  ];

  const genreRecords: Record<string, string> = {};

  for (const name of genres) {
    const genre = await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    genreRecords[name] = genre.id;
  }

  // 2. Create books
  const books = [
    // HORROR / THRILLER
    {
      title: "The Shining",
      author: "Stephen King",
      isbn: "DEMO-HT-001",
      genre: "Horror / Thriller",
      publishedYear: 1977,
    },
    {
      title: "Dracula",
      author: "Bram Stoker",
      isbn: "DEMO-HT-002",
      genre: "Horror / Thriller",
      publishedYear: 1897,
    },
    {
      title: "Gone Girl",
      author: "Gillian Flynn",
      isbn: "DEMO-HT-003",
      genre: "Horror / Thriller",
      publishedYear: 2012,
    },
    {
      title: "The Silent Patient",
      author: "Alex Michaelides",
      isbn: "DEMO-HT-004",
      genre: "Horror / Thriller",
      publishedYear: 2019,
    },

    // TECHNOLOGY
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "DEMO-TECH-001",
      genre: "Technology",
      publishedYear: 2008,
    },
    {
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt and David Thomas",
      isbn: "DEMO-TECH-002",
      genre: "Technology",
      publishedYear: 1999,
    },
    {
      title: "Code Complete",
      author: "Steve McConnell",
      isbn: "DEMO-TECH-003",
      genre: "Technology",
      publishedYear: 1993,
    },
    {
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen and others",
      isbn: "DEMO-TECH-004",
      genre: "Technology",
      publishedYear: 1990,
    },

    // CLASSICS
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      isbn: "DEMO-CLASS-001",
      genre: "Classics",
      publishedYear: 1813,
    },
    {
      title: "1984",
      author: "George Orwell",
      isbn: "DEMO-CLASS-002",
      genre: "Classics",
      publishedYear: 1949,
    },
    {
      title: "Great Expectations",
      author: "Charles Dickens",
      isbn: "DEMO-CLASS-003",
      genre: "Classics",
      publishedYear: 1861,
    },
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "DEMO-CLASS-004",
      genre: "Classics",
      publishedYear: 1925,
    },

    // SCIENCE
    {
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      isbn: "DEMO-SCI-001",
      genre: "Science",
      publishedYear: 1988,
    },
    {
      title: "Cosmos",
      author: "Carl Sagan",
      isbn: "DEMO-SCI-002",
      genre: "Science",
      publishedYear: 1980,
    },
    {
      title: "The Selfish Gene",
      author: "Richard Dawkins",
      isbn: "DEMO-SCI-003",
      genre: "Science",
      publishedYear: 1976,
    },
    {
      title: "The Origin of Species",
      author: "Charles Darwin",
      isbn: "DEMO-SCI-004",
      genre: "Science",
      publishedYear: 1859,
    },
  ];

  for (const book of books) {
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {
        title: book.title,
        author: book.author,
        publishedYear: book.publishedYear,
        genreId: genreRecords[book.genre],
      },
      create: {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publishedYear: book.publishedYear,
        genreId: genreRecords[book.genre],
      },
    });
  }

  console.log("4 genres created or confirmed.");
  console.log("16 books created or updated.");
  console.log("Database seeding completed!");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });