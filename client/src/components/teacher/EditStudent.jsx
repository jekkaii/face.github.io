import React, { useState, useEffect } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { Button, Modal, Alert } from "antd";
import { useStudentStore } from "../../stores/studentStore";
import "../css/style.css";

const EditStudent = ({ isOpen, onClose, onConfirm, idNumber, name, refreshStudents}) => {
  const [newStudent, setNewStudent] = useState({ idNumber: "", name: "" });
  const { updateStudent, error } = useStudentStore();
  const [errors, setErrors] = useState({}); // State to hold validation errors

  useEffect(() => {
    setNewStudent({ idNumber, name });
  }, [idNumber, name]);

  const validateField = (name, value) => {
    const validationErrors = {};
    if (name === "name" && !value.trim()) {
      validationErrors.name = "Name is required.";
    }
    return validationErrors;
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
  
    const validationErrors = {};
    Object.keys(newStudent).forEach((key) => {
      const fieldErrors = validateField(key, newStudent[key]);
      Object.assign(validationErrors, fieldErrors);
    });

    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      await updateStudent(idNumber, newStudent);
      setNewStudent({ idNumber: "", name: "" });
      onClose();
      refreshStudents();
      onConfirm();
    }
  };

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} width={550}>
      <h2 className="attendance-header" style={{ marginBottom: "30px" }}>
        Edit Student
      </h2>

      {/* Error Message from the Server */}
      {error && (
        <Alert className="mb-3" message={error} type="error" showIcon />
      )}

      <Form id="formBody" onSubmit={handleEditStudent}>
        <Form.Group as={Row} className="mb-2">
          <Form.Label className="fw-bold" column sm={3}>
            ID Number:
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              value={newStudent.idNumber}
              disabled
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label className="fw-bold" column sm={3}>
            Name:
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              value={newStudent.name}
              onChange={(e) => {
                const value = e.target.value;
                setNewStudent({ ...newStudent, name: value });
                const fieldErrors = validateField("name", value);
                setErrors((prevErrors) => ({ ...prevErrors, name: fieldErrors.name }));
              }}
              required
            />
            {errors.name && (
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

      <div id="buttondiv" className="text-center">
        <Button
          variant="primary"
          type="submit"
          className="edit-student-button"
          onClick={handleEditStudent}
        >
          Save Changes
        </Button>
      </div>
    </Modal>
  );
};

export default EditStudent;
