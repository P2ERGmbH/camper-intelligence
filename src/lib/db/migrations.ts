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

interface ColumnDefinition {
  name: string;
  type: string;
  constraints: string;
}

const createTableStatements: { name: string; sql: string }[] = [];
const providerColumnDefinitions: ColumnDefinition[] = [];
const camperColumnDefinitions: ColumnDefinition[] = [];
const stationColumnDefinitions: ColumnDefinition[] = [];

async function loadSchema() {
  if (createTableStatements.length > 0 && providerColumnDefinitions.length > 0 && camperColumnDefinitions.length > 0) return;

  const initSqlPath = path.join(process.cwd(), 'db', 'init.sql');
  const sqlContent = await fs.readFile(initSqlPath, 'utf-8');

  const tableRegex = /CREATE TABLE IF NOT EXISTS `?(\w+)`?\s*\(([^;]+?)\);/gs;
  let match;
  while ((match = tableRegex.exec(sqlContent)) !== null) {
    const tableName = match[1];
    const createStatement = match[0];
    createTableStatements.push({ name: tableName, sql: createStatement });

    const columnsContent = match[2];
    // This regex is more precise to capture column name, type, and constraints, excluding PRIMARY KEY from constraints
    const columnRegex = /`?(\w+)`?\s+((?:[A-Z]+(?:\(\d+(?:,\s*\d+)?\))?)(?:\s+(?:UNIQUE|NOT\s+NULL|DEFAULT\s+[^,]+|AUTO_INCREMENT))*)(?:,|$)/g;
    let colMatch;

    if (tableName === 'providers') {
      while ((colMatch = columnRegex.exec(columnsContent)) !== null) {
        const colName = colMatch[1].trim();
        const colTypeAndConstraints = colMatch[2].trim();

        // Skip PRIMARY KEY and FOREIGN KEY definitions that are not part of a column definition
        if (colName.toUpperCase() === 'PRIMARY' || colName.toUpperCase() === 'FOREIGN') {
          continue;
        }

        const typeMatch = colTypeAndConstraints.match(/^([A-Z]+(?:\[d+(?:,\s*\d+)?\])?)/i);
        const type = typeMatch ? typeMatch[1] : '';
        const constraints = colTypeAndConstraints.substring(type.length).trim();

        // Ensure UNIQUE constraint is only added if it's not part of the type already and is explicitly defined
        // Also, ensure PRIMARY KEY is not included here.
        const finalConstraints = constraints.replace(/PRIMARY\s+KEY/g, '').trim();

        providerColumnDefinitions.push({ name: colName, type: type, constraints: finalConstraints });
      }
    } else if (tableName === 'campers') {
      console.log('--- Parsing Campers Table Columns ---');
      console.log('Raw columns content:', columnsContent);
      columnRegex.lastIndex = 0; // Reset regex lastIndex for re-execution
      while ((colMatch = columnRegex.exec(columnsContent)) !== null) {
        console.log('colMatch:', colMatch);
        const colName = colMatch[1].trim();
        const colTypeAndConstraints = colMatch[2].trim();
        console.log(`  Raw: Name='${colName}', TypeAndConstraints='${colTypeAndConstraints}'`);

        if (colName.toUpperCase() === 'PRIMARY' || colName.toUpperCase() === 'FOREIGN') {
          console.log(`  Skipping: ${colName}`);
          continue;
        }

        const typeMatch = colTypeAndConstraints.match(/^([A-Z]+(?:\[d+(?:,\s*\d+)?\])?)/i);
        const type = typeMatch ? typeMatch[1] : '';
        const constraints = colTypeAndConstraints.substring(type.length).trim();

        const finalConstraints = constraints.replace(/PRIMARY\s+KEY/g, '').trim();

        console.log(`  Parsed: Name='${colName}', Type='${type}', Constraints='${finalConstraints}'`);
        camperColumnDefinitions.push({ name: colName, type: type, constraints: finalConstraints });
      }
              console.log('--- End Parsing Campers Table Columns ---');
          } else if (tableName === 'stations') {
            console.log('--- Parsing Stations Table Columns ---');
            console.log('Raw columns content:', columnsContent);
            columnRegex.lastIndex = 0; // Reset regex lastIndex for re-execution
            while ((colMatch = columnRegex.exec(columnsContent)) !== null) {
              console.log('colMatch:', colMatch);
              const colName = colMatch[1].trim();
              const colTypeAndConstraints = colMatch[2].trim();
              console.log(`  Raw: Name='${colName}', TypeAndConstraints='${colTypeAndConstraints}'`);
      
              if (colName.toUpperCase() === 'PRIMARY' || colName.toUpperCase() === 'FOREIGN') {
                console.log(`  Skipping: ${colName}`);
                continue;
              }
      
              const typeMatch = colTypeAndConstraints.match(/^([A-Z]+(?:\(\d+(?:,\s*\d+)?\))?)/i);
              const type = typeMatch ? typeMatch[1] : '';
              const constraints = colTypeAndConstraints.substring(type.length).trim();
      
              const finalConstraints = constraints.replace(/PRIMARY\s+KEY/g, '').trim();
      
              console.log(`  Parsed: Name='${colName}', Type='${type}', Constraints='${finalConstraints}'`);
              stationColumnDefinitions.push({ name: colName, type: type, constraints: finalConstraints });
            }
            console.log('--- End Parsing Stations Table Columns ---');
          }  }
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

    // Check for missing columns in providers table
    let pendingProviderColumnUpdates = 0;
    if (existingTables.has('providers')) {
      const [existingProviderColumns] = await connection.execute('SHOW COLUMNS FROM providers');
      const existingColumnNames = new Set((existingProviderColumns as DbColumn[]).map(col => col.Field));

      for (const colDef of providerColumnDefinitions) {
        if (!existingColumnNames.has(colDef.name)) {
          console.log(`Column '${colDef.name}' not found in providers table. Pending update.`);
          pendingProviderColumnUpdates++;
        }
      }
    }

    // Check for missing columns in campers table
    let pendingCamperColumnUpdates = 0;
    if (existingTables.has('campers')) {
      const [existingCamperColumns] = await connection.execute('SHOW COLUMNS FROM campers');
      const existingColumnNames = new Set((existingCamperColumns as DbColumn[]).map(col => col.Field));

      for (const colDef of camperColumnDefinitions) {
        if (!existingColumnNames.has(colDef.name)) {
          console.log(`Column '${colDef.name}' not found in campers table. Pending update.`);
          pendingCamperColumnUpdates++;
        }
      }
    }

    // Check for missing columns in stations table
    let pendingStationColumnUpdates = 0;
    if (existingTables.has('stations')) {
      const [existingStationColumns] = await connection.execute('SHOW COLUMNS FROM stations');
      const existingColumnNames = new Set((existingStationColumns as DbColumn[]).map(col => col.Field));

      for (const colDef of stationColumnDefinitions) {
        if (!existingColumnNames.has(colDef.name)) {
          console.log(`Column '${colDef.name}' not found in stations table. Pending update.`);
          pendingStationColumnUpdates++;
        }
      }

      // Check for address column nullability
      const [addressColumn] = await connection.execute("SHOW COLUMNS FROM stations LIKE 'address'");
      const currentAddressColumn = (addressColumn as DbColumn[])[0];
      if (currentAddressColumn && currentAddressColumn.Null === 'NO') {
        console.log(`Column 'address' in stations table is NOT NULL, but should be NULL. Pending update.`);
        pendingStationColumnUpdates++; // Increment existing counter for simplicity
      }
    }

    console.log('Missing tables count:', missingTables.length);
    console.log('Pending role update count:', pendingRoleUpdate);
    console.log('Pending provider column updates count:', pendingProviderColumnUpdates);
    console.log('Pending camper column updates count:', pendingCamperColumnUpdates);
    console.log('Pending station column updates count:', pendingStationColumnUpdates);

    return missingTables.length + pendingRoleUpdate + pendingProviderColumnUpdates + pendingCamperColumnUpdates + pendingStationColumnUpdates;
  } catch (error) {
    console.error('Error checking for pending migrations:', error);
    throw new Error('Failed to check for pending migrations.');
  } finally {
    if (connection) connection.end();
  }
}

