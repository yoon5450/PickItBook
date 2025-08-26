
import { setFilePreview } from "@/utils/setFilePreview";
import supabase from "@/utils/supabase";
import { useEffect, useState } from "react";

function MyPage() {
  const [profile, setProfile] = useState<{
    nickname: string;
    email: string;
    created_at: string;
  } | null>(null);

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);


  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_profile")
        .select("nickname, email, created_at,profile_image")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile(data);
      }
    };

    fetchProfile();
  }, []);


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (profile?.nickname) {
      const { error } = await supabase
        .from("user_profile")
        .update({ nickname: profile.nickname })
        .eq("id", user.id);

      if (error) {
        alert("닉네임 업데이트 실패");
        console.error(error);
        return;
      }
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
     const ext = profileImage.name.split(".").pop();
     const filePath = `private/${user.id}-${Date.now()}.${ext}`;

     const { error: uploadError } = await supabase.storage
       .from("profile_image")
       .upload(filePath, profileImage, { upsert: true });

     if (!uploadError) {
       const { data: { publicUrl } } = supabase
         .storage.from("profile_image")
         .getPublicUrl(filePath);

       await supabase
         .from("user_profile")
         .update({ profile_image: publicUrl })
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


    const filePath = `private/${user.id}-${Date.now()}.png`;
    const { error: uploadError } = await supabase.storage
      .from("profile_image") 
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      alert("이미지 업로드 실패: " + uploadError.message);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("profile_image")
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("user_profile")
      .update({ profile_image: publicUrl })
      .eq("id", user.id);

    if (updateError) {
      alert("프로필 갱신 실패: " + updateError.message);
      return;
    }

    setProfile(prev => prev ? { ...prev, profile_image: publicUrl } : prev);

    alert("프로필 이미지가 변경되었습니다.");
  }
}
  
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-white">

       <div className="w-screen h-[474px] bg-center bg-cover" style={{ backgroundImage: "url('/banner.jpg')" }}>
       </div>

      <label htmlFor="profile-upload" className="cursor-pointer">
        <img
          src={imagePreview || profile?.profile_image || "https://via.placeholder.com/250"}
          alt="Profile"
          className="-mt-[80px] w-[250px] h-[250px] rounded-full border-2 border-[var(--color-primary)] overflow-hidden mx-auto"
        />
      </label>
       <input
         id="profile-upload"
         type="file"
         accept="image/*"
         className="hidden"
         onChange={handleImageChange}
       />

      <hr className="w-full max-w-[1200px] mx-auto my-18 border-t border-[var(--color-primary-black)]" />

      <form onSubmit={handleSave} className="w-full max-w-[850px] flex flex-col gap-9 mx-auto mb-27">
        <div className="flex gap-[50px]">
          <div className="flex flex-col w-[400px]">
            <label className="text-base mb-1.5">Nick Name</label>
            <input
              type="text"
              value={profile?.nickname ?? ""}
              onChange={(e) =>
                setProfile((prev) =>
                  prev ? { ...prev, nickname: e.target.value } : prev
                )
              }
              className="w-full h-[50px] border border-[var(--color-primary-black)] rounded px-4"
            />
          </div>
          <div className="flex flex-col w-[400px]">
            <label className="text-base mb-1.5">가입일</label>
            <span className="h-[50px] flex items-center px-2 text-gray-700 border border-[var(--color-background-gray)] rounded bg-gray-200">
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString()
                : "-"}
            </span>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <label className="text-base mb-1.5">Email</label>
          <span className="h-[50px] flex items-center px-2 text-gray-700 border border-[var(--color-background-gray)] rounded bg-gray-200">
            {profile?.email ?? "-"}
          </span>
        </div>
        <div className="flex gap-[50px]">
          <div className="flex flex-col w-[400px]">
            <label className="text-base mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[50px] border border-[var(--color-background-gray)] rounded px-4"
            />
          </div>
          <div className="flex flex-col w-[400px]">
            <label className="text-base mb-1.5">Password Confirm</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full h-[50px] border border-[var(--color-background-gray)] rounded px-4"
            />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-base mb-2">Linked Accounts</p>
            <div className="flex gap-4 text-2xl">
              <img src="/google_icon.svg" alt="Google" className="w-[30px] h-[30px]" />
              <img src="/git_icon.svg" alt="Github" className="w-[30px] h-[30px]" />
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
