import type { PageLoad } from './$types';
import axios from '../../axios.config';

export const load = (async () => {
    const blog = await axios.get('/blog')
    console.log(blog);
    
    return {blog};
}) satisfies PageLoad;