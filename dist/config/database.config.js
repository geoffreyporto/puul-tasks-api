"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const getDatabaseConfig = (configService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST', 'db.hhywwjurdzwieldploou.supabase.co'),
    port: configService.get('DB_PORT', 5432),
    username: configService.get('DB_USERNAME', 'postgres'),
    password: configService.get('DB_PASSWORD', '4dm1ndbdevap11'),
    database: configService.get('DB_NAME', 'postgres'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    migrationsRun: configService.get('NODE_ENV') !== 'production',
    synchronize: configService.get('NODE_ENV') === 'development',
    logging: configService.get('NODE_ENV') === 'development' ? ['query', 'error'] : ['error'],
    extra: {
        connectionLimit: 20,
        acquireTimeout: 60000,
        timeout: 60000,
    },
    ssl: configService.get('NODE_ENV') === 'production' ? {
        rejectUnauthorized: false,
    } : false,
    cache: {
        duration: 30000,
    },
});
exports.getDatabaseConfig = getDatabaseConfig;
//# sourceMappingURL=database.config.js.map