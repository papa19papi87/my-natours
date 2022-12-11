/* eslint-disabled */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZ2F5aXNlbW9yZSIsImEiOiJjbDBjYmFoeDExMng0M2NxdTgzcmkyZHZ5In0.KNb8cFehgIHNH-4YCz9S5Q';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/gayisemore/cl0gpt18u000x15ql363j6mmh1',
    //   // center: [-118.113491, 34.111745],
    //   // zoom: 10,
    //   // interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // add marker
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);

    map.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100,
      },
    });
  });
};
