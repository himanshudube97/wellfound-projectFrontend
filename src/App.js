import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

export default function App() {
  const [add, setAdd] = useState(false);
  const [addData, setAddData] = useState({
    id: "565",
    name: "",
    email: "",
    phone: ""
  });
  const [checkedRow, setCheckedRow] = useState([]);
  const [data, setData] = useState([]);
  const [updateBool, setUpdateBool] = useState(false);

  function addPopup() {
    setAdd((prev) => {
      return !prev;
    });
  }
  function handleInput(e) {
    const { value, name } = e.target;
    setAddData({ ...addData, [name]: value });
  }
  console.log(addData, "daf");

  function checkRows(e, row) {
    e.preventDefault();
    let dupRow = [...checkedRow];
    let index = dupRow.findIndex((item) => {
      return item.email === row.email;
    });

    if (index === -1) {
      setCheckedRow([...dupRow, row]);
    } else {
      let filteredArr = dupRow.filter((i) => {
        return i.email !== row.email;
      });
      setCheckedRow(filteredArr);
    }

    console.log(index, "index");
  }

  async function handleSave() {
    try {
      // if (
      //   addData.name.trim() ||
      //   addData.phone.trim() ||
      //   addData.email.trim() === ""
      // ) {
      //   alert("fill the inputs all");
      // } else {
      let result = await axios.post("http://localhost:4000/createRow", addData);
      if (result) {
        console.log(result, "result");
        setAddData({ name: "", phone: "", email: "" });
        setAdd(false);
        setData([...data, result.data.result]);
      }
      // }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdate(e, item) {
    console.log(item.id, "id");
    setAddData({
      name: item.name,
      email: item.email,
      phone: item.phone,
      id: item._id
    });
    setUpdateBool(true);
  }

  async function handleUpdateApi() {
    try {
      const result = await axios.post(
        "http://localhost:4000/updateData",
        addData
      );
      if (result) {
        getData();
        setAdd(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDelete(e, id) {
    try {
      const result = await axios.get(
        `http://localhost:4000/deleteData?id=${id}`
      );
      if (result) {
        console.log(result);
        getData();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getData() {
    try {
      let result = await axios.get("http://localhost:4000/getData");
      if (result) {
        console.log(result, "res");
        setData(result.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
    if (updateBool) {
      const req = {
        id: addData._id,
        name: addData.name,
        phone: addData.phone,
        email: addData.email
      };
      setAdd(true);

      console.log(req, "REQUEST");
    }
  }, [updateBool]);

  console.log(checkedRow, "checkrow");
  return (
    <div className="App">
      <button onClick={addPopup}>Add</button>
      <div class="popup-div" style={{ display: add ? "inline-block" : "none" }}>
        <button
          onClick={() => {
            setAdd(false);
            setUpdateBool(false);
          }}
        >
          close
        </button>
        <h2>Name</h2>
        <input
          type="text"
          name="name"
          onChange={handleInput}
          value={addData.name}
          required
        />
        <h2>Email</h2>
        <input
          type="email"
          name="email"
          onChange={handleInput}
          value={addData.email}
          required
        />
        <h2>Phone Num</h2>
        <input
          type="number"
          name="phone"
          onChange={handleInput}
          value={addData.phone}
        />
        <br />
        {updateBool ? (
          <button onClick={handleUpdateApi}>update</button>
        ) : (
          <button onClick={handleSave}>Save</button>
        )}
      </div>
      {data?.map((item, index) => {
        return (
          <>
            <div>
              <table>
                <tr>
                  <td style={{width: "4%"}}>
                    <button
                      onClick={(e) => {
                        checkRows(e, item);
                      }}
                    >
                      check
                    </button>{" "}
                  </td>
                  <td style={{width: "30%"}}>{item.name}</td>
                  <td style={{width: "40%"}}>{item.email}</td>
                  <td style={{width: "30%"}}>{item.phone}</td>
                  <td>
                    <button
                      onClick={(e) => {
                        handleUpdate(e, item);
                      }}
                    >
                      update
                    </button>{" "}
                  </td>
                  <td>
                    <button
                      onClick={(e) => {
                        handleDelete(e, item._id);
                      }}
                    >
                      Delete{" "}
                    </button>
                  </td>
                </tr>
              </table>
            </div>
          </>
        );
      })}
    </div>
  );
}
