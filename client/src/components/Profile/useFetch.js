import Axios from "axios";
import { useEffect, useState } from "react";

const useFetch = (url, options = {}) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    if (url === undefined) {
        setError("URL is required");
    }

    url = "http://localhost:3001" + url;


    useEffect(() => {
        const controller = new AbortController();

        if (options && options.method && options.method === "POST" && options.data) {
            Axios.post(url, options.data, { signal: controller.signal })
                .then((response) => {
                    setData(response.data);
                    setIsPending(false);
                })
                .catch((error) => {
                    setError(error);
                });

        } else {
            Axios.get(url, { signal: controller.signal })
                .then((response) => {
                    setData(response.data);
                    setIsPending(false);
                })
                .catch((error) => {
                    setError(error);
                });
        }


    }, [url, options]);

    return { data, isPending, error };
}

export default useFetch;