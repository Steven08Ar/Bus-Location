import { MigrationInterface, QueryRunner } from 'typeorm';

export class BusIdVarcharRefactor1700000000001 implements MigrationInterface {
  name = 'BusIdVarcharRefactor1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bus_locations" DROP CONSTRAINT IF EXISTS "FK_bus_locations_bus"`); // adjust to actual FK name
    await queryRunner.query(`ALTER TABLE "buses" ALTER COLUMN "id" TYPE varchar`);
    await queryRunner.query(`ALTER TABLE "buses" ALTER COLUMN "name" TYPE varchar`);
    await queryRunner.query(`ALTER TABLE "bus_locations" ALTER COLUMN "busId" TYPE varchar`);
    await queryRunner.query(
      `ALTER TABLE "bus_locations" ADD CONSTRAINT "FK_bus_locations_bus" FOREIGN KEY ("busId") REFERENCES "buses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bus_locations" DROP CONSTRAINT IF EXISTS "FK_bus_locations_bus"`);
    await queryRunner.query(`ALTER TABLE "bus_locations" ALTER COLUMN "busId" TYPE character varying`);
    await queryRunner.query(`ALTER TABLE "buses" ALTER COLUMN "name" TYPE character varying`);
    await queryRunner.query(`ALTER TABLE "buses" ALTER COLUMN "id" TYPE character varying`);
    await queryRunner.query(
      `ALTER TABLE "bus_locations" ADD CONSTRAINT "FK_bus_locations_bus" FOREIGN KEY ("busId") REFERENCES "buses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
