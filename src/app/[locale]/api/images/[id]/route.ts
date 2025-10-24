import {NextRequest, NextResponse} from 'next/server';
import { createDbConnection } from '@/lib/db/utils';
import {
  deleteImage,
  updateCamperCategory,
  updateImageMetadata,
  updateProviderCategory,
  updateStationCategory
} from '@/lib/db/images';
import { getAuthenticatedUser } from '@/lib/auth';

export async function PUT(request: Request, context: { params: Promise<{ locale: string; id: string; }> }) {
  const { id } = await context.params;
  const authenticatedUser = await getAuthenticatedUser();

  if (!authenticatedUser) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }

  if (authenticatedUser.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }

  const imageId = parseInt(id, 10);
  if (isNaN(imageId)) {
    console.error('Image PUT API: Invalid image ID provided:', id);
    return NextResponse.json({ error: 'Invalid image ID.' }, { status: 400 });
  }

  let connection;
  try {
    const body = await request.json();
    const { image, camperId, stationId, providerId } = body;

    connection = await createDbConnection();
    const updatedImage = await updateImageMetadata(connection, imageId, image);
    let updatedCategory = false;
    if (camperId) {
      updatedCategory = await updateCamperCategory(connection, imageId, camperId, image.category);
    }
    if (stationId) {
      updatedCategory = await updateStationCategory(connection, imageId, stationId, image.category);
    }
    if (providerId) {
      updatedCategory = await updateProviderCategory(connection, imageId, stationId, image.category);
    }

    console.log(body, updatedCategory)

    if (!updatedImage && !updatedCategory) {
      return NextResponse.json({ error: 'Image not found or no changes applied.' }, { status: 404 });
    }
    if (updatedImage && updatedCategory) {
        updatedImage.category = image.category;
    }
    return NextResponse.json({ message: 'Image updated successfully.', image: updatedImage });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update image.', details: (error as Error).message }, { status: 500 });
  } finally {
    if (connection) connection.end();
  }
}


export async function DELETE(req: NextRequest, context: { params: Promise<{ locale: string; id: string; }> }) {
  const { id } = await context.params;
  const user = await getAuthenticatedUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsedImageId = parseInt(id);
  if (isNaN(parsedImageId)) {
    return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 });
  }

  let connection;
  try {
    connection = await createDbConnection();
    await deleteImage(connection, parsedImageId);
    return NextResponse.json({ message: 'Image deleted successfully.' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Failed to delete image.', details: (error as Error).message }, { status: 500 });
  } finally {
    if (connection) connection.end();
  }
}
