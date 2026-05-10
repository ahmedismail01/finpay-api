import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentTransactionJoinColumn1778431364450 implements MigrationInterface {
    name = 'PaymentTransactionJoinColumn1778431364450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" ADD "payment_id" integer`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "UQ_464da95dc8a05470b2b158d4df6" UNIQUE ("payment_id")`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP CONSTRAINT "FK_99797bb751811331b74d27865f3"`);
        await queryRunner.query(`ALTER TABLE "kyc" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD CONSTRAINT "FK_99797bb751811331b74d27865f3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_464da95dc8a05470b2b158d4df6" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_464da95dc8a05470b2b158d4df6"`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP CONSTRAINT "FK_99797bb751811331b74d27865f3"`);
        await queryRunner.query(`ALTER TABLE "kyc" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD CONSTRAINT "FK_99797bb751811331b74d27865f3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "UQ_464da95dc8a05470b2b158d4df6"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "payment_id"`);
    }

}
