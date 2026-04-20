export function flyToTarget(
    map: L.Map | null,
    lat: number,
    lon: number,
    boost: number | null
  ) {
    if (!map) return;
  
    const currentZoom = map.getZoom();
    const maxZoom = 10;
  
    if (!boost) {
      boost = 0.7;
    }
  
    const targetZoom =
      currentZoom < maxZoom ? Math.min(currentZoom + boost, 16) : currentZoom;
  
    const duration = 0.5 + currentZoom / 5;
  
    map.flyTo([lat, lon], targetZoom, {
      animate: true,
      duration,
      easeLinearity: 0.25,
    });
  }