import { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";
import "devextreme/dist/css/dx.light.css";
import DataGrid, {
  Column,
  Editing,
  Popup,
  Paging,
  Lookup,
  Form,
  HeaderFilter,
  Search,
} from "devextreme-react/data-grid";
import "devextreme-react/text-area";
import { Item } from "devextreme-react/form";
import Header from "./components/Header";

function App() {
  //declare state(s)
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [allJobs, setAllJobs] = useState([]);

  const editingModeID = useRef(0);

  const status = [
    {
      ID: "submitted",
      Name: "Submitted",
    },
    {
      ID: "progress",
      Name: "In progress",
    },
    {
      ID: "completed",
      Name: "Completed",
    },
  ];

  const priority = [
    {
      ID: "Low",
      Name: "Low",
    },
    {
      ID: "Medium",
      Name: "Medium",
    },
    {
      ID: "High",
      Name: "High",
    },
  ];

  const archived = [
    {
      ID: "true",
      Name: "true",
    },
    {
      ID: "false",
      Name: "false",
    },
  ];

  useEffect(() => {
    //Do the API call
    fetch("/get-open-jobs")
      //.then((res) => console.log('res:',res))
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          console.log("Jobs:", result);
          setItems(result);
        },
        (error) => {
          setIsLoaded(true);
          console.log("error:", error);
          setError(error);
        }
      );
  }, []);

  const onSaving = useCallback((e) => {
    console.log("On saving", e);

    if (e.changes[0].type === "remove") {
      // Archive job
      // DO NOT delete
      const job = { id: e.changes[0].key };
      fetch("/archive-job", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      }).then(() => {
        console.log("Frontend - job archived");
        editingModeID.current = 0; //Reset editingMode,
        window.location.href = "/";
      });
    } else {
      // Edit or add new job
      const jobs = e.changes;
      // console.log('jobs:', jobs)
  
      if (jobs.length !== 0) {
        jobs.forEach((element, index) => {
          const job = {
            description: element.data.description,
            location: element.data.location,
            priority: element.data.priority,
            status: element.data.status,
          };

          if (e.changes[0].type === "update") {
            // EDIT existing job
            job.id = element.key? element.key : editingModeID.current;

            fetch("/edit-job", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(job),
            }).then(() => {
              console.log("Frontend - job edited");
              editingModeID.current = 0; //Reset editingMode,
              // window.location.href = "/";
            });
          } else {
            // ADD new job
            fetch("/new-job", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(job),
            }).then(() => {
              console.log("Frontend - new job added");
              // window.location.href = "/";
            });
          }
        });
        window.location.href = "/";
      }

    }
  }, []);

  const editJob = useCallback((e) => {
    console.log("editJob", e);
    editingModeID.current = e.data._id;

  }, []);

  function loadModalData() {
    fetch("/get-all-jobs")
      //.then((res) => console.log('res:',res))
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          console.log("All Jobs:", result);
          setAllJobs(result);
        },
        (error) => {
          setIsLoaded(true);
          console.log("error:", error);
          setError(error);
        }
      );
  }

  return (
    <>
      <Header />
      <h4>Jobs:</h4>
      <div id="data-grid-demo">
        <DataGrid
          dataSource={items}
          keyExpr="_id"
          showBorders={true}
          onSaving={onSaving}
          onEditingStart={editJob}
        >
          <Paging defaultPageSize={10} />
          <HeaderFilter visible={true}>
            <Search enabled={true} />
          </HeaderFilter>
          <Editing
            mode="popup"
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
          >
            <Popup title="Job Info" showTitle={true} width={700} height={255} />
            <Form>
              <Item itemType="group" colCount={2} colSpan={2}>
                <Item dataField="description" />
                <Item dataField="location" />
                <Item dataField="priority" />
                <Item dataField="status" />
              </Item>
            </Form>
          </Editing>
          <Column dataField="_id" caption="Id" width={70} />
          <Column dataField="description" width={170} />
          <Column dataField="location" />
          <Column dataField="status" caption="Status">
            <Lookup dataSource={status} displayExpr="Name" valueExpr="ID" />
          </Column>
          <Column dataField="priority" caption="Priority">
            <Lookup dataSource={priority} displayExpr="Name" valueExpr="ID" />
          </Column>
          <Column dataField="createdAt" dataType="date" />
          <Column dataField="updatedAt" dataType="date" />
        </DataGrid>
      </div>
      {/* modal for buld edit*/}
      <div className="d-inline-flex gap-2 mb-5 mt-5" style={{marginLeft:'45%'}}>
        <button
          type="button"
          className="d-inline-flex align-items-center btn btn-primary btn-lg px-4 rounded-pill"
          data-bs-toggle="modal"
          data-bs-target="#exampleModalFullscreen"
          onClick={() => loadModalData()}
        >
          Bulk edit
        </button>
      </div>
      <div
        className="modal fade"
        id="exampleModalFullscreen"
        tabIndex="-1"
        aria-labelledby="exampleModalFullscreenLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-4" id="exampleModalFullscreenLabel">
                Bulk edit
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div id="data-grid-demo">
                <DataGrid
                  dataSource={allJobs}
                  keyExpr="_id"
                  showBorders={true}
                  onSaving={onSaving}
                  onEditingStart={editJob}
                >
                  <Paging defaultPageSize={10}/>
                  <Editing
                    mode="batch"
                    allowUpdating={true}
                    // selectTextOnEditStart={state.selectTextOnEditStart}
                    // startEditAction={state.startEditAction}
                  />
                  <Column dataField="_id" caption="Id" width={70} />
                  <Column dataField="description" width={170} />
                  <Column dataField="location" />
                  <Column dataField="archived" caption="Archived">
                    <Lookup
                      dataSource={archived}
                      displayExpr="Name"
                      valueExpr="ID"
                    />
                  </Column>
                  <Column dataField="status" caption="Status">
                    <Lookup
                      dataSource={status}
                      displayExpr="Name"
                      valueExpr="ID"
                    />
                  </Column>
                  <Column dataField="priority" caption="Priority">
                    <Lookup
                      dataSource={priority}
                      displayExpr="Name"
                      valueExpr="ID"
                    />
                  </Column>
                </DataGrid>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

/*
LINKS
https://js.devexpress.com/Demos/WidgetsGallery/Demo/Localization/UsingGlobalize/React/Light/
https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/RowEditingAndEditingEvents/jQuery/Light/
https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/CellEditingAndEditingAPI/jQuery/Light/
https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/FormEditing/jQuery/Light/
https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/WebAPIService/React/Light/ - has filter 
https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/EditStateManagement/React/Light/ - write to DB example 

*/
