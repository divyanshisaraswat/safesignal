import { useState } from "react";
import { Navigation, Clock, MapPin, User, Mail, Send } from "lucide-react";

export default function Planner({ journey, onCreate }) {
  const [dest, setDest] = useState(journey?.dest || "Mathura");
  const [startDest, setStartDest] = useState(journey?.startDest || journey?.start || "Aligarh");
  const [time, setTime] = useState(journey?.time || "18:30");
  const [cname, setCname] = useState(journey?.cname || "Alex");
  const [cemail, setCemail] = useState(journey?.cemail || "alex@example.com");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onCreate) {
      onCreate({
        startDest,
        dest,
        time,
        cname,
        cemail,
      });
    }
    // Smoothly scroll down to the map section when starting journey
    document.getElementById("map-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <Navigation size={20} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Plan a journey</h2>
          <p className="text-xs text-slate-500">Tell us where you're going and who to keep informed.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Start Destination</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400">
                <MapPin size={16} />
              </span>
              <input
                type="text"
                value={startDest}
                onChange={(e) => setStartDest(e.target.value)}
                placeholder="e.g. Aligarh"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Destination</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400">
                <MapPin size={16} />
              </span>
              <input
                type="text"
                value={dest}
                onChange={(e) => setDest(e.target.value)}
                placeholder="e.g. Mathura"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Arrival</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400">
                <Clock size={16} />
              </span>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Name</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400">
                <User size={16} />
              </span>
              <input
                type="text"
                value={cname}
                onChange={(e) => setCname(e.target.value)}
                placeholder="Trusted contact name"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                value={cemail}
                onChange={(e) => setCemail(e.target.value)}
                placeholder="contact@example.com"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Send size={18} />
          Start journey & View Map
        </button>
      </form>
    </div>
  );
}