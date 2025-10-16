import { createDbConnection } from './utils';
import fs from 'fs/promises';
import path from 'path';

interface DbTable {
  [key: string]: string; // e.g., { 'Tables_in_database_name': 'users' }
}

interface DbColumn {
  Field: string;
  Type: string;
  Null: string;
  Key: string;
  Default: string | null;
  Extra: string;
}


const createTableStatements: { name: string; sql: string }[] = [];

async function loadSchema() {
  if (createTableStatements.length > 0) return; // Only load once

  const initSqlPath = path.join(process.cwd(), 'db', 'init.sql');
  const sqlContent = await fs.readFile(initSqlPath, 'utf-8');

  const tableRegex = /CREATE TABLE IF NOT EXISTS `?(\w+)`?\s*\(([^;]+?)\);/gs;
  let match;
  while ((match = tableRegex.exec(sqlContent)) !== null) {
    const tableName = match[1];
    const createStatement = match[0];
    createTableStatements.push({ name: tableName, sql: createStatement });
  }
}

export async function getPendingMigrationsCount(): Promise<number> {
  await loadSchema();
  let connection;
  try {
    connection = await createDbConnection();
    const [rows] = await connection.execute('SHOW TABLES');
    const existingTables = new Set((rows as DbTable[]).map((row: DbTable) => Object.values(row)[0]));
    console.log('Existing tables:', existingTables);

    const missingTables = createTableStatements.filter(stmt => !existingTables.has(stmt.name));
    console.log('Missing tables identified:', missingTables.map(t => t.name));

    // Check for 'admin' role in users table separately
    let pendingRoleUpdate = 0;
    if (existingTables.has('users')) {
      const [columns] = await connection.execute("SHOW COLUMNS FROM users LIKE 'role'");
      const roleColumn = (columns as DbColumn[])[0];
      console.log('Role column definition:', roleColumn);
      if (roleColumn && !roleColumn.Type.includes('admin')) {
        console.log(`'admin' not found in role column type. Pending update.`);
        pendingRoleUpdate = 1;
      } else if (roleColumn) {
        console.log(`'admin' already found in role column type.`);
      }
    }


    // Check for missing columns in images table
    let pendingImageColumnUpdates = 0;
    if (existingTables.has('images')) {
      const [widthColumn] = await connection.execute("SHOW COLUMNS FROM images LIKE 'width'");
      if ((widthColumn as DbColumn[]).length === 0) {
        console.log(`Column 'width' not found in images table. Pending update.`);
        pendingImageColumnUpdates++;
      }
      const [heightColumn] = await connection.execute("SHOW COLUMNS FROM images LIKE 'height'");
      if ((heightColumn as DbColumn[]).length === 0) {
        console.log(`Column 'height' not found in images table. Pending update.`);
        pendingImageColumnUpdates++;
      }
    }

    // Check for missing columns in camper_images table and primary key
    let pendingCamperImageColumnUpdates = 0;
    let pendingCamperImagePrimaryKeyUpdate = 0;
    if (existingTables.has('camper_images')) {
      const [categoryColumn] = await connection.execute("SHOW COLUMNS FROM camper_images LIKE 'category'");
      if ((categoryColumn as DbColumn[]).length === 0) {
        console.log(`Column 'category' not found in camper_images table. Pending update.`);
        pendingCamperImageColumnUpdates++;
      }

      // Check primary key for camper_images
      const [primaryKeyRows] = await connection.execute("SHOW KEYS FROM camper_images WHERE Key_name = 'PRIMARY'");
      const primaryKeyColumns = (primaryKeyRows as { Column_name: string }[]).map(row => row.Column_name).sort().join(',');
      const expectedPrimaryKey = ['camper_id', 'image_id', 'category'].sort().join(',');

      if (primaryKeyColumns !== expectedPrimaryKey) {
        console.log(`Primary key for camper_images is incorrect. Expected: ${expectedPrimaryKey}, Got: ${primaryKeyColumns}. Pending update.`);
        pendingCamperImagePrimaryKeyUpdate = 1;
      }
    }

    // Check for missing columns in station_images table and primary key
    let pendingStationImageColumnUpdates = 0;
    let pendingStationImagePrimaryKeyUpdate = 0;
    if (existingTables.has('station_images')) {
      const [categoryColumn] = await connection.execute("SHOW COLUMNS FROM station_images LIKE 'image_category'");
      if ((categoryColumn as DbColumn[]).length === 0) {
        console.log(`Column 'image_category' not found in station_images table. Pending update.`);
        pendingStationImageColumnUpdates++;
      }

      // Check primary key for station_images
      const [primaryKeyRows] = await connection.execute("SHOW KEYS FROM station_images WHERE Key_name = 'PRIMARY'");
      const primaryKeyColumns = (primaryKeyRows as { Column_name: string }[]).map(row => row.Column_name).sort().join(',');
      const expectedPrimaryKey = ['station_id', 'image_id', 'image_category'].sort().join(',');

      if (primaryKeyColumns !== expectedPrimaryKey) {
        console.log(`Primary key for station_images is incorrect. Expected: ${expectedPrimaryKey}, Got: ${primaryKeyColumns}. Pending update.`);
        pendingStationImagePrimaryKeyUpdate = 1;
      }
    }

    console.log('Missing tables count:', missingTables.length);
    console.log('Pending role update count:', pendingRoleUpdate);
    console.log('Pending image column updates count:', pendingImageColumnUpdates);
    console.log('Pending camper_image column updates count:', pendingCamperImageColumnUpdates);
    console.log('Pending camper_image primary key update count:', pendingCamperImagePrimaryKeyUpdate);
    console.log('Pending station_image column updates count:', pendingStationImageColumnUpdates);
    console.log('Pending station_image primary key update count:', pendingStationImagePrimaryKeyUpdate);

    return missingTables.length + pendingRoleUpdate + pendingImageColumnUpdates + pendingCamperImageColumnUpdates + pendingCamperImagePrimaryKeyUpdate + pendingStationImageColumnUpdates + pendingStationImagePrimaryKeyUpdate;
  } catch (error) {
    console.error('Error checking for pending migrations:', error);
    throw new Error('Failed to check for pending migrations.');
  } finally {
    if (connection) connection.end();
  }
}

