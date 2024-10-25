/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import "../css/style.css";
import { useAdminStore } from "../../stores/adminStore";
import { Button, Table, Form, Modal } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const initialUsers = [
];

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => (
  <Modal show={isOpen} onHide={onCancel} centered>
    <Modal.Header closeButton>
      <Modal.Title>Confirmation</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>{message}</p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="primary" onClick={onConfirm}>
        Confirm
      </Button>
    </Modal.Footer>
  </Modal>
);

const AddEditUserModal = ({ isOpen, user, onSave, onCancel, isEditing }) => {
  const [firstName, setFirstName] = useState(user ? user.firstName : "");
  const [lastName, setLastName] = useState(user ? user.lastName : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [role, setRole] = useState(user ? user.role : "Faculty");

  const handleSave = () => {
    const updatedUser = { ...user, firstName, lastName, email, role };
    onSave(updatedUser);
  };

  return (
    <Modal show={isOpen} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? "Edit User" : "Add User"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Role</Form.Label>
          <Form.Control
            as="select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option>Faculty</option>
            <option>Admin</option>
          </Form.Control>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          {isEditing ? "Save Changes" : "Add User"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const ManageUsers = () => {
  const {users, getUsers} = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [actionType, setActionType] = useState("");
  const [selectedRole, setSelectedRole] = useState('');


  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  const toggleUserStatus = (id) => {
    getUsers(
      users.map((user) =>
        user.id === id ? { ...user, status: !user.status } : user
      )
    );
  };
  const handleToggleChange = (user) => {
    setSelectedUser(user);
    setActionType("toggle");
    setShowModal(true);
  };

  const handleConfirmAction = () => {
    if (actionType === "toggle" && selectedUser) {
      toggleUserStatus(selectedUser.id);
    } else if (actionType === "delete" && selectedUser) {
      getUsers(users.filter((u) => u.id !== selectedUser.id));
    }
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleCancelAction = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleSelectUser = (id) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((userId) => userId !== id)
        : [...prevSelected, id]
    );
  };

  const handleAddUser = () => {
    setIsEditing(false);
    setSelectedUser(null);
    setIsAddEditModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
    setIsAddEditModalOpen(true);
  };

  const handleSaveUser = (updatedUser) => {
    if (isEditing) {
      getUsers(
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
    } else {
      getUsers([...users, { ...updatedUser, id: Date.now(), status: true }]);
    }
    setIsAddEditModalOpen(false);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setActionType("delete");
    setShowModal(true);
  };

  const filteredUsers = users.filter(
    (user) =>
      (selectedRole === '' || user.role === selectedRole) &&
      (user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm))
  );

  return (
    <div className="container mt-5">
      {/* Search bar */}
      <div className="d-flex justify-content-between align-items-center mb-3">  
        <div style={{ position: "relative", maxWidth: "300px" }}>
          <input
            type="text"
            value={searchTerm}
            placeholder="Search Here"
            onChange={handleSearch}
            className="form-control"
            style={{ paddingLeft: "35px" }}
          />
          <FaSearch
            style={{
              position: "absolute",
              left: "12px",
              top: "30%",
              transform: "translateY(-50%)",
              color: "#888",
              fontSize: "16px",
            }}
          />
        </div>
        <div style={{ marginRight: '200px' }}>
    <select
      value={selectedRole}
      onChange={(e) => setSelectedRole(e.target.value)}
      className="form-select"
    >
      <option value="">All</option>
      <option value="Admin">Admin</option>
      <option value="Teacher">Teacher</option>
    </select>
  </div>
  
        <Button className="btn-primary" onClick={handleAddUser}>
          <FaPlus className="me-2" />
          ADD USER
        </Button>
      </div>
      
      <Table bordered hover responsive className="user-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Account Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Form.Check
                  type="switch"
                  id={`status-switch-${user.id}`}
                  checked={user.status}
                  onChange={() => handleToggleChange(user)}
                  label={
                    <span
                      className={`status-label ${
                        user.status ? "activated" : "deactivated"
                      }`}
                    >
                      {user.status ? "Activated" : "Deactivated"}
                    </span>
                  }
                />
              </td>
              <td>
                <Button variant="warning" onClick={() => handleEditUser(user)}>
                  <FaEdit />
                </Button>{" "}
                <Button variant="danger" onClick={() => handleDeleteUser(user)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Confirmation Modal for Delete & Status */}
      <ConfirmationModal
        isOpen={showModal}
        message={
          actionType === "delete" ? (
            <>
              Are you sure you want to delete{" "}
              <span style={{ fontWeight: "bold", color: "red" }}>
                {selectedUser?.firstName} {selectedUser?.lastName}
              </span>
              's account?
            </>
          ) : (
            <>
              Are you sure you want to{" "}
              {selectedUser?.status ? "deactivate" : "activate"}{" "}
              <span style={{ fontWeight: "bold", color: "red" }}>
                {selectedUser?.firstName} {selectedUser?.lastName}
              </span>
              's account?
            </>
          )
        }
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />

      {/* Add/Edit User modal */}
      <AddEditUserModal
        isOpen={isAddEditModalOpen}
        user={selectedUser}
        onSave={handleSaveUser}
        onCancel={() => setIsAddEditModalOpen(false)}
        isEditing={isEditing}
      />
    </div>
  );
};

export default ManageUsers;