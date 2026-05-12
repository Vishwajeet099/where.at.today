"use client";

export default function ListPanel({
  title,
  items,
  renderItem,
}: {
  title: string;
  items: any[];
  renderItem: (item: any) => React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xl mb-4">{title}</h2>

      <div className="space-y-2 max-h-[70vh] overflow-y-auto">
        {items.length === 0 && (
          <p className="text-gray-500">No data found</p>
        )}

        {items.map((item) => (
          <div key={item.id} className="p-3 border rounded">
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}