import {
  Column,
  CreateDateColumn,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  Entity,
  ManyToOne,
} from 'typeorm';
import { BusLocation } from './bus-location.entity';
import { Route } from '../../routes/entities/route.entity';

@Entity('buses')
export class Bus {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar', length: 64 })
  name: string;

  @ManyToOne(() => Route, (route) => route.buses, { nullable: true, eager: true })
  route?: Route;

  @OneToMany(() => BusLocation, (location) => location.bus)
  locations: BusLocation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
