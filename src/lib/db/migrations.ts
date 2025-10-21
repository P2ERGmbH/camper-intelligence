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
      const [userIdColumn] = await connection.execute("SHOW COLUMNS FROM images LIKE 'user_id'");
      if ((userIdColumn as DbColumn[]).length === 0) {
        console.log(`Column 'user_id' not found in images table. Pending update.`);
        pendingImageColumnUpdates++;
      }
      const [originColumn] = await connection.execute("SHOW COLUMNS FROM images LIKE 'origin'");
      if ((originColumn as DbColumn[]).length === 0) {
        console.log(`Column 'origin' not found in images table. Pending update.`);
        pendingImageColumnUpdates++;
      }
      const [activeColumn] = await connection.execute("SHOW COLUMNS FROM images LIKE 'active'");
      if ((activeColumn as DbColumn[]).length === 0) {
        console.log(`Column 'active' not found in images table. Pending update.`);
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
      const [categoryColumn] = await connection.execute("SHOW COLUMNS FROM station_images LIKE 'category'");
      if ((categoryColumn as DbColumn[]).length === 0) {
        console.log(`Column 'category' not found in station_images table. Pending update.`);
        pendingStationImageColumnUpdates++;
      }

      // Check primary key for station_images
      const [primaryKeyRows] = await connection.execute("SHOW KEYS FROM station_images WHERE Key_name = 'PRIMARY'");
      const primaryKeyColumns = (primaryKeyRows as { Column_name: string }[]).map(row => row.Column_name).sort().join(',');
      const expectedPrimaryKey = ['station_id', 'image_id', 'category'].sort().join(',');

      if (primaryKeyColumns !== expectedPrimaryKey) {
        console.log(`Primary key for station_images is incorrect. Expected: ${expectedPrimaryKey}, Got: ${primaryKeyColumns}. Pending update.`);
        pendingStationImagePrimaryKeyUpdate = 1;
      }
    }

    // Check for missing columns in provider_images table and primary key
    let pendingProviderImageColumnUpdates = 0;
    let pendingProviderImagePrimaryKeyUpdate = 0;
    if (existingTables.has('provider_images')) {
      const [categoryColumn] = await connection.execute("SHOW COLUMNS FROM provider_images LIKE 'category'");
      if ((categoryColumn as DbColumn[]).length === 0) {
        console.log(`Column 'category' not found in provider_images table. Pending update.`);
        pendingProviderImageColumnUpdates++;
      }

      // Check primary key for provider_images
      const [primaryKeyRows] = await connection.execute("SHOW KEYS FROM provider_images WHERE Key_name = 'PRIMARY'");
      const primaryKeyColumns = (primaryKeyRows as { Column_name: string }[]).map(row => row.Column_name).sort().join(',');
      const expectedPrimaryKey = ['provider_id', 'image_id', 'category'].sort().join(',');

      if (primaryKeyColumns !== expectedPrimaryKey) {
        console.log(`Primary key for provider_images is incorrect. Expected: ${expectedPrimaryKey}, Got: ${primaryKeyColumns}. Pending update.`);
        pendingProviderImagePrimaryKeyUpdate = 1;
      }
    }

    console.log('Missing tables count:', missingTables.length);
    console.log('Pending role update count:', pendingRoleUpdate);
    console.log('Pending image column updates count:', pendingImageColumnUpdates);
    console.log('Pending camper_image column updates count:', pendingCamperImageColumnUpdates);
    console.log('Pending camper_image primary key update count:', pendingCamperImagePrimaryKeyUpdate);
    console.log('Pending station_image column updates count:', pendingStationImageColumnUpdates);
    console.log('Pending station_image primary key update count:', pendingStationImagePrimaryKeyUpdate);
    console.log('Pending provider_image column updates count:', pendingProviderImageColumnUpdates);
    console.log('Pending provider_image primary key update count:', pendingProviderImagePrimaryKeyUpdate);

    return missingTables.length + pendingRoleUpdate + pendingImageColumnUpdates + pendingCamperImageColumnUpdates + pendingCamperImagePrimaryKeyUpdate + pendingStationImageColumnUpdates + pendingStationImagePrimaryKeyUpdate + pendingProviderImageColumnUpdates + pendingProviderImagePrimaryKeyUpdate;
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
    // Temporarily disable foreign key checks
    await connection.execute("SET FOREIGN_KEY_CHECKS = 0");

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

    // Handle images table column additions and foreign key constraint
    if (existingTables.has('images')) {
      // Add width column if missing
      const [widthColumn] = await connection.execute("SHOW COLUMNS FROM images LIKE 'width'");
      if ((widthColumn as DbColumn[]).length === 0) {
        console.log('Applying migration: Adding column \'width\' to images table');
        await connection.execute("ALTER TABLE images ADD COLUMN width INT");
        changesApplied.push('Added column: width to images table');
      }

      // Add height column if missing
      const [heightColumn] = await connection.execute("SHOW COLUMNS FROM images LIKE 'height'");
      if ((heightColumn as DbColumn[]).length === 0) {
        console.log('Applying migration: Adding column \'height\' to images table');
        await connection.execute("ALTER TABLE images ADD COLUMN height INT");
        changesApplied.push('Added column: height to images table');
      }

      // Add active column if missing
      const [activeColumn] = await connection.execute("SHOW COLUMNS FROM images LIKE 'active'");
      if ((activeColumn as DbColumn[]).length === 0) {
        console.log('Applying migration: Adding column \'active\' to images table');
        await connection.execute("ALTER TABLE images ADD COLUMN active BOOLEAN DEFAULT TRUE");
        changesApplied.push('Added column: active to images table');
      }

      // Add user_id column if missing (initially nullable)
      const [userIdColumn] = await connection.execute("SHOW COLUMNS FROM images LIKE 'user_id'");
      if ((userIdColumn as DbColumn[]).length === 0) {
        console.log('Applying migration: Adding nullable column \'user_id\' to images table');
        await connection.execute("ALTER TABLE images ADD COLUMN user_id INT NULL");
        changesApplied.push('Added nullable column: user_id to images table');
      }

      // Add origin column if missing (initially nullable)
      const [originColumn] = await connection.execute("SHOW COLUMNS FROM images LIKE 'origin'");
      if ((originColumn as DbColumn[]).length === 0) {
        console.log('Applying migration: Adding nullable column \'origin\' to images table');
        await connection.execute("ALTER TABLE images ADD COLUMN origin VARCHAR(255) NULL");
        changesApplied.push('Added nullable column: origin to images table');
      }

      // Find an admin user to assign to existing images
      const [adminUsers] = await connection.execute('SELECT id FROM users WHERE role = \'admin\' LIMIT 1');
      let defaultUserId: number | null = null;
      if ((adminUsers as { id: number }[]).length > 0) {
        defaultUserId = (adminUsers as { id: number }[])[0].id;
      } else {
        // If no admin user exists, create a default one
        console.warn('No admin user found. Creating a default admin user for migration purposes.');
        await connection.execute(
          'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
          ['migration_admin@example.com', 'default_hashed_password', 'admin']
        );
        const [newAdmin] = await connection.execute('SELECT id FROM users WHERE email = \'migration_admin@example.com\'');
        defaultUserId = (newAdmin as { id: number }[])[0].id;
        changesApplied.push('Created default admin user for migration.');
      }

      // Update existing images to set user_id and origin if they are NULL
      if (defaultUserId !== null) {
        const [nullUserIdImages] = await connection.execute('SELECT id FROM images WHERE user_id IS NULL');
        if ((nullUserIdImages as { id: number }[]).length > 0) {
          console.log(`Updating ${nullUserIdImages.length} existing images with default user_id and origin.`);
          await connection.execute('UPDATE images SET user_id = ?, origin = ? WHERE user_id IS NULL', [defaultUserId, 'legacy-import']);
          changesApplied.push(`Updated ${nullUserIdImages.length} images with default user_id and origin.`);
        }
      }

      // Make user_id and origin NOT NULL
      const [userIdNullCheck] = await connection.execute("SHOW COLUMNS FROM images LIKE 'user_id'");
      if ((userIdNullCheck as DbColumn[])[0]?.Null === 'YES') {
        console.log('Applying migration: Making column \'user_id\' NOT NULL in images table');
        await connection.execute("ALTER TABLE images MODIFY COLUMN user_id INT NOT NULL");
        changesApplied.push('Made column: user_id NOT NULL in images table');
      }

      const [originNullCheck] = await connection.execute("SHOW COLUMNS FROM images LIKE 'origin'");
      if ((originNullCheck as DbColumn[])[0]?.Null === 'YES') {
        console.log('Applying migration: Making column \'origin\' NOT NULL in images table');
        await connection.execute("ALTER TABLE images MODIFY COLUMN origin VARCHAR(255) NOT NULL");
        changesApplied.push('Made column: origin NOT NULL in images table');
      }

      // Add foreign key constraint for user_id if it doesn't exist
      const [foreignKeyCheck] = await connection.execute("SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'images' AND COLUMN_NAME = 'user_id' AND REFERENCED_TABLE_NAME = 'users'");
      if ((foreignKeyCheck as DbTable[]).length === 0) {
        console.log('Applying migration: Adding foreign key constraint for user_id in images table');
        await connection.execute("ALTER TABLE images ADD CONSTRAINT fk_images_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE");
        changesApplied.push('Added foreign key constraint for user_id in images table');
      }
    }

    // Check and add missing columns to camper_images table and primary key
    if (existingTables.has('camper_images')) {
      console.log('Applying migration: Dropping and recreating camper_images table.');
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

    // Check and add missing columns to provider_images table and primary key
    if (existingTables.has('provider_images')) {
      console.log('Applying migration: Dropping and recreating provider_images table.');
      // Drop existing table
      await connection.execute("DROP TABLE IF EXISTS provider_images");
      // Recreate table with correct schema
      const providerImagesTableSql = createTableStatements.find(stmt => stmt.name === 'provider_images')?.sql;
      if (providerImagesTableSql) {
        await connection.execute(providerImagesTableSql);
        changesApplied.push('Dropped and recreated provider_images table');
      } else {
        changesApplied.push('Failed to find SQL for provider_images table recreation.');
      }
    } else {
      // If table does not exist, create it
      const providerImagesTableSql = createTableStatements.find(stmt => stmt.name === 'provider_images')?.sql;
      if (providerImagesTableSql) {
        console.log('Applying migration: Creating provider_images table.');
        await connection.execute(providerImagesTableSql);
        changesApplied.push('Created provider_images table');
      } else {
        changesApplied.push('Failed to find SQL for provider_images table creation.');
      }
    }

    if (changesApplied.length === 0) {
      return 'No pending migrations to apply.';
    } else {
      return `Database migrations applied successfully: ${changesApplied.join('; ')}`;
    }
  } catch (error) {
    console.error('Error applying database migrations:', error);
    throw new Error('An unexpected error occurred during migration.');
  } finally {
    if (connection) {
      await connection.execute("SET FOREIGN_KEY_CHECKS = 1"); // Ensure foreign key checks are re-enabled
      connection.end();
    }
  }
}
