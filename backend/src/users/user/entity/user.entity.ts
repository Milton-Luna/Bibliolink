import { UserRolesEntity } from "src/users/userroles/entity/userroles.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'user' })
export class UserEntity {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({ type: 'varchar', length: 255,  unique: true })
    user_email: string;

    @Column()
    user_password: string;
        
    @OneToMany(() => UserRolesEntity, (userroles) => userroles.user)
    userroles: UserRolesEntity[];

}
