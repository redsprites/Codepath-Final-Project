import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostCard from './PostCard';
import supabaseInstance from "@/contexts/supabaseInstance";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PostCardProps } from '@/interfaces';

const PostGallery = () => {
  const [posts, setPosts] = useState<PostCardProps[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortType, setSortType] = useState<'created_at' | 'up_votes'>('created_at');
  const supabase = supabaseInstance();

  useEffect(() => {
    const fetchPosts = async () => {
      let query = supabase
        .from('post')
        .select('*');

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching posts:', error);
      } else if (data) {
        const sortedData = data.sort((a: PostCardProps, b: PostCardProps) => {
          if (sortType === 'created_at') {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          } else if (sortType === 'up_votes') {
            return b.up_votes - a.up_votes;
          }
          return 0;
        });
        setPosts(sortedData);
      }
    };

    fetchPosts();
  }, [searchTerm, sortType]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center border-b pb-4">
          <Link to='/' className='text-black-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium'>
            Hobby Hub
          </Link>
          <Input
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 max-w-xs form-input"
          />
          <Link to='/create' className='text-black-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium'>
            Create a new Post
          </Link>
        </div>
      </div>

      <div className="ml-4 space-x-2">
        <Button onClick={() => setSortType('created_at')} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow">
          Sort by Date
        </Button>
        <Button onClick={() => setSortType('up_votes')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow">
          Sort by Votes
        </Button>
      </div>
      <div className="flex flex-col justify-between items-center">
        {posts.map((post) => (
            <PostCard
            key={post.id}
            {...post}
          />
        ))}
      </div>
    </>
  );
};

export default PostGallery;
