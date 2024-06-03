import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration21717400029444 implements MigrationInterface {
    name = 'Migration21717400029444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "employee" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "salary" integer NOT NULL, "department" character varying NOT NULL, CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "employee"`);
    }

}
