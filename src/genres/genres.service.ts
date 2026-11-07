import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.genre.findMany({
      include: {
        books: true,
      },
    });
  }

  async findOne(id: string) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: {
        books: true,
      },
    });

    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }

    return genre;
  }

  async create(data: { name: string }) {
    return this.prisma.genre.create({
      data,
    });
  }

  async update(id: string, data: { name?: string }) {
    await this.findOne(id);

    return this.prisma.genre.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const genre = await this.findOne(id);

    if (genre.books.length > 0) {
      throw new ConflictException(
        'Cannot delete a genre that has books assigned to it',
      );
    }

    return this.prisma.genre.delete({
      where: { id },
    });
  }
}