import { RolEntity } from "src/users/rol/entity/rol.entity";
import { UserEntity } from "src/users/user/entity/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'userroles' })
export class UserRolesEntity {
    @PrimaryGeneratedColumn()
    userroles_id: number;

    @ManyToOne(() => UserEntity, (user) => user.userroles)
    user: UserEntity;

    @ManyToOne(() => RolEntity, (rol) => rol.userroles)
    rol: RolEntity;

}