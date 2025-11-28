"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/lib/api";

export default function AdminVideos() {
  const [spices, setSpices] = useState<any[]>([]);
  const [selectedSpice, setSelectedSpice] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [editSpiceId, setEditSpiceId] = useState("");
  const [editVideoFile, setEditVideoFile] = useState<File | null>(null);

  useEffect(() => {
    fetchSpices();
    fetchVideos();
  }, []);

  const fetchSpices = async () => {
    try {
      const data = await api.get("/spices");
      setSpices(data);
    } catch (error) {
      console.error("Failed to fetch spices");
    }
  };

  const fetchVideos = async () => {
    try {
      const data = await api.get("/videos");
      setVideos(data);
    } catch (error) {
      console.error("Failed to fetch videos");
    }
  };

  const handleVideoUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSpice || !videoFile) {
      toast.error("Please select a spice and video file");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", videoFile);
      formData.append("folder", "spice-videos");

      const { url } = await api.upload("/upload", formData);

      await api.post("/videos", {
        spiceId: selectedSpice,
        videoUrl: url,
      });

      toast.success("Video uploaded successfully!");
      setSelectedSpice("");
      setVideoFile(null);
      fetchVideos();
    } catch (error: any) {
      toast.error(error.message || "Video upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      await api.delete(`/videos/${id}`);
      toast.success("Video deleted successfully");
      fetchVideos();
    } catch (error: any) {
      toast.error(error.message || "Delete failed");
    }
  };

  const handleSaveEdit = async (video: any) => {
    try {
      let newVideoUrl = video.videoUrl;

      if (editVideoFile) {
        const fd = new FormData();
        fd.append("file", editVideoFile);
        fd.append("folder", "spice-videos");

        const { url } = await api.upload("/upload", fd);
        newVideoUrl = url;
      }

      const updateBody: any = { videoUrl: newVideoUrl };
      if (editSpiceId) updateBody.spiceId = editSpiceId;

      await api.put(`/videos/${video._id}`, updateBody);

      toast.success("Video updated successfully!");
      setEditingId(null);
      setEditVideoFile(null);
      fetchVideos();
    } catch (error: any) {
      toast.error(error.message || "Update failed");
    }
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-8 text-black">
          Upload Spice Videos
        </h1>

        {/* Upload Form */}
        <form
          onSubmit={handleVideoUpload}
          className="bg-white p-6 rounded-2xl shadow-lg space-y-6 mb-8"
        >
          <div>
            <label className="block text-sm font-semibold mb-2">
              Select Spice
            </label>
            <select
              value={selectedSpice}
              onChange={(e) => setSelectedSpice(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-xl"
            >
              <option value="">Choose a spice</option>
              {spices.map((spice) => (
                <option key={spice._id} value={spice._id}>
                  {spice.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Upload Video (.mp4)
            </label>
            <input
              type="file"
              accept="video/mp4"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              required
              disabled={uploading}
              className="w-full px-4 py-3 border rounded-xl"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-900"
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </button>
        </form>

        {/* Video List */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-black">
            Uploaded Videos
          </h2>

          <div className="space-y-4">
            {videos.length === 0 ? (
              <p className="text-gray-600">No videos uploaded yet.</p>
            ) : (
              videos.map((video) => (
                <div
                  key={video._id}
                  className="p-4 border border-gray-200 rounded-xl"
                >
                  {editingId === video._id ? (
                    <div className="space-y-4">
                      {/* Edit Spice */}
                      <div>
                        <label className="text-sm font-semibold">
                          Change Spice
                        </label>
                        <select
                          value={editSpiceId || spices[0]?._id}
                          onChange={(e) => setEditSpiceId(e.target.value)}
                          className="w-full px-4 py-2 border rounded-xl"
                        >
                          {spices.map((spice) => (
                            <option key={spice._id} value={spice._id}>
                              {spice.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Replace Video */}
                      <div>
                        <label className="text-sm font-semibold">
                          Replace Video (optional)
                        </label>
                        <input
                          type="file"
                          accept="video/mp4"
                          onChange={(e) =>
                            setEditVideoFile(e.target.files?.[0] || null)
                          }
                          className="w-full px-4 py-2 border rounded-xl"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleSaveEdit(video)}
                          className="px-4 py-2 bg-green-600 text-white rounded-xl font-semibold"
                        >
                          Save Changes
                        </button>

                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditVideoFile(null);
                          }}
                          className="px-4 py-2 bg-gray-300 rounded-xl font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-black">
                            Spice: {video.spiceId?.title || "Unknown"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(video.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingId(video._id);

                              const correctId =
                                typeof video.spiceId === "string"
                                  ? video.spiceId
                                  : video.spiceId?._id;

                              setEditSpiceId(correctId || spices[0]?._id || "");
                            }}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(video._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <video
                        src={video.videoUrl}
                        controls
                        className="w-full max-w-md rounded-lg"
                      />
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
