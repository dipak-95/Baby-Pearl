import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Search, Filter, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

const PhotoList = ({ type }) => {
    const [photos, setPhotos] = useState([]);
    const [filterType, setFilterType] = useState(''); // Month / Festival
    const [search, setSearch] = useState('');

    // Determine gender filter based on route type ('boy', 'girl', or 'all')
    const genderFilter = type === 'boy' || type === 'girl' ? type : '';

    useEffect(() => {
        fetchPhotos();
    }, [type, filterType]);

    const fetchPhotos = async () => {
        try {
            const params = {};
            if (genderFilter) params.gender = genderFilter;
            if (filterType) params.type = filterType;

            const res = await axios.get('http://localhost:5000/api/photos', { params });
            setPhotos(res.data);
        } catch (err) {
            toast.error('Failed to fetch photos');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this photo permanently?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/photos/${id}`);
            toast.success('Photo removed');
            fetchPhotos();
        } catch (err) {
            toast.error('Could not delete');
        }
    };

    const filtered = photos.filter(p =>
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.prompt.toLowerCase().includes(search.toLowerCase())
    );

    const getTitle = () => {
        if (type === 'boy') return 'Boy Photos';
        if (type === 'girl') return 'Girl Photos';
        return 'All Photos';
    };

    return (
        <div className="animate-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">{getTitle()}</h1>
                    <div style={{ color: 'var(--gray-600)', fontSize: 15, marginTop: 8 }}>Manage your photo collection</div>
                </div>
                <Link to="/photos/add" className="btn-primary">
                    <Plus size={18} /> Upload Photo
                </Link>
            </div>

            <div className="card">
                {/* Filters Toolbar */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: 12, top: 12 }} />
                        <input
                            placeholder="Search category or prompt..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ paddingLeft: 40 }}
                        />
                    </div>

                    {(type === 'boy' || type === 'girl') && (
                        <select onChange={(e) => setFilterType(e.target.value)} value={filterType} style={{ width: 'auto', minWidth: 150 }}>
                            <option value="">All Types</option>
                            <option value="month">Month</option>
                            <option value="festival">Festival</option>
                        </select>
                    )}

                    {type === 'all' && (
                        <div style={{ padding: 10, background: '#f3f4f6', borderRadius: 8, fontSize: 13, color: '#6b7280' }}>
                            Showing all genders
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th width="80">Photo</th>
                                <th>Category</th>
                                <th>Type</th>
                                {!genderFilter && <th>Gender</th>}
                                <th>Status</th>
                                <th>Likes</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(photo => (
                                <tr key={photo._id}>
                                    <td>
                                        <img src={photo.imageUrl} style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} alt="" />
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600, fontSize: 14 }}>{photo.category}</div>
                                        <div style={{ fontSize: 12, color: '#6b7280', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {photo.prompt}
                                        </div>
                                    </td>
                                    <td style={{ textTransform: 'capitalize' }}>{photo.type}</td>
                                    {!genderFilter && (
                                        <td style={{ textTransform: 'capitalize' }}>
                                            <span style={{
                                                background: photo.gender === 'boy' ? '#eff6ff' : '#fdf2f8',
                                                color: photo.gender === 'boy' ? '#3b82f6' : '#ec4899',
                                                padding: '4px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600
                                            }}>
                                                {photo.gender}
                                            </span>
                                        </td>
                                    )}
                                    <td>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 6,
                                            color: photo.status === 'active' ? '#10b981' : '#f59e0b',
                                            fontWeight: 500, fontSize: 13
                                        }}>
                                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }}></div>
                                            {photo.status}
                                        </span>
                                    </td>
                                    <td>{photo.likes}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', gap: 8 }}>
                                            <Link to={`/photos/edit/${photo._id}`} style={{ padding: 8, color: '#3b82f6', background: '#eff6ff', borderRadius: 6 }}>
                                                <Edit2 size={16} />
                                            </Link>
                                            <button onClick={() => handleDelete(photo._id)} style={{ padding: 8, color: '#ef4444', background: '#fef2f2', borderRadius: 6, border: 'none', cursor: 'pointer' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
                                        No photos found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PhotoList;
