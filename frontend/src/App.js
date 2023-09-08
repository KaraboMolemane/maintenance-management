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
  const editingModeId = useRef(0);

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
    //loadJobs(dispatch);
    //Do the API call
    fetch("/get-all-jobs")
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
  
    if (editingModeId.current !== 0) {
      // EDIT existing job
      const job = {
        id: editingModeId.current,
        id2: e.changes[0].data._id,
        description: e.changes[0].data.description,
        location: e.changes[0].data.location,
        priority: e.changes[0].data.priority,
        status: e.changes[0].data.status,
        createdAt: e.changes[0].data.createdAt,
        updatedAt: e.changes[0].data.updatedAt,
      };

      console.log('edited car', job)
      
      console.log('saving edited car ....');
    } else {
      // ADD new job 
      console.log('saving new car ....');

      const job = {
        description: e.changes[0].data.description,
        location: e.changes[0].data.location,
        priority: e.changes[0].data.priority,
        status: e.changes[0].data.status,
        createdAt: e.changes[0].data.createdAt,
        updatedAt: e.changes[0].data.updatedAt,
      };

      console.log('job', job) 

      fetch("/new-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      }).then(() => {
        console.log('React - new job added');
      });
    }

    //Reset editingMode,
    //Route to homepage to refresh table
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
    //get id of job being edited 
    editingModeId.current = e.key;
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
            <Popup title="Job Info" showTitle={true} width={700} height={325} />
            <Form>
              <Item itemType="group" colCount={2} colSpan={2}>
                <Item dataField="description" />
                <Item dataField="location" />
                <Item dataField="priority" />
                <Item dataField="status" />
                <Item dataField="createdAt" />
                <Item dataField="updatedAt" />
              </Item>
            </Form>
          </Editing>
          <Column dataField="_id" caption="Id" width={70} />
          <Column dataField="description" width={170} />
          <Column dataField="location" />
          <Column dataField="status" caption="Status" >
            <Lookup dataSource={status} displayExpr="Name" valueExpr="ID" />
          </Column>
          <Column dataField="priority" caption="Priority" >
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
