import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import supabase from "@/utils/supabase";
import { useEffect } from "react";

export function useAuthInit() {
  // auth
  // 명시적 selector
  const setAuth = useAuthStore((s) => s.setAuth);
  const setAuthStatus = useAuthStore((s) => s.setAuthStatus);
  const setLastProvider = useAuthStore((s) => s.setLastProvider);
  const resetAuth = useAuthStore((s) => s.resetAuth);

  // user_profile
  const resetProfile = useProfileStore((s) => s.resetProfile);
  const fetchUser = useProfileStore((s) => s.fetchUser);

  useEffect(() => {
    setAuthStatus('loading')
    let unsub: { unsubscribe: () => void } | undefined;

    const init = async () => {
      try {
        const [{ data: { user } }, { data: { session } }] = await Promise.all([
          // 서버에서 사용자 정보 얻기
          supabase.auth.getUser(),
          // 세션(로컬)에 저장된 사용자 정보 얻기
          supabase.auth.getSession(),
        ]);

        // 사용자 정보를 auth에 반영
        setAuth({ user: user ?? null, session: session ?? null });

        // 유저가 존재하고 id가 존재한다면 프로필도 가져오기
        if (user?.id) {
          fetchUser(user.id)
        }

        // authState를 유저 존재여부에 따라 인가된 사용자 / 게스트로 설정
        setAuthStatus(user ? "authed" : "guest");


        // auth 이벤트 구독
        const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
          try {
            // 1. 로그아웃 이벤트 발생시
            if (event === 'SIGNED_OUT') {
              // ouath 버튼 클릭할때 임시로 기록해둔 pending 삭제
              localStorage.removeItem('pending_provider');

              // 프로필 초기화
              resetProfile();

              // auth 초기화
              resetAuth();

              setAuthStatus('guest')
              return
            }

            // 2. 로그인 직후 || 초기 세션 
            if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
              // 스토리지에 저장된 임시 기록(pending_provider)으로 이전 로그인 기록(provider) 업데이트 
              const provider = localStorage.getItem('pending_provider') as 'google' | 'github' | null;
              if (provider) {
                setLastProvider(provider);
                // 업데이트 후 임시 기록 삭제
                localStorage.removeItem('pending_provider');
              }
              // 세션이 존재한다면 유저 프로필 데이터 패치
              if (newSession) {
                setAuthStatus('authed')
                fetchUser(newSession.user.id)
              }

              return
            }

            // 3. 그 외 이벤트
            const user = newSession?.user ?? null;
            setAuth({ user, session: newSession ?? null });

            // 유저가 존재하지 않는다면 모두 초기화
            if (!user) {
              setAuthStatus('guest')
              resetProfile()
            }
          } catch (err) {
            console.error('auth state change failed', err);
            if (useAuthStore.getState().authStatus === "loading") setAuthStatus('guest');
          }
        })

        // onAuthStateChange 이벤트 구독 할당
        unsub = data.subscription;

      } catch (err) {
        console.error('auth 초기화 실패', err)
        setAuthStatus('guest');
        resetAuth();
        resetProfile();
      } finally {
        if (useAuthStore.getState().authStatus === "loading") setAuthStatus('guest')
      }

    }
    init();

    // 컴포넌트 unmount될때 구독해지
    return () => unsub?.unsubscribe();
  }, [setAuth, setAuthStatus, resetAuth, resetProfile, fetchUser])
}