import { useEffect, useState } from "react";

const STORAGE_KEY = "safesignalEmergencyContacts";

function loadContacts() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function mapsLink(latitude, longitude) {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

export default function EmergencyHelp() {
  const [contacts, setContacts] = useState(loadContacts);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState(null);
  const [locationMessage, setLocationMessage] = useState("Location has not been fetched yet.");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  const fetchLocation = () => new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("This browser does not support location access."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: Math.round(position.coords.accuracy),
        fetchedAt: new Date().toISOString(),
      }),
      (geoError) => reject(new Error(
        geoError.code === 1
          ? "Location permission was denied. Allow location access in your browser and try again."
          : "Could not get your location. Check your GPS or network and try again."
      )),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
    );
  });

  const updateLocation = async () => {
    setError("");
    setBusy(true);
    try {
      const current = await fetchLocation();
      setLocation(current);
      setLocationMessage(`Location ready (about ${current.accuracy} m accuracy).`);
    } catch (e) {
      setError(e.message);
      setLocationMessage("Location unavailable.");
    } finally {
      setBusy(false);
    }
  };

  const addContact = (event) => {
    event.preventDefault();
    setError("");
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();
    if (!cleanName || (!cleanPhone && !cleanEmail)) {
      setError("Enter a name and at least a phone number or email address.");
      return;
    }
    setContacts((existing) => [...existing, {
      id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
    }]);
    setName("");
    setPhone("");
    setEmail("");
  };

  const removeContact = (id) => {
    setContacts((existing) => existing.filter((contact) => contact.id !== id));
  };

  const sendLocation = (contact, method) => {
    setError("");
    if (!location) {
      setError("Get your current location first, then choose how to share it.");
      return;
    }

    const link = mapsLink(location.latitude, location.longitude);
    const message = `I need help. My current location is: ${link}`;
    if (method === "sms" && contact.phone) {
      window.location.href = `sms:${encodeURIComponent(contact.phone)}?body=${encodeURIComponent(message)}`;
    } else if (method === "whatsapp" && contact.phone) {
      const digits = contact.phone.replace(/\D/g, "");
      if (!digits) {
        setError(`Add a valid phone number for ${contact.name} to use WhatsApp.`);
        return;
      }
      window.open(`https://wa.me/${digits}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    } else if (method === "email" && contact.email) {
      window.location.href = `mailto:${encodeURIComponent(contact.email)}?subject=${encodeURIComponent("I need help")}&body=${encodeURIComponent(message)}`;
    }
  };

  return (
    <section id="emergency-help" className="mx-auto my-8 max-w-7xl px-4 sm:px-8">
      <div className="overflow-hidden rounded-2xl border border-rose-200 bg-white shadow-sm">
        <div className="bg-rose-700 p-5 text-white sm:p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-rose-100">SafeSignal</p>
          <h2 className="mt-1 text-2xl font-bold">Emergency Help</h2>
          <p className="mt-2 max-w-2xl text-sm text-rose-50">
            Save trusted contacts and choose when to send them your current location. Your contacts stay in this browser.
          </p>
        </div>

        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold">Your location</h3>
            <p className="mt-1 text-sm text-slate-600" aria-live="polite">{locationMessage}</p>
            {location && (
              <a className="mt-2 inline-block text-sm font-medium text-blue-700 underline" href={mapsLink(location.latitude, location.longitude)} target="_blank" rel="noreferrer">
                Open current location in map
              </a>
            )}
            <button type="button" onClick={updateLocation} disabled={busy} className="mt-4 block rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-wait disabled:opacity-60">
              {busy ? "Getting location…" : "Get my current location"}
            </button>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Your browser will ask for location permission. Location is added to a message only when you choose a contact action; SafeSignal does not send it automatically.
            </p>
          </div>

          <form onSubmit={addContact} className="rounded-xl bg-slate-50 p-4">
            <h3 className="text-lg font-semibold">Add an emergency contact</h3>
            <label className="mt-3 block text-sm font-medium text-slate-700">
              Name
              <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2" placeholder="Contact name" />
            </label>
            <label className="mt-3 block text-sm font-medium text-slate-700">
              Phone (include country code for WhatsApp)
              <input value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" type="tel" className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2" placeholder="+91 98765 43210" />
            </label>
            <label className="mt-3 block text-sm font-medium text-slate-700">
              Email (optional)
              <input value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" type="email" className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2" placeholder="name@example.com" />
            </label>
            <button type="submit" className="mt-4 rounded-lg bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-800">Save contact</button>
          </form>
        </div>

        {error && <p role="alert" className="mx-5 mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-800 sm:mx-6">{error}</p>}

        <div className="border-t border-slate-200 p-5 sm:p-6">
          <h3 className="text-lg font-semibold">Trusted contacts</h3>
          {contacts.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">No contacts saved yet. Add someone you trust above.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {contacts.map((contact) => (
                <li key={contact.id} className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-sm text-slate-600">{[contact.phone, contact.email].filter(Boolean).join(" · ")}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {contact.phone && <>
                      <button type="button" onClick={() => sendLocation(contact, "sms")} disabled={busy || !location} className="rounded-lg bg-rose-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-60">Text location</button>
                      <button type="button" onClick={() => sendLocation(contact, "whatsapp")} disabled={busy || !location} className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-60">WhatsApp</button>
                    </>}
                    {contact.email && <button type="button" onClick={() => sendLocation(contact, "email")} disabled={busy || !location} className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-60">Email location</button>}
                    <button type="button" onClick={() => removeContact(contact.id)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs leading-5 text-slate-500">SMS, WhatsApp, and email open your messaging app with a draft. Review and send it there. This starter version sends a location snapshot; continuous live sharing needs a secured backend feature.</p>
        </div>
      </div>
    </section>
  );
}
