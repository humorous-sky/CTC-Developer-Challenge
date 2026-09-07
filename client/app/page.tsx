import { getRestaurants, getVisits } from '@/lib/apiClient';

function formatSpent(amount: number | null): string {
  if (amount === null) return '—';
  return `$${amount.toFixed(2)}`;
}

export default async function HomePage() {
  const [restaurants, visits] = await Promise.all([
    getRestaurants(),
    getVisits(),
  ]);

  const restaurantNameById = new Map(
    restaurants.map((restaurant) => [restaurant.id, restaurant.name])
  );

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <section>
        <h2 className="mb-4 text-lg font-medium">Restaurants 🍴</h2>
        <ul className="space-y-3">
          {restaurants.map((restaurant) => (
            <li
              key={restaurant.id}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-medium">{restaurant.name}</span>
                <span className="text-sm text-gray-500">
                  {restaurant.rating}★
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-600">
                {restaurant.cuisine} · {restaurant.address}
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address ?? '')}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500"
              >
                View on Google Maps
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-medium">Visits ⭐</h2>
        <ul className="space-y-3">
          {visits.map((visit) => (
            <li
              key={visit.id}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-medium">
                  {restaurantNameById.get(visit.restaurantId) ??
                    `Restaurant #${visit.restaurantId}`}
                </span>
                <span className="text-sm text-gray-500">
                  {formatSpent(visit.amountSpent)}
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-600">{visit.date}</div>
              {visit.notes ? (
                <div className="mt-1 text-sm text-gray-600">{visit.notes}</div>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
