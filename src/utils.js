import { axiosReq } from "./api/axiosDefaults"

export const fetchMoreData = async (resource, setResource) => {
    // two arguements allow rendering and updating of different types of data for the InfiniteScroll component
    // for example, resource and setResource could be posts and setPosts or comments and setComments

    try{
        // make network request to resource.next which is the url for the next page of results
        const {data} = await axiosReq.get(resource.next);

        // if there is no error, call setResource and pass callback function with prevResource as arguement
        // the callback function will return an object where:
        //      - spread prevResource
        //      - update the next attribute of the URL to the next page of results
        //      - update the results array to include newly fetched results, appending them to the existing ones the state is rendering for the user

        setResource(prevResource => ({
            ...prevResource,
            next:data.next,
            // 1. reduce method loops through new page of results from API
            results: data.results.reduce((acc, cur) => {
                // With so many users adding/removing posts, the results can produce duplicate on pages, before reload.
                // to stop this, we need to filter duplicates:
                //      some() method checks if the callback passed to it returns true, for atleast one element in the array
                //      if it does, the method stops
                //      using it to check if any post IDs in the newly fetched data matchs an existig id in previous results
                //      if the some() method finds a match, return the exisitng accumulator (acc) to the reduce method
                //      if it doesn't, it is a new post and the spread accumulator can be returned

                // 4. use some() method to loop through the array of posts in the accumulator
                // 5. compare each accumulator item id to the current post id from the newly fetched posts array
                // 6. if some() returns true, it means it found a post that is already being displayed - return acc without the post
                // 7. if some() returns false, it means its a new post - return an array containing spread accumulator with the new post
                return acc.some(accResult => accResult.id === cur.id)
                    ? acc 
                    : [...acc, cur]
            }, prevResource.results)
            // 2. append new results to existing posts (prevResource) in post.results array in the state
        }));
    } catch(err){
        console.log(err)
    }
}