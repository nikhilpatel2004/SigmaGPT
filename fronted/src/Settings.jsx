import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "./AuthContext.jsx";
import "./Settings.css";

export function Settings({ onClose }) {
  const { user, logout, updateProfile } = useContext(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [editableName, setEditableName] = useState(user?.name || "");
  const [photoPreview, setPhotoPreview] = useState(user?.photoURL || "");
  const fileInputRef = useRef(null);

  useEffect(() => {
    setEditableName(user?.name || "");
    setPhotoPreview(user?.photoURL || "");
  }, [user]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
    updateProfile({ photoURL: url });
  };

  const handleSave = () => {
    if (!user) {
      alert("Please sign in to save profile changes.");
      return;
    }
    updateProfile({ name: editableName });
    onClose();
  };

  return (
    <div className="settingsOverlay" onClick={onClose}>
      <div className="settingsPanel" onClick={(e) => e.stopPropagation()}>
        <div className="settingsHeader">
          <h2>Settings</h2>
          <button className="closeButton" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="settingsSection">
          <h3>Account</h3>
          {user ? (
            <div className="profileForm">
              <div className="userProfile">
                <div className="userAvatar">
                  {photoPreview ? (
                    <img src={photoPreview} alt={editableName || "User"} />
                  ) : (
                    <i className="fa-solid fa-user"></i>
                  )}
                </div>
                <div className="userInfo">
                  <input
                    className="textInput"
                    value={editableName}
                    onChange={(e) => setEditableName(e.target.value)}
                    placeholder="Display name"
                  />
                  <p className="userEmail">{user.email}</p>
                </div>
              </div>

              <div className="uploadRow">
                <button className="uploadButton" onClick={() => fileInputRef.current?.click()}>
                  <i className="fa-solid fa-camera"></i> Upload photo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handlePhotoChange}
                />
              </div>

              <button className="saveButton" onClick={handleSave}>
                Save changes
              </button>
            </div>
          ) : (
            <p className="userEmail">Sign in to edit your profile.</p>
          )}
        </div>

        <div className="settingsSection">
          <h3>Appearance</h3>
          <div className="themeOptions">
            <label className="themeOption">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === "dark"}
                onChange={(e) => handleThemeChange(e.target.value)}
              />
              <span>
                <i className="fa-solid fa-moon"></i> Dark
              </span>
            </label>
            <label className="themeOption">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === "light"}
                onChange={(e) => handleThemeChange(e.target.value)}
              />
              <span>
                <i className="fa-solid fa-sun"></i> Light
              </span>
            </label>
          </div>
        </div>

        <div className="settingsSection">
          <h3>About</h3>
          <div className="aboutInfo">
            <p>SigmaGPT v1.0</p>
            <p className="smallText">AI-powered chat assistant</p>
          </div>
        </div>

        {user && (
          <div className="settingsFooter">
            <button className="logoutButton" onClick={handleLogout}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
