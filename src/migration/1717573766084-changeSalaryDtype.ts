import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeSalaryDtype1717573766084 implements MigrationInterface {
    name = 'ChangeSalaryDtype1717573766084'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "salary"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "salary" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "salary"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "salary" integer NOT NULL`);
    }

}
