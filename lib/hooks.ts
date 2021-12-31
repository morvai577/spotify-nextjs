/*
 * Helper functions for API calls related to SWR and fetcher
 * Contains custom defined hooks
 * */

import useSWR from "swr";
import fetcher from "./fetcher";

// Can use this custom hook to get any information about the current user
export const useMe = () => {
  const { data, error } = useSWR("/me", fetcher);

  return {
    user: data,
    isLoading: !data && !error,
    isError: error,
  };
};

// Can use this custom hook to only have one call for getting playlist data
export const usePlaylist = () => {
  const { data, error } = useSWR("/playlist", fetcher);

  return {
    playlists: (data as any) || [],
    isLoading: !data && !error,
    isError: error,
  };
};
