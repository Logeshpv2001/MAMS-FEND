import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { Modal, Button, Input, Select, message } from "antd";

const { Option } = Select;

const UsersPage = () => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "",
    base_id: "",
  });
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "commander",
    base_id: "",
  });

  if (user?.role !== "admin") {
    return (
      <div className="text-center mt-20 text-red-500 font-semibold text-xl">
        Unauthorized - Admin access only
      </div>
    );
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/user/get-users");
      setUsers(res.data);
    } catch (err) {
      setError("Failed to fetch users.");
    }
  };

  const handleEditClick = (u) => {
    setEditingUserId(u.id);
    setEditForm({
      name: u.name,
      email: u.email,
      role: u.role,
      base_id: u.base_id,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (id) => {
    try {
      await axiosInstance.put(`/user/edit-user/${id}`, editForm);
      setEditingUserId(null);
      fetchUsers();
      message.success("User updated successfully");
    } catch (err) {
      setError("Failed to update user.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axiosInstance.delete(`/user/${id}`);
      fetchUsers();
    } catch (err) {
      setError("Failed to delete user.");
    }
  };

  const showModal = () => setIsModalOpen(true);
  const handleModalCancel = () => setIsModalOpen(false);

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value) => {
    setNewUser((prev) => ({ ...prev, role: value }));
  };

  const handleCreateUser = async () => {
    try {
      await axiosInstance.post("/user/register", newUser);
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "commander",
        base_id: "",
      });
      setIsModalOpen(false);
      fetchUsers();
      message.success("User created successfully");
    } catch (err) {
      message.error("Failed to create user.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Users</h1>
        <button
          className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
          onClick={showModal}
        >
          Add User
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Base ID</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="p-2 border">{u.id}</td>
                <td className="p-2 border">
                  {editingUserId === u.id ? (
                    <Input
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                    />
                  ) : (
                    u.name
                  )}
                </td>
                <td className="p-2 border">
                  {editingUserId === u.id ? (
                    <Input
                      name="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                    />
                  ) : (
                    u.email
                  )}
                </td>
                <td className="p-2 border">
                  {editingUserId === u.id ? (
                    <Select
                      value={editForm.role}
                      onChange={(value) =>
                        setEditForm((prev) => ({ ...prev, role: value }))
                      }
                      className="w-full"
                    >
                      <Option value="admin">Admin</Option>
                      <Option value="commander">Commander</Option>
                      <Option value="logistics">Logistics</Option>
                    </Select>
                  ) : (
                    u.role
                  )}
                </td>
                <td className="p-2 border">
                  {editingUserId === u.id ? (
                    <Input
                      name="base_id"
                      value={editForm.base_id}
                      onChange={handleEditChange}
                    />
                  ) : (
                    u.base_id
                  )}
                </td>
                <td className="p-2 border space-x-2">
                  {editingUserId === u.id ? (
                    <Button type="primary" onClick={() => handleUpdate(u.id)}>
                      Save
                    </Button>
                  ) : (
                    <Button onClick={() => handleEditClick(u)}>Edit</Button>
                  )}
                  <Button danger onClick={() => handleDelete(u.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        title="Create New User"
        open={isModalOpen}
        onCancel={handleModalCancel}
        onOk={handleCreateUser}
        okText="Create"
      >
        <div className="space-y-3">
          <Input
            name="name"
            placeholder="Name"
            value={newUser.name}
            onChange={handleNewUserChange}
          />
          <Input
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleNewUserChange}
          />
          <Input.Password
            name="password"
            placeholder="Password"
            value={newUser.password}
            onChange={handleNewUserChange}
          />
          <Input
            name="base_id"
            placeholder="Base ID"
            value={newUser.base_id}
            onChange={handleNewUserChange}
          />
          <Select
            value={newUser.role}
            onChange={handleRoleChange}
            className="w-full"
          >
            <Option value="admin">Admin</Option>
            <Option value="commander">Commander</Option>
            <Option value="logistics">Logistics</Option>
          </Select>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;
