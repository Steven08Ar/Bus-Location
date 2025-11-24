import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Bus } from './bus.entity';

@Entity('bus_locations')
export class BusLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'double precision' })
  lat: number;

  @Column({ type: 'double precision' })
  lng: number;

  @Column({ type: 'double precision', nullable: true })
  speed?: number;

  @Column({ type: 'timestamptz' })
  timestamp: Date;

  @ManyToOne(() => Bus, (bus) => bus.locations, { onDelete: 'CASCADE', eager: true })
  bus: Bus;

  @CreateDateColumn()
  createdAt: Date;
}
