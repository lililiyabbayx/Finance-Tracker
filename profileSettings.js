import React from 'react';

const ProfileSettings = () => (
  <div>
    <h2>Profile Settings</h2>
    <form>
      <label>
        Default Currency:
        <input type="text" name="currency" />
      </label>
      <br />
      <label>
        Notifications:
        <input type="checkbox" name="notifications" />
      </label>
      <br />
      <button type="submit">Save Changes</button>
    </form>
  </div>
);

export default ProfileSettings;
