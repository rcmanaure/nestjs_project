import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Modelado de la base de datos
@Entity()
export class CodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  lat: string;

  @Column({ nullable: true })
  lon: string;

  @Column('text', { array: true, nullable: true })
  nearest_postcodes: string[];
}
