import { Connection } from 'mysql2/promise';

export async function getInternalIdByExternalIdAndPartner(
  connection: Connection,
  partnerName: string,
  entityType: 'camper' | 'provider' | 'station',
  externalId: string
): Promise<number | null> {
  const [rows] = await connection.execute(
    'SELECT internal_id FROM partner_mappings WHERE partner_name = ? AND entity_type = ? AND external_id = ?',
    [partnerName, entityType, externalId]
  );
  const result = rows as { internal_id: number }[];
  return result.length > 0 ? result[0].internal_id : null;
}

export async function createPartnerMapping(
  connection: Connection,
  partnerName: string,
  entityType: 'camper' | 'provider' | 'station',
  internalId: number,
  externalId: string
): Promise<void> {
  await connection.execute(
    'INSERT INTO partner_mappings (partner_name, entity_type, internal_id, external_id) VALUES (?, ?, ?, ?)',
    [partnerName, entityType, internalId, externalId]
  );
}
