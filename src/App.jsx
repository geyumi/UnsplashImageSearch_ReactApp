import { useCallback, useEffect, useRef, useState } from 'react';
import './index.css';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'https://api.unsplash.com/search/photos';
const IMAGES_PER_PAGE = 25;

function App() {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMsg, setErorMsg] = useState('');



  const fetchImages = useCallback( async () => {
    try {

      if(searchInput.current.value){
        setErorMsg('');
        const { data } = await axios.get(`${API_URL}?query=${searchInput.current.value}&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${import.meta.env.VITE_API_KEY}`);
       setImages(data.results);
       setTotalPages(data.total_pages);
      }
      
    } catch (error) {
      setErorMsg('Error fetching images. Try again later.');
      console.log(error);
      // You can add user-friendly error handling here
    }
  },[page]);

  useEffect(() => {
    fetchImages();
  },[fetchImages]);

  const handleSearch = (event) => {
    event.preventDefault();
    
    setPage(1);
    fetchImages();
  };

  const handleSelection = (selection) => {
    searchInput.current.value = selection;
   
    setPage(1);
    fetchImages();
  };

  console.log('page',page)

  return (
    <div className="container">
      <h1 className='title'>Image Search</h1>
      {errorMsg && <p className='error-msg'>{errorMsg}</p>}
      <div className="search-section">
        <Form onSubmit={handleSearch}>
          <Form.Control
            type="search"
            placeholder="Type something to search..."
            className="search-input"
            ref={searchInput}
          />
        </Form>
      </div>

      <div className="filters">
        <div onClick={() => handleSelection('nature')}>Nature</div>
        <div onClick={() => handleSelection('birds')}>Birds</div>
        <div onClick={() => handleSelection('cats')}>Cats</div>
        <div onClick={() => handleSelection('shoes')}>Shoes</div>
      </div>

      <div className="images">
        {images.map((image) => (
          <img key={image.id} src={image.urls.small} alt={image.alt?.description || 'Image Description'} className="image" />
        ))}
      </div>

      <div className="buttons">
        {page>1 && <Button onClick={() => setPage(page - 1)} >Previous</Button>}
        {page<totalPages && <Button  onClick={() => setPage(page + 1)}>Next</Button>}
        </div>
    </div>
  );
}

export default App;
