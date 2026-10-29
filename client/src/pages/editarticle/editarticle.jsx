import '../createarticle/createarticle.scss' 
import Nav_menu from '../../components/navmenu/navmenu'
import Footer from '../../components/footer/footer'
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = 'http://localhost:3001';

// Тот же обработчик изображений
const imageHandler = (quillRef, setUploading) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
        const file = input.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const res = await axios.post(`${API_URL}/api/upload`, formData);
            const imageUrl = res.data.url;
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', imageUrl);
        } catch (err) {
            console.error(err);
            alert('Ошибка загрузки изображения');
        } finally {
            setUploading(false);
        }
    };
};

export default function EditArticle() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [coverPreview, setCoverPreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [loading, setLoading] = useState(true);
    const quillRef = useRef(null);
    const coverInputRef = useRef(null);

    const modules = {
        toolbar: {
            container: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: () => imageHandler(quillRef, setUploading)
            }
        }
    };

    // Загрузка существующей статьи
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/articles/${id}`);
                const article = res.data;
                setTitle(article.title);
                setDescription(article.description || '');
                setType(article.type || '');
                setContent(article.content || '');
                if (article.cover) {
                    setCoverImage(article.cover);
                    setCoverPreview(article.cover);
                }
            } catch (err) {
                console.error(err);
                alert('Не удалось загрузить статью');
                navigate('/newslist');
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id, navigate]);

    // Загрузка обложки
    const handleCoverUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        setUploadingCover(true);
        try {
            const res = await axios.post(`${API_URL}/api/upload`, formData);
            const url = res.data.url;
            setCoverImage(url);
            setCoverPreview(url);
        } catch (err) {
            console.error(err);
            alert('Не удалось загрузить обложку');
        } finally {
            setUploadingCover(false);
        }
    };

    const removeCover = () => {
        setCoverImage('');
        setCoverPreview('');
        if (coverInputRef.current) coverInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim() || !description.trim() || !type.trim() || !coverImage) {
            alert('Заполните все поля и загрузите обложку');
            return;
        }
        try {
            await axios.put(`${API_URL}/api/articles/${id}`, {
                title,
                description,
                type,
                content,
                cover: coverImage
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Статья успешно обновлена!');
            navigate('/newslist');
        } catch (err) {
            console.error('Ошибка при обновлении:', err);
            if (err.response) {
                alert(`Ошибка: ${err.response.data.error || err.response.status}`);
            } else {
                alert('Ошибка обновления: ' + err.message);
            }
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Загрузка...</div>;

    return (
        <>
            <Nav_menu/>
            <section className='createa_space'>
                <div className='createa_form'>
                    <h1 className='createa_title'>Редактировать статью</h1>
                    <form onSubmit={handleSubmit}>
                        <input 
                            className='createa_title_space' 
                            type="text" 
                            placeholder="Заголовок статьи" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <input 
                            className='createa_title_space' 
                            type="text" 
                            placeholder="Краткое описание" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <div className='createa_double'>
                            <div className={`createa_cover ${coverPreview ? 'has-cover' : ''}`}>
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>Обложка статьи</label>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    onChange={handleCoverUpload}
                                    ref={coverInputRef}
                                    style={{ marginBottom: '10px' }}
                                />
                                {uploadingCover && <p>Загрузка обложки...</p>}
                                {coverPreview && (
                                    <div style={{ marginTop: '10px' }}>
                                        <img src={coverPreview} alt="Обложка" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                                        <button type="button" onClick={removeCover} style={{ marginLeft: '10px', padding: '4px 8px' }}>Удалить</button>
                                    </div>
                                )}
                            </div>

                            <div className='createa_type'>
                                <label>Выберите тип</label>
                                <select value={type} onChange={(e) => setType(e.target.value)} required>
                                    <option value="" disabled>Выберите тип</option>
                                    <option value="Девлог">Девлог</option>
                                    <option value="Трейлер">Трейлер</option>
                                </select>
                            </div>
                        </div>

                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            modules={modules}
                            placeholder="Введите текст статьи..."
                            className='createa_textt'
                        />

                        <button type="submit" disabled={uploading || uploadingCover} className='createa_button'>
                            {uploading || uploadingCover ? 'Загрузка...' : 'Сохранить изменения'}
                        </button>
                    </form>
                </div>
            </section>
            <Footer/>
        </>
    );
}