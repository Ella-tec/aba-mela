import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { MapTechnician, MapJob, TechStatus } from '@/data/mock';
import { KANSAS_CITY_CENTER } from '@/data/mock';
import { MELA_MARKET } from '@/data/market';

const statusColors: Record<TechStatus, string> = {
  available: '#16a36a',
  busy: '#e5a323',
  onTheWay: '#3478df',
  working: '#e8793e',
  offline: '#89949a',
};

type RouteLine = { id: string; positions: [number, number][]; color: string };

function createTechIcon(status: TechStatus) {
  const color = statusColors[status];
  return L.divIcon({
    className: 'mela-map-marker',
    html: '<div style="width:32px;height:32px;border-radius:50% 50% 50% 7px;transform:rotate(-45deg);background:' + color + ';border:3px solid #fff;box-shadow:0 4px 12px rgba(15,23,42,.28);display:flex;align-items:center;justify-content:center"><span style="width:8px;height:8px;border-radius:50%;background:#fff;transform:rotate(45deg)"></span></div>',
    iconSize: [32, 32],
    iconAnchor: [16, 30],
    popupAnchor: [0, -28],
  });
}

function mapSearchUrl(lat: number, lng: number) {
  return 'https://www.google.com/maps/search/?api=1&query=' + lat + ',' + lng;
}

function appleMapUrl(lat: number, lng: number, label: string) {
  return 'https://maps.apple.com/?ll=' + lat + ',' + lng + '&q=' + encodeURIComponent(label);
}

function FitBounds({ points }: { points: L.LatLngExpression[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      map.fitBounds(L.latLngBounds(points), { padding: [52, 52], maxZoom: 14 });
    }
  }, [map, points]);
  return null;
}

function FocusSelectedJob({ job }: { job?: MapJob }) {
  const map = useMap();
  useEffect(() => {
    if (job) map.flyTo([job.lat, job.lng], Math.max(map.getZoom(), 13), { duration: 0.7 });
  }, [job, map]);
  return null;
}

function RoadRoutes({ technicians, jobs }: { technicians: MapTechnician[]; jobs: MapJob[] }) {
  const [routes, setRoutes] = useState<RouteLine[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const assignments = jobs
      .map((job) => ({ job, tech: technicians.find((person) => person.id === job.techId) }))
      .filter((item): item is { job: MapJob; tech: MapTechnician } => Boolean(item.tech))
      .slice(0, 8);

    if (assignments.length === 0) {
      setRoutes([]);
      return () => controller.abort();
    }

    Promise.all(assignments.map(async ({ job, tech }) => {
      const endpoint = 'https://router.project-osrm.org/route/v1/driving/' +
        tech.lng + ',' + tech.lat + ';' + job.lng + ',' + job.lat +
        '?overview=full&geometries=geojson';
      try {
        const response = await fetch(endpoint, { signal: controller.signal });
        if (!response.ok) return null;
        const data = await response.json() as {
          routes?: Array<{ geometry?: { coordinates?: [number, number][] } }>;
        };
        const coordinates = data.routes?.[0]?.geometry?.coordinates;
        if (!coordinates?.length) return null;
        return {
          id: job.id,
          color: statusColors[tech.status],
          positions: coordinates.map((point): [number, number] => [point[1], point[0]]),
        };
      } catch {
        return null;
      }
    })).then((results) => {
      if (!controller.signal.aborted) setRoutes(results.filter((route): route is RouteLine => route !== null));
    });

    return () => controller.abort();
  }, [technicians, jobs]);

  return (
    <>
      {routes.map((route) => (
        <Polyline
          key={route.id}
          positions={route.positions}
          pathOptions={{ color: route.color, weight: 5, opacity: 0.82, lineCap: 'round', lineJoin: 'round' }}
        />
      ))}
    </>
  );
}

