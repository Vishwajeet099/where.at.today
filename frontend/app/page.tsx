async function getEvents() {
  const res = await fetch("http://localhost:5050/events", {
    cache: "no-store",
  });
  return res.json();
}

export default async function Home() {
  const events = await getEvents();

  return (
    <div style={{ padding: "20px" }}>
      <h1>🎉 Upcoming Events</h1>

      {/* 🔥 GOOGLE EVENT STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            events.map((event: any) => ({
              "@context": "https://schema.org",
              "@type": "Event",

              name: event.title,
              description: event.description,
              image: event.image,

              startDate: event.start_at,
              endDate: event.end_at,

              eventStatus: "https://schema.org/EventScheduled",
              eventAttendanceMode:
                "https://schema.org/OfflineEventAttendanceMode",

              location: {
                "@type": "Place",
                name: event.venue,
                address: {
                  "@type": "PostalAddress",
                  streetAddress: event.address,
                  addressLocality: event.city,
                  addressCountry: event.country || "IN",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: event.latitude,
                  longitude: event.longitude,
                },
              },

              offers: {
                "@type": "Offer",
                price: event.price || "0",
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
                url: event.ticket_url,
                seller: {
                  "@type": "Organization",
                  name: event.seller,
                },
              },
            }))
          ),
        }}
      />

      {/* 🎨 UI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {events.map((event: any, index: number) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "15px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            {/* Image */}
            {event.image && (
              <img
                src={event.image}
                alt={event.title}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            )}

            {/* Title */}
            <h2>{event.title}</h2>

            {/* Description */}
            <p>{event.description}</p>

            {/* Date */}
            <p>
              🕒{" "}
              {new Date(event.start_at).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>

            {/* Venue */}
            <p>
              📍 {event.venue}, {event.city}
            </p>

            {/* Address */}
            <p style={{ fontSize: "12px", color: "#555" }}>
              {event.address}
            </p>

            {/* Price */}
            {event.price && (
              <p>
                💰 ₹{event.price}
              </p>
            )}

            {/* Seller */}
            {event.seller && (
              <p>
                🎟️ {event.seller}
              </p>
            )}

            {/* Ticket Button */}
            {event.ticket_url && (
              <a
                href={event.ticket_url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "10px",
                  padding: "10px 15px",
                  background: "#007bff",
                  color: "#fff",
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                Book Tickets
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}