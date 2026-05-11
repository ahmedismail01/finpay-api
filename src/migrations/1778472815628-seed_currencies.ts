import { MigrationInterface, QueryRunner } from 'typeorm';
import { Currency } from '../database/entities/currency.entity';

const currencies = [
  { name: 'US Dollar', code: 'USD', symbol: '$', isDefault: false },
  { name: 'Euro', code: 'EUR', symbol: '€', isDefault: false },
  { name: 'Egyptian Pound', code: 'EGP', symbol: '£', isDefault: true },
  { name: 'British Pound', code: 'GBP', symbol: '£', isDefault: false },
  { name: 'Japanese Yen', code: 'JPY', symbol: '¥', isDefault: false },
];

export class SeedCurrencies1778472815628 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const currency of currencies) {
      const existing = await queryRunner.manager
        .getRepository(Currency)
        .findOne({ where: { code: currency.code } });

      if (!existing) {
        await queryRunner.manager.getRepository(Currency).save(currency);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const currency of currencies) {
      await queryRunner.manager
        .getRepository(Currency)
        .delete({ code: currency.code });
    }
  }
}
