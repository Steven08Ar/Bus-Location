import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Route } from './route.entity';

@Entity('route_stops')
export class RouteStop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'double precision' })
  latitude: number;

  @Column({ type: 'double precision' })
  longitude: number;

  @Column({ type: 'int', default: 0 })
  order: number;

  @ManyToOne(() => Route, (route) => route.stops, { onDelete: 'CASCADE' })
  route: Route;
}
