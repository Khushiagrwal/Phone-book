import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import "../App.css"

export default function GetContact({ deleteUser, updateUser }) {
  const [data, setData] = useState([]); // Store the user data
  const [searchQuery, setSearchQuery] = useState(""); // Store search query
  const [currentPage, setCurrentPage] = useState(1); // Track current page for pagination
  const [itemsPerPage] = useState(6); // Set the number of items per page
  const [searchData, setSearchData] = useState([]); // Backup data for reset

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:3000/api/list", {
          params: { page: currentPage, limit: itemsPerPage },
        });
        if (Array.isArray(response.data)) {
          setData(response.data);
          setSearchData(response.data);
        } else {
          console.error("Invalid data format received");
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [currentPage]);

  const handleDelete = (userId) => {
    deleteUser(userId);
  };

  const handleUpdate = (userId) => {
    updateUser(userId);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      const filtered = searchData.filter((elem) =>
        Object.values(elem).some((value) =>
          value.toString().toLowerCase().includes(query)
        )
      );
      setData(filtered);
    } else {
      setData(searchData); // Reset to original data if query is empty
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container">
      <div className="table-wrapper">
        <div className="table-title">
          <div className="row">
            <div className="col-sm-6">
              <h2><b>Contacts</b></h2>
            </div>
            <div className="col-sm-6">
              <button
                className="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#addEmployeeModal"
              >
                <i className="material-icons">&#xE147;</i>
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search input */}
        <div>
          <input
            type="text"
            className="btn border"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Contacts Table */}
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone 1</th>
              <th>Phone 2</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((elem, index) => (
                <tr key={index}>
                  <td>
                    {[elem.first_name, elem.middle_name, elem.last_name]
                      .filter(Boolean)
                      .join(" ")}
                  </td>
                  <td>{elem.email}</td>
                  <td>{elem.phone_1}</td>
                  <td>{elem.phone_2}</td>
                  <td>{elem.address}</td>
                  <td>
                    <a
                      href="#"
                      className="edit"
                      data-bs-toggle="modal"
                      data-bs-target="#editEmployeeModal"
                      onClick={() => handleUpdate(elem.id)}
                    >
                      <i className="material-icons" title="Edit">&#xE254;</i>
                    </a>
                    <a
                      href="#"
                      className="delete"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteEmployeeModal"
                      onClick={() => handleDelete(elem.id)}
                    >
                      <i className="material-icons" title="Delete">&#xE872;</i>
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No contacts found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <nav>
          <ul className="pagination">
            <li>
              <a className="page-link" onClick={() => paginate(currentPage - 1)}>
                <FaChevronLeft></FaChevronLeft>
              </a>
            </li>
            <li>
              <a className="page-link" onClick={() => paginate(currentPage)}>
                {currentPage}
              </a>
            </li>
            <li>
              <a className="page-link" onClick={() => paginate(currentPage + 1)}>
                <FaChevronRight></FaChevronRight>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
} 