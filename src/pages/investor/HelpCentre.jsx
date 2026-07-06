import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, BookOpen, TrendingUp, Shield, Wallet, Building, Banknote, ArrowRight, Users, Lock, Loader2, ChevronRight } from "lucide-react";
import { helpApi } from "../../services/api";
import { Card, Skeleton } from "../../components/common";
import { categories as fallbackCategories, articles as fallbackArticles } from "../../constants/helpData";

const iconMap = {
  Rocket: BookOpen,
  Shield,
  Wallet: Wallet,
  TrendingUp,
  Building,
  Banknote,
  Users,
  Lock,
  ArrowRight: ArrowRight,
};

export default function HelpCentre() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const [arts, cats, pop] = await Promise.allSettled([
          helpApi.getArticles(),
          helpApi.getCategories(),
          helpApi.getPopularArticles(6),
        ]);
        if (arts.status === "fulfilled") {
          const d = arts.value?.data || arts.value || [];
          setArticles(Array.isArray(d) ? d : []);
        } else {
          setArticles(fallbackArticles);
        }
        if (cats.status === "fulfilled") {
          const d = cats.value?.data || cats.value || [];
          setCategories(Array.isArray(d) ? d : fallbackCategories);
        } else {
          setCategories(fallbackCategories);
        }
        if (pop.status === "fulfilled") {
          const d = pop.value?.data || pop.value || [];
          setPopular(Array.isArray(d) ? d : []);
        }
      } catch { /* silent */ } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = articles.filter((a) => {
    if (!search) return false;
    const q = search.toLowerCase();
    return (a.title || "").toLowerCase().includes(q) || (a.summary || "").toLowerCase().includes(q);
  });

  const catIcon = (icon) => {
    const Icon = iconMap[icon] || BookOpen;
    return Icon;
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Help Centre</h1>
        <p className="text-gray-500 mt-1">Find answers and learn how to make the most of your investments</p>
      </div>

      {/* Search */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for articles, guides, and answers..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white shadow-sm focus:border-neon-tangerine focus:ring-2 focus:ring-neon-tangerine/20 outline-none text-sm" />
      </div>

      {search ? (
        /* Search Results */
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Results ({filtered.length})</h2>
          {filtered.length > 0 ? (
            <div className="grid gap-3">
              {filtered.map((a) => (
                <Link key={a.id} to={`/help-centre/${a.id}`}
                  className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 hover:border-neon-tangerine/50 hover:shadow-sm transition-all group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-neon-tangerine">{a.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{a.summary}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-neon-tangerine shrink-0 ml-3" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <BookOpen size={40} className="mx-auto mb-3" />
              <p className="text-sm">No articles found for "{search}"</p>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Categories */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const Icon = catIcon(cat.icon);
                const count = articles.filter((a) => a.category === cat.id || a.categoryId === cat.id).length;
                return (
                  <Link key={cat.id} to={`/help-centre?category=${cat.id}`}
                    className="flex items-center gap-4 bg-white rounded-2xl border border-gray-200 p-5 hover:border-neon-tangerine/50 hover:shadow-md transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-neon-tangerine/10 flex items-center justify-center shrink-0">
                      <Icon size={22} className="text-neon-tangerine" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-neon-tangerine">{cat.label}</p>
                      <p className="text-xs text-gray-500">{count} articles</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-neon-tangerine shrink-0" />
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Popular Articles */}
          {popular.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Popular Articles</h2>
              </div>
              <div className="grid gap-3">
                {popular.map((a) => (
                  <Link key={a.slug || a.id} to={`/help-centre/${a.slug || a.id}`}
                    className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 hover:border-neon-tangerine/50 hover:shadow-sm transition-all group">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-neon-tangerine">{a.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{a.summary}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-neon-tangerine shrink-0 ml-3" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Need more help */}
          <section className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-6 md:p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Still need help?</h2>
            <p className="text-sm text-gray-500 mb-5">Contact our support team and we'll get back to you within 24 hours.</p>
            <button onClick={() => navigate("/support/new")}
              className="inline-flex items-center gap-2 bg-neon-tangerine text-white font-semibold px-6 py-3 rounded-xl hover:bg-neon-tangerine/80 transition-colors text-sm">
              Contact Support
            </button>
          </section>
        </>
      )}
    </div>
  );
}
