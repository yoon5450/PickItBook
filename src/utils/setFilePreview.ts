
/**
 * @description 이미지 파일을 프리뷰할수 있는 형식으로 변경하고 setState콜백을 실행합니다.
 * @param imageFile 이미지 파일
 * @param setterCallback state 콜백
 * @returns void
 */

export const setFilePreview = (
  imageFile: File,
  setterCallback: (
    value: React.SetStateAction<string | null | undefined>
  ) => void
) => {
  if (imageFile) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setterCallback(reader.result as string);
    };
    reader.readAsDataURL(imageFile);
  } else {
    setterCallback(null);
  }
};




/**
function handleImageChange(e:React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setFeedImage(file);
    if(file) setFilePreview(file, setImagePreview);
  }

          <label htmlFor={previewId} className={S.addImgBtn}>
            <img src={imagePreview ? imagePreview : imgIcon} width={'40px'}/>
          </label>          
<input
            id={previewId}
            name={previewId}
            aria-label="클립 이미지 업로드"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
 */