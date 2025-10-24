import mysql from 'mysql2/promise';
import { InsertResult } from '@/lib/db/utils';
import {Image, CategorizedImage} from '@/types/image';
import { FieldPacket } from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';

export async function upsertImage(connection: mysql.Connection, imageUrl: string, userId: number, origin: string, caption: string | null = null, alt_text: string | null = null, copyright_holder_name: string | null = null, width: number | null = null, height: number | null = null): Promise<number> {
  console.log(`upsertImage called with: imageUrl=${imageUrl}, userId=${userId}, origin=${origin}`);
  // Check if image already exists
  const [existingRows] = await connection.execute('SELECT id FROM images WHERE url = ?', [imageUrl]);
  const existingImage = existingRows as Image[];

  if (existingImage.length > 0) {
    console.log(`Image with URL ${imageUrl} already exists. Updating metadata.`);
    // Update existing image with new metadata if provided
    const imageId = existingImage[0].id;
    const updateFields: string[] = [];
    const updateValues: (string | number | null)[] = [];

    // Always update user_id and origin if provided, as they might change during re-import
    updateFields.push('user_id = ?'); updateValues.push(userId);
    updateFields.push('origin = ?'); updateValues.push(origin);

    if (caption !== null) { updateFields.push('caption = ?'); updateValues.push(caption); }
    if (alt_text !== null) { updateFields.push('alt_text = ?'); updateValues.push(alt_text); }
    if (copyright_holder_name !== null) { updateFields.push('copyright_holder_name = ?'); updateValues.push(copyright_holder_name); }
    if (width !== null) { updateFields.push('width = ?'); updateValues.push(width); }
    if (height !== null) { updateFields.push('height = ?'); updateValues.push(height); }

    if (updateFields.length > 0) {
      console.log(`Updating existing image ${imageId} with userId: ${userId}, origin: ${origin}, and other metadata.`);
      await connection.execute(`UPDATE images SET ${updateFields.join(', ')} WHERE id = ?`, [...updateValues, imageId]);
    }
    return imageId;
  } else {
    // Insert new image with metadata
    const [result] = await connection.execute(
      'INSERT INTO images (url, user_id, origin, caption, alt_text, copyright_holder_name, width, height) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [imageUrl, userId, origin, caption, alt_text, copyright_holder_name, width, height]
    ) as [InsertResult, FieldPacket[]];
    return result.insertId;
  }
}

export async function linkCamperImage(connection: mysql.Connection, camperId: number, imageId: number, category: string): Promise<void> {
  // Check if the link already exists
  const [existingLinkRows] = (await connection.execute(
    'SELECT camper_id FROM camper_images WHERE camper_id = ? AND image_id = ? AND category = ?',
    [camperId, imageId, category]
  ));

  if ((existingLinkRows as mysql.RowDataPacket[]).length === 0) {
    // Link image to camper if not already linked
    await connection.execute(
      'INSERT INTO camper_images (camper_id, image_id, category) VALUES (?, ?, ?)',
      [camperId, imageId, category]
    );
  }
}

export async function linkProviderImage(connection: mysql.Connection, providerId: number, imageId: number, category: string): Promise<void> {
  // Check if the link already exists
  const [existingLinkRows] = (await connection.execute(
    'SELECT provider_id FROM provider_images WHERE provider_id = ? AND image_id = ? AND category = ?',
    [providerId, imageId, category]
  ));
  if ((existingLinkRows as mysql.RowDataPacket[]).length === 0) {
    // Link image to provider if not already linked
    await connection.execute(
      'INSERT INTO provider_images (provider_id, image_id, category) VALUES (?, ?, ?)',
      [providerId, imageId, category]
    );
  }
}

export async function linkStationImage(connection: mysql.Connection, stationId: number, imageId: number, category: string): Promise<void> {
  // Check if the link already exists
  const selectSql = 'SELECT station_id FROM station_images WHERE station_id = ? AND image_id = ? AND category = ?';
  const [existingLinkRows] = (await connection.execute(
    selectSql,
    [stationId, imageId, category]
  ));

  if ((existingLinkRows as mysql.RowDataPacket[]).length === 0) {
    // Link image to station if not already linked
    const insertSql = 'INSERT INTO station_images (station_id, image_id, category) VALUES (?, ?, ?)';
    await connection.execute(
      insertSql,
      [stationId, imageId, category]
    );
  }
}

export async function getImagesForCamper(connection: mysql.Connection, camperId: number): Promise<CategorizedImage[]> {
  const [rows] = await connection.execute(
    'SELECT i.id, i.url, ci.category FROM images i JOIN camper_images ci ON i.id = ci.image_id WHERE ci.camper_id = ?',
    [camperId]
  );
  return rows as CategorizedImage [];
}

export async function getImagesForCamperWithMetadata(connection: mysql.Connection, camperId: number): Promise<CategorizedImage[]> {
  if (camperId === undefined || camperId === null) {
    throw new Error("camperId must not be undefined or null when fetching images for a camper.");
  }
  const [rows] = await connection.execute(
    `SELECT i.id, i.url, i.caption, i.alt_text, i.copyright_holder_name, i.copyright_holder_link, i.width, i.height, ci.category, i.active, i.created_at, i.updated_at, i.origin
     FROM images i
     JOIN camper_images ci ON i.id = ci.image_id
     WHERE ci.camper_id = ?`,
    [camperId]
  );
  return rows as CategorizedImage[];
}

