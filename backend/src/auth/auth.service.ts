import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RolEntity } from 'src/users/rol/entity/rol.entity';
import { UserEntity } from 'src/users/user/entity/user.entity';
import { UserRolesEntity } from 'src/users/userroles/entity/userroles.entity';
import { Repository } from 'typeorm';
import { LoginDto } from '../dtos/login.dto';
import { compare } from 'bcrypt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/users/user/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(RolEntity)
        private readonly rolRepository: Repository<RolEntity>,
        @InjectRepository(UserRolesEntity)
        private readonly userRolesRepository: Repository<UserRolesEntity>,
        private readonly jwtService: JwtService,
    ) {}

    async register(userData: CreateUserDto) {
        // Generar un salt para mejorar la seguridad del hash de la contraseña
        const salt = await bcrypt.genSalt(10);

        // Hashea la contraseña del usuario con el salt generado
        const hashedPassword = await bcrypt.hash(userData.user_password, salt);

        // Buscar el rol correspondiente
        const rol = await this.rolRepository.findOne({ where: { rol_id: userData.rol_id } });

        if (!rol) {
            throw new BadRequestException('El rol especificado no existe');
        }

        // Crear el usuario
        const newUser = this.userRepository.create({
            user_email: userData.user_email,
            user_password: hashedPassword,
        });

        // Guardar el usuario en la base de datos
        const savedUser = await this.userRepository.save(newUser);

        // Crear la relación en la tabla userroles
        const userRole = this.userRolesRepository.create({
            user: savedUser,
            rol: rol,
        });

        // Guardar la relación en la base de datos
        await this.userRolesRepository.save(userRole);

        return savedUser;
    }

    async login(dto: LoginDto): Promise<any> {
        const { user_email } = dto;

        // Buscar el usuario en la base de datos por correo
        const user = await this.userRepository.findOne({
            where: { user_email: user_email },
            relations: ['userroles', 'userroles.rol'], // Cargar relaciones necesarias
        });

        if (!user) throw new UnauthorizedException('No se ha encontrado el usuario');

        // Comparar la contraseña con la contraseña almacenada en la base de datos
        const passwordOK = await compare(dto.user_password, user.user_password);

        if (!passwordOK) throw new UnauthorizedException('Contraseña incorrecta');

        // Obtener el primer rol del usuario (si tiene múltiples roles, ajusta según tu lógica)
        const userRole = user.userroles[0];
        if (!userRole) throw new UnauthorizedException('El usuario no tiene roles asignados');

        // Crear el token JWT con la información del usuario
        const payload = {
            user_id: user.user_id,
            user_email: user.user_email,
            rol_id: userRole.rol.rol_id, // Acceder al primer rol
        };

        const token = this.jwtService.sign(payload, { expiresIn: '1h' });
        return { token };
    }
}