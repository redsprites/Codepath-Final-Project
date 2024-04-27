import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import supabaseInstance from "@/contexts/supabaseInstance";
import { PostCardProps } from '../interfaces';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const PostEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostCardProps |null >(null);
  const supabase = supabaseInstance();

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
  }, [id]);
    const formSchema = z.object({
        title : z.string().min(2, {
        message: "name must be at least 2 characters.",
        }),
        content : z.string(),
        url : z.string()
    })
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: "",
        content: "",
        url: "",
    },
    })
    const handleEdit = async (formData: z.infer<typeof formSchema>)  => {

    console.log("Editing...");
    const { data } = await supabase
    .from('post')
    .update(formData)
    .match({ id: id })
  console.log(data)


    navigate(`/posts/${id}`);
  };

  const handleDelete =async ()  => {
    console.log("Deleting...");
    const {data, error } = await supabase.from('post').delete().match({id: id})
    if(data){
        console.log(data)
    }
    if(error){
        console.error(error)
    } 
    navigate("/gallary");
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div style={{display: 'flex' , flexDirection:'column', alignContent: 'center', alignItems: 'center'}}>
      <Link to="/gallary"><Button>Back to Gallery </Button></Link>
      <h1>Update Your Post</h1>
      <h3> Current Post Info:</h3>
      <p> {post.title}</p>
      <p>{post.content}</p>
      <p>Image Url: {post.url}</p>
      <p>Created at: {new Date(post.created_at).toLocaleDateString()}</p>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-blue-500 font-bold">Title </FormLabel>
              <FormControl>
                <Input placeholder="Enter Title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({field}) => (
            <FormItem>
              <FormLabel className="text-blue-500 font-bold">Content </FormLabel>
                <FormControl>
                    <Input type="string" placeholder="Enter content" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
<FormField
  control={form.control}
  name="url"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Image Url </FormLabel>
      <FormControl>
      <Input placeholder="Enter Image Url..." {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
      <Button type="submit">Update Post</Button> {'    '}
      <Button onClick={handleDelete}>Delete Post</Button>
      </form>
    </Form>
    </div>
  );
};

export default PostEdit;
