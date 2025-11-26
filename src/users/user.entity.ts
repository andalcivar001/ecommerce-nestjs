import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { hash } from 'bcrypt';
import { Rol } from 'src/roles/rol.entity';
import { Address } from 'src/address/address.entity';
//hace referencia a una tabla de la base de datos
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  notificationToken: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  update_at: Date;

  @JoinTable({
    name: 'user_has_roles',
    joinColumn: {
      name: 'id_user',
    },
    inverseJoinColumn: {
      name: 'id_rol',
    },
  }) // se especifica que es la tabla principal
  @ManyToMany(() => Rol, (rol) => rol.users)
  roles: Rol[];

  @OneToMany(() => Address, (address) => address.id)
  address: Address;

  @BeforeInsert()
  async hashPassowrd() {
    this.password = await hash(this.password, Number(process.env.HASH_SALT));
  }
}
