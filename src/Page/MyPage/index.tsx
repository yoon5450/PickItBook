

import { setFilePreview } from "@/utils/setFilePreview";
import supabase from "@/utils/supabase";
import { useEffect, useRef, useState } from "react";
import { usePageEnterAnimation } from "./usePageEnterAnimation";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";




function MyPage() {

  const { email, nickname, created_at, profile_image, fetchUser, setNickname } = useProfileStore();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null >(null);
  

  const hrRef = useRef<HTMLHRElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLLabelElement>(null);

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const user = useAuthStore((s) => s.user);
  const provider = user?.app_metadata?.provider;



  usePageEnterAnimation(bannerRef, hrRef, avatarRef, formRef);


useEffect(() => {
  const init = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) fetchUser(user.id);
  };
  init();
}, [fetchUser]);


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

if (nickname) {
  await supabase.from("user_profile").update({ nickname }).eq("id", user.id);
  fetchUser(user.id);
}

  if (password || passwordConfirm) {
    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    const { error: pwError } = await supabase.auth.updateUser({ password });
    if (pwError) {
      alert("비밀번호 변경 실패: " + pwError.message);
      return;
    }
  }

    if (profileImage) {   
     const ext = profileImage?.name.includes(".") 
       ? profileImage!.name.split(".").pop()
       : "png";
     const filePath = `private/${user.id}.${ext}`;

     const { error: uploadError } = await supabase.storage
       .from("profile_image")
       .upload(filePath, profileImage, { upsert: true });

     if (!uploadError) {
       const { data } = supabase
         .storage.from("profile_image")
         .getPublicUrl(filePath);

         const cacheBustedUrl = `${data.publicUrl}?t=${Date.now()}`;

       await supabase
         .from("user_profile")
         .update({ profile_image: cacheBustedUrl })
         .eq("id", user.id);
     }
   }

    alert("프로필이 저장되었습니다.");
  };

async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0] ?? null;
  setProfileImage(file);

  if (file) {

    setFilePreview(file, setImagePreview);


    const confirmUpload = window.confirm("선택한 이미지를 프로필 사진으로 변경하시겠습니까?");
    if (!confirmUpload) return;


    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;


    const ext = file.name.includes(".")
      ? file.name.split(".").pop()
      : "png";

    const filePath = `private/${user.id}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("profile_image") 
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      alert("이미지 업로드 실패: " + uploadError.message);
      console.log("업로드 싶패");
      
      return;
    }

    const { data } = supabase.storage
      .from("profile_image")
      .getPublicUrl(filePath);
     
    const cacheBustedUrl = `${data.publicUrl}?t=${Date.now()}`;  

    const { error: updateError } = await supabase
      .from("user_profile")
      .update({ profile_image: cacheBustedUrl })
      .eq("id", user.id);

    if (updateError) {
      alert("프로필 갱신 실패: " + updateError.message);
      return;
    }

    fetchUser(user.id);

    alert("프로필 이미지가 변경되었습니다.");
  }
}
  
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-white">

       <div  ref={bannerRef}
       className="w-screen h-[474px] bg-center bg-cover bg-[url('/banner.jpg')]" 
       >
       </div>

      <label 
      ref={avatarRef} 
      htmlFor="profile-upload" 
      className="cursor-pointer relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onMouseMove={(e) =>
          setTooltipPos({ x: e.clientX, y: e.clientY })
        }
      >
        <img
          src={imagePreview || profile_image || "https://via.placeholder.com/250"}
          alt="Profile"
          className="-mt-[80px] w-[250px] h-[250px] rounded-full border-2 border-[var(--color-primary)] overflow-hidden mx-auto transition-transform duration-300 ease-in-out hover:scale-105"
        />
      </label>
      {showTooltip && (
         <div
           className="fixed text-sm text-black transition-opacity pointer-events-none z-[9999]"
           style={{
             top: tooltipPos.y + 16,
             left: tooltipPos.x + 16,
           }}
         >
           프로필 이미지 변경하기
         </div>
       )}


       <input
         id="profile-upload"
         type="file"
         accept="image/*"
         className="hidden"
         onChange={handleImageChange}
       />

      <hr
      ref={hrRef} 
      className="w-full max-w-[1200px] mx-auto my-18 border-t-1.5 border-[var(--color-primary-black)]" 
      />

      <form 
      ref={formRef}
      onSubmit={handleSave} 
      className="w-full max-w-[850px] flex flex-col gap-9 mx-auto mb-27"
      >
        <div className="flex gap-[50px]">
          <div className="flex flex-col w-[400px]">
            <label className="text-base mb-1.5">Nick Name</label>
            <input
              type="text"
              placeholder="닉네임을 입력하세요"
              value={nickname ?? ""}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full h-[50px] border border-[var(--color-primary-black)] rounded px-4"
            />
          </div>
          <div className="flex flex-col w-[400px]">
            <label className="text-base mb-1.5">가입일</label>
            <span className="h-[50px] flex items-center px-2 text-gray-700 border border-[var(--color-background-gray)] rounded bg-gray-200">
              {created_at
                ? new Date(created_at).toLocaleDateString()
                : "-"}
            </span>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <label className="text-base mb-1.5">Email</label>
          <span className="h-[50px] flex items-center px-2 text-gray-700 border border-[var(--color-background-gray)] rounded bg-gray-200">
            {email ?? "-"}
          </span>
        </div>
        <div className="flex gap-[50px]">
          <div className="flex flex-col w-[400px]">
            <label className="text-base mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              placeholder="비밀번호를 입력하세요"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[50px] border border-[var(--color-background-gray)] rounded px-4"
            />
          </div>
          <div className="flex flex-col w-[400px]">
            <label className="text-base mb-1.5">Password Confirm</label>
            <input
              type="password"
              value={passwordConfirm}
              placeholder="비밀번호 확인"
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full h-[50px] border border-[var(--color-background-gray)] rounded px-4"
            />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-base mb-2">Linked Accounts</p>
            <div className="flex gap-4 text-2xl">
              {provider === "google" && (
                <img src="/google_icon.svg" alt="Google" className="w-[30px] h-[30px]" />
              )}
              {provider === "github" && (
                <img src="/git_icon.svg" alt="Github" className="w-[30px] h-[30px]" />
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-[130px] h-[45px] rounded bg-[var(--color-primary)] text-white font-medium shadow"
          >
            저장하기
          </button>
        </div>
      </form>
    </div>
  );
}

export default MyPage;
