"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Pagination from "@/components/Pagination";
import Breadcrumb from "@/components/Breadcrumb";
import api from "@/lib/api";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await api.get("/blogs");
        setBlogs(data);
      } catch (error) {
        console.error("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBlogs = blogs.slice(startIndex, endIndex);

  return (
    <div className="py-4 md:py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">

        <Breadcrumb items={[{ label: "Blog" }]} />

        <h1 className="text-5xl text-black font-bold text-center mb-4">
          Know Your Masala
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Learn about the health benefits, uses, and history of different masalas
        </p>

        {/* Skeleton Loader */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse"
              >
                <div className="aspect-video bg-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : paginatedBlogs.length === 0 ? (
          <p className="col-span-full text-center text-gray-600">
            No blogs available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedBlogs.map((blog: any) => (
              <article
                key={blog._id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <Link href={`/blog/${blog.slug}`}>
                  <div className="aspect-video relative bg-gray-100">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                  <Link href={`/blog/${blog.slug}`}>
                    <h2 className="font-bold text-xl mb-3 hover:text-gray-600 transition text-black">
                      {blog.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 text-sm mb-4">{blog.content.substring(0, 150)}...</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">By {blog.author}</span>
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="text-black font-semibold hover:underline text-sm"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {blogs.length > 0 && !loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </div>
    </div>
  );
}
