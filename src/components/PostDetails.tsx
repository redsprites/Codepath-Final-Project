// src/components/PostDetails.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabaseInstance from "@/contexts/supabaseInstance";
import { PostCardProps } from '@/interfaces';
import { Button } from './ui/button';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import commnetFormSchema from "@/schemas/commentSchema"
import { Input } from "@/components/ui/input"

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState<PostCardProps | null>(null);
  const [commentAdded, setCommentAdded] = useState(false);
  const supabase = supabaseInstance();


  const insertComment = async (formData: z.infer<typeof commnetFormSchema>, post: PostCardProps | null) => {
    if (!post) {
      console.error('Post not found');
      return;
    }
    const updatedComments = [...post.comments, formData.comment];
    const { error: updateError } = await supabase
      .from('post')
      .update({ comments: updatedComments })
      .eq('id', id);

    if (updateError) {
      console.error('Update error:', updateError);
    } else {
      console.log('Comment added');
    }
  };
  const handleUpvote = async (post: PostCardProps | null) => {
    if (!post) {
      console.error('Post not found');
      return;
    }
    const newUpVotes = post.up_votes + 1;
    const { error } = await supabase
      .from('post')
      .update({ up_votes: newUpVotes })
      .eq('id', id);

    if (!error) {
      setPost({ ...post, up_votes: newUpVotes });
    } else {
      console.error('Error updating upvotes:', error);
    }
  };


  const onSubmit = async (values: z.infer<typeof commnetFormSchema>) => {
    setCommentAdded(true);
    await insertComment(values, post);
    setCommentAdded(false);
  }
  const deletePost = async () => {
    const { error } = await supabase
      .from('post')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting post:', error);
    }
  }
  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('post')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching post:', error);
      } else {
        setPost(data);
      }
    };

    fetchPost();

  }, [id, commentAdded]);

  const form = useForm<z.infer<typeof commnetFormSchema>>({
    resolver: zodResolver(commnetFormSchema),
    defaultValues: {
      comment: "",
    },
  })

  if (!post) return <p className="text-gray-500">Loading...</p>;
  const createdDate = new Date(post.created_at);
  const today = new Date();
  const timeDiff = Math.abs(today.getTime() - createdDate.getTime());
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));


  return (
    <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center border-b pb-4">
          <Link to='/' className='text-black-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium'>
            Hobby Hub
          </Link>
          <Link to="/gallary"  className="text-black-300 hover:bg-grey-700 hober:text-white font-bold py-2 px-4 rounded">Back to Gallery</Link>
          <Link to='/create' className='text-black-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium'>
            Create a new Post
          </Link>
        </div>
      </div>
    <div className="flex flex-col items-left justify-center p-8">
      
      <div className="flex flex-col items-left justify-center" key={post.id}>
      
      <p  className="text-gray-600 mb-2">Posted {daysDiff} days ago </p>
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p  className="text-gray-700 mb-4"> {post.content}</p>
      <img src={post.url} className="w-64 h-auto mb-4" alt="Post" />
      <div className="flex items-center mb-4">
        <span className="text-gray-700 mr-2"> Upvotes : {post.up_votes}</span>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleUpvote(post)}
        >
          Upvote
        </button>
      </div>
      </div>
      <div className="bg-slate-300 space-y-8 p-5 ">    
      <Form {...form}>
        
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-500 font-bold mb-2" htmlFor="comment">Comment </FormLabel>
                <FormControl>
                  <Input  className="border border-gray-400 rounded py-2 px-3 w-full" placeholder="Enter Comment..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit"  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" >Submit</Button>
        </form>
      </Form>
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Comments:</h2>
          {post.comments?.length ? (
            post.comments.map((comment, index) => (
              <p key={index}  className="text-gray-700 mb-2">{comment}</p>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </div>
      <Link to={`/posts/${id}/edit`} className="mt-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Edit Post
        </button>
        <br />
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 max-w-sm"
        onClick={deletePost}
      >
        Delete Post
      </button>
    
     
      </Link>
      
    </div>
    </>
  );
};

export default PostDetails;
