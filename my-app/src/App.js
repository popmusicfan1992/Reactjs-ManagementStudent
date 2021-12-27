import logo from "./logo.svg";
import "./App.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Axios from "axios";
function App() {
  let fullname = useRef("");
  let age = useRef("");
  let numberClass = useRef("");
  let [ModalContent, setModal] = useState({
    title: "Thêm học sinh",
    Action: <button className="btn btn-success">Thêm học sinh</button>,
  });
  let [studentState, setStudent] = useState({
    fullname: "",
    age: "",
    numberClass: "",
  });
  let [listStudent, setListStudent] = useState([]);
  const getListStudenAPI = async () => {
    try {
      let { status, data } = await Axios({
        url: "http://localhost:7000/students",
        method: "GET",
      });
      if (status === 200) {
        setListStudent(...listStudent, data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(getListStudenAPI, []);
  const renderOption = () => {
    let arr = [];
    for (let i = 1; i <= 12; i++) {
      arr.push(
        <option value={i} key={i}>
          {i}
        </option>
      );
    }
    return arr;
  };
  const handleChangeStudent = (e) => {
    let { value, name } = e.target;
    setStudent({ ...studentState, [name]: value });
  };
  const renderStudent = () => {
    return listStudent.map((student, index) => {
      return (
        <tr key={index}>
          <td>{student.id}</td>
          <td>{student.fullname}</td>
          <td>{student.age}</td>
          <td>{student.numberClass}</td>
          <td>
            <button
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#exampleModalCenter"
              onClick={() => {
                setStudent({
                  fullname: student.fullname,
                  age: student.age,
                  numberClass: student.numberClass,
                });
                setModal({
                  title: "Sửa sinh viên",
                  Action: (
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        let studentUpdate = {
                          fullname: fullname.current.value,
                          age: age.current.value,
                          numberClass: numberClass.current.value,
                        };
                        // studentUpdate = JSON.stringify(studentUpdate);
                        let promise = Axios({
                          url: `http://localhost:7000/students/${student.id}`,
                          method: "PUT",
                          data: studentUpdate,
                        });

                        promise.then((result) => {
                          setListStudent(result.data);
                        });
                        promise.catch((err) => {
                          console.log(err);
                        });
                      }}
                    >
                      Sửa sinh viên
                    </button>
                  ),
                });
              }}
            >
              Sửa
            </button>
          </td>
          <td>
            <button
              className="btn btn-danger"
              onClick={() => {
                let promise = Axios({
                  url: `http://localhost:7000/students/${student.id}`,
                  method: "DELETE",
                });

                promise.then((result) => {
                  setListStudent(result.data);
                });
                promise.catch((err) => {
                  console.log(err);
                });
              }}
            >
              Xóa
            </button>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="App container mt-5">
      <div
        className="modal fade"
        id="exampleModalCenter"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                {ModalContent.title}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <div>
                  <p>Name</p>
                  <input
                    type="text"
                    name="fullname"
                    ref={fullname}
                    value={studentState.fullname}
                    className="form-control"
                    aria-describedby="helpId"
                    onChange={handleChangeStudent}
                  />
                </div>
                <div>
                  <p>Age</p>
                  <input
                    type="text"
                    name="age"
                    ref={age}
                    value={studentState.age}
                    className="form-control"
                    aria-describedby="helpId"
                    onChange={handleChangeStudent}
                  />
                </div>
                <div>
                  <p>Class</p>
                  <select
                    name="numberClass"
                    ref={numberClass}
                    value={studentState.numberClass}
                    className="form-control"
                    onChange={handleChangeStudent}
                  >
                    {renderOption()}
                  </select>
                </div>
              </div>
            </div>
            {ModalContent.Action}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-success"
          data-toggle="modal"
          data-target="#exampleModalCenter"
          onClick={() => {
            setStudent({
              fullname: "",
              age: "",
              numberClass: "",
            });
            setModal({
              title: "Thêm học sinh",
              Action: (
                <button
                  className="btn btn-success"
                  onClick={() => {
                    let studentCreate = {
                      fullname: fullname.current.value,
                      age: age.current.value,
                      numberClass: numberClass.current.value,
                    };
                    let promise = Axios({
                      url: `http://localhost:7000/students`,
                      method: "POST",
                      data: studentCreate,
                    });

                    promise.then((result) => {
                      console.log(result.data);
                    });
                    promise.catch((err) => {
                      console.log(err);
                    });
                  }}
                >
                  Thêm học sinh
                </button>
              ),
            });
          }}
        >
          Thêm học sinh
        </button>
      </div>
      <div className="p-5">
        <table className="table">
          <thead>
            <tr>
              <th>id</th>
              <th>Full name</th>
              <th>Age</th>
              <th>Class</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{renderStudent()}</tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
