import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Modelado de la base de datos
@Entity()
export class PostCodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lat: number;

  @Column()
  lon: number;
}
