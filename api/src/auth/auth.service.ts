import {
  ConflictException, Injectable, UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(dto.password, 12);
    try {
      const user = await this.prisma.user.create({
        data: { name: dto.name.trim(), email, passwordHash, role: 'PATRON' },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      });
      return { user, ...(await this.issueToken(user.id, user.role)) };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('An account with this email already exists');
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.trim().toLowerCase() },
    });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const safeUser = {
      id: user.id, name: user.name, email: user.email,
      role: user.role, createdAt: user.createdAt,
    };
    return { user: safeUser, ...(await this.issueToken(user.id, user.role)) };
  }

  private async issueToken(userId: string, role: string) {
    const accessToken = await this.jwtService.signAsync({ sub: userId, role });
    return { accessToken, tokenType: 'Bearer', expiresIn: '1h' };
  }
}