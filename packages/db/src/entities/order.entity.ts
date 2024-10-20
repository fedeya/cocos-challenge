import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { InstrumentEntity } from './instrument.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: 'userid', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({ name: 'userid' })
  userId: number;

  @ManyToOne(() => InstrumentEntity)
  @JoinColumn({ name: 'instrumentid' })
  instrument: InstrumentEntity;

  @Column({ name: 'instrumentid' })
  instrumentId: number;

  @Column()
  side: string; // BUY, SELL, CASH_IN, CASH_OUT

  @Column()
  size: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  type: string; // MARKET, LIMIT

  @Column()
  status: string; // NEW, FILLED, REJECTED, CANCELLED

  @Column()
  datetime: Date;
}
