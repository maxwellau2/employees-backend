import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1717739387803 implements MigrationInterface {
  name = "CreateUserTable1717739387803";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "departmentId" integer NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`
        ALTER TABLE "employee" 
        ADD COLUMN IF NOT EXISTS "departmentId" INT
    `);

    // Update the departmentId column based on the department column
    await queryRunner.query(`
        UPDATE "employee"
        SET "departmentId" = CASE
            WHEN "department" = 'HR' THEN 1
            WHEN "department" = 'PS' THEN 2
            WHEN "department" = 'ADMIN' THEN 3
            ELSE NULL
        END
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "employee" 
        DROP COLUMN IF EXISTS "departmentId"
    `);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
