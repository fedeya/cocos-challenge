import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { InstrumentEntity } from './instrument.entity';

@Entity('marketdata')
export class MarketDataEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => InstrumentEntity)
  @JoinColumn({ name: 'instrumentid' })
  instrument: InstrumentEntity;

  @Column({ name: 'instrumentid' })
  instrumentId: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  high: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  low: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  open: number;

  @Column('decimal', { precision: 10, scale: 2 })
  close: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'previousclose' })
  previousClose: number;

  @Column()
  date: Date;
}
