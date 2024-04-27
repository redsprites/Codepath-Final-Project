import React from 'react';
import { Link } from 'react-router-dom';
import { PostCardProps } from '../interfaces';

const PostCard: React.FC<PostCardProps> = ({ id, title, created_at, up_votes }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 w-96 mx-auto mb-6">
      <Link to={`/posts/${id}`}>
        <div className="p-4">
          <p className="text-gray-500 text-sm">
            Posted {new Date(created_at).toLocaleDateString()}
          </p>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-gray-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 11l7-7 7 7M5 19l7-7 7 7"
              />
            </svg>
            <span className="text-gray-700">{up_votes}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;