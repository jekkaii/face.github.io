import React, { useState, useEffect } from "react";
import "../css/style.css";
import { FaArchive, FaTrash, FaBars } from "react-icons/fa";
import Confirmation from "./Confirmation"; // Import the Confirmation component
import CreateClass from "./CreateClass";
import { useClassStore } from "../../stores/classStore";

const ClassList = () => {
  const [classesData, setClassesData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [showCreateClass, setShowCreateClass] = useState(false);

  // Fetch class details from the database when component mounts
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        // Uncomment below to fetch real data from your API
        // const response = await fetch('/api/getClasses?professor=Cruz');
        // const data = await response.json();
        // setClasses(data.classes);

        // Sample data (you can comment this out and replace it with actual fetch)
        const sampleClasses = [
          {
            subject: "Information Management",
            classCode: "IT221",
            classCodes: ["9552", "9553"],
            room: "D515",
            days: ["M", "W", "F"],
            startTime: "11:30 AM",
            endTime: "12:30",
          },
          {
            subject: "IT Security",
            classCode: "IT322",
            classCodes: ["9541", "9542"],
            room: "D512",
            days: ["T", "Th"],
            startTime: "10:00 AM",
            endTime: "11:30",
          },
        ];
        setClassesData(sampleClasses);
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };

    fetchClasses();
  }, []);

  // // Class Store
  // const { getClasses, classes, isLoading, error } = useClassStore();

  //   useEffect(() => {
  //     getClasses();
  //   }, [getClasses]);

  //   const [classesData, setClassesData] = useState([]);

  //   useEffect(() => {
  //     if (classes && classes.length > 0) { // Check if classes array is populated
  //       setClassesData(
  //         classes.map((item) => ({
  //           id: item._id,
  //           teacher: item.teacher,
  //           students: item.students,
  //           classCode: item.classCode,
  //           courseNumber: item.courseNumber,
  //           subject:  item.subject,
  //           academicYear: item.academicYear,
  //           term: item.term,
  //           room: item.room,
  //           days: item.days,
  //           startTime: item.startTime,
  //           endTime: item.endTime
  //         }))
  //       );
  //     }
  //   }, [classes]);

  const handleShowCreateClass = () => {
    setShowCreateClass(true);
  };

  const handleBackButtonClick = () => {
    setShowCreateClass(false);
  };

  const handleActionClick = (action, classCode) => {
    setSelectedAction(action);
    setSelectedClass(classCode);

    if (action === "archive") {
      setModalMessage(
        `Are you sure you want to archive the class of ${classCode}?`
      );
    } else if (action === "delete") {
      setModalMessage(
        `Are you sure you want to delete the class of ${classCode}?`
      );
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };

  const confirmAction = async () => {
    try {
      if (selectedAction === "archive") {
        // Perform archive action here (uncomment when API is ready)
        // await fetch(`/api/archiveClass?classCode=${selectedClass}`, { method: 'POST' });
      } else if (selectedAction === "delete") {
        // Perform delete action here (uncomment when API is ready)
        // await fetch(`/api/deleteClass?classCode=${selectedClass}`, { method: 'DELETE' });
      }

      // After action, update class list
      // setClasses(classes.filter((cls) => cls.classCode !== selectedClass));
    } catch (error) {
      console.error("Error performing action on class:", error);
    }

    closeModal();
  };

  return (
    <div className="class-list-container">
      {/* User Avatar */}
      {/* <div className="user-avatar">
        <div className="avatar-initials">JD</div>
      </div> */}
      {!showCreateClass && ( // if the createClass btn is clicked, do not display header
        <>
          {/* Main Heading */}
          <div className="heading-container">
            <h1>All Classes</h1>
            <p>Here are the list of the classes you handle</p>
          </div>
        </>
      )}
      {/* Create Class and Hamburger Menu Button */}
      <div className="menu-create-btn-container">
        {!showCreateClass && ( // if the createClass btn is clicked, do not display button
          <button className="create-class-btn" onClick={handleShowCreateClass}>
            + Create Class
          </button>
        )}

        {showCreateClass && (
          <CreateClass
            goBack={handleBackButtonClick}
            onSuccess={() => {
              console.log("Class successfully created, refreshing window");
              window.location.reload();
            }}
          />
        )}
      </div>
      {/* TEMPORARY FIX LANG TO KASI DI SIYA KUMAKASYA SA DASHBOARD */}
      {!showCreateClass && ( // if the createClass btn is clicked, do not display class section
        <>
          {/* Class Section */}
          <div className="row">
            {classesData.length > 0 ? (
              classesData.map((cls) => (
                <div key={cls.classCode} className="col-md-6 col-lg-4">
                  <div className="card">
                    <div className="card-header">
                      <h5>
                        {cls.subject} ({cls.classCode})
                      </h5>
                    </div>
                    <div className="card-body">
                      <p>CLASSCODE: {cls.classCodes.join(", ")}</p>
                      <p>Room: {cls.room}</p>
                      <p>
                        Schedule: {cls.days.join(", ")} {cls.startTime} -{" "}
                        {cls.endTime}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <button className="btn btn-primary">View Class</button>
                        <div>
                          <button
                            className="btn"
                            onClick={() =>
                              handleActionClick("archive", cls.classCodes[0])
                            }
                          >
                            <FaArchive className="archive-icon" />
                          </button>
                          <button
                            className="btn"
                            onClick={() =>
                              handleActionClick("delete", cls.classCodes[0])
                            }
                          >
                            <FaTrash className="trash-icon" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-md-12">
                <p className="text-center">No classes available.</p>
              </div>
            )}
          </div>
          {/* Confirmation Modal */}
          <Confirmation
            isOpen={isModalOpen}
            onClose={closeModal}
            onConfirm={confirmAction}
            message={modalMessage}
          />
        </>
      )}{" "}
    </div>
  );
};

export default ClassList;
