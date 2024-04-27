import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import postFormSchema from "@/schemas/formSchema"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"; 
import supabaseInstance from "../contexts/supabaseInstance"

const CreatePost = () => {
    const navigate = useNavigate();
    const supabase = supabaseInstance()

    const insertPost = async (formData: z.infer<typeof postFormSchema>) => {
        const { error } = await supabase
          .from('post')
          .insert(formData)
        if (error) {
            console.error('Insert error:', error);
        }
        else{
            navigate('/gallary')       
        }
      }
    const form = useForm<z.infer<typeof postFormSchema>>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
        title: "",
        content: "",
        url: "",
        comments: [],
    },
    })
    const onSubmit = async (values: z.infer<typeof postFormSchema>) => {
        await insertPost(values);
    }

return(
  <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center border-b pb-4">
          <Link to='/' className='text-black-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium'>
            Hobby Hub
          </Link>
          <Link to='/create' className='text-black-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium'>
            Create a new Post
          </Link>
        </div>
      </div>
    <div style={{display: 'flex' , flexDirection:'column', alignContent: 'center', alignItems: 'center'}}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-500 font-bold">Title </FormLabel>
                <FormControl>
                  <Input placeholder="Enter Title" {...field} />
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
                <FormLabel>Image URL </FormLabel>
                <FormControl>
                  <Input placeholder="Enter URL..." {...field} />
                </FormControl>
              
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  </>
)
}

export default CreatePost;