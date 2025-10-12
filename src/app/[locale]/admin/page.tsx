export async function generateMetadata() {
  return { title: 'Camper Intelligence - Admin Dashboard' };
}

export default function AdminDashboardPage() {
  return (
    <div>
      <h2 className="text-foreground">Welcome to the Admin Dashboard</h2>
      <p className="text-foreground">Use the navigation above to manage providers, campers, and stations.</p>
    </div>
  );
}
