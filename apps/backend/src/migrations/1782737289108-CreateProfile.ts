import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProfile1782737289108 implements MigrationInterface {
    name = 'CreateProfile1782737289108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profiles" ("id" uuid NOT NULL, "email" character varying NOT NULL, "display_name" character varying, "avatar_url" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_5b49bd22c967ce2829ca8f17720" UNIQUE ("email"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "profiles"`);
    }

}
