import React, { useState } from "react";
import { Layout, Menu, Table, Button, Input, Switch, notification } from "antd";

const { Header, Content, Footer, Sider } = Layout;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("1");

  const onTabChange = (key) => {
    setActiveTab(key);
  };

  // Sample data for User Management
  const users = [
    { _id: "1", name: "John Doe", email: "john@example.com", status: "active" },
    { _id: "2", name: "Jane Smith", email: "jane@example.com", status: "inactive" },
  ];

  // Sample handler functions
  const handleUpdateUserStatus = (userId, newStatus) => {
    console.log(`Updating user ${userId} to status ${newStatus}`);
    // Add API call logic here
  };

  const handleDeleteUser = (userId) => {
    console.log(`Deleting user ${userId}`);
    // Add API call logic here
  };

  const handleDownloadReport = async () => {
    console.log("Downloading system report...");
    // Add logic for report download
  };

  const handleSendNotification = (form) => {
    console.log("Sending notification:", form);
    notification.success({
      message: "Notification Sent",
      description: `Title: ${form.title}, Message: ${form.message}`,
    });
  };

  // UI for different tabs
  const tabs = [
    {
      key: "1",
      label: "User Management",
      content: (
        <Table
          dataSource={users}
          rowKey="_id"
          columns={[
            { title: "Name", dataIndex: "name", key: "name" },
            { title: "Email", dataIndex: "email", key: "email" },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              render: (status, record) => (
                <Switch
                  checked={status === "active"}
                  onChange={() => handleUpdateUserStatus(record._id, status === "active" ? "inactive" : "active")}
                />
              ),
            },
            {
              title: "Actions",
              key: "actions",
              render: (_, record) => (
                <Button danger onClick={() => handleDeleteUser(record._id)}>
                  Delete
                </Button>
              ),
            },
          ]}
        />
      ),
    },
    {
      key: "2",
      label: "Category Management",
      content: (
        <div>
          <h3>Manage Categories</h3>
          <Input.Search
            placeholder="Add new category"
            enterButton="Add"
            onSearch={(value) => console.log(`Adding category: ${value}`)}
          />
        </div>
      ),
    },
    {
      key: "3",
      label: "System Reports",
      content: (
        <div>
          <Button type="primary" onClick={handleDownloadReport}>
            Download System Report
          </Button>
        </div>
      ),
    },
    {
      key: "4",
      label: "Notifications",
      content: (
        <div>
          <h3>Send Notification</h3>
          <Input
            placeholder="Title"
            style={{ marginBottom: "10px" }}
            onChange={(e) => console.log("Notification Title:", e.target.value)}
          />
          <Input.TextArea
            placeholder="Message"
            rows={4}
            onChange={(e) => console.log("Notification Message:", e.target.value)}
          />
          <Button
            type="primary"
            style={{ marginTop: "10px" }}
            onClick={() =>
              handleSendNotification({
                title: "Sample Title",
                message: "Sample Message",
              })
            }
          >
            Send Notification
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <div className="logo" style={{ color: "white", padding: "16px", fontSize: "20px", textAlign: "center" }}>
          Admin Panel
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[activeTab]} onClick={(e) => onTabChange(e.key)}>
          {tabs.map((tab) => (
            <Menu.Item key={tab.key}>{tab.label}</Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }}>
          <h2 style={{ marginLeft: "20px" }}>{tabs.find((tab) => tab.key === activeTab)?.label}</h2>
        </Header>
        <Content style={{ margin: "16px" }}>
          <div style={{ padding: "24px", background: "#fff", minHeight: 360 }}>
            {tabs.find((tab) => tab.key === activeTab)?.content}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Finance Tracker ©2024</Footer>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
