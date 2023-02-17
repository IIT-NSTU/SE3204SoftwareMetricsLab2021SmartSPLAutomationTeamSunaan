import React from "react";
import { useState, useEffect } from "react";
import Select from "react-select";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import "./task.css";
import { connect } from "react-redux";
import { isEmptyOrSpaces } from "src/views/utils";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import {
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormTextarea,
  CCol,
  CRow,
} from "@coreui/react";

function Task({ isAuthenticated, isTeacher, isVerified }) {
  const [visibleLg, setVisibleLg] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [files, setFiles] = useState(null);

  const [dropDownAssign, setdropDownAssign] = useState([]);
  const [dropDownPriority, setDropDownPriority] = useState("");
  const [dropDownStatus, setDropDownStatus] = useState("");

  const [startDate, setStartDate] = useState(null);
  const [Loading, setLoading] = useState(null);

  const handleDropDownAssign = (e) => {
    let arr = [];
    e.map((val, i) => {
      arr.push(val.value);
    });
    setdropDownAssign(arr);
  };

  const handleDropDownStatus = (e) => {
    setDropDownStatus(e.label);
  };

  const handleDropDownPriority = (e) => {
    setDropDownPriority(e.label);
  };

  let assigned = [];
  assigned = studentList.students;

  const priority = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  const status = [
    { value: "no progress", label: "No Progress" },
    { value: "in progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];
  const { projectID } = useParams();
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/spl-manager/task-list/${projectID}`)
      .then((res) => {
        setTasks(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [visibleLg]);

  const getUserData = React.useCallback(async () => {
    axios
      .get(
        `http://127.0.0.1:8000/api/spl-manager/get-team-by-project/${projectID}`
      )
      .then((res) => {
        setStudentList(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    getUserData();
  }, []);

  const handleFile = (e) => {
    let files = e.target.files;
    setFiles(files);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const name = event.target.name.value;
    const description = event.target.description.value;

    if (isEmptyOrSpaces(name)) {
      alert("name cant be empty");
    } else if (isEmptyOrSpaces(description)) {
      alert("description cant be empty");
    } else if (dropDownAssign.length == 0) {
      alert("Select student to assign task");
    } else if (dropDownPriority.length == 0) {
      alert("select task priority");
    } else if (dropDownStatus.length == 0) {
      alert("select task status");
    } else {
      let formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      dropDownAssign.forEach((value) => formData.append("assign", value));
      formData.append("priority", dropDownPriority);
      formData.append("task_status", dropDownStatus);

      if (files != null) {
        Array.from(files).forEach((file) => {
          formData.append("files", file);
        });
      }

      // files.forEach();

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      axios
        .post(
          `http://127.0.0.1:8000/api/spl-manager/create-task/${projectID}`,
          formData,
          config
        )
        .then((response) => {
          toast.success("task create successful");
          setVisibleLg(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <div className="header2">Tasks</div>
      {isTeacher && (
        <CButton
          className="task-button"
          color="dark"
          variant="outline"
          onClick={() => setVisibleLg(!visibleLg)}
        >
          Add Task
        </CButton>
      )}

      <CModal
        alignment="center"
        size="lg"
        visible={visibleLg}
        onClose={() => setVisibleLg(false)}
      >
        <CForm
          className="row g-4 needs-validation"
          noValidate
          onSubmit={handleSubmit}
          style={{ padding: "1rem" }}
        >
          <CModalHeader>
            <CModalTitle>Add Task</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CFormLabel htmlFor="exampleFormControlTextarea1">
              Title:{" "}
            </CFormLabel>
            <CFormInput
              type="text"
              placeholder="Enter Task Title"
              name="name"
            />
            <CFormLabel
              className="description"
              htmlFor="exampleFormControlTextarea1"
            >
              Description:{" "}
            </CFormLabel>
            <CFormTextarea
              id="exampleFormControlTextarea1"
              rows="3"
              placeholder="Enter task description"
              name="description"
            />
            <CRow>
              <CCol>
                <CFormLabel
                  className="description"
                  htmlFor="exampleFormControlTextarea1"
                >
                  Priority:{" "}
                </CFormLabel>
                <Select
                  onChange={(e) => handleDropDownPriority(e)}
                  options={priority}
                />
              </CCol>
              <CCol>
                {" "}
                <CFormLabel
                  className="description"
                  htmlFor="exampleFormControlTextarea1"
                >
                  Status:{" "}
                </CFormLabel>
                <Select
                  onChange={(e) => handleDropDownStatus(e)}
                  options={status}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CFormLabel
                  className="description"
                  htmlFor="exampleFormControlTextarea1"
                >
                  Point:{" "}
                </CFormLabel>
                <Select
                  onChange={(e) => handleDropDownPriority(e)}
                  options={priority}
                />
              </CCol>
              <CCol>
                {" "}
                <CFormLabel
                  className="description"
                  htmlFor="exampleFormControlTextarea1"
                >
                  Deadline:{" "}
                </CFormLabel>
                <DatePicker
                  className="form-control"
                  isClearable
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  minDate={new Date()}
                />
              </CCol>
            </CRow>
            <CRow>
              <CFormLabel
                className="description"
                htmlFor="exampleFormControlTextarea1"
              >
                Assigned to:{" "}
              </CFormLabel>
              <Select
                onChange={(e) => handleDropDownAssign(e)}
                options={assigned}
                isMulti
              />
            </CRow>
            <CFormLabel
              className="description"
              htmlFor="exampleFormControlTextarea1"
            >
              Attach Files
            </CFormLabel>
            <CFormInput
              type="file"
              name="files"
              id="formFileMultiple"
              onChange={(e) => handleFile(e)}
              multiple
            />
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisibleLg(false)}>
              Close
            </CButton>
            <CButton color="dark" type="submit">
              Save changes
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      {Object.keys(tasks).length > 0 && (
        <>
          {tasks.tasks.map((task) => (
            <CAccordion flush key={task.id}>
              <CAccordionItem itemKey={1} className="accordion">
                <CAccordionHeader>{task.name}</CAccordionHeader>
                <CAccordionBody>
                  <CFormLabel htmlFor="exampleFormControlTextarea1">
                    {task.description}
                  </CFormLabel>{" "}
                  <br />
                  <CFormLabel htmlFor="exampleFormControlTextarea1">
                    Assigned To:
                    {task.assign != null &&
                      task.assign.map(
                        (val, i) =>
                          " " + val.first_name + " " + val.last_name + ", "
                      )}
                  </CFormLabel>{" "}
                  <br />
                  <CFormLabel htmlFor="exampleFormControlTextarea1">
                    Priority: {task.priority}
                  </CFormLabel>
                  <br />
                  <CFormLabel htmlFor="exampleFormControlTextarea1">
                    Status: {task.status}
                  </CFormLabel>
                  <br />
                  <br />
                  {isTeacher && (
                    <Link to={"/edit-task/" + task.id}>
                      <CButton className="projects-button" color="dark">
                        Update task
                      </CButton>
                    </Link>
                  )}
                </CAccordionBody>
              </CAccordionItem>
            </CAccordion>
          ))}
        </>
      )}
    </>
  );
}
const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    isTeacher: state.auth.isTeacher,

    isStudent: state.auth.isStudent,
    isVerified: state.auth.isVerified,
  };
};

export default connect(mapStateToProps, null)(Task);
