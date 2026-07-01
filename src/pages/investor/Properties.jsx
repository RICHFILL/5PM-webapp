import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Home, TrendingUp, Users, Search } from "lucide-react";
import { propertyApi } from "../../services/api";
import { Card, Skeleton, Badge, Button } from "../../components/common";

const formatNaira = (amount) => "₦" + (amount || 0).toLocaleString("en-NG");

export default function Properties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await propertyApi.getProperties();
        setProperties(Array.isArray(data) ? data : data?.data ?? data?.properties ?? []);
      } catch (err) {
        setProperties([]);
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = properties.filter((p) => {
    const q = search.toLowerCase();
    return (p.name || p.title || "").toLowerCase().includes(q)
      || (p.location || "").toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton.Card /><Skeleton.Card /><Skeleton.Card />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="bg-dark-lavender rounded-2xl p-4 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Fractional Real Estate</h1>
        <p className="text-blue-200">Own prime properties with fractional ownership starting from low amounts</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input type="text" placeholder="Search by name or location..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/30 outline-none transition-all" />
      </div>

      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((property) => (
              <Card key={property.id || property._id} className="flex flex-col overflow-hidden p-0 hover:shadow-lg transition-shadow">
                <div className="h-48 bg-dark-lavender flex items-center justify-center">
                  {property.images?.[0] ? (
                    <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                  ) : (
                    <Home size={48} className="text-white/60" />
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{property.title || property.name}</h3>
                    <Badge variant={property.status === "active" ? "success" : "default"}>{property.status || "active"}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                    <MapPin size={14} /><span>{property.location || property.city || "Nigeria"}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{property.description || "Premium real estate investment opportunity."}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Price/Unit</p>
                      <p className="text-sm font-bold text-gray-900">{formatNaira(property.unitPrice || property.pricePerUnit || property.price)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">ROI</p>
                      <p className="text-sm font-bold text-neon-tangerine">{property.expectedROI ? `${property.expectedROI}%` : "--"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Units Left</p>
                      <p className="text-sm font-bold text-gray-900">{property.availableUnits || property.units || 0}</p>
                    </div>
                  </div>
                  <Button onClick={() => navigate(`/properties/${property.id || property._id}`)} className="w-full mt-auto">
                    View Details
                  </Button>
                </div>
              </Card>
          ))}
        </div>
      ) : (
        <Card><p className="text-center text-gray-500 py-12">No properties found.</p></Card>
      )}
    </div>
  );
}
