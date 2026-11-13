import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useState } from 'react';
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

const statusLabels: Record<TechStatus, string> = {
  available: 'Available',
  busy: 'Busy',
  onTheWay: 'On the way',
  working: 'Working',
  offline: 'Offline',
};

type MapFilter = TechStatus | 'jobs' | 'hotJobs';

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

function distanceMiles(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const radians = (value: number) => (value * Math.PI) / 180;
  const dLat = radians(b.lat - a.lat);
  const dLng = radians(b.lng - a.lng);
  const value = Math.sin(dLat / 2) ** 2
    + Math.cos(radians(a.lat)) * Math.cos(radians(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 3958.8 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
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
  const [selectedFilter, setSelectedFilter] = useState<MapFilter | null>(null);

  const selectedTechnicians = useMemo(
    () => selectedFilter && selectedFilter !== 'jobs' && selectedFilter !== 'hotJobs'
      ? technicians.filter((tech) => tech.status === selectedFilter)
      : [],
    [selectedFilter, technicians],
  );
  const selectedJobs = useMemo(
    () => selectedFilter === 'jobs' ? jobs : selectedFilter === 'hotJobs' ? jobs.filter((job) => job.isHot) : [],
    [selectedFilter, jobs],
  );
  const selectedTitle = selectedFilter === 'jobs'
    ? 'All jobs'
    : selectedFilter === 'hotJobs'
      ? 'Hot jobs'
      : selectedFilter
        ? statusLabels[selectedFilter]
        : '';

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
          {MELA_MARKET.serviceAreas.map((area) => {
            const nearbyTechs = technicians
              .map((tech) => ({ tech, miles: distanceMiles(area, tech) }))
              .filter((item) => item.miles <= 12)
              .sort((a, b) => a.miles - b.miles);
            const nearbyJobs = jobs
              .map((job) => ({ job, miles: distanceMiles(area, job) }))
              .filter((item) => item.miles <= 12)
              .sort((a, b) => a.miles - b.miles);
            return (
              <CircleMarker
                key={area.city + '-' + area.state}
                center={[area.lat, area.lng]}
                radius={7}
                pathOptions={{ color: '#173b35', fillColor: '#f4c66a', fillOpacity: 0.9, weight: 2 }}
              >
                <Popup minWidth={260} maxWidth={340}>
                  <div className="space-y-2 text-sm">
                    <div className="font-semibold">{area.city}, {area.state}</div>
                    <div className="text-xs text-gray-600">Planned market area · provider coverage is not yet verified</div>
                    <div className="rounded-md bg-gray-50 p-2">
                      <div className="font-semibold">{nearbyTechs.length} nearby demo technicians</div>
                      {nearbyTechs.length ? nearbyTechs.slice(0, 8).map(({ tech, miles }) => (
                        <div key={tech.id} className="mt-1 border-t border-gray-200 pt-1">
                          <div className="font-medium">{tech.name}</div>
                          <div className="text-xs text-gray-600">{tech.service} · {statusLabels[tech.status]} · ★ {tech.rating.toFixed(1)} · {miles.toFixed(1)} mi away</div>
                        </div>
                      )) : <div className="text-xs text-gray-500">No demo technicians listed nearby.</div>}
                    </div>
                    <div className="rounded-md bg-gray-50 p-2">
                      <div className="font-semibold">{nearbyJobs.length} nearby demo jobs</div>
                      {nearbyJobs.length ? nearbyJobs.slice(0, 6).map(({ job, miles }) => (
                        <div key={job.id} className="mt-1 border-t border-gray-200 pt-1">
                          <div className="font-medium">{job.service}{job.isHot ? ' · HOT' : ''}</div>
                          <div className="text-xs text-gray-600">{job.id} · {job.customer} · {job.status} · {miles.toFixed(1)} mi</div>
                        </div>
                      )) : <div className="text-xs text-gray-500">No demo jobs listed nearby.</div>}
                    </div>
                    <MapLinks lat={area.lat} lng={area.lng} label={area.city + ', ' + area.state} />
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

          {technicians.map((tech) => {
            const assignedJobs = jobs.filter((job) => job.techId === tech.id);
            return (
              <Marker key={tech.id} position={[tech.lat, tech.lng]} icon={createTechIcon(tech.status)}>
                <Popup minWidth={240} maxWidth={320}>
                  <div className="space-y-1 text-sm">
                    <div className="font-semibold">{tech.name}</div>
                    <div><span className="font-medium">Trade:</span> {tech.service}</div>
                    <div><span className="font-medium">Status:</span> {statusLabels[tech.status]}</div>
                    <div><span className="font-medium">Technician ID:</span> {tech.id}</div>
                    <div><span className="font-medium">Rating:</span> ★ {tech.rating.toFixed(1)} / 5</div>
                    {tech.distanceMiles !== undefined && <div><span className="font-medium">Listed distance:</span> {tech.distanceMiles.toFixed(1)} mi</div>}
                    <div className="mt-2 rounded-md bg-gray-50 p-2">
                      <div className="font-semibold">Assigned jobs ({assignedJobs.length})</div>
                      {assignedJobs.length ? assignedJobs.map((job) => (
                        <div key={job.id} className="mt-1 border-t border-gray-200 pt-1">
                          <div className="font-medium">{job.service}{job.isHot ? ' · HOT JOB' : ''}</div>
                          <div className="text-xs text-gray-600">{job.id} · {job.customer} · {job.address} · {job.status}</div>
                        </div>
                      )) : <div className="text-xs text-gray-500">No job assigned in this demo dataset.</div>}
                    </div>
                    <MapLinks lat={tech.lat} lng={tech.lng} label={tech.name} />
                  </div>
                </Popup>
              </Marker>
            );
          })}

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
                <Popup minWidth={240} maxWidth={320}>
                  <div className="space-y-1 text-sm">
                    <div className="font-semibold">{job.service} {job.isHot ? '🔥 HOT JOB' : ''}</div>
                    <div><span className="font-medium">Job ID:</span> {job.id}</div>
                    <div><span className="font-medium">Customer:</span> {job.customer}</div>
                    <div><span className="font-medium">Location:</span> {job.address}</div>
                    <div><span className="font-medium">Status:</span> {job.status}</div>
                    <div><span className="font-medium">Assigned technician:</span> {assignedTech ? assignedTech.name + ' · ' + assignedTech.service + ' · ' + statusLabels[assignedTech.status] : 'Not assigned'}</div>
                    <MapLinks lat={job.lat} lng={job.lng} label={job.address || job.service} origin={origin} />
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {selectedFilter && (
        <div className="absolute bottom-3 end-3 z-[1000] max-h-[65%] w-[min(360px,calc(100%-24px))] overflow-hidden rounded-xl border border-gray-200 bg-white/95 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
            <div>
              <div className="text-sm font-semibold text-gray-900">{selectedTitle}</div>
              <div className="text-xs text-gray-500">{selectedTechnicians.length || selectedJobs.length} matching records · demo data</div>
            </div>
            <button type="button" onClick={() => setSelectedFilter(null)} className="rounded-md px-2 py-1 text-xs text-gray-600 hover:bg-gray-100" aria-label="Close details">Close</button>
          </div>
          <div className="max-h-64 space-y-2 overflow-y-auto p-3">
            {selectedTechnicians.map((tech) => {
              const assignedJobs = jobs.filter((job) => job.techId === tech.id);
              return (
                <div key={tech.id} className="rounded-lg border border-gray-100 p-2 text-xs">
                  <div className="font-semibold text-gray-900">{tech.name}</div>
                  <div className="mt-0.5 text-gray-600">{tech.service} · {statusLabels[tech.status]} · ★ {tech.rating.toFixed(1)}</div>
                  <div className="text-gray-500">{tech.distanceMiles?.toFixed(1) ?? '—'} mi listed distance · {assignedJobs.length} assigned jobs</div>
                  {assignedJobs.map((job) => <div key={job.id} className="mt-1 text-gray-600">{job.id}: {job.service} for {job.customer} · {job.address}</div>)}
                </div>
              );
            })}
            {selectedJobs.map((job) => {
              const tech = technicians.find((person) => person.id === job.techId);
              return (
                <div key={job.id} className="rounded-lg border border-gray-100 p-2 text-xs">
                  <div className="font-semibold text-gray-900">{job.service}{job.isHot ? ' · HOT' : ''}</div>
                  <div className="text-gray-600">{job.id} · {job.customer} · {job.address}</div>
                  <div className="text-gray-500">Status: {job.status} · Technician: {tech ? tech.name + ' (' + tech.service + ')' : 'Not assigned'}</div>
                </div>
              );
            })}
            {!selectedTechnicians.length && !selectedJobs.length && <div className="text-xs text-gray-500">No records in this category.</div>}
          </div>
        </div>
      )}

      {showLegend && (
        <div className="absolute bottom-3 start-3 z-[1000] max-w-[190px] space-y-1 rounded-lg border border-gray-200 bg-white/95 px-3 py-2 text-xs shadow-md backdrop-blur">
          <div className="mb-1 font-semibold text-gray-700">Technicians · select a status</div>
          {(Object.keys(statusColors) as TechStatus[]).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setSelectedFilter(status)}
              aria-pressed={selectedFilter === status}
              className={'flex w-full items-center gap-2 rounded px-1 py-1 text-left hover:bg-gray-100 ' + (selectedFilter === status ? 'bg-gray-100 font-semibold' : '')}
            >
              <span className="h-3 w-3 shrink-0 rounded-full border-2 border-white shadow" style={{ background: statusColors[status] }} />
              <span className="text-gray-700">{statusLabels[status]}</span>
              <span className="ml-auto text-gray-500">{technicians.filter((tech) => tech.status === status).length}</span>
            </button>
          ))}
          <div className="mb-1 mt-2 border-t border-gray-100 pt-2 font-semibold text-gray-700">Jobs · select to view</div>
          <button type="button" onClick={() => setSelectedFilter('jobs')} aria-pressed={selectedFilter === 'jobs'} className={'flex w-full items-center gap-2 rounded px-1 py-1 text-left hover:bg-gray-100 ' + (selectedFilter === 'jobs' ? 'bg-gray-100 font-semibold' : '')}>
            <span className="h-3 w-3 shrink-0 rounded-full border-2 border-indigo-500 bg-indigo-300" />
            <span className="text-gray-700">All jobs</span><span className="ml-auto text-gray-500">{jobs.length}</span>
          </button>
          <button type="button" onClick={() => setSelectedFilter('hotJobs')} aria-pressed={selectedFilter === 'hotJobs'} className={'flex w-full items-center gap-2 rounded px-1 py-1 text-left hover:bg-gray-100 ' + (selectedFilter === 'hotJobs' ? 'bg-gray-100 font-semibold' : '')}>
            <span className="h-3 w-3 shrink-0 rounded-full border-2 border-red-500 bg-red-300" />
            <span className="text-gray-700">Hot jobs</span><span className="ml-auto text-gray-500">{jobs.filter((job) => job.isHot).length}</span>
          </button>
        </div>
      )}
    </div>
  );
}
