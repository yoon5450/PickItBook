import type { TemplateItem } from "@/@types/global";
import supabase from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";


async function fetchMissionDetailByTemplateID(templateID: string): Promise<TemplateItem[]> {
  const { data, error } = await supabase
    .from('task_templates')
    .select('*')
    .eq('id', templateID)

  if (error) throw error;
  return data;
}


export const useGetMissionDetailByTemplateID = (templateID: string) => {

  return useQuery({
    queryKey: ['missionDetail', templateID],
    queryFn: () => fetchMissionDetailByTemplateID(templateID),
    enabled: !!templateID,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 0,
  })
}
