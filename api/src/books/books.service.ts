import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.book.findMany({
      include: {
        genre: true,
      },
    });
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        genre: true,
      },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async create(data: {
    title: string;
    author: string;
    isbn: string;
    description?: string;
    publishedYear?: number;
    genreId: string;
  }) {
    return this.prisma.book.create({
      data,
      include: {
        genre: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      author?: string;
      isbn?: string;
      description?: string;
      publishedYear?: number;
      genreId?: string;
    },
  ) {
    await this.findOne(id);

    return this.prisma.book.update({
      where: { id },
      data,
      include: {
        genre: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.book.delete({
      where: { id },
    });
  }
}