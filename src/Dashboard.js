import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import './Dashboard.css';

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [loading, setLoading] = useState(true);
  const [editIndex, setEditIndex] = useState(null);
  const [editBook, setEditBook] = useState({});

  useEffect(() => {
    fetchBooks(currentPage, booksPerPage);
  }, [currentPage, booksPerPage]);

  const fetchBooks = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://openlibrary.org/search.json?q=subject:fiction&limit=${limit}&page=${page}`);
      const works = response.data.docs;

      const booksData = await Promise.all(
        works.map(async (work) => {
          let authorData = { birth_date: 'N/A', top_work: 'N/A' };

          if (work.author_key) {
            const authorResponse = await axios.get(`https://openlibrary.org/authors/${work.author_key[0]}.json`);
            authorData = authorResponse.data;
          }

          return {
            ratings_average: work.ratings_average || 'N/A',
            author_name: work.author_name ? work.author_name.join(', ') : 'Unknown',
            title: work.title || 'No Title',
            first_publish_year: work.first_publish_year || 'N/A',
            subject: work.subject ? work.subject.join(', ') : 'N/A',
            author_birth_date: authorData.birth_date || 'N/A',
            author_top_work: authorData.top_work || 'N/A',
          };
        })
      );

      setBooks(booksData);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBooks = books.filter((book) =>
    book.author_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchBooks(newPage, booksPerPage);
  };

  const handleBooksPerPageChange = (e) => {
    setBooksPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        return <i className="fas fa-sort-up"></i>;
      } else {
        return <i className="fas fa-sort-down"></i>;
      }
    }
    return <i className="fas fa-sort"></i>;
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditBook(currentBooks[index]);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditBook({ ...editBook, [name]: value });
  };

  const handleSaveClick = (index) => {
    const updatedBooks = [...books];
    const bookIndex = indexOfFirstBook + index;
    updatedBooks[bookIndex] = editBook;
    setBooks(updatedBooks);
    setEditIndex(null);
  };

  const handleCancelClick = () => {
    setEditIndex(null);
  };

  return (
    <div className="dashboard-container">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="search-bar-container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by author"
                value={searchTerm}
                onChange={handleSearch}
              />
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="records-per-page-selector">
        <label htmlFor="records-per-page">Records per page:</label>
        <select id="records-per-page" value={booksPerPage} onChange={handleBooksPerPageChange}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort('ratings_average')}>
                    Rating {getSortIcon('ratings_average')}
                  </th>
                  <th onClick={() => handleSort('author_name')}>
                    Author {getSortIcon('author_name')}
                  </th>
                  <th onClick={() => handleSort('title')}>
                    Title {getSortIcon('title')}
                  </th>
                  <th onClick={() => handleSort('first_publish_year')}>
                    First Publish Year {getSortIcon('first_publish_year')}
                  </th>
                  <th onClick={() => handleSort('subject')}>
                    Subject {getSortIcon('subject')}
                  </th>
                  <th onClick={() => handleSort('author_birth_date')}>
                    Author Birth Date {getSortIcon('author_birth_date')}
                  </th>
                  <th onClick={() => handleSort('author_top_work')}>
                    Author Top Work {getSortIcon('author_top_work')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBooks.map((book, index) => (
                  <tr key={index} className={editIndex === index ? 'editing-row' : ''}>
                    {editIndex === index ? (
                      <>
                        <td><input type="text" name="ratings_average" value={editBook.ratings_average} onChange={handleEditChange} /></td>
                        <td><input type="text" name="author_name" value={editBook.author_name} onChange={handleEditChange} /></td>
                        <td><input type="text" name="title" value={editBook.title} onChange={handleEditChange} /></td>
                        <td><input type="text" name="first_publish_year" value={editBook.first_publish_year} onChange={handleEditChange} /></td>
                        <td><input type="text" name="subject" value={editBook.subject} onChange={handleEditChange} /></td>
                        <td><input type="text" name="author_birth_date" value={editBook.author_birth_date} onChange={handleEditChange} /></td>
                        <td><input type="text" name="author_top_work" value={editBook.author_top_work} onChange={handleEditChange} /></td>
                        <td>
                          <button className="save-button" onClick={() => handleSaveClick(index)}>Save</button>
                          <button className="cancel-button" onClick={handleCancelClick}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{book.ratings_average}</td>
                        <td>{book.author_name}</td>
                        <td>{book.title}</td>
                        <td>{book.first_publish_year}</td>
                        <td>{book.subject}</td>
                        <td>{book.author_birth_date}</td>
                        <td>{book.author_top_work}</td>
                        <td>
                          <button className="edit-button" onClick={() => handleEditClick(index)}>
                            <i className="fas fa-edit"></i>
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <CSVLink data={currentBooks} filename={"books.csv"} className="csv-button">
            Download CSV
          </CSVLink>
          <div className="pagination">
            {/* <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={indexOfLastBook >= filteredBooks.length}>
              Next
            </button> */}
            {/* <select value={booksPerPage} onChange={handleBooksPerPageChange}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select> */}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
