import "../styles/profile.css";

function Profile() {
  return (
    <div className="profile-page">
      <h2>My Profile</h2>
      <p>Welcome to your profile page.</p>

      {/* Profile Card */}
      <div className="profile-card">
        <h3>Vishal Kumar</h3>
        <p>Email: vishal@gmail.com</p>
        <p>Phone: +91 XXXXXXXX</p>
        <button>Edit Profile</button>
      </div>

      {/* Recent Orders */}
      <div className="profile-section">
        <h3>Recent Orders</h3>
        <p>No recent orders yet.</p>
      </div>

      {/* Address */}
      <div className="profile-section">
        <h3>Saved Address</h3>
        <p>No address added.</p>
      </div>
    </div>
  );
}

export default Profile;