import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Modelado de la base de datos
@Entity()
export class CodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lat: string;

  @Column()
  lon: string;
}
