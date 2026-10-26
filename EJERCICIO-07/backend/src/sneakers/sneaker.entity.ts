import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sneakers')
export class Sneaker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  modelo: string;

  @Column()
  marca: string;

  @Column()
  stock: number;
}
