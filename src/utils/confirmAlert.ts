import Swal from "sweetalert2";

type ConfirmAlertOptions = {
  title: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: "warning" | "error" | "info" | "success" | "question";
  confirmButtonColor?: string;
};

// 경고  
export function showConfirmAlert({
  title,
  text = "",
  confirmText = "확인",
  cancelText = "취소",
  icon = "warning",
  confirmButtonColor = "#3B82F6", 
}: ConfirmAlertOptions) {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor,
  });
}

// 저장 성공 전용
export function showSuccessAlert(title: string, text?: string) {
  return Swal.fire({
    title,
    text,
    icon: "success",
    confirmButtonText: "확인",
    confirmButtonColor: "#3B82F6",
  });
}