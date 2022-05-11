import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Modelado de la base de datos
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @Column()
  email: string;
}
