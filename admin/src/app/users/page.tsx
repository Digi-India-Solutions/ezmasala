"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.get("/users");
      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen px-4 sm:px-6 py-8 sm:py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4 text-black font-semibold">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-6 sm:mb-8 text-black">Manage Users</h1>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-bold text-sm sm:text-base text-black">Name</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-bold text-sm sm:text-base text-black">Email</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-bold text-sm sm:text-base text-black">Registered</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-black">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-black">{user.email}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-black">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-12 text-black">
                No users registered yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
