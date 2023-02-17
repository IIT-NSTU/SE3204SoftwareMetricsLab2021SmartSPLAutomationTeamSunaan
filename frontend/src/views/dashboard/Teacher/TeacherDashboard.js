import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "../Teacher/dashboard.css";
import reactIMG from "../../../assets/images/theme.png";
import { isEmptyOrSpaces } from "src/views/utils";
import { toast } from "react-toastify";
import { handleError } from "../../../redux/auth/utility";
import {
  CRow,
  CCard,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormTextarea,
  CFormLabel,
  CCardBody,
  CCol,
  CCardImage,
  CCardTitle,
  CCardText,
  CCardFooter,
  CForm,
  CNavLink,
  CContainer,
} from "@coreui/react";

function Dashboard() {
  const [visible, setVisible] = useState(false);
  const [spls, setSpls] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const splName = event.target.splName.value;
    const splDes = event.target.spldes.value;
    if (isEmptyOrSpaces(splName)) {
      toast.error("Enter room title ");
    } else if (isEmptyOrSpaces(splDes)) {
      toast.error("Description can't be empty");
    } else {
      axios.defaults.headers = {
        "Content-Type": "application/json",
      };
      axios
        .post("http://127.0.0.1:8000/api/spl-manager/spl/", {
          title: splName,
          description: splDes,
        })
        .then((response) => {
          toast.success("Room created successfully.");
          setVisible(false);
        })
        .catch((error) => {
          handleError(error);
        });
    }
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/spl-manager/spl/")
      .then((res) => {
        setSpls(res.data);
      })
      .catch((error) => {
        handleError(error);
      });
  }, [visible]);
  return (
    <>
      <div className="header2">
        <CContainer>
          <CRow>
            <CCol>Rooms</CCol>
            <CCol style={{ textAlign: "end" }}>
              {" "}
              <CButton
                className="dashboard-button"
                color="dark"
                variant="outline"
                onClick={() => setVisible(!visible)}
              >
                Create Room
              </CButton>
            </CCol>
          </CRow>
        </CContainer>

        <CModal
          alignment="center"
          visible={visible}
          onClose={() => setVisible(false)}
        >
          <CForm
            className="row g-3 needs-validation"
            noValidate
            onSubmit={handleSubmit}
            style={{ padding: "1rem" }}
          >
            <CModalHeader>
              <CModalTitle>Create Room</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CFormLabel>Name: </CFormLabel>
              <CFormInput type="text" name="splName" placeholder="Room name" />
              <CFormLabel className="description">Description: </CFormLabel>
              <CFormTextarea
                name="spldes"
                rows="3"
                placeholder="Room description"
              ></CFormTextarea>
            </CModalBody>
            <CModalFooter>
              <CButton color="light" onClick={() => setVisible(false)}>
                Close
              </CButton>
              <CButton color="dark" type="submit">
                Save changes
              </CButton>
            </CModalFooter>
          </CForm>
        </CModal>
      </div>

      <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 2 }}>
        {spls.map((spl) => (
          <CCol xs>
            <CCard>
              <CNavLink
                to={"/teacher/spls/" + spl.join_code}
                component={NavLink}
              >
                <CCardImage orientation="top" src={reactIMG} />

                <CCardBody>
                  <CCardTitle>{spl.title}</CCardTitle>
                  <CCardText>{spl.description}</CCardText>
                </CCardBody>
              </CNavLink>

              <CCardFooter>
                <small className="text-medium-emphasis">
                  Join code: {spl.join_code}
                </small>
                <CButton
                  style={{ marginLeft: "1.5rem" }}
                  shape="rounded-pill"
                  color="dark"
                  variant="ghost"
                  onClick={(e) => {
                    navigator.clipboard.writeText(spl.join_code);
                    e.target.innerHTML = "Copied !";
                  }}
                >
                  Copy
                </CButton>
              </CCardFooter>
            </CCard>
          </CCol>
        ))}
      </CRow>
    </>
  );
}

export default Dashboard;
