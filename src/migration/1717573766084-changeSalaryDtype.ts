import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeSalaryDtype1717573766084 implements MigrationInterface {
    name = "ChangeSalaryDtype1717573766084";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "employee" ALTER COLUMN "salary" TYPE double precision USING "salary"::double precision`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "employee" ALTER COLUMN "salary" TYPE integer USING "salary"::integer`
        );
    }
}
