import supabase from "@/utils/supabase";
import { redirect } from "react-router";

export async function guestLoader() {
  // 비로그인 상태일때만 접속 가능하도록
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    console.warn('이미 로그인 된 계정이 존재합니다');
    throw redirect('/');
  }
  return null;
}