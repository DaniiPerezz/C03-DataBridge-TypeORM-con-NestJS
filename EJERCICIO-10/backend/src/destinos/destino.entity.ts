import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('destinos')
export class Destino {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  pais: string;

  @Column()
  prioridad: string;

  @Column()
  visitado: boolean;

  @Column({ default: '' })
  notas: string;
}
