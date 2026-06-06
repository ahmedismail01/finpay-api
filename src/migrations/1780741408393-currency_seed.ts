import { MigrationInterface, QueryRunner } from 'typeorm';

export class CurrencySeed1780741408393 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.insert('currency', [
      {
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
        isDefault: true,
      },
      {
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
        isDefault: false,
      },
      {
        code: 'GBP',
        name: 'British Pound',
        symbol: '£',
        isDefault: false,
      },
      {
        code: 'EGP',
        name: 'Egyptian Pound',
        symbol: '£',
        isDefault: false,
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "currency" WHERE "code" IN ('USD', 'EUR', 'GBP', 'EGP');`,
    );
  }
}
