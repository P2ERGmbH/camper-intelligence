'use server';

import { revalidatePath } from 'next/cache';
import { createDbConnection } from '@/lib/db/utils';
import { updateStationStatus } from '@/lib/db/stations';
import { updateCamperStation } from '@/lib/db/campers';

export async function toggleStationStatusAction(stationId: number, newStatus: boolean, slug: string, id: string) {
  let toggleConnection;
  try {
    toggleConnection = await createDbConnection();
    await updateStationStatus(toggleConnection, stationId, newStatus);
    revalidatePath(`/provider/${slug}/stations/${id}`);
  } catch (error) {
    console.error('Failed to update station status:', error);
  } finally {
    if (toggleConnection) toggleConnection.end();
  }
}

export async function handleCamperMappingAction(camperId: number, newStationId: number | null, slug: string, currentStationId: string) {
  let mapConnection;
  try {
    mapConnection = await createDbConnection();
    await updateCamperStation(mapConnection, camperId, newStationId);
    revalidatePath(`/provider/${slug}/stations/${currentStationId}`);
  } catch (error) {
    console.error('Failed to update camper station mapping:', error);
  } finally {
    if (mapConnection) mapConnection.end();
  }
}
