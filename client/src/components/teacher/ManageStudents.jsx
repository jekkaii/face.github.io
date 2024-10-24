/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "../css/style.css";
import Confirmation from "./Confirmation";
import { Flex, Table, Button, Input, Dropdown } from "antd";
import {
  IdcardOutlined,
  SearchOutlined,
  TagOutlined,
  MoreOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import AddStudent from "./AddStudent";
import Notification from "./Notification";
import EditStudent from "./EditStudent";
import { useStudentStore } from "../../stores/studentStore";

const ManageStudents = ({ sortedData, classCode, refreshStudents }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState(""); // 'success' or 'error'
  const [openEditStudent, setOpenEditStudent] = useState(false);
  const [openDeleteStudent, setOpenDeleteStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({ idNumber: "", name: "" });
  const { deleteStudent, deleteMultipleStudents } = useStudentStore();
 
  // State to track selected row keys
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  // const props = {
  //   name: "file",
  //   action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  //   headers: {
  //     authorization: "authorization-text",
  //   },
  //   onChange(info) {
  //     if (info.file.status !== "uploading") {
  //       console.log(info.file, info.fileList);
  //     }
  //     if (info.file.status === "done") {
  //       message.success(`${info.file.name} file uploaded successfully`);
  //     } else if (info.file.status === "error") {
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  // };

  // Dropdown menu
  const actionMenu = [
    {
      key: "1",
      label: "Edit",
    },
    {
      key: "2",
      label: "Delete",
    },
  ];

  // Student data and buttons
  const items = sortedData.map((Item) => ({
    key: Item.id,
    studentId: Item.idNumber,
    name: Item.name,
    createdAt: Item.createdAt,
    updatedAt: (
      <Flex justify="space-between">
        <span>{Item.updatedAt}</span>
        <Dropdown
          menu={{
            items: actionMenu,
            onClick: (e) => {
              handleMenuClick(e, Item.idNumber, Item.name);
            }
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <MoreOutlined className="fs-5" />
          </a>
        </Dropdown>
      </Flex>
    ),
  }));

  // Table columns
  const columns = [
    {
      title: (
        <>
          <Flex gap={6}>
            <IdcardOutlined />
            <span>ID Number</span>
          </Flex>
        </>
      ),
      dataIndex: "studentId",
      key: "studentId",
      filteredValue: [searchTerm],
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
      onFilter: (value, record) => {
        return (
          String(record.studentId)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.name).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: (
        <>
          <Flex gap={6}>
            <TagOutlined />
            <span>Name</span>
          </Flex>
        </>
      ),
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },
    {
      title: "Date Created",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },
    {
      title: "Date Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    console.log("File uploaded:", file);
  };

  // Handle delete modal
  const handleDeleteModalOpen = () => {
    const isAllSelected = selectedRowKeys.length === sortedData.length;
    
    if (selectedRowKeys.length == 1) {
      const selectedName = selectedRows[0].name;
     
      setModalMessage(
        <>Are you sure you want to delete <strong>{selectedName}</strong>?</>
      );
    } else if (isAllSelected) {
      setModalMessage(
        <>Are you sure you want to delete <strong>all students</strong> from this class?</>
      );
    } else {
      const selectedNames = selectedRows.map((student, index) => (
        <React.Fragment key={student.idNumber}>
          {index + 1}. {student.name} <br />
        </React.Fragment>
      ));
     
      setModalMessage(
        <React.Fragment>
          Are you sure you want to delete the following students from the
          class?
          <br />
          {selectedNames}
        </React.Fragment>
      );
    }
    setOpenDeleteStudent(true);
  };

  // Handle the dropdown item selection
  const handleMenuClick = (e, idNumber, name) => {
    if (e.key === "1") { // edit class
      setOpenEditStudent(true);
      setSelectedStudent({ idNumber, name });
    } else { // delete class
      setOpenDeleteStudent(true);
      setSelectedStudent({ idNumber, name });
      setModalMessage(
        <>Are you sure you want to delete <strong>{name}</strong>?</>
      );
    }
  };

  const handleDeleteStudentConfirmation = async () => {
    if (selectedStudent.idNumber !== "" && selectedStudent.name !== "") {
      try {
        await deleteStudent(classCode, selectedStudent.idNumber);
        setNotificationMessage("Student deleted successfully!");
        setNotificationType("success");
        refreshStudents();
      } catch (error) {
        setNotificationMessage("Error deleting student:", error);
        setNotificationType("error");
      }
    } else if (selectedRowKeys.length === 1) {
      // Deleting a single student
      const studentId = selectedRows[0].studentId;
  
      try {
        await deleteStudent(classCode, studentId);
        setNotificationMessage("Students deleted successfully!");
        setNotificationType("success");
        refreshStudents();
      } catch (error) {
        setNotificationMessage("Error deleting student:", error);
        setNotificationType("error");
      }
    } else if (selectedRowKeys.length > 1) {
      const studentIds = selectedRows.map(row => row.studentId);

      try {
        await deleteMultipleStudents(classCode, studentIds);
        setNotificationMessage("Students deleted successfully!");
        setNotificationType("success");
        refreshStudents();
      } catch (error) {
        setNotificationMessage("Error deleting students:", error);
        setNotificationType("error");
      }
    }
  
    setOpenDeleteStudent(false);
  };

  const closeNotification = () => {
    setNotificationMessage("");
    setNotificationType("");
  }; 

  const handleDeleteModalClose = () => {
    setOpenDeleteStudent(false);
    setSelectedStudent({ idNumber: "", name: "" });
  };

  const handleEditModalClose = () => {
    setOpenEditStudent(false);
    setSelectedStudent({ idNumber: "", name: "" });
  };

  // Row selection configuration
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User", // Disable checkbox for a particular row
      name: record.name,
    }),
  };

  return (
    <>
      {/* Search, Add, Delete and File Upload buttons */}
      <Flex gap={10} justify="space-between">
        <Input
          placeholder="Input ID Number or Name"
          allowClear
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            maxWidth: 450,
          }}
        />

        <Flex>
          {/* <Upload {...props} on>
            <Button>
              <UploadOutlined className="fs-4" />
            </Button>
            
          {/* </Upload> */}

          <Flex gap={10}>
            <AddStudent 
              onSuccess={() => {
                setNotificationMessage("Student added successfully!");
                setNotificationType("success");
              }}
              classCode={classCode}
              refreshStudents={refreshStudents}
            />

            <Button
              className="m-0 pt-0"
              size="medium"
              variant="solid"
              color="danger"
              style={{
                display: selectedRowKeys.length === 0 ? "none" : "block",
                transition: "display 0.3s ease-in-out",
              }}
              onClick={handleDeleteModalOpen}
            >
              <DeleteOutlined />
            </Button>
          </Flex>
        </Flex>
      </Flex>

      {/* Students Table */}
      <Table
        className="rounded"
        dataSource={items}
        columns={columns}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
      />
      
      {/* confirmation modal to delete a student */}
      <Confirmation
        isOpen={openDeleteStudent}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteStudentConfirmation}
        message={modalMessage}
      />

      <EditStudent
        isOpen={openEditStudent}
        onClose={handleEditModalClose}
        onConfirm={() => {
          setNotificationMessage("Student edited successfully!");
          setNotificationType("success");
        }}
        idNumber={selectedStudent.idNumber}
        name={selectedStudent.name}
        refreshStudents={refreshStudents}
      />
  
      {notificationMessage && (
        <Notification
          message={notificationMessage}
          type={notificationType}
          onClose={closeNotification}
        />
      )}
    </>
  );
};

export default ManageStudents;
