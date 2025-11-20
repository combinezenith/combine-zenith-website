"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { app } from "../../../config/firebase";
import toast from "react-hot-toast";
import Sidebar from "@/app/(admin-components)/Sidebar";

const db = getFirestore(app);

interface Inquiry {
  id: string;
  name: string;
  email: string;
  inquiryType: string;
  subject: string;
  message: string;
  timestamp: Date;
  status: "new" | "in-progress" | "resolved" | "closed";
}

const ContactInquiriesPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [viewInquiry, setViewInquiry] = useState<Inquiry | null>(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // ✅ Redirect if not logged in or not admin
  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (session && session.user.role !== "admin")
    ) {
      router.replace("/admin/login");
    }
  }, [status, session, router]);

  // ✅ Fetch inquiries from Firestore
  const fetchInquiries = async () => {
    try {
      const q = query(
        collection(db, "inquiries"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      const inquiriesData: Inquiry[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        inquiriesData.push({
          id: docSnap.id,
          ...data,
          timestamp: data.timestamp.toDate(),
        } as Inquiry);
      });
      setInquiries(inquiriesData);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast.error("Failed to fetch inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchInquiries();
  }, [status]);

  // ✅ Update inquiry status
  const updateStatus = async (
    inquiryId: string,
    newStatus: Inquiry["status"]
  ) => {
    try {
      await updateDoc(doc(db, "inquiries", inquiryId), { status: newStatus });
      toast.success(`Inquiry marked as ${newStatus}`);
      fetchInquiries();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update inquiry status");
    }
  };

  // ✅ Delete inquiry
  const deleteInquiry = async (inquiryId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this inquiry? This action cannot be undone."
      )
    )
      return;
    try {
      await deleteDoc(doc(db, "inquiries", inquiryId));
      toast.success("Inquiry deleted successfully");
      fetchInquiries();
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      toast.error("Failed to delete inquiry");
    }
  };

  // ✅ Reply to inquiry
  const handleReply = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setReplySubject(`Re: ${inquiry.subject}`);
    setReplyMessage("");
  };

  const sendReply = async () => {
    if (!selectedInquiry || !replyMessage.trim()) return;
    setSending(true);
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selectedInquiry.email,
          subject: replySubject,
          message: replyMessage,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Reply sent successfully");
        await updateStatus(selectedInquiry.id, "resolved");
        setSelectedInquiry(null);
        setReplySubject("");
        setReplyMessage("");
      } else {
        toast.error("Failed to send reply");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  // ✅ Filtered inquiries
  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesName =
      nameFilter === "" ||
      inquiry.name.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesType = typeFilter === "" || inquiry.inquiryType === typeFilter;
    const matchesStatus =
      statusFilter === "" || inquiry.status === statusFilter;
    return matchesName && matchesType && matchesStatus;
  });

  // ✅ Loading / Auth checks
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Checking authentication...
      </div>
    );
  }

  if (
    status === "unauthenticated" ||
    (session && session.user.role !== "admin")
  ) {
    return null;
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // ✅ Render page
  return (
    <div className="p-6 min-h-screen">
      <div className="md:fixed md:w-64 md:h-screen">
        <Sidebar />
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="flex-1 text-white p-4 sm:p-6 md:pl-60 lg:pl-72">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Contact Inquiries</h1>
            <p className="mt-2 text-gray-100">
              Manage and respond to customer inquiries
            </p>
          </div>

          {/* Filters */}
          <div className="mb-4 flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-1">
                Filter by Name
              </label>
              <input
                type="text"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="text-white border placeholder:text-shadow-white border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter name..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-1">
                Filter by Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="text-white open:text-black border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Types</option>
                <option value="General">General</option>
                <option value="Collaboration">Collaboration</option>
                <option value="Support">Support</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-1">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-white open:text-black border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {filteredInquiries.length === 0 ? (
            <div className="rounded-lg shadow-md p-8 text-center bg-purple-500/50">
              <h3 className="text-lg font-medium text-white mb-2">
                No inquiries found
              </h3>
              <p className="text-gray-100">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="bg-purple-500/50 rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-purple-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-purple-200/30 divide-y divide-gray-200">
                    {filteredInquiries.map((inquiry, index) => (
                      <tr
                        key={inquiry.id}
                        className={
                          index % 2 === 0
                            ? "bg-purple-200/70"
                            : "bg-purple-100/60"
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {inquiry.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {inquiry.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              inquiry.inquiryType === "General"
                                ? "bg-blue-100 text-blue-800"
                                : inquiry.inquiryType === "Collaboration"
                                ? "bg-green-100 text-green-800"
                                : inquiry.inquiryType === "Support"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {inquiry.inquiryType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={inquiry.status || "new"}
                            onChange={(e) =>
                              updateStatus(
                                inquiry.id,
                                e.target.value as Inquiry["status"]
                              )
                            }
                            className="text-sm text-gray-900 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="new">New</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setViewInquiry(inquiry)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleReply(inquiry)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                            >
                              Reply
                            </button>
                            <button
                              onClick={() => deleteInquiry(inquiry.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View & Reply Modals */}
      {viewInquiry && (
        <div className="fixed inset-0 backdrop-blur-2xl bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-purple-50/90">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Inquiry Details
              </h3>
              <button
                onClick={() => setViewInquiry(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <p>
                <b>Name:</b> {viewInquiry.name}
              </p>
              <p>
                <b>Email:</b> {viewInquiry.email}
              </p>
              <p>
                <b>Type:</b> {viewInquiry.inquiryType}
              </p>
              <p>
                <b>Date:</b> {viewInquiry.timestamp.toLocaleString()}
              </p>
              <p>
                <b>Subject:</b> {viewInquiry.subject}
              </p>
              <p>
                <b>Message:</b> {viewInquiry.message}
              </p>
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setViewInquiry(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setViewInquiry(null);
                  handleReply(viewInquiry);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedInquiry && (
        <div className="fixed inset-0 backdrop-blur-2xl bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-lg shadow-lg rounded-md bg-purple-50/90">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Reply to Inquiry
              </h3>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Replying to:</p>
                <p className="font-medium">
                  {selectedInquiry.name} ({selectedInquiry.email})
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="w-full text-black border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={6}
                  className="w-full text-black border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Type your reply here..."
                />
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={sendReply}
                disabled={sending || !replyMessage.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? "Sending..." : "Send Reply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactInquiriesPage;