function MapControls({
  points,
  mapStyle,
  onToggleStyle,
  expanded,
  onToggleExpanded,
  onMessage,
}: {
  points: L.LatLngExpression[];
  mapStyle: 'street' | 'light';
  onToggleStyle: () => void;
  expanded: boolean;
  onToggleExpanded: () => void;
  onMessage: (message: string) => void;
}) {
  const map = useMap();

  const fitAll = () => {
    if (points.length > 0) map.fitBounds(L.latLngBounds(points), { padding: [52, 52], maxZoom: 14 });
  };

  const locateMe = () => {
    if (!navigator.geolocation) {
      onMessage('Location services are not available in this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        map.flyTo([position.coords.latitude, position.coords.longitude], 15, { duration: 0.8 });
        onMessage('Map centered on your current location.');
      },
      () => onMessage('Location permission was unavailable. You can enable it in your browser settings.'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  const controlClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-3 text-xs font-semibold text-slate-700 shadow-lg shadow-slate-900/10 backdrop-blur transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600';

  return (
    <div className="absolute right-3 top-3 z-[1000] flex max-w-[calc(100%-1.5rem)] flex-wrap justify-end gap-2">
      <button type="button" className={controlClass} onClick={onToggleStyle} aria-label="Change map style">
        {mapStyle === 'street' ? 'Light map' : 'Street map'}
      </button>
      <button type="button" className={controlClass} onClick={fitAll}>Fit all</button>
      <button type="button" className={controlClass} onClick={locateMe}>My location</button>
      <button type="button" className={controlClass} onClick={onToggleExpanded}>
        {expanded ? 'Compact map' : 'Expand map'}
      </button>
    </div>
  );
}

interface LiveMapProps {
  technicians?: MapTechnician[];
  jobs?: MapJob[];
  height?: string;
  showLegend?: boolean;
  center?: { lat: number; lng: number };
  zoom?: number;
  selectedJobId?: string | null;
  onJobSelect?: (job: MapJob) => void;
}

export function LiveMap({
  technicians = [],
  jobs = [],
  height = '440px',
  showLegend = true,
  center = KANSAS_CITY_CENTER,
  zoom = 11,
  selectedJobId,
  onJobSelect,
}: LiveMapProps) {
  const [mapStyle, setMapStyle] = useState<'street' | 'light'>('street');
  const [expanded, setExpanded] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');
  const points = useMemo<L.LatLngExpression[]>(() => [
    ...technicians.map((person) => [person.lat, person.lng] as L.LatLngExpression),
    ...jobs.map((job) => [job.lat, job.lng] as L.LatLngExpression),
  ], [technicians, jobs]);
  const selectedJob = jobs.find((job) => job.id === selectedJobId);
  const mapHeight = expanded ? '620px' : height;

  return (
    <section className="relative isolate overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100 shadow-[0_18px_55px_rgba(15,23,42,.12)]" aria-label="Interactive Mela service map">
      <div className="pointer-events-none absolute left-3 top-3 z-[1000] flex items-center gap-2 rounded-xl border border-white/80 bg-white/95 px-3 py-2 shadow-lg shadow-slate-900/10 backdrop-blur">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
        <span className="text-xs font-bold tracking-wide text-slate-800">MELA MAP</span>
        <span className="hidden text-xs text-slate-500 sm:inline">Kansas City metro</span>
      </div>
      <div style={{ height: mapHeight, width: '100%' }}>
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={zoom}
          style={{ height: '100%', width: '100%', background: '#e9eff0' }}
          scrollWheelZoom
          zoomControl
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={mapStyle === 'street'
              ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
              : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'}
            subdomains="abcd"
            maxZoom={20}
          />
          <FitBounds points={points} />
          <FocusSelectedJob job={selectedJob} />
          <RoadRoutes technicians={technicians} jobs={jobs} />

          {MELA_MARKET.serviceAreas.map((area) => (
            <CircleMarker
              key={area.city + area.state}
              center={[area.lat, area.lng]}
              radius={4}
              pathOptions={{ color: '#b68b3c', fillColor: '#f4c66a', fillOpacity: 0.48, weight: 1.5, opacity: 0.55 }}
            >
              <Popup>
                <div className="text-sm">
                  <strong>{area.city}, {area.state}</strong>
                  <div className="text-slate-500">Mela planned service market</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {technicians.map((person) => (
            <Marker key={person.id} position={[person.lat, person.lng]} icon={createTechIcon(person.status)}>
              <Popup>
                <div className="min-w-40 space-y-1 text-sm">
                  <div className="font-bold text-slate-900">{person.name}</div>
                  <div className="text-slate-600">{person.service}</div>
                  <div className="capitalize text-slate-600">{person.status.replace(/([A-Z])/g, ' $1')}</div>
                  <div className="font-semibold text-amber-600">★ {person.rating.toFixed(1)}</div>
                  <div className="flex gap-3 border-t border-slate-100 pt-2">
                    <a className="font-semibold text-emerald-700 underline" href={mapSearchUrl(person.lat, person.lng)} target="_blank" rel="noreferrer">Google Maps</a>
                    <a className="font-semibold text-emerald-700 underline" href={appleMapUrl(person.lat, person.lng, person.name)} target="_blank" rel="noreferrer">Apple Maps</a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {jobs.map((job) => {
            const assignedTech = technicians.find((person) => person.id === job.techId);
            const isSelected = job.id === selectedJobId;
            const googleDirections = assignedTech
              ? 'https://www.google.com/maps/dir/?api=1&origin=' + assignedTech.lat + ',' + assignedTech.lng + '&destination=' + job.lat + ',' + job.lng + '&travelmode=driving'
              : mapSearchUrl(job.lat, job.lng);
            const appleDirections = assignedTech
              ? 'https://maps.apple.com/?saddr=' + assignedTech.lat + ',' + assignedTech.lng + '&daddr=' + job.lat + ',' + job.lng + '&dirflg=d'
              : appleMapUrl(job.lat, job.lng, job.service);

            return (
              <CircleMarker
                key={job.id}
                center={[job.lat, job.lng]}
                radius={isSelected ? 12 : 9}
                eventHandlers={{ click: () => onJobSelect?.(job) }}
                pathOptions={{
                  color: job.isHot ? '#e44f48' : isSelected ? '#0f766e' : '#4778c7',
                  fillColor: job.isHot ? '#ff8a78' : '#78a8e8',
                  fillOpacity: 0.92,
                  weight: isSelected ? 4 : 2,
                }}
              >
                <Popup>
                  <div className="min-w-44 space-y-1 text-sm">
                    <div className="font-bold text-slate-900">{job.service}{job.isHot ? ' · HOT JOB' : ''}</div>
                    <div className="text-slate-700">{job.customer}</div>
                    <div className="text-slate-500">{job.address}</div>
                    <div className="capitalize text-slate-600">{job.status}</div>
                    <div className="flex gap-3 border-t border-slate-100 pt-2">
                      <a className="font-semibold text-emerald-700 underline" href={googleDirections} target="_blank" rel="noreferrer">Google directions</a>
                      <a className="font-semibold text-emerald-700 underline" href={appleDirections} target="_blank" rel="noreferrer">Apple Maps</a>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

          <MapControls
            points={points}
            mapStyle={mapStyle}
            onToggleStyle={() => setMapStyle((current) => current === 'street' ? 'light' : 'street')}
            expanded={expanded}
            onToggleExpanded={() => setExpanded((current) => !current)}
            onMessage={setLocationMessage}
          />
        </MapContainer>
      </div>

      <div className="absolute bottom-3 right-3 z-[1000] max-w-[min(19rem,calc(100%-1.5rem))] rounded-xl border border-white/80 bg-white/95 px-3 py-2 text-[10px] leading-relaxed text-slate-600 shadow-lg shadow-slate-900/10 backdrop-blur">
        Sample provider and job pins · not live GPS tracking. Road previews appear for assigned demo jobs.
      </div>

      {showLegend && (
        <div className="absolute bottom-3 left-3 z-[1000] max-w-[calc(100%-12rem)] rounded-xl border border-white/80 bg-white/95 px-3 py-2.5 shadow-lg shadow-slate-900/10 backdrop-blur">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[.14em] text-slate-500">Map key</div>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] font-medium text-slate-700">
            {(Object.keys(statusColors) as TechStatus[]).map((status) => (
              <span key={status} className="inline-flex items-center gap-1.5 capitalize">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: statusColors[status] }} />
                {status.replace(/([A-Z])/g, ' $1')}
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border-2 border-blue-500 bg-blue-300" /> Job</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border-2 border-red-500 bg-red-300" /> Hot job</span>
          </div>
        </div>
      )}

      {locationMessage && (
        <div className="absolute bottom-16 left-3 z-[1001] max-w-[calc(100%-1.5rem)] rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow-lg" role="status">
          {locationMessage}
          <button type="button" className="ml-3 font-bold text-emerald-300" onClick={() => setLocationMessage('')} aria-label="Dismiss message">×</button>
        </div>
      )}
    </section>
  );
}
