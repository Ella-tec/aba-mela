import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import type { MapTechnician, MapJob, TechStatus } from '@/data/mock';
import { KANSAS_CITY_CENTER } from '@/data/mock';
import { MELA_MARKET } from '@/data/market';

const statusColors: Record<TechStatus, string> = {
  available: '#22c55e',
  busy: '#eab308',
  onTheWay: '#3b82f6',
  working: '#f97316',
  offline: '#6b7280',
};

function createTechIcon(status: TechStatus) {
  const color = statusColors[status];
  return L.divIcon({
    className: '',
    html: '<div style="width:18px;height:18px;border-radius:50%;background:' + color + ';border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function mapLinks(lat: number, lng: number, label: string, origin?: { lat: number; lng: number }) {
  const destination = lat + ',' + lng;
  const google = origin
    ? 'https://www.google.com/maps/dir/?api=1&origin=' + origin.lat + ',' + origin.lng + '&destination=' + destination + '&travelmode=driving'
    : 'https://www.google.com/maps/search/?api=1&query=' + destination;
  const waze = 'https://waze.com/ul?ll=' + encodeURIComponent(destination) + '&navigate=yes';
  const apple = origin
    ? 'https://maps.apple.com/?saddr=' + origin.lat + ',' + origin.lng + '&daddr=' + destination + '&dirflg=d'
    : 'https://maps.apple.com/?ll=' + destination + '&q=' + encodeURIComponent(label);
  return { google, waze, apple };
}

function MapLinks({ lat, lng, label, origin }: {
  lat: number;
  lng: number;
  label: string;
  origin?: { lat: number; lng: number };
}) {
  const links = mapLinks(lat, lng, label, origin);
  const linkClass = 'inline-flex items-center rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-primary-700 hover:bg-primary-50';
  return (
    <div className="mt-2 flex flex-wrap gap-1.5 border-t border-gray-100 pt-2">
      <a className={linkClass} href={links.google} target="_blank" rel="noopener noreferrer">Google Maps</a>
      <a className={linkClass} href={links.waze} target="_blank" rel="noopener noreferrer">Waze</a>
      <a className={linkClass} href={links.apple} target="_blank" rel="noopener noreferrer">Apple Maps</a>
    </div>
  );
}

function FitBounds({ techs, jobs }: { techs: MapTechnician[]; jobs: MapJob[] }) {
  const map = useMap();
  useEffect(() => {
    const points: L.LatLngExpression[] = [
      ...techs.map((t) => [t.lat, t.lng] as L.LatLngExpression),
      ...jobs.map((j) => [j.lat, j.lng] as L.LatLngExpression),
    ];
    if (points.length > 0) {
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 14 });
    }
  }, [map, techs, jobs]);
  return null;
}

interface LiveMapProps {
  technicians?: MapTechnician[];
  jobs?: MapJob[];
  height?: string;
  showLegend?: boolean;
  center?: { lat: number; lng: number };
  zoom?: number;
}

export function LiveMap({
  technicians = [],
  jobs = [],
  height = '400px',
  showLegend = true,
  center = KANSAS_CITY_CENTER,
  zoom = 10,
}: LiveMapProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200">
      <div className="absolute top-3 end-3 z-[1000] rounded-lg border border-gray-200 bg-white/95 px-3 py-2 text-xs font-medium text-gray-600 shadow-sm">
        Illustrative demo map · Not live provider locations
      </div>
      <div style={{ height }}>
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds techs={technicians} jobs={jobs} />
          {MELA_MARKET.serviceAreas.map((area) => (
            <CircleMarker
              key={area.city + '-' + area.state}
              center={[area.lat, area.lng]}
              radius={7}
              pathOptions={{ color: '#173b35', fillColor: '#f4c66a', fillOpacity: 0.9, weight: 2 }}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{area.city}, {area.state}</div>
                  <div className="text-gray-600">Planned market area · coverage not yet enabled</div>
                  <MapLinks lat={area.lat} lng={area.lng} label={area.city + ', ' + area.state} />
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {technicians.map((tech) => (
            <Marker key={tech.id} position={[tech.lat, tech.lng]} icon={createTechIcon(tech.status)}>
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{tech.name}</div>
                  <div className="text-gray-600">{tech.service}</div>
                  <div className="mt-1 capitalize">{tech.status.replace(/([A-Z])/g, ' $1')}</div>
                  <div className="text-amber-600">★ {tech.rating}</div>
                  <MapLinks lat={tech.lat} lng={tech.lng} label={tech.name} />
                </div>
              </Popup>
            </Marker>
          ))}

          {jobs.map((job) => {
            const assignedTech = technicians.find((tech) => tech.id === job.techId);
            const origin = assignedTech ? { lat: assignedTech.lat, lng: assignedTech.lng } : undefined;
            return (
              <CircleMarker
                key={job.id}
                center={[job.lat, job.lng]}
                radius={10}
                pathOptions={{
                  color: job.isHot ? '#ef4444' : '#6366f1',
                  fillColor: job.isHot ? '#fca5a5' : '#a5b4fc',
                  fillOpacity: 0.8,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <div className="font-semibold">{job.service} {job.isHot ? '🔥' : ''}</div>
                    <div>{job.customer}</div>
                    <div className="text-gray-600">{job.address}</div>
                    <div className="mt-1 capitalize">{job.status}</div>
                    <MapLinks lat={job.lat} lng={job.lng} label={job.address || job.service} origin={origin} />
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {showLegend && (
        <div className="absolute bottom-3 start-3 z-[1000] space-y-1 rounded-lg border border-gray-200 bg-white/95 px-3 py-2 text-xs shadow-md backdrop-blur">
          <div className="mb-1 font-semibold text-gray-700">Technicians</div>
          {(Object.keys(statusColors) as TechStatus[]).map((status) => (
            <div key={status} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border-2 border-white shadow" style={{ background: statusColors[status] }} />
              <span className="capitalize text-gray-600">{status.replace(/([A-Z])/g, ' $1')}</span>
            </div>
          ))}
          <div className="mb-1 mt-2 font-semibold text-gray-700">Jobs</div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border-2 border-indigo-500 bg-indigo-300" />
            <span className="text-gray-600">Job</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border-2 border-red-500 bg-red-300" />
            <span className="text-gray-600">Hot Job</span>
          </div>
        </div>
      )}
    </div>
  );
}
