import React from "react";

export default function AddCourseModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[700px] max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add New Course</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                placeholder="Enter course title"
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Category</label>
              <select className="w-full border rounded-lg px-3 py-2 mt-1 text-sm">
                <option>Select category</option>
                <option>Web Development</option>
                <option>Design</option>
                <option>Marketing</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              placeholder="Enter course description"
              className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
              rows="3"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              placeholder="$ 0.00"
              className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
            />
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-gray-500 text-sm">
                Upload a file or drag and drop <br />
                <span className="text-red-600">PNG, JPG, GIF up to 10MB</span>
              </p>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-gray-500 text-sm">
                Upload a file or drag and drop <br />
                <span className="text-red-600">PDF, ZIP, MP4 up to 1GB</span>
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Add Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
