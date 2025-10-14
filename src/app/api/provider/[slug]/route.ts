import { NextRequest, NextResponse } from 'next/server';
import { createDbConnection } from '@/lib/db/utils';
import { getProviderByExtId, updateProvider } from '@/lib/db/providers';
import { Provider } from '@/types/provider';

export async function PUT(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const params = await context.params;
  const { slug } = params;
  const connection = await createDbConnection();

  try {
    const existingProvider = await getProviderByExtId(connection, slug);
    if (!existingProvider) {
      return NextResponse.json({ message: 'Provider not found' }, { status: 404 });
    }

    const body = await req.json();
    const updatedFields: Partial<Provider> = {};

    // Only allow specific fields to be updated
    const allowedFields = [
      'company_name',
      'address',
      'email',
      'page_url',
      'description',
      'website',
      'tax_id',
      'min_driver_age',
      'deposit_amount',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updatedFields[field as keyof Provider] = body[field];
      }
    }

    if (Object.keys(updatedFields).length === 0) {
      return NextResponse.json({ message: 'No valid fields provided for update' }, { status: 400 });
    }

    await updateProvider(connection, { id: existingProvider.id, ...updatedFields });

    return NextResponse.json({ message: 'Provider updated successfully' });
  } catch (error) {
    console.error('Error updating provider:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    await connection.end();
  }
}