export async function getProviderLogo(connection: mysql.Connection, providerId: number): Promise<CategorizedImage|null> {
  const [rows] = await connection.execute(
      `SELECT i.id AS id, i.url, i.caption, i.alt_text, i.copyright_holder_name, i.width, i.height, pi.category
     FROM images i
     JOIN provider_images pi ON i.id = pi.image_id
     WHERE pi.provider_id = ?
    ORDER BY FIELD(pi.category, 'logo', 'teaser')
     `,
      [providerId]
  );
  return (rows as Image[])[0] || null;
}

export async function updateCamperCategory(connection: mysql.Connection, imageId: number, camperId:number, category: string, ): Promise<boolean> {
  const update = await connection.execute(
      `UPDATE camper_images SET category=? WHERE camper_images.image_id = ? AND camper_images.camper_id = ?`,
      [category, imageId, camperId]
  );
  if ((update[0] as mysql.ResultSetHeader).affectedRows > 0) {
    return true;
  }
  return false;
}

export async function updateStationCategory(connection: mysql.Connection, imageId: number, stationId:number, category: string, ): Promise<boolean> {
  const update = await connection.execute(
      `UPDATE station_images SET category=? WHERE station_images.image_id = ? AND station_images.station_id = ?`,
      [category, imageId, stationId]
  );

  if ((update[0] as mysql.ResultSetHeader).affectedRows > 0) {
    return true;
  }
  return false;
}

export async function updateProviderCategory(connection: mysql.Connection, imageId: number, providerId:number, category: string, ): Promise<boolean> {
  const update = await connection.execute(
      `UPDATE provider_images SET category=? WHERE provider_images.image_id = ? AND provider_images.provider_id = ?`,
      [category, imageId, providerId]
  );

  if ((update[0] as mysql.ResultSetHeader).affectedRows > 0) {
    return true;
  }
  return false;
}

export async function updateImageMetadata(connection: mysql.Connection, imageId: number, data: Partial<CategorizedImage>): Promise<CategorizedImage | null> {
  const updateFields: string[] = [];
  const updateValues: (string | number | boolean | null)[] = [];

  if (data.caption !== undefined) { updateFields.push('caption = ?'); updateValues.push(data.caption); }
  if (data.alt_text !== undefined) { updateFields.push('alt_text = ?'); updateValues.push(data.alt_text); }
  if (data.copyright_holder_name !== undefined) { updateFields.push('copyright_holder_name = ?'); updateValues.push(data.copyright_holder_name); }
  if (data.copyright_holder_link !== undefined) { updateFields.push('copyright_holder_link = ?'); updateValues.push(data.copyright_holder_link); }
  if (data.width !== undefined) { updateFields.push('width = ?'); updateValues.push(data.width); }
  if (data.height !== undefined) { updateFields.push('height = ?'); updateValues.push(data.height); }
  if (data.active !== undefined) { updateFields.push('active = ?'); updateValues.push(data.active); }

  if (updateFields.length === 0) {
    return null; // No fields to update
  }

  await connection.execute(
    `UPDATE images SET ${updateFields.join(', ')} WHERE id = ?`,
    [...updateValues, imageId]
  );

  const [rows] = await connection.execute('SELECT * FROM images WHERE id = ?', [imageId]);
  const updatedImage = rows as Image[];
  return updatedImage.length > 0 ? updatedImage[0] : null;
}


export async function deleteImage(connection: mysql.Connection, imageId: number): Promise<void> {
  // Get image URL to check if it's a local file
  const [imageRows] = await connection.execute('SELECT url FROM images WHERE id = ?', [imageId]);
  const image = (imageRows as { url: string }[])[0];

  if (image && image.url.startsWith('/uploads/')) {
    // It's a local file, delete from filesystem
    const filePath = path.join(process.cwd(), 'public', image.url);
    try {
      await fs.unlink(filePath);
      console.log(`Deleted local image file: ${filePath}`);
    } catch (fileError) {
      console.error(`Failed to delete local image file ${filePath}:`, fileError);
    }
  }

  // Delete link from camper_images table
  await connection.execute('DELETE FROM camper_images WHERE image_id = ?', [imageId]);

  // Delete image from images table (only if not referenced by other campers/providers/stations)
  const [camperRefs] = await connection.execute('SELECT COUNT(*) as count FROM camper_images WHERE image_id = ?', [imageId]);
  const [providerRefs] = await connection.execute('SELECT COUNT(*) as count FROM provider_images WHERE image_id = ?', [imageId]);
  const [stationRefs] = await connection.execute('SELECT COUNT(*) as count FROM station_images WHERE image_id = ?', [imageId]);

  const totalRefs = (camperRefs as { count: number }[])[0].count +
      (providerRefs as { count: number }[])[0].count +
      (stationRefs as { count: number }[])[0].count;

  if (totalRefs === 0) {
    await connection.execute('DELETE FROM images WHERE id = ?', [imageId]);
  }
}

