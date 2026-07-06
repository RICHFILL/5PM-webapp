import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Eye, Clock, ChevronRight, BookOpen } from "lucide-react";
import { Skeleton } from "../../components/common";
import { helpApi } from "../../services/api";
import { articles as fallbackArticles, categories as fallbackCategories } from "../../constants/helpData";

export default function HelpArticle() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await helpApi.getArticleBySlug(id);
        if (res?.data) {
          const a = res.data;
          setArticle({
            id: a.slug, title: a.title, category: a.category?.slug || a.categoryId,
            summary: a.summary, content: a.content, views: a.views,
            updatedAt: a.updatedAt ? a.updatedAt.split('T')[0] : a.createdAt?.split('T')[0],
          });
          if (a.related) {
            setRelated(a.related.map(r => ({
              id: r.slug, title: r.title, summary: r.summary,
            })));
          }
          setLoading(false);
          return;
        }
      } catch { /* fallback */ }
      const fallback = fallbackArticles.find(a => a.id === id);
      if (fallback) {
        setArticle(fallback);
        setRelated(fallbackArticles.filter(a => a.category === fallback.category && a.id !== id).slice(0, 3));
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  const category = article ? (fallbackCategories.find((c) => c.id === article.category) || { label: article.category }) : null;

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto text-center py-16">
        <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Article Not Found</h2>
        <p className="text-gray-500 mb-6">The article you are looking for does not exist.</p>
        <Link to="/help-centre" className="text-neon-tangerine hover:underline text-sm font-medium">Back to Help Centre</Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <Link to="/help-centre" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ArrowLeft size={16} /> Back to Help Centre
      </Link>

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link to="/help-centre" className="hover:text-gray-600">Help Centre</Link>
        <ChevronRight size={12} />
        <span>{category?.label || article.category}</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{article.title}</h1>

      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1"><Eye size={14} /> {article.views?.toLocaleString() || 0} views</span>
        <span className="flex items-center gap-1"><Clock size={14} /> Updated {article.updatedAt}</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-10">
        <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>

      {related.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Related Articles</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link key={r.id} to={`/help-centre/${r.id}`}
                className="rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50 hover:border-gray-300 transition-all group">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-neon-tangerine">{r.title}</p>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{r.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
