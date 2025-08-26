import supabase from "@/utils/supabase"
import Button from "./Button";

function Logout() {

  const handleLogout = async () => {
    await supabase.auth.signOut();
  }
  return (
    <Button onClick={handleLogout}>
      <p className="text-white">Logout</p>
    </Button>
  )
}
export default Logout