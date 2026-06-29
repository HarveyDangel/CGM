import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailIndex1782740094645 implements MigrationInterface {
  name = 'AddEmailIndex1782740094645';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_5b49bd22c967ce2829ca8f1772" ON "profiles" ("email") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5b49bd22c967ce2829ca8f1772"`,
    );
  }
}