export async function deleteCamperImage(connection: mysql.Connection, camperId: number, imageId: number): Promise<void> {
  // Get image URL to check if it's a local file
  const [imageRows] = await connection.execute('SELECT url FROM images WHERE id = ?', [imageId]);
  const image = (imageRows as { url: string }[])[0];

  if (image && image.url.startsWith('/uploads/')) {
    // It's a local file, delete from filesystem
    const filePath = path.join(process.cwd(), 'public', image.url);
    try {
      await fs.unlink(filePath);
      console.log(`Deleted local image file: ${filePath}`);
    } catch (fileError) {
      console.error(`Failed to delete local image file ${filePath}:`, fileError);
    }
  }

  // Delete link from camper_images table
  await connection.execute('DELETE FROM camper_images WHERE camper_id = ? AND image_id = ?', [camperId, imageId]);

  // Delete image from images table (only if not referenced by other campers/providers/stations)
  const [camperRefs] = await connection.execute('SELECT COUNT(*) as count FROM camper_images WHERE image_id = ?', [imageId]);
  const [providerRefs] = await connection.execute('SELECT COUNT(*) as count FROM provider_images WHERE image_id = ?', [imageId]);
  const [stationRefs] = await connection.execute('SELECT COUNT(*) as count FROM station_images WHERE image_id = ?', [imageId]);

  const totalRefs = (camperRefs as { count: number }[])[0].count +
                    (providerRefs as { count: number }[])[0].count +
                    (stationRefs as { count: number }[])[0].count;

  if (totalRefs === 0) {
    await connection.execute('DELETE FROM images WHERE id = ?', [imageId]);
  }
}

export async function deleteStationImage(connection: mysql.Connection, stationId: number, imageId: number): Promise<void> {
  // Get image URL to check if it's a local file
  const [imageRows] = await connection.execute('SELECT url FROM images WHERE id = ?', [imageId]);
  const image = (imageRows as { url: string }[])[0];

  if (image && image.url.startsWith('/uploads/')) {
    // It's a local file, delete from filesystem
    const filePath = path.join(process.cwd(), 'public', image.url);
    try {
      await fs.unlink(filePath);
      console.log(`Deleted local image file: ${filePath}`);
    } catch (fileError) {
      console.error(`Failed to delete local image file ${filePath}:`, fileError);
    }
  }

  // Delete link from station_images table
  await connection.execute('DELETE FROM station_images WHERE station_id = ? AND image_id = ?', [stationId, imageId]);

  // Delete image from images table (only if not referenced by other campers/providers/stations)
  const [camperRefs] = await connection.execute('SELECT COUNT(*) as count FROM camper_images WHERE image_id = ?', [imageId]);
  const [providerRefs] = await connection.execute('SELECT COUNT(*) as count FROM provider_images WHERE image_id = ?', [imageId]);
  const [stationRefs] = await connection.execute('SELECT COUNT(*) as count FROM station_images WHERE image_id = ?', [imageId]);

  const totalRefs = (camperRefs as { count: number }[])[0].count +
      (providerRefs as { count: number }[])[0].count +
      (stationRefs as { count: number }[])[0].count;

  if (totalRefs === 0) {
    await connection.execute('DELETE FROM images WHERE id = ?', [imageId]);
  }
}

export async function getCamperTileImage(connection: mysql.Connection, camperId: number): Promise<CategorizedImage | null> {
  const [rows] = await connection.execute(
      `SELECT i.url,
              ci.category,
              i.id,
              i.caption,
              i.alt_text,
              i.copyright_holder_name,
              i.width,
              i.height
       FROM images i
              JOIN camper_images ci ON i.id = ci.image_id
       WHERE ci.camper_id = ?
       ORDER BY CASE ci.category
                  WHEN 'mood' THEN 1
                  WHEN 'exterior' THEN 2
                  ELSE 3 -- All other categories come last
                  END ASC,
                i.id ASC -- Optional: Add a secondary sort for consistent results if multiple images have the same category
       LIMIT 1;`,
      [camperId]
  );
  const images = rows as Image[];
  return images.length > 0 ? images[0] : null;
}

export async function getStationTileImage(connection: mysql.Connection, stationId: number): Promise<CategorizedImage | null> {
  const images = await getStationImages(connection, stationId);
  return images.length > 0 ? images[0] : null;
}

export async function getStationImages(connection: mysql.Connection, stationId: number): Promise<CategorizedImage[]> {
  const [rows] = await connection.execute(
      `SELECT i.id, i.url, i.caption, i.alt_text, i.copyright_holder_name, i.copyright_holder_link, i.width, i.height, si.category, i.active, i.created_at, i.updated_at, i.origin
     FROM images i
     JOIN station_images si ON i.id = si.image_id
     WHERE si.station_id = ?
     ORDER BY FIELD(si.category, 'main')
     LIMIT 1`,
      [stationId]
  );
  const images = rows as Image[];
  return images.length > 0 ? images : [];
}