import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaTimes, FaChevronDown, FaFilter, FaEdit, FaTrash } from 'react-icons/fa';

const statuses = ["All", "Approved", "Denied", "Pending", "Blocked", "Available", "Not Available"];

const BookInventory = () => {
  const [isFilterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState({});
  const [selectedStatus, setSelectedStatus] = useState('All');

  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const toggleFilterDropdown = () => setFilterDropdownOpen(!isFilterDropdownOpen);
  const clearSearch = () => setSearchTerm('');

  const [books, setBooks] = useState([]);
  const [booksData, setBooksData] = useState([]);

  const [categories, setCategories] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setScrollTop(scrollRef.current.scrollTop);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY;
    scrollRef.current.scrollTop = scrollTop - deltaY;
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCategoryDropdownOpen(false);
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setStatusDropdownOpen(false);
  };

  /**
   * Used for fetching data
   */
  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch("/api/v1/books");
      const result = await response.json();

      setBooksData(result);
    }
    
    const fetchCategories = async () => {
      const response = await fetch("/api/v1/categories");
      const result = await response.json();

      setCategoriesData(result);
    }

    fetchCategories();
    fetchBooks();
  }, []);

  /**
   * Used for searching and filtering
   */
  useEffect(() => {
    // search
    const filteredBooks = booksData.filter(book => {

      const matchesTerm = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !selectedCategory.id ? true : selectedCategory.id === book.categoryId;

      return matchesTerm && matchesCategory;
    });

    setBooks(filteredBooks);
    setCategories(categoriesData);
  }, [booksData, categories, categoriesData, searchTerm, selectedCategory, selectedCategory.id]);

  return (
    <div className="bg-teal-100 flex flex-col w-full h-full min-h-screen">
      <div className="bg-teal-100 p-6 flex flex-col">
        {/* Search Bar and Filter Dropdowns */}
        <div className="flex justify-between items-center max-w-2xl mb-2 space-x-4">
          <div className="flex items-center border border-gray-300 rounded-full p-2 bg-white flex-1">
            <FaSearch className="text-black mr-2" />
            <input
              type="text"
              placeholder="Search by title or author..."
              className="outline-none flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <FaTimes className="text-black cursor-pointer ml-2" onClick={clearSearch} />
            )}
          </div>
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={toggleFilterDropdown}
              className="bg-white border border-gray-300 rounded-full px-4 py-2 shadow-md flex items-center"
            >
              <FaFilter className="mr-2" />
              <span>Filter</span>
              <FaChevronDown className={`text-gray-500 transition-transform duration-300 ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isFilterDropdownOpen && (
              <div className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-md mt-1 w-48">
                {/* Categories Dropdown */}
                <div className="border-b border-gray-300">
                  <button
                    onClick={() => setCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="flex justify-between items-center w-full p-2 hover:bg-gray-100"
                  >
                    <span>Categories</span>
                    <FaChevronDown className={`transition-transform duration-300 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isCategoryDropdownOpen && (
                    <ul className="space-y-2 p-2">
                      {categories.map((category) => (
                        <li
                          key={category.id}
                          className="flex items-center space-x-2 p-2 bg-gray-100 rounded hover:bg-teal-600 hover:text-white cursor-pointer"
                          onClick={() => handleCategorySelect(category)}
                        >
                          <input
                            type="radio"
                            name="category"
                            checked={selectedCategory.id === category.id}
                            onChange={() => handleCategorySelect(category)}
                            className="w-4 h-4 text-teal-500"
                          />
                          <span>{category.name}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* Status Dropdown */}
                <div className="border-b border-gray-300">
                  <button
                    onClick={() => setStatusDropdownOpen(!isStatusDropdownOpen)}
                    className="flex justify-between items-center w-full p-2 hover:bg-gray-100"
                  >
                    <span>Status</span>
                    <FaChevronDown className={`transition-transform duration-300 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isStatusDropdownOpen && (
                    <ul className="space-y-2 p-2">
                      {statuses.map((status) => (
                        <li
                          key={status}
                          className="flex items-center space-x-2 p-2 bg-gray-100 rounded hover:bg-teal-600 hover:text-white cursor-pointer"
                          onClick={() => handleStatusSelect(status)}
                        >
                          <input
                            type="radio"
                            name="status"
                            checked={selectedStatus === status}
                            onChange={() => handleStatusSelect(status)}
                            className="w-4 h-4 text-teal-500"
                          />
                          <span>{status}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold p-4">Inventory</h2>
        <div className="relative bg-white p-4 rounded-2xl shadow-lg flex-1 mb-4 mx-2 overflow-hidden">
          <div
            className="overflow-y-auto max-h-full"
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <table className="w-full table-auto text-left">
              <thead>
                <tr>
                  <th className="p-4 border-b border-gray-300 text-left">Cover</th>
                  <th className="p-4 border-b border-gray-300 text-left">Title</th>
                  <th className="p-4 border-b border-gray-300 text-left">Author</th>
                  <th className="p-4 border-b border-gray-300 text-right">Available</th>
                  <th className="p-4 border-b border-gray-300 text-right">Total</th>
                  <th className="p-4 border-b border-gray-300 text-left">Status</th>
                  <th className="p-4 border-b border-gray-300 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    <td className="p-4 border-b border-gray-200">
                      <img  src={`/api/v1/cover/${book.cover}`} 
                            alt={book.title} 
                            className="h-16 w-16 object-cover rounded-md" 
                            />
                    </td>
                    <td className="p-4 border-b border-gray-200">{book.title}</td>
                    <td className="p-4 border-b border-gray-200">{book.author.name}</td>
                    <td className="p-4 border-b border-gray-200 text-center">{book.available}</td>
                    <td className="p-4 border-b border-gray-200 text-center">{book.total}</td>
                    <td className={`p-4 border-b border-gray-200 ${book.status === 'Available' ? 'text-green-600' : 'text-red-600'}`}>
                      {book.status}
                    </td>
                    <td className="p-4 border-b border-gray-200 text-center">
                      <div className="flex justify-center space-x-3">
                        <Link to={`/edit/${book.id}`} className="text-blue-500 hover:text-blue-700">
                          <FaEdit />
                        </Link>
                        <button className="text-red-500 hover:text-red-700">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {books.length === 0 && (
                  <tr>
                    <td className="p-4 text-center" colSpan="8">No books found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookInventory;
