import { NextRequest, NextResponse } from 'next/server';
import { createDbConnection } from '@/lib/db/utils';
import { getAuthenticatedUser } from '@/lib/auth';
import { updateImageMetadata, deleteCamperImage } from '@/lib/db/images';

export async function PUT(req: NextRequest, { params }: { params: { camperId: string, imageId: string } }) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const camperId = parseInt(params.camperId);
  const imageId = parseInt(params.imageId);
  if (isNaN(camperId) || isNaN(imageId)) {
    return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 });
  }

  let connection;
  try {
    const data = await req.json();
    connection = await createDbConnection();

    const updatedImage = await updateImageMetadata(connection, imageId, { ...data, camper_id: camperId });

    if (updatedImage) {
      return NextResponse.json(updatedImage);
    } else {
      return NextResponse.json({ error: 'Image not found or no data to update.' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating image metadata:', error);
    return NextResponse.json({ error: 'Failed to update image metadata.', details: (error as Error).message }, { status: 500 });
  } finally {
    if (connection) connection.end();
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { camperId: string, imageId: string } }) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const camperId = parseInt(params.camperId);
  const imageId = parseInt(params.imageId);
  if (isNaN(camperId) || isNaN(imageId)) {
    return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 });
  }

  let connection;
  try {
    connection = await createDbConnection();
    await deleteCamperImage(connection, camperId, imageId);
    return NextResponse.json({ message: 'Image deleted successfully.' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Failed to delete image.', details: (error as Error).message }, { status: 500 });
  } finally {
    if (connection) connection.end();
  }
}
