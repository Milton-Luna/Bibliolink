import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserEntity } from 'src/users/user/entity/user.entity';
import { RolEntity } from 'src/users/rol/entity/rol.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRolesEntity } from 'src/users/userroles/entity/userroles.entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '30m' },
      }),
    }),
    TypeOrmModule.forFeature([UserEntity, RolEntity, UserRolesEntity]), 
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
