import { DataSource } from 'typeorm';

import * as dotenv from 'dotenv';

dotenv.config({
  path: '.env.development',
});

console.log(process.env.DB_HOST);
export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/src/**/*.entity.{ts,js}'],
  migrations: [__dirname + '/src/migrations/*.{ts,js}'],
});
