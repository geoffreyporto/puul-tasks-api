// =====================================================
// CONFIGURACIÓN DE MÓDULO TYPEORM
// =====================================================

// src/config/database.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST', 'db.hhywwjurdzwieldploou.supabase.co'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', '4dm1ndbdevap11'),
  database: configService.get('DB_NAME', 'postgres'),
  
  //postgresql://postgres:[YOUR-PASSWORD]@db.hhywwjurdzwieldploou.supabase.co:5432/postgres

  // Entities
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  
  // Migraciones
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  migrationsRun: configService.get('NODE_ENV') !== 'production',
  
  // Configuración de desarrollo
  synchronize: configService.get('NODE_ENV') === 'development',
  logging: configService.get('NODE_ENV') === 'development' ? ['query', 'error'] : ['error'],
  
  // Pool de conexiones
  extra: {
    connectionLimit: 20,
    acquireTimeout: 60000,
    timeout: 60000,
  },
  
  // Configuración SSL para producción
  ssl: configService.get('NODE_ENV') === 'production' ? {
    rejectUnauthorized: false,
  } : false,
  
  // Cache de consultas
  cache: {
    duration: 30000, // 30 segundos
  },
});