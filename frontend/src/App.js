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
import { employees, states } from "./data.js";
import Header from "./components/Header";

const notesEditorOptions = { height: 100 };

function App() {
  //declare state(s)
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
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

    if(e.changes[0].type === "remove"){
      // Archive job 
      // DO NOT delete 
      const job = {id: e.changes[0].key }
      fetch("/archive-job", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      }).then(() => {
        console.log("Frontend - job archived");
        editingModeID.current = 0; //Reset editingMode,
        window.location.href = "/";
      });

    }
    else{
      // Edit or add new job 
      const job = {
        description: e.changes[0].data.description,
        location: e.changes[0].data.location,
        priority: e.changes[0].data.priority,
        status: e.changes[0].data.status
      };
  
      if (e.changes[0].type === "update") {
        // EDIT existing job
        job.id = editingModeID.current;
  
        fetch("/edit-job", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(job),
        }).then(() => {
          console.log("Frontend - job edited");
          editingModeID.current = 0; //Reset editingMode,
          window.location.href = "/";
        });
      } else {
        // ADD new job
        fetch("/new-job", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(job),
        }).then(() => {
          console.log("Frontend - new job added");
          window.location.href = "/";
        });
      }

    }
  }, []);

  const afterSaving = (e) => {
    console.log("After saving", e);
    e.cancel = true;
    //e.promise = saveChange(dispatch, e.changes[0]);
    //Reset editingMode,
    //Route to homepage to refresh table
  };

  const addNewJob = useCallback((e) => {
    console.log("new job", e);
    e.cancel = true;
    //e.promise = saveChange(dispatch, e.changes[0]);
  }, []);

  const editJob = useCallback((e) => {
    console.log("editJob", e);
    editingModeID.current = e.data._id;
    //get id of job being edited
    // e.cancel = true;
    //e.promise = saveChange(dispatch, e.changes[0]);
  }, []);


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
          onSaved={afterSaving}
          onInitNewRow={addNewJob}
          onEditingStart={editJob}
        >
          <Paging enabled={false} />
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
