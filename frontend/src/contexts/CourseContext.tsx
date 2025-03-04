import { Configuration, CourseControllerApi } from '../api/generated';

const config = new Configuration({
    basePath: `${import.meta.env.VITE_BACKEND_URL}`
});

export const courseApi = new CourseControllerApi(config);