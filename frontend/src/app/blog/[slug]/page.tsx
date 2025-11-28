import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import api from "@/lib/api";

async function getBlog(slug: string) {
  try {
    return await api.get(`/blogs/slug/${slug}`);
  } catch (error) {
    return null;
  }
}

async function getAllBlogs() {
  try {
    return await api.get('/blogs');
  } catch (error) {
    return [];
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  const allBlogs = await getAllBlogs();

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4 text-black">Blog Post Not Found</h1>
          <Link href="/blog" className="text-amber-600 font-semibold hover:text-amber-700 transition">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-8">
        <Breadcrumb
          items={[
            { label: "Blog", href: "/blog" },
            { label: blog.title }
          ]}
        />
      </div>

      {/* HERO IMAGE */}
      <div className="relative h-[60vh] min-h-[500px] w-full">
        <div className="absolute inset-0">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>

        <div className="relative h-full flex items-end">
          <div className="container mx-auto px-4 pb-12 md:pb-16">
            <Link href="/blog" className="inline-flex items-center text-white/90 hover:text-white font-semibold mb-6 transition group">
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>

            <div className="max-w-4xl">
              <div className="flex items-center gap-4 text-sm text-white/80 mb-4">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span>•</span>
                <span>By {blog.author}</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black mb-4 text-white leading-tight">
                {blog.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section - Modern Two Column Layout */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="grid lg:grid-cols-[1fr,400px] gap-8 max-w-7xl mx-auto">
          {/* Main Content */}
          <article className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              {blog.content.split('\n').map((paragraph: string, index: number) => {
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-3xl font-black mt-12 mb-6 text-black first:mt-0">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                } else if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-2xl font-bold mt-8 mb-4 text-black">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                } else if (paragraph.startsWith('- ')) {
                  return (
                    <li key={index} className="ml-6 mb-3 text-gray-700 leading-relaxed">
                      {paragraph.replace('- ', '')}
                    </li>
                  );
                } else if (paragraph.trim() !== '') {
                  return (
                    <p key={index} className="mb-6 text-gray-700 text-lg leading-relaxed">
                      {paragraph}
                    </p>
                  );
                }
                return null;
              })}
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h4 className="font-bold text-black mb-4">Share this article</h4>
              <div className="flex gap-3">
                <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </button>
                <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </button>
                <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                  </svg>
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Author Card */}
            <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-24">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {blog.author.charAt(0)}
                </div>
                <h4 className="font-bold text-lg text-black mb-1">{blog.author}</h4>
                <p className="text-sm text-gray-600 mb-4">Author</p>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Expert in Indian spices and traditional cooking methods
                  </p>
                </div>
              </div>
            </div>

            {/* Table of Contents (if content has headers) */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-xl p-6">
              <h4 className="font-bold text-black mb-4">Quick Navigation</h4>
              <div className="space-y-2">
                {blog.content.split('\n').filter((p: string) => p.startsWith('## ')).slice(0, 5).map((heading: string, index: number) => (
                  <div key={index} className="text-sm text-gray-700 hover:text-black transition cursor-pointer">
                    • {heading.replace('## ', '')}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Related Articles - Full Width */}
        <div className="mt-16 mb-16">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-3xl font-black mb-8 text-black">Continue Reading</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allBlogs.filter((b: any) => b._id !== blog._id).slice(0, 3).map((relatedBlog: any) => (
                <Link key={relatedBlog._id} href={`/blog/${relatedBlog.slug}`}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group h-full">
                    <div className="aspect-video relative bg-gray-100 overflow-hidden">
                      <Image
                        src={relatedBlog.image}
                        alt={relatedBlog.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="p-6">
                      <div className="text-xs text-gray-500 mb-2">
                        {new Date(relatedBlog.createdAt).toLocaleDateString()}
                      </div>
                      <h4 className="font-bold text-lg mb-3 text-black group-hover:text-amber-600 transition line-clamp-2">
                        {relatedBlog.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {relatedBlog.content.substring(0, 150)}...
                      </p>
                      <div className="mt-4 text-amber-600 font-semibold text-sm flex items-center group-hover:gap-2 transition-all">
                        Read More
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
