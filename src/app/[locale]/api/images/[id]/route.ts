import { NextResponse } from 'next/server';
import { createDbConnection } from '@/lib/db/utils';
import { updateImageMetadata } from '@/lib/db/images';
import { getAuthenticatedUser } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  console.log('Image PUT API: Request received for ID:', params.id);
  const authenticatedUser = await getAuthenticatedUser();

  if (!authenticatedUser) {
    console.warn('Image PUT API: Unauthorized - No authenticated user.');
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }

  if (authenticatedUser.role !== 'admin') {
    console.warn('Image PUT API: Unauthorized - User is not an admin. User role:', authenticatedUser.role);
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }

  const imageId = parseInt(params.id, 10);
  if (isNaN(imageId)) {
    console.error('Image PUT API: Invalid image ID provided:', params.id);
    return NextResponse.json({ error: 'Invalid image ID.' }, { status: 400 });
  }

  let connection;
  try {
    const body = await request.json();
    const { active } = body;
    console.log('Image PUT API: Request body parsed. Active status:', active);

    if (typeof active !== 'boolean') {
      console.error('Image PUT API: Invalid \'active\' status provided in body:', active);
      return NextResponse.json({ error: 'Invalid \'active\' status provided.' }, { status: 400 });
    }

    connection = await createDbConnection();
    const updatedImage = await updateImageMetadata(connection, imageId, { active });

    if (!updatedImage) {
      console.warn('Image PUT API: Image not found or no changes applied for ID:', imageId);
      return NextResponse.json({ error: 'Image not found or no changes applied.' }, { status: 404 });
    }

    console.log('Image PUT API: Image updated successfully for ID:', imageId);
    return NextResponse.json({ message: 'Image updated successfully.', image: updatedImage });
  } catch (error) {
    console.error('Image PUT API: Error updating image for ID:', imageId, error);
    return NextResponse.json({ error: 'Failed to update image.', details: (error as Error).message }, { status: 500 });
  } finally {
    if (connection) connection.end();
  }
}
