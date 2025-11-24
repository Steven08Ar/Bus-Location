import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RouteStop } from './route-stop.entity';
import { Bus } from '../../bus/entities/bus.entity';

@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => RouteStop, (stop) => stop.route, { cascade: true, eager: true })
  stops: RouteStop[];

  @OneToMany(() => Bus, (bus) => bus.route)
  buses: Bus[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
