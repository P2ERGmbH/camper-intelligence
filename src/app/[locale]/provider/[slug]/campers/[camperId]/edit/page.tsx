import { getTranslations } from 'next-intl/server';
import CamperEditForm from '@/components/campers/CamperEditForm';
import { Camper } from '@/types/camper';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import { createDbConnection } from '@/lib/db/utils';
import {Metadata} from "next";

interface EditCamperPageProps {
  params: {
    locale: string; 
    slug: string; 
    camperId: string; 
  };
}

export async function generateMetadata({ params }: EditCamperPageProps): Promise<Metadata> {
  const t = await getTranslations('dashboard');
  const { camperId } = params;
  const title = t('edit_camper') + ` - ${camperId}`;
  const description = t('edit_camper') + ` ${camperId}`;
  return { title, description };
}

export default async function EditCamperPage({ params }: EditCamperPageProps) {
  const t = await getTranslations('errors');
  const { slug, camperId } = params;
  const camperIdNum = parseInt(camperId);
  let connection: mysql.Connection | undefined;

  if (isNaN(camperIdNum)) {
    redirect(`/${params.locale}/provider/login`);
  }

  let camperData: Camper | null = null;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      redirect(`/${params.locale}/provider/login`);
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your-default-secret') as {
      id: number;
      email: string;
      role: 'client' | 'provider' | 'admin';
    };

    const userId = decodedToken.id;
    const userRole = decodedToken.role;

    connection = await createDbConnection();

    if (userRole === 'admin') {
      const [rows] = await connection.execute<mysql.RowDataPacket[]>(`SELECT * FROM campers WHERE id = ?`, [camperIdNum]);
      if (rows.length > 0) {
        camperData = rows[0] as Camper;
      }
    } else if (userRole === 'provider') {
      const [providerRows] = await connection.execute<mysql.RowDataPacket[]>(`
        SELECT p.id, p.company_name
        FROM providers p
        JOIN provider_users pu ON p.id = pu.provider_id
        WHERE pu.user_id = ? AND CONCAT(LOWER(REPLACE(p.company_name, ' ', '-')), '-', p.id) = ?
      `, [userId, slug]);

      if (providerRows.length === 0) {
        redirect(`/${params.locale}/provider/login`);
      }

      const providerId = (providerRows[0] as { id: number }).id;

      const [camperRows] = await connection.execute<mysql.RowDataPacket[]>(`SELECT * FROM campers WHERE id = ? AND provider_id = ?`, [camperIdNum, providerId]);
      if (camperRows.length > 0) {
        camperData = camperRows[0] as Camper;
      }
    } else {
      redirect(`/${params.locale}/provider/login`);
    }

    if (!camperData) {
      redirect(`/${params.locale}/provider/login`);
    }

  } catch (error: unknown) {
    console.error('Error fetching camper data:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      redirect(`/${params.locale}/provider/login`);
    }
    redirect(`/${params.locale}/provider/login`);
  } finally {
    if (connection) {
      await connection.end();
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <div className="flex-grow container mx-auto px-6 py-12">
        <div className="bg-card shadow-lg rounded-lg p-8 border border-border">
          {camperData ? (
            <CamperEditForm initialData={camperData} camperId={camperIdNum} />
          ) : (
            <div className="text-center mt-8">{t('camper_not_found')}</div>
          )}
        </div>
      </div>
    </div>
  );
}
