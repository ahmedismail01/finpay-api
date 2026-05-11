import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Role } from '../common/enums';
import bcrypt from 'bcrypt';

const admin_user: Partial<User> = {
  email: process.env.ADMIN_EMAIL,
  password: bcrypt.hashSync(
    process.env.ADMIN_PASSWORD ??
      (() => {
        throw new Error('admin password not found');
      })(),
    10,
  ),
  phoneNumber: process.env.ADMIN_PHONE_NUMBER,
  firstName: 'admin',
  lastName: 'user',
  role: Role.ADMIN,
};

export class SeedAdmin1778470895538 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const user = await queryRunner.manager
      .getRepository(User)
      .findOne({ where: { email: admin_user.email } });

    if (user) {
      return;
    }

    await queryRunner.manager.getRepository(User).save(admin_user);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