export async function applyMigrations(): Promise<string> {
  await loadSchema();
  let connection;
  try {
    connection = await createDbConnection();
    const [rows] = await connection.execute('SHOW TABLES');
    const existingTables = new Set((rows as DbTable[]).map((row: DbTable) => Object.values(row)[0]));

    const missingTables = createTableStatements.filter(stmt => !existingTables.has(stmt.name));

    const changesApplied: string[] = [];

    if (missingTables.length > 0) {
      for (const table of missingTables) {
        console.log(`Applying migration: Creating table ${table.name}`);
        await connection.execute(table.sql);
        changesApplied.push(`Created table: ${table.name}`);
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

    // Check and add missing columns to providers table
    if (existingTables.has('providers')) {
      const [existingProviderColumns] = await connection.execute('SHOW COLUMNS FROM providers');
      const existingColumnNames = new Set((existingProviderColumns as DbColumn[]).map(col => col.Field));

      for (const colDef of providerColumnDefinitions) {
        if (!existingColumnNames.has(colDef.name)) {
          console.log(`Applying migration: Adding column '${colDef.name}' to providers table`);
          let alterStatement = `ALTER TABLE providers ADD COLUMN \`${colDef.name}\` ${colDef.type}`;
          if (colDef.constraints) {
            alterStatement += ` ${colDef.constraints}`;
          }
          console.log('Executing ALTER TABLE for providers:', alterStatement);
          await connection.execute(alterStatement);
          changesApplied.push(`Added column: ${colDef.name} to providers table`);
        }
      }
    }

    // Check and add missing columns to campers table
    if (existingTables.has('campers')) {
      const [existingCamperColumns] = await connection.execute('SHOW COLUMNS FROM campers');
      const existingColumnNames = new Set((existingCamperColumns as DbColumn[]).map(col => col.Field));

      for (const colDef of camperColumnDefinitions) {
        if (!existingColumnNames.has(colDef.name)) {
          console.log(`Applying migration: Adding column '${colDef.name}' to campers table`);
          let alterStatement = `ALTER TABLE campers ADD COLUMN \`${colDef.name}\` ${colDef.type}`;
          if (colDef.constraints) {
            alterStatement += ` ${colDef.constraints}`;
          }
          console.log('Executing ALTER TABLE for campers:', alterStatement);
          await connection.execute(alterStatement);
          changesApplied.push(`Added column: ${colDef.name} to campers table`);
        }
      }
    }

    // Check and add missing columns to stations table
    if (existingTables.has('stations')) {
      const [existingStationColumns] = await connection.execute('SHOW COLUMNS FROM stations');
      const existingColumnNames = new Set((existingStationColumns as DbColumn[]).map(col => col.Field));

      for (const colDef of stationColumnDefinitions) {
        if (!existingColumnNames.has(colDef.name)) {
          console.log(`Applying migration: Adding column '${colDef.name}' to stations table`);
          let alterStatement = `ALTER TABLE stations ADD COLUMN \`${colDef.name}\` ${colDef.type}`;
          if (colDef.constraints) {
            alterStatement += ` ${colDef.constraints}`;
          }
          console.log('Executing ALTER TABLE for stations:', alterStatement);
          await connection.execute(alterStatement);
          changesApplied.push(`Added column: ${colDef.name} to stations table`);
        }
      }

      // Explicitly check and alter 'address' column to allow NULL
      const [addressColumn] = await connection.execute("SHOW COLUMNS FROM stations LIKE 'address'");
      const currentAddressColumn = (addressColumn as DbColumn[])[0];
      if (currentAddressColumn && currentAddressColumn.Null === 'NO') {
        console.log('Applying migration: Altering \'address\' column in stations table to allow NULL.');
        await connection.execute("ALTER TABLE stations MODIFY COLUMN address TEXT NULL");
        changesApplied.push('Altered column: address in stations table to allow NULL');
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
    if (connection) connection.end();
  }
}
