import React, { useState } from "react";
import { Button, Form, Container, Row, Col, Modal} from "react-bootstrap";
import { IoCaretBackCircleSharp } from "react-icons/io5";
import { TimePicker } from "antd";import { useClassStore } from "../../stores/classStore";
import Confirmation from "./Confirmation";

const { RangePicker } = TimePicker;

const CreateClass = ({ goBack, onSuccess }) => {
  const [timeRange, setTimeRange] = useState(null);
  const { addClass } = useClassStore();
  const [touchedFields, setTouchedFields] = useState({});
  const [errors, setErrors] = useState({});

  const [newClass, setNewClass] = useState({ 
    classCode: "",
    courseNumber: "",
    subject: "",
    academicYear: "",
    term: "", 
    room: "",
    days: [],
    startTime: "",
    endTime: "" 
  });

  // Get the current year and set the starting year to one year prior to the current year
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 1; 

  // Generate the academic years
  const years = Array.from({ length: 3 }, (_, index) => {
    const year = startYear + index;
    return `${year}-${year + 1}`;
  });

  const validateField = (name, value) => {
    const validationErrors = {};
    const formattedName = typeof name === 'string' ? name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^([a-z])/g, (match) => match.toUpperCase()) : name; 

    if (name === "classCode" && !(/^\d{4}[A-Z]?$/.test(value))) {
      validationErrors.classCode = "Class code must be 4 digits, optionally followed by a capital letter (e.g., 9400 or 9400C).";
    }

    if ((name === "courseNumber" || name === "subject" || name === "academicYear" || name === "term") && !value.trim()) {
      validationErrors[name] = `${formattedName} is required.`;
    }

    if (name === "room" && !(/^[A-Z]\d{3}$/.test(value))) {
      validationErrors.room = "Room must be 1 capital letter followed by 3 digits (e.g., D515).";
    }

    if (name === "days" && newClass.days.length === 0) {
      validationErrors.days = "Days are required.";
    }

    if (name === "time" && (timeRange === null || timeRange.length < 2)) {
      validationErrors.time = "Time is required.";
    }

    return validationErrors;
  };

  const handleBlur = (name, value) => {
    setTouchedFields((prevTouched) => ({ ...prevTouched, [name]: true }));
  
    const fieldErrors = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, ...fieldErrors }));
  };
  
  const handleCreateClass = async (e) => {
    e.preventDefault();
  
    const validationErrors = {}
  
    // Validate fields when submitting
    Object.keys(newClass).forEach((key) => {
      const fieldErrors = validateField(key, newClass[key]);
      Object.assign(validationErrors, fieldErrors);
    });

    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      // const capitalizedSubject = newClass.subject.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());

      // // Update the subject field before submitting
      // const updatedClass = {
      //   ...newClass,
      //   subject: capitalizedSubject,
      // };
  
      // await addClass(updatedClass);
      
      await addClass(newClass);

      setNewClass({ 
          classCode: "",
          courseNumber: "",
          subject: "",
          academicYear: "",
          term: "", 
          room: "",
          days: [],
          startTime: "",
          endTime: ""
      });
      setShowConfirmation(false);
      onSuccess();
    }
  };

  const handleScheduleChange = (day) => {
    setTouchedFields((prev) => ({ ...prev, days: true }));
    setNewClass((prevClass) => {
      const updatedDays = prevClass.days.includes(day)
        ? prevClass.days.filter((d) => d !== day)
        : [...prevClass.days, day];
      
      if (updatedDays.length > 0) {
        setErrors((prevErrors) => {
          const { days, ...restErrors } = prevErrors;
          return restErrors;
        });
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, days: "Days are required." }));
      }
      
      return {
        ...prevClass,
        days: updatedDays
      };
    });
  };
  
  
  const handleTimeChange = (newTimeRange) => {
    setTimeRange(newTimeRange);
  
    if (newTimeRange && newTimeRange.length === 2) {
      setErrors((prevErrors) => {
        const { time, ...rest } = prevErrors;
        return rest;
      });
    }
  
    setNewClass((prevClass) => ({
      ...prevClass,
      startTime: newTimeRange ? newTimeRange[0]?.format("hh:mm A") : "",
      endTime: newTimeRange ? newTimeRange[1]?.format("hh:mm A") : "",
    }));
  };
  
  const handleCancel = () => {
    setShowCancelConfirmation(true);
  };

  const handleConfirmCancel = () => {
    setNewClass("");
    setShowCancelConfirmation(false);
  };

  const handleCloseCancelConfirmation = () => setShowCancelConfirmation(false);

  return (
    <Container
      className="attendance-container"
      style={{ height: "100vh", position: "relative" }}
    >
 {/* Navigation Buttons */}
<Button
  variant="link"
  onClick={goBack}
  style={{
    position: "absolute",
    top: "20px",
    left: "25px",
    fontSize: "35px",
    textDecoration: "none",
    color: "#191970",
    padding: "1px 5px",
  }}
>
  <IoCaretBackCircleSharp />
</Button>



      {/* Create Class Form */}
      <Form className="attendance-form">
        <h2 className="attendance-header">Create Class</h2>

        <Form.Group as={Row} controlId="formClassCode">
          <Form.Label column sm="3" className="form-label fw-bold">
            Class Code:
          </Form.Label>
          <Col sm="9">
            <Form.Control
              type="text"
              placeholder="Enter Class Code"
              value={newClass.classCode}
              onChange={(e) => {
                const value = e.target.value;
                setNewClass({ ...newClass, classCode: value });
                const fieldErrors = validateField("classCode", value); 
                setErrors((prevErrors) => ({ ...prevErrors, classCode: fieldErrors.classCode }));
              }}
              onBlur={(e) => handleBlur("classCode", e.target.value)}
              required
            />
            {touchedFields.classCode && errors.classCode && (
              <span style={{ color: "red", paddingBottom: "30px", display: "block", fontSize: "14px" }}>
                {errors.classCode}
              </span>
            )}
          </Col>

        </Form.Group>

        <Form.Group as={Row} controlId="formcourseNumber">
          <Form.Label column sm="3" className="form-label fw-bold">
            Course Number:
          </Form.Label>
          <Col sm="9">
            <Form.Control
              placeholder="Enter Course Number"
              className="form-control"
              value={newClass.courseNumber}
              onChange={(e) => {
                const value = e.target.value;
                setNewClass({ ...newClass, courseNumber: value });
                const fieldErrors = validateField("courseNumber", value); 
                setErrors((prevErrors) => ({ ...prevErrors, courseNumber: fieldErrors.courseNumber }));
              }}
              onBlur={(e) => handleBlur("courseNumber", e.target.value)}
              required
            />
            {touchedFields.courseNumber && errors.courseNumber && (
              <span style={{ color: "red", paddingBottom: "30px", display: "block", fontSize: "14px" }}>
                {errors.courseNumber}
              </span>
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formSubject">
          <Form.Label column sm="3" className="form-label fw-bold">
            Subject:
          </Form.Label>
          <Col sm="9">
            <Form.Control
              value={newClass.subject}
              onChange={(e) => {
                const value = e.target.value;
                setNewClass({ ...newClass, subject: value });
                const fieldErrors = validateField("subject", value); 
                setErrors((prevErrors) => ({ ...prevErrors, subject: fieldErrors.subject}));
              }}
              onBlur={(e) => handleBlur("subject", e.target.value)}
              placeholder="Enter Subject"
              className="form-control"
              required
            />
            {touchedFields.subject && errors.subject && (
              <span style={{ color: "red", paddingBottom: "30px", display: "block", fontSize: "14px" }}>
                {errors.subject}
              </span>
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formAcademicYear">
          <Form.Label column sm="3" className="form-label fw-bold">
            Academic Year:
          </Form.Label>
          <Col sm="9">
            <Form.Select
              value={newClass.academicYear}
              onChange={(e) => {
                const value = e.target.value;
                setNewClass({ ...newClass, academicYear: value });
                const fieldErrors = validateField("academicYear", value); 
                setErrors((prevErrors) => ({ ...prevErrors, academicYear: fieldErrors.academicYear }));
              }}
              onBlur={(e) => handleBlur("academicYear", e.target.value)}
              className="form-select"
              required
            >
              <option value="">Select Academic Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
            </Form.Select>
            {touchedFields.academicYear && errors.academicYear && (
              <span style={{ color: "red", paddingBottom: "30px", display: "block", fontSize: "14px" }}>
                {errors.academicYear}
              </span>
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formTerm">
          <Form.Label column sm="3" className="form-label fw-bold">
            Term:
          </Form.Label>
          <Col sm="9">
            <Form.Select
               onChange={(e) => {
                const value = e.target.value;
                setNewClass({ ...newClass, term: value });
                const fieldErrors = validateField("term", value); 
                setErrors((prevErrors) => ({ ...prevErrors, term: fieldErrors.term }));
              }}
              onBlur={(e) => handleBlur("term", e.target.value)}
              className="form-select"
              required
            >
              <option value="">Select Semester</option>
              <option value="First">First Semester</option>
              <option value="Second">Second Semester</option>
              <option value="Short">Short Term</option>
            </Form.Select>
            {touchedFields.term && errors.term && (
              <span style={{ color: "red", paddingBottom: "30px", display: "block", fontSize: "14px" }}>
                {errors.term}
              </span>
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formRoom">
          <Form.Label column sm="3" className="form-label fw-bold">
            Room:
          </Form.Label>
          <Col sm="9">
            <Form.Control
              type="text"
              value={newClass.room}
              onChange={(e) => {
                const value = e.target.value;
                setNewClass({ ...newClass, room: value });
                const fieldErrors = validateField("room", value); 
                setErrors((prevErrors) => ({ ...prevErrors, room: fieldErrors.room }));
              }}
              onBlur={(e) => handleBlur("room", e.target.value)}
              placeholder="Enter Room"
              className="form-control"
              required
            />
            {touchedFields.room && errors.room && (
              <span style={{ color: "red", paddingBottom: "30px", display: "block", fontSize: "14px" }}>
                {errors.room}
              </span>
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formSchedule">
          <Form.Label column sm="3" className="form-label fw-bold">
            Days:
          </Form.Label>
          <Col sm="9" className="d-flex align-items-center">
            <div className="schedule-picker d-flex w-100">
              {["M", "T", "W", "TH", "F", "S"].map((day) => (
                <Button
                  key={day}
                  variant={newClass.days.includes(day) ? "primary" : "outline-primary"}
                  className={`m-0 my-1 py-1 ${newClass.days.includes(day) ? "selected" : "unselected"} w-100`}
                  onClick={() => handleScheduleChange(day)}
                >
                  {day}
                </Button>
              ))}
            </div> 
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Col sm="3"></Col>
          
          <Col sm="9">
            {touchedFields.days && newClass.days.length === 0 && (
              <span style={{ color: "red", paddingBottom: "30px", display: "block", fontSize: "14px" }}>
                {errors.days}
              </span>
            )}
          </Col>
        </Form.Group>
        
          {/* Time Picker */}
        <Form.Group as={Row} controlId="formTimeRange" className="mt-3">
          <Form.Label column sm="3" className="form-label fw-bold">
            Time:
          </Form.Label>
          <Col>
            <RangePicker
              value={timeRange}
              onChange={handleTimeChange}
              onBlur={handleBlur}
              format="hh:mm A"
              minuteStep={30}
              showTime={{
                format: "hh:mm A",
                use12Hours: true,
                minuteStep: 30,
              }}
              style={{ width: "100%" }}
              getPopupContainer={(trigger) => trigger.parentNode}
              required
              disabledTime={(current) => {
                if (!current) return {};
                
                const startHour = timeRange && timeRange[0] ? timeRange[0].hour() : null;

                return {
                  disabledHours: () => {
                    const disabled = [...Array(7).keys(), ...Array.from({ length: 3 }, (_, i) => i + 21)];
                    // If start time exists, disable hours before the selected start time for end picker
                    if (startHour !== null) {
                      return disabled.concat(Array.from({ length: startHour }, (_, i) => i));
                    }
                    return disabled;
                  },
                  disabledMinutes: (selectedHour) => {
                    const startMinute = timeRange && timeRange[0] ? timeRange[0].minute() : null;
                    if (selectedHour === 7) {
                      return [0, 15]; // Disable minutes before 7:30 AM
                    }
                    if (selectedHour === 20) {
                      return [45, 59]; // Disable minutes after 8:30 PM
                    }
                    // If selected hour matches start hour, disable minutes earlier than the start time
                    if (startHour !== null && selectedHour === startHour && startMinute !== null) {
                      return Array.from({ length: startMinute + 1 }, (_, i) => i); // Disable minutes before the start minute
                    }
                    return [];
                  },
                };
              }}
            />

            {touchedFields.time && errors.time && (
              <span style={{ color: "red", paddingBottom: "30px", display: "block", fontSize: "14px" }}>
                {errors.time}
               </span>
            )}
          </Col>
        </Form.Group>

        <div className="button-container">
          <Button
            variant="primary"
            type="submit"
            className="custom-button create-button"
            onClick={handleCreateClass}
          >
            Create Class
          </Button>
        </div>
      </Form>

    </Container>
  );
};

export default CreateClass;