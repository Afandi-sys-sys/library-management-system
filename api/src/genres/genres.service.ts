import {
  ConflictException, Injectable, NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateGenreDto } from './dto/create-genre.dto.js';
import { UpdateGenreDto } from './dto/update-genre.dto.js';

@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.genre.findMany({ include: { books: true } });
  }

  async findOne(id: string) {
    const genre = await this.prisma.genre.findUnique({
      where: { id }, include: { books: true },
    });
    if (!genre) throw new NotFoundException(`Genre with ID ${id} not found`);
    return genre;
  }

  async create(data: CreateGenreDto) {
    try {
      return await this.prisma.genre.create({ data });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(id: string, data: UpdateGenreDto) {
    await this.findOne(id);
    try {
      return await this.prisma.genre.update({ where: { id }, data });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(id: string) {
    const genre = await this.findOne(id);
    if (genre.books.length) {
      throw new ConflictException('Cannot delete a genre that has books assigned to it');
    }
    return this.prisma.genre.delete({ where: { id } });
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictException('A genre with this name already exists');
    }
    throw error;
  }
}