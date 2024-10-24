/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { Button, Modal, Alert } from "antd";
import { useStudentStore } from "../../stores/studentStore";
import "../css/style.css";
import { PlusOutlined } from "@ant-design/icons";

const AddStudent = ({ onSuccess, classCode, refreshStudents, sortedData }) => {
  const [show, setShow] = useState(false);
  const [newStudent, setNewStudent] = useState({ idNumber: "", name: "" });
  const { addStudent, error, getAllStudents, allStudents } = useStudentStore();
  const [touchedFields, setTouchedFields] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getAllStudents();
  }, [getAllStudents]);

  const handleClose = () => {
    setNewStudent({ idNumber: "", name: "" });
    setErrors({});
    setTouchedFields({});
    setShow(false);
  };

  const handleShow = () => setShow(true);

  const validateField = (name, value) => {
    const validationErrors = {};

    if (name === "idNumber" && !/^\d{7}$/.test(value)) {
      validationErrors.idNumber = "ID number must be exactly 7 digits.";
    }
    if (name === "name" && !value.trim()) {
      validationErrors.name = "Name is required.";
    }

    return validationErrors;
  };

  const handleBlur = (name, value) => {
    setTouchedFields((prevTouched) => ({ ...prevTouched, [name]: true }));

    const fieldErrors = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, ...fieldErrors }));
  };

  const handleAddToClass = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    Object.keys(newStudent).forEach((key) => {
      const fieldErrors = validateField(key, newStudent[key]);
      Object.assign(validationErrors, fieldErrors);
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const capitalizedName = newStudent.name
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());

      const updatedStudent = {
        ...newStudent,
        name: capitalizedName,
      };

      await addStudent(classCode, updatedStudent);
      
      setNewStudent({ idNumber: "", name: "" });
      handleClose();
      refreshStudents();
      onSuccess();
    }
  };

  const handleIDChange = async (e) => {
    const value = e.target.value;
    setNewStudent((prev) => ({ ...prev, idNumber: value }));
  
    const fieldErrors = validateField("idNumber", value);
    const validationErrors = { ...fieldErrors };
  
    if (sortedData.some((student) => String(student.idNumber) === String(value))) {
      validationErrors.idNumber = "Student is already in this class";
    }
  
    setErrors((prevErrors) => ({ ...prevErrors, idNumber: validationErrors.idNumber }));
  
    if (!validationErrors.idNumber) {
      let fetchedStudent = null;
  
      allStudents.forEach((student) => {
        if (String(student.idNumber) === String(value)) {
          fetchedStudent = student;
        }
      });
  
      if (fetchedStudent && fetchedStudent.name) {
        setNewStudent((prev) => ({ ...prev, name: fetchedStudent.name }));
      } else {
        setNewStudent((prev) => ({ ...prev, name: "" }));
        console.warn("No student found with this ID:", value);
      }
    }
  };
  
  return (
    <>
      <Button type="primary" size="medium" onClick={handleShow}>
        <PlusOutlined className="fs-7" /> Add Student
      </Button>

      <Modal open={show} onCancel={handleClose} footer={null} width={550}>
        <h2 className="attendance-header" style={{ marginBottom: "30px" }}>
          Add Student
        </h2>

        {/* Error Message from the Server */}
        {error && <Alert className="mb-3" message={error} type="error" showIcon />}

        <Form id="formBody">
          <Form.Group as={Row} className="mb-2">
            <Form.Label className="fw-bold" column sm={3}>
              ID Number:
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                placeholder="Enter ID Number"
                value={newStudent.idNumber}
                className={`form-control ${touchedFields.idNumber && errors.idNumber ? "no-margin" : ""}`}
                onChange={handleIDChange}
                onBlur={(e) => handleBlur("idNumber", e.target.value)}
                required
              />
              {touchedFields.idNumber && errors.idNumber && (
                <span
                  style={{
                    color: "red",
                    paddingBottom: "20px",
                    display: "block",
                    fontSize: "14px",
                  }}
                >
                  {errors.idNumber}
                </span>
              )}
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-2">
            <Form.Label className="fw-bold" column sm={3}>
              Name:
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                placeholder="Enter Name"
                className={`form-control ${touchedFields.name && errors.name ? "no-margin" : ""}`}
                value={newStudent.name}
                onChange={(e) => setNewStudent((prev) => ({ ...prev, name: e.target.value }))}
                onBlur={(e) => handleBlur("name", e.target.value)}
                required
              />
              {touchedFields.name && errors.name && (
                <span
                  style={{
                    color: "red",
                    paddingBottom: "20px",
                    display: "block",
                    fontSize: "14px",
                  }}
                >
                  {errors.name}
                </span>
              )}
            </Col>
          </Form.Group>
        </Form>

        <div id="button-container" className="text-center">
          <Button variant="primary" type="submit" className="add-button" onClick={handleAddToClass}>
            Add to Class
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default AddStudent;
