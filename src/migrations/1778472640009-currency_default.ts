import { MigrationInterface, QueryRunner } from 'typeorm';

export class CurrencyDefault1778472640009 implements MigrationInterface {
  name = 'CurrencyDefault1778472640009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallets" DROP CONSTRAINT "FK_57ced1bbf241ff1451bb2ccfddf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" RENAME COLUMN "currencyId" TO "currency_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "currency" ADD "is_default" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ALTER COLUMN "currency_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD CONSTRAINT "FK_b3167c57663ae949d67436465b3" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallets" DROP CONSTRAINT "FK_b3167c57663ae949d67436465b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ALTER COLUMN "currency_id" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "currency" DROP COLUMN "is_default"`);
    await queryRunner.query(
      `ALTER TABLE "wallets" RENAME COLUMN "currency_id" TO "currencyId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD CONSTRAINT "FK_57ced1bbf241ff1451bb2ccfddf" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
