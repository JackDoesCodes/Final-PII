import "../styles/style.css";

function AdminPanel() {

  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  return (
    <div>
      <div id="header">
        <h1>Panel de admin</h1>
      </div>
      <div id="content"></div>
    </div>
  );
}

export default AdminPanel;
