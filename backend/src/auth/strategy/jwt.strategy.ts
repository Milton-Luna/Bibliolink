import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PayloadInterface } from "../payload.inteface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "src/users/user/entity/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private configService: ConfigService
    ) { 
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET')
        });
    }

    //Validar el token
    async validate(payload: PayloadInterface) {
        //Extraer el email del payload
        const { user_email } = payload;
        //Buscar el usuario en la base de datos por correo
        const user = await this.userRepository.findOne({ 
            where: [
                { user_email: user_email }
            ],
         });
         if(!user) throw new UnauthorizedException('No se ha encontrado el usuario');
            //Retornar el usuario
            return user;
         
    }
}