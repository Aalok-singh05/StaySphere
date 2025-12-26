document.addEventListener("DOMContentLoaded", () => {
  mapboxgl.accessToken = mapToken;

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: coordinates,
    zoom: 9
  });

  new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h4>${title}</h4>
         <p>Exact location provided after booking</p>`
      )
    )
    .addTo(map);
});