import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('instruments')
export class InstrumentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ticker: string;

  @Column()
  name: string;

  @Column()
  type: string; // "MONEDA" or "ACCIONES"
}
