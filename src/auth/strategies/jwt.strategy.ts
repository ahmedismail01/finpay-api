import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { In, Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayloadDto } from '../dtos/jwt-payload.dto';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayloadDto) {
    const user = await this.userRepository.findOne({
      where: { id: payload.id },
    });

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
