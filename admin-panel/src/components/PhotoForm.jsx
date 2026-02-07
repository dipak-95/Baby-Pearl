import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { toast } from 'react-toastify';
import { UploadCloud, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { PHOTOS_API } from '../config/api';

const UploadPhoto = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        category: '',
        prompt: '',
        gender: 'boy',
        type: 'month',
        keywords: '',
        imageUrl: '',
        status: 'active'
    });

    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        if (isEdit) fetchPhoto();
    }, [id]);

    useEffect(() => {
        if (imageFile) setPreviewUrl(URL.createObjectURL(imageFile));
        else if (formData.imageUrl) setPreviewUrl(formData.imageUrl);
    }, [imageFile, formData.imageUrl]);

    const fetchPhoto = async () => {
        try {
            const res = await axios.get(`${PHOTOS_API}/${id}`);
            const photoData = res.data;
            if (photoData.keywords && Array.isArray(photoData.keywords)) {
                photoData.keywords = photoData.keywords.join(', ');
            }
            setFormData(photoData);
        } catch (err) {
            toast.error('Error fetching details');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'type') {
            // Reset category when Event Type changes to avoid mixing
            setFormData({ ...formData, type: value, category: '' });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) setImageFile(e.target.files[0]);
    };

    const uploadImage = async () => {
        if (!imageFile) return formData.imageUrl;
        const storageRef = ref(storage, `photos/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        return await getDownloadURL(storageRef);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            let url = formData.imageUrl;
            if (imageFile) url = await uploadImage();
            else if (!url && !isEdit) {
                toast.error('Please upload a photo');
                setUploading(false);
                return;
            }

            const payload = { ...formData, imageUrl: url };

            if (isEdit) {
                await axios.put(`${PHOTOS_API}/${id}`, payload);
                toast.success('Photo updated successfully');
            } else {
                await axios.post(PHOTOS_API, payload);
                toast.success('Photo uploaded successfully');
            }
            navigate('/photos');
        } catch (err) {
            toast.error('Failed to save');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ width: '100%', padding: '30px 40px' }}>
            <div style={{ marginBottom: 30 }}>
                <button onClick={() => navigate(-1)} style={{ background: 'white', border: '1px solid #e5e7eb', color: '#6b7280', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: 10, fontSize: 13, padding: '8px 16px', borderRadius: 8 }}>
                    <ArrowLeft size={16} /> Back
                </button>
                <h1 style={{ fontSize: 28, margin: 0, color: '#1f2937' }}>{isEdit ? 'Edit Photo Details' : 'Upload New Photo'}</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ maxWidth: 800, margin: '0 auto', background: 'white', padding: 40, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>

                    {/* 1. Gender & Type */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 25 }}>
                        <div>
                            <label>Gender Category</label>
                            <select name="gender" value={formData.gender} onChange={handleChange}>
                                <option value="boy">Boy</option>
                                <option value="girl">Girl</option>
                            </select>
                        </div>
                        <div>
                            <label>Event Type</label>
                            <select name="type" value={formData.type} onChange={handleChange}>
                                <option value="month">Month Milestone</option>
                                <option value="festival">Festival</option>
                                <option value="professional">Professional Photography</option>
                            </select>
                        </div>
                    </div>

                    {/* 2. Category Dropdown (Dynamic) */}
                    <div style={{ marginBottom: 25 }}>
                        <label>
                            {formData.type === 'month' ? 'Select Month' :
                                formData.type === 'festival' ? 'Select Festival' :
                                    'Category Name'}
                        </label>
                        {formData.type === 'professional' ? (
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="e.g., Outdoor, Studio, Newborn"
                                required
                                style={{ fontSize: 16 }}
                            />
                        ) : (
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                style={{ fontSize: 16 }}
                            >
                                <option value="">-- Select {formData.type === 'month' ? 'Month' : 'Festival'} --</option>
                                {formData.type === 'month' ? (
                                    <>
                                        <option value="1 Month">1 Month</option>
                                        <option value="2 Month">2 Month</option>
                                        <option value="3 Month">3 Month</option>
                                        <option value="4 Month">4 Month</option>
                                        <option value="5 Month">5 Month</option>
                                        <option value="6 Month">6 Month</option>
                                        <option value="Half Birthday">Half Birthday</option>
                                        <option value="7 Month">7 Month</option>
                                        <option value="8 Month">8 Month</option>
                                        <option value="9 Month">9 Month</option>
                                        <option value="10 Month">10 Month</option>
                                        <option value="11 Month">11 Month</option>
                                        <option value="12 Month">12 Month</option>
                                        <option value="1st Birthday">1st Birthday</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="Makar Sankranti">Makar Sankranti</option>
                                        <option value="Maha Shivratri">Maha Shivratri</option>
                                        <option value="Holi">Holi</option>
                                        <option value="Janmashtami">Janmashtami</option>
                                        <option value="Diwali">Diwali</option>
                                        <option value="New Year">New Year</option>
                                        <option value="Navratri">Navratri</option>
                                        <option value="Ganesh Chaturthi">Ganesh Chaturthi</option>
                                        <option value="Christmas">Christmas</option>
                                        <option value="Raksha Bandhan">Raksha Bandhan</option>
                                        <option value="Independence Day">Independence Day</option>
                                        <option value="Republic Day">Republic Day</option>
                                    </>
                                )}
                            </select>
                        )}
                    </div>

                    {/* 3. AI Prompt */}
                    <div style={{ marginBottom: 25 }}>
                        <label>AI Prompt Description</label>
                        <textarea
                            name="prompt"
                            value={formData.prompt}
                            onChange={handleChange}
                            rows="6"
                            placeholder="Enter the full AI prompt used to generate this image..."
                            style={{ resize: 'vertical', lineHeight: 1.6 }}
                            required
                        ></textarea>
                        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 5 }}>This prompt will be shown to users</div>
                    </div>

                    {/* 4. Keywords */}
                    <div style={{ marginBottom: 25 }}>
                        <label>Keywords (for search)</label>
                        <input
                            name="keywords"
                            value={formData.keywords}
                            onChange={handleChange}
                            placeholder="e.g. baby, cute, birthday, celebration, colorful"
                            style={{ fontSize: 16 }}
                        />
                        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 5 }}>Separate multiple keywords with commas - helps users find this photo</div>
                    </div>

                    {/* 5. Photo Upload */}
                    <div style={{ marginBottom: 30 }}>
                        <label style={{ marginBottom: 15, display: 'block', fontWeight: 600 }}>Upload Photo</label>

                        <label style={{
                            border: previewUrl ? 'none' : '2px dashed #d1d5db',
                            padding: previewUrl ? 0 : 40,
                            cursor: 'pointer',
                            display: 'block',
                            borderRadius: 12,
                            textAlign: 'center',
                            transition: 'all 0.2s'
                        }}>
                            <input type="file" onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />

                            {previewUrl ? (
                                <div style={{ width: '100%', height: 400, borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
                                    <img src={previewUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="Preview" />
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'rgba(0,0,0,0.6)',
                                        opacity: 0,
                                        transition: '0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: 16
                                    }}
                                        onMouseOver={e => e.currentTarget.style.opacity = 1}
                                        onMouseOut={e => e.currentTarget.style.opacity = 0}
                                    >
                                        <UploadCloud size={24} style={{ marginRight: 8 }} />
                                        Click to change photo
                                    </div>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '40px 20px' }}>
                                    <ImageIcon size={48} style={{ margin: '0 auto 15px', opacity: 0.5 }} />
                                    <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 5, color: '#374151' }}>Click to upload photo</div>
                                    <div style={{ fontSize: 13 }}>PNG, JPG up to 10MB</div>
                                </div>
                            )}
                        </label>
                    </div>

                    {/* 6. Submit Buttons */}
                    <div style={{ display: 'flex', gap: 15, justifyContent: 'flex-end', paddingTop: 20, borderTop: '1px solid #e5e7eb' }}>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            style={{
                                background: 'white',
                                border: '1px solid #d1d5db',
                                color: '#6b7280',
                                padding: '12px 24px',
                                borderRadius: 8,
                                cursor: 'pointer',
                                fontSize: 15,
                                fontWeight: 500
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            style={{
                                background: uploading ? '#9ca3af' : '#3b82f6',
                                color: 'white',
                                border: 'none',
                                padding: '12px 32px',
                                borderRadius: 8,
                                cursor: uploading ? 'not-allowed' : 'pointer',
                                fontSize: 15,
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                            }}
                        >
                            <Save size={18} />
                            {uploading ? 'Uploading...' : (isEdit ? 'Update Photo' : 'Upload Photo')}
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
};

export default UploadPhoto;
