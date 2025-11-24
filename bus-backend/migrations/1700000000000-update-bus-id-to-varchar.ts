import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateBusIdToVarchar1700000000000 implements MigrationInterface {
  name = 'UpdateBusIdToVarchar1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "buses" ALTER COLUMN "id" TYPE varchar(64)`);
    await queryRunner.query(`ALTER TABLE "buses" ALTER COLUMN "name" TYPE varchar(64)`);
    await queryRunner.query(`ALTER TABLE "bus_locations" ALTER COLUMN "busId" TYPE varchar(64)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bus_locations" ALTER COLUMN "busId" TYPE character varying`);
    await queryRunner.query(`ALTER TABLE "buses" ALTER COLUMN "name" TYPE character varying`);
    await queryRunner.query(`ALTER TABLE "buses" ALTER COLUMN "id" TYPE character varying`);
  }
}
