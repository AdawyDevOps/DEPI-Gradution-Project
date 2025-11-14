// في components/Profile.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    daily_calorie_goal: user?.daily_calorie_goal || '',
    weight: user?.weight || '',
    height: user?.height || '',
    age: user?.age || '',
    gender: user?.gender || 'male'
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      alert('تم تحديث البيانات بنجاح!');
    }
  };

  return (
    <div className="profile-page">
      <h1>الملف الشخصي</h1>
      <form onSubmit={handleUpdate}>
        {/* أضف حقول الإدخال هنا */}
      </form>
    </div>
  );
};

export default Profile;
