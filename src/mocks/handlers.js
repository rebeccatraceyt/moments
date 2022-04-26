import { rest } from "msw";

// grab API base url for mock responses
const baseURL = "https://rebeccatraceyt-drf-api.herokuapp.com/"

// export array to store mocked request handlers
export const handlers = [
    // mock response for GET request for user object
    rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
        return res(
            // mock json user object
            ctx.json({
                pk: 1,
                username: "bec",
                email: "",
                first_name: "",
                last_name: "",
                profile_id: 1,
                profile_image: "https://res.cloudinary.com/dzpax11dy/image/upload/v1/media/images/avatar_2_ged0n8"
            })
        );
    }),

    // mock logout response
    rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
        return res(ctx.status(200));
    }),
]