export async function applyMigrations(): Promise<string> {
  console.log('Starting applyMigrations...');
  await loadSchema();
  let connection;
  try {
    connection = await createDbConnection();
    const [rows] = await connection.execute('SHOW TABLES');
    const existingTables = new Set((rows as DbTable[]).map((row: DbTable) => Object.values(row)[0]));
    console.log('applyMigrations: Existing tables in DB:', existingTables);

    const missingTables = createTableStatements.filter(stmt => !existingTables.has(stmt.name));
    console.log('applyMigrations: Missing tables to create:', missingTables.map(t => t.name));

    const changesApplied: string[] = [];

    if (missingTables.length > 0) {
      for (const table of missingTables) {
        console.log(`Applying migration: Creating table ${table.name} with SQL: ${table.sql}`);
        try {
          await connection.execute(table.sql);
          changesApplied.push(`Created table: ${table.name}`);
        } catch (tableCreationError) {
          console.error(`Error creating table ${table.name}:`, tableCreationError);
          changesApplied.push(`Failed to create table: ${table.name} - ${(tableCreationError as Error).message}`);
        }
      }
    }

    // Check and update 'admin' role in users table
    if (existingTables.has('users')) {
      const [columns] = await connection.execute("SHOW COLUMNS FROM users LIKE 'role'");
      const roleColumn = (columns as DbColumn[])[0];
      if (roleColumn && !roleColumn.Type.includes('admin')) {
        console.log('Applying migration: Adding \'admin\' to users.role ENUM');
        await connection.execute("ALTER TABLE users MODIFY role ENUM('client', 'provider', 'admin') NOT NULL");
        changesApplied.push('Added \'admin\' to users.role ENUM');
      }
    }

    // Check and add missing columns to images table
    if (existingTables.has('images')) {
      const [widthColumn] = await connection.execute("SHOW COLUMNS FROM images LIKE 'width'");
      if ((widthColumn as DbColumn[]).length === 0) {
        console.log('Applying migration: Adding column \'width\' to images table');
        await connection.execute("ALTER TABLE images ADD COLUMN width INT");
        changesApplied.push('Added column: width to images table');
      }
      const [heightColumn] = await connection.execute("SHOW COLUMNS FROM images LIKE 'height'");
      if ((heightColumn as DbColumn[]).length === 0) {
        console.log('Applying migration: Adding column \'height\' to images table');
        await connection.execute("ALTER TABLE images ADD COLUMN height INT");
        changesApplied.push('Added column: height to images table');
      }
    }

    // Check and add missing columns to camper_images table and primary key
    if (existingTables.has('camper_images')) {
      console.log('Applying migration: Dropping and recreating camper_images table.');
      // Temporarily disable foreign key checks
      await connection.execute("SET FOREIGN_KEY_CHECKS = 0");
      // Drop existing table
      await connection.execute("DROP TABLE IF EXISTS camper_images");
      // Recreate table with correct schema
      const camperImagesTableSql = createTableStatements.find(stmt => stmt.name === 'camper_images')?.sql;
      if (camperImagesTableSql) {
        await connection.execute(camperImagesTableSql);
        changesApplied.push('Dropped and recreated camper_images table');
      } else {
        changesApplied.push('Failed to find SQL for camper_images table recreation.');
      }
      // Re-enable foreign key checks
      await connection.execute("SET FOREIGN_KEY_CHECKS = 1");
    } else {
      // If table does not exist, create it
      const camperImagesTableSql = createTableStatements.find(stmt => stmt.name === 'camper_images')?.sql;
      if (camperImagesTableSql) {
        console.log('Applying migration: Creating camper_images table.');
        await connection.execute(camperImagesTableSql);
        changesApplied.push('Created camper_images table');
      } else {
        changesApplied.push('Failed to find SQL for camper_images table creation.');
      }
    }

    // Check and add missing columns to station_images table and primary key
    if (existingTables.has('station_images')) {
      console.log('Applying migration: Dropping and recreating station_images table.');
      // Temporarily disable foreign key checks
      await connection.execute("SET FOREIGN_KEY_CHECKS = 0");
      // Drop existing table
      await connection.execute("DROP TABLE IF EXISTS station_images");
      // Recreate table with correct schema
      const stationImagesTableSql = createTableStatements.find(stmt => stmt.name === 'station_images')?.sql;
      if (stationImagesTableSql) {
        await connection.execute(stationImagesTableSql);
        changesApplied.push('Dropped and recreated station_images table');
      } else {
        changesApplied.push('Failed to find SQL for station_images table recreation.');
      }
      // Re-enable foreign key checks
      await connection.execute("SET FOREIGN_KEY_CHECKS = 1");
    } else {
      // If table does not exist, create it
      const stationImagesTableSql = createTableStatements.find(stmt => stmt.name === 'station_images')?.sql;
      if (stationImagesTableSql) {
        console.log('Applying migration: Creating station_images table.');
        await connection.execute(stationImagesTableSql);
        changesApplied.push('Created station_images table');
      } else {
        changesApplied.push('Failed to find SQL for station_images table creation.');
      }
    }

    if (changesApplied.length === 0) {
      return 'No pending migrations to apply.';
    } else {
      return `Database migrations applied successfully: ${changesApplied.join('; ')}`;
    }
  } catch (error) {
    console.error('Error applying database migrations:', error);
    // Ensure foreign key checks are re-enabled even on error
    if (connection) {
      await connection.execute("SET FOREIGN_KEY_CHECKS = 1");
    }
    throw new Error('An unexpected error occurred during migration.');
  } finally {
    if (connection) connection.end();
  }
}
