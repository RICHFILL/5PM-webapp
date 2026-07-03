import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Rocket, Shield, Wallet, TrendingUp, Building, Banknote, ArrowRight, Users, Lock, Eye, Clock, ChevronRight } from "lucide-react";
import { Button, Skeleton } from "../../components/common";
import { helpApi } from "../../services/api";
import { categories as fallbackCategories, articles as fallbackArticles } from "../../constants/helpData";

const iconMap = { Rocket, Shield, Wallet, TrendingUp, Building, Banknote, ArrowRight, Users, Lock };

function HelpCentre() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState(fallbackCategories);
  const [articles, setArticles] = useState(fallbackArticles);
  const [loading, setLoading] = useState(true);
  const [popular, setPopular] = useState(
    () => [...fallbackArticles].sort((a, b) => b.views - a.views).slice(0, 5)
  );
  const [recent, setRecent] = useState(
    () => [...fallbackArticles].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5)
  );

  useEffect(() => {
    const fetch = async () => {
      try {
        const [catRes, artRes, popRes, recRes] = await Promise.all([
          helpApi.getCategories(),
          helpApi.getArticles(),
          helpApi.getPopularArticles(5),
          helpApi.getRecentArticles(5),
        ]);
        if (catRes?.data) setCategories(catRes.data.map(c => ({ id: c.slug, label: c.name, icon: c.icon || 'Rocket' })));
        if (artRes?.data) setArticles(artRes.data.map(a => ({
          id: a.slug, title: a.title, category: a.category?.slug || a.categoryId,
          summary: a.summary, content: a.content, views: a.views,
          updatedAt: a.updatedAt ? a.updatedAt.split('T')[0] : a.createdAt?.split('T')[0],
        })));
        if (popRes?.data) setPopular(popRes.data.map(a => ({
          id: a.slug, title: a.title, views: a.views,
        })));
        if (recRes?.data) setRecent(recRes.data.map(a => ({
          id: a.slug, title: a.title, updatedAt: a.updatedAt ? a.updatedAt.split('T')[0] : a.createdAt?.split('T')[0],
        })));
      } catch {
        // fallback to static data
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = useMemo(() => {
    let result = articles;
    if (activeCategory) result = result.filter((a) => a.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) => a.title.toLowerCase().includes(q) || (a.summary || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [search, activeCategory, articles]);

  if (loading) {
    return (
      <div>
        <section className="bg-dark-lavender text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-4 w-24 bg-white/20 mb-4" />
            <Skeleton className="h-10 w-96 bg-white/20 mb-4" />
            <Skeleton className="h-5 w-64 bg-white/20" />
          </div>
        </section>
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-6 w-48 mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-28" />)}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-dark-lavender text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-neon-tangerine text-xs font-bold uppercase tracking-[0.2em]">Help Centre</span>
            <h1 className="text-3xl md:text-5xl font-black mt-4 mb-6 leading-tight">How Can We Help You?</h1>
            <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">Browse our guides and articles to get the most out of your 5PM NEXUS INVEST experience.</p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Help Articles"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-neon-tangerine focus:border-transparent text-sm"
            />
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon] || Rocket;
              const count = articles.filter((a) => a.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                  className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                    activeCategory === cat.id
                      ? "border-neon-tangerine bg-neon-tangerine/5 ring-2 ring-neon-tangerine/30"
                      : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                    activeCategory === cat.id ? "bg-neon-tangerine/10" : "bg-gray-100"
                  }`}>
                    <Icon size={20} className={activeCategory === cat.id ? "text-neon-tangerine" : "text-gray-500"} />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{cat.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{count} {count === 1 ? "article" : "articles"}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeCategory && (
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900">
                {categories.find((c) => c.id === activeCategory)?.label}
                <span className="text-gray-400 font-normal text-base ml-2">({filtered.length} articles)</span>
              </h2>
              <button onClick={() => setActiveCategory(null)} className="text-sm text-neon-tangerine hover:underline">Clear filter</button>
            </div>
          )}

          {filtered.length > 0 ? (
            <div className="space-y-4">
              {filtered.map((article) => (
                <Link key={article.id} to={`/help/${article.id}`} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-neon-tangerine transition-colors">{article.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{article.summary}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Eye size={12} /> {article.views?.toLocaleString() || 0} views</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> Updated {article.updatedAt}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-neon-tangerine shrink-0 ml-4" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search size={40} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No articles found for your search.</p>
            </div>
          )}
        </div>
      </section>

      {!activeCategory && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Popular Articles</h2>
                <div className="space-y-3">
                  {popular.map((article, i) => (
                    <Link key={article.id} to={`/help/${article.id}`} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50 transition-colors group">
                      <span className="text-lg font-black text-gray-300 w-6 text-center">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-neon-tangerine">{article.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{article.views?.toLocaleString() || 0} views</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recently Updated</h2>
                <div className="space-y-3">
                  {recent.map((article) => (
                    <Link key={article.id} to={`/help/${article.id}`} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50 transition-colors group">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                        <Clock size={16} className="text-purple-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-neon-tangerine">{article.title}</p>
                        <p className="text-xs text-gray-500 mt-1">Updated {article.updatedAt}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Still Need Help?</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">Our support team is ready to assist you. Create a support ticket and we will respond within 24 hours.</p>
          <Link to="/support/new">
            <Button className="bg-neon-tangerine hover:bg-neon-tangerine/80 text-white font-bold px-8 py-4 rounded-xl text-base">Contact Support</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HelpCentre;
