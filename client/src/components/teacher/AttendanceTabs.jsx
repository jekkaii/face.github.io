/* eslint-disable no-unused-vars */
import React from "react";
import { useState, useEffect } from "react";
import { Row, Col, InputGroup, Form } from "react-bootstrap";
import dayjs from "dayjs";
import AttendanceSummary from "./AttendanceSummary";
import DailyAttendance from "./DailyAttendance";
import "../css/style.css";
import ManageStudents from "./ManageStudents";
import UploadClassPicture from "./UploadClassPicture";
import { useStudentStore } from "../../stores/studentStore";
import { useClassStore } from "../../stores/classStore";
import { Skeleton, Flex, Breadcrumb, Tabs, Input, Button } from "antd";
import moment from "moment";

import { Link, useParams } from "react-router-dom";
import Icon, {
  BookOutlined,
  CalendarOutlined,
  CameraOutlined,
  ContactsOutlined,
  FieldTimeOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const AttendanceTabs = () => {
  // Use parameter
  const params = useParams();

  const [key, setKey] = useState("daily");
  const [searchTerm, setSearchTerm] = useState("");

  // Student Store
  const { getStudents, updateStudentStatus, students, isLoading, error } =
    useStudentStore();

  // Class Store
  const {
    getClasses,
    existingClass,
    isLoading: classLoading,
    error: classError,
  } = useClassStore();

  useEffect(() => {
    if (params.classcode) {
      getStudents(params.classcode);
    }
  }, [params.classcode, getStudents]);

  const [attendanceData, setAttendanceData] = useState(
    students.map((student) => ({
      id: student._id,
      idNumber: student.idNumber,
      name: student.name,
      status: student.status,
      createdAt: moment(student.createdAt).format("MMM Do YYYY"),
      updatedAt: moment(student.updatedAt).format("MMMM Do YYYY, h:mm:ss a"),
      attendance: [],
    }))
  );

  useEffect(() => {
    setAttendanceData(
      students.map((student) => ({
        id: student._id,
        idNumber: student.idNumber,
        name: student.name,
        status: student.status,
        createdAt: moment(student.createdAt).format("MMM Do YYYY"),
        updatedAt: moment(student.updatedAt).format("MMMM Do YYYY, h:mm:ss a"),
        attendance: [],
      }))
    );
  }, [students]);

  useEffect(() => {
    if (params.classcode) {
      getClasses(params.classcode);
    }
  }, [params.classcode, getClasses]);

  const sortedData = [...attendanceData].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  /* For the Date Picker */
  const [dateValue, setDateValue] = useState(dayjs());
  const [formattedDate, setFormattedDate] = useState(
    dateValue.format("MMMM D, YYYY")
  );

  const handleDateChange = (newValue) => {
    setDateValue(newValue);
    const dateString = newValue.format("MMMM D, YYYY");
    setFormattedDate(dateString);
  };

  const handleManualAttendance = (id) => {
    setAttendanceData((prevData) =>
      prevData.map((entry) =>
        entry.idNumber === id
          ? {
              ...entry,
              status: entry.status === "Absent" ? "Present" : "Absent",
            }
          : entry
      )
    );
  };

  // // Filter the info based on the searchTerm
  // const filteredInfo = sortedData.filter((entry) => {
  //   const lowerCaseSearchTerm = searchTerm.toLowerCase();
  //   return (
  //     entry.name.toLowerCase().includes(lowerCaseSearchTerm) ||
  //     entry.idNumber.includes(lowerCaseSearchTerm)
  //   );
  // });

  const items = [
    {
      key: "1",
      label: (
        <Flex gap={4}>
          <CalendarOutlined className="fs-6 m-0" />
          <span>Daily Attendance</span>
        </Flex>
      ),
      children: (
        <>
          {/* Daily Attendance */}
          <Flex justify="space-between" vertical gap={14} className="mb-3 mt-2">
            <DailyAttendance
              handleManualAttendance={handleManualAttendance}
              sortedData={sortedData}
              isLoading={isLoading}
            />
          </Flex>
        </>
      ),
    },
    {
      key: "2",
      label: (
        <Flex gap={4}>
          <FieldTimeOutlined className="fs-6 m-0" />
          <span>Attendance Summary</span>
        </Flex>
      ),
      children: (
        <>
          {/* Attendance Summary */}
          <Flex justify="space-between" vertical gap={14} className="mb-3 mt-2">
            <AttendanceSummary isLoading={isLoading} sortedData={sortedData} />
          </Flex>
        </>
      ),
    },
    {
      key: "3",
      label: (
        <Flex gap={4}>
          <TeamOutlined className="fs-6 m-0" />
          <span>Manage Students</span>
        </Flex>
      ),
      children: (
        <>
          {/* Manage Students Tab */}
          <Flex justify="space-between" vertical gap={14} className="mb-3 mt-2">
            <ManageStudents
              sortedData={sortedData}
              attendanceData={attendanceData}
            />
          </Flex>
        </>
      ),
    },
  ];

  return (
    <>
      <Breadcrumb
        separator=">"
        className="text-decoration-none"
        items={[
          {
            title: (
              <>
                <Link className="text-decoration-none" to="/teacher">
                  <BookOutlined style={{ marginRight: "5px" }} />
                  Classes
                </Link>
              </>
            ),
          },
          {
            title: (
              <>
                <span>
                  <ContactsOutlined
                    style={{ fontSize: "16px", marginRight: "5px" }}
                  />
                  {params.classcode}
                </span>
              </>
            ),
          },
          {
            title: (
              <>
                <span>
                  <TeamOutlined
                    style={{ fontSize: "16px", marginRight: "5px" }}
                  />
                  Students List
                </span>
              </>
            ),
          },
        ]}
      />
      <br />
      <Flex vertical gap={23}>
        <Flex
          justify="space-between"
          gap={23}
          align="center"
          style={{
            padding: 30,
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.1)",
            width: "100%",
          }}
        >
          <Flex vertical>
            <p className="mb-2 fw-bold fs-3 text-center">
              {existingClass.classCode + " " + existingClass.subject}
            </p>
            <p className="mb-0 text-center">
              {existingClass.startTime} - {existingClass.endTime}
            </p>
            <p className="mb-0 text-center">{existingClass.days}</p>
          </Flex>
          <Flex></Flex>
        </Flex>
        {/* Tabs */}
        <Flex
          vertical
          style={{
            // margin: "30px 30px 0",
            padding: 24,
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0px 2px 10px 0px rgba(0, 0, 0, 0.1)",
            width: "100%",
          }}
        >
          <Tabs defaultActiveKey="1" addIcon items={items} />
        </Flex>
      </Flex>
    </>
  );
};

export default AttendanceTabs;
