import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import type { MapTechnician, MapJob, TechStatus } from '@/data/mock';
import { KANSAS_CITY_CENTER } from '@/data/mock';

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
    html: `<div style="
      width:18px;height:18px;border-radius:50%;
      background:${color};border:3px solid white;
      box-shadow:0 1px 4px rgba(0,0,0,.4);
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
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
  center = ADDIS_CENTER,
  zoom = 13,
}: LiveMapProps) {
  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200">
      <div className="absolute top-3 end-3 z-[1000] rounded-lg bg-white/95 px-3 py-2 text-xs font-medium text-gray-600 shadow-sm border border-gray-200">Illustrative demo map · Not live provider locations</div>
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

          {technicians.map((t) => (
            <Marker key={t.id} position={[t.lat, t.lng]} icon={createTechIcon(t.status)}>
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-gray-600">{t.service}</div>
                  <div className="mt-1 capitalize">{t.status.replace(/([A-Z])/g, ' $1')}</div>
                  <div className="text-amber-600">★ {t.rating}</div>
                </div>
              </Popup>
            </Marker>
          ))}

          {jobs.map((j) => (
            <CircleMarker
              key={j.id}
              center={[j.lat, j.lng]}
              radius={10}
              pathOptions={{
                color: j.isHot ? '#ef4444' : '#6366f1',
                fillColor: j.isHot ? '#fca5a5' : '#a5b4fc',
                fillOpacity: 0.8,
                weight: 2,
              }}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{j.service} {j.isHot ? '🔥' : ''}</div>
                  <div>{j.customer}</div>
                  <div className="text-gray-600">{j.address}</div>
                  <div className="capitalize mt-1">{j.status}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {showLegend && (
        <div className="absolute bottom-3 start-3 z-[1000] bg-white/95 backdrop-blur rounded-lg shadow-md border border-gray-200 px-3 py-2 text-xs space-y-1">
          <div className="font-semibold text-gray-700 mb-1">Technicians</div>
          {(Object.keys(statusColors) as TechStatus[]).map((s) => (
            <div key={s} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full border-2 border-white shadow"
                style={{ background: statusColors[s] }}
              />
              <span className="capitalize text-gray-600">{s.replace(/([A-Z])/g, ' $1')}</span>
            </div>
          ))}
          <div className="font-semibold text-gray-700 mt-2 mb-1">Jobs</div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-300 border-2 border-indigo-500" />
            <span className="text-gray-600">Job</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-300 border-2 border-red-500" />
            <span className="text-gray-600">Hot Job</span>
          </div>
        </div>
      )}
    </div>
  );
}
