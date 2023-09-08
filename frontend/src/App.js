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
  const editingMode = useRef(false);

  const status = [
    {
      ID: "submitted",
      Name: "submitted",
    },
    {
      ID: "progress",
      Name: "progress",
    },
    {
      ID: "completed",
      Name: "completed",
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
    console.log("bare ke E", e);
    e.cancel = true;
    //e.promise = saveChange(dispatch, e.changes[0]);

    if (editingMode.current) {
      // Edit existing job
      //TO-DO
      console.log('saving edited car ....');
    } else {
      // Add new job 
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
        //window.location.href = "/";
      });
    }

    //Reset editingMode,
    //Route to homepage to refresh table
  }, []);

  const onSaving2 = (e) => {
    console.log("on saving", e);
    e.cancel = true;
    //e.promise = saveChange(dispatch, e.changes[0]);

    
    //Reset editingMode,
    //Route to homepage to refresh table
    
  };

  const afterSaving = (e) => {
    console.log("After saving", e);
    e.cancel = true;
    //e.promise = saveChange(dispatch, e.changes[0]);

    if (editingMode) {
      // Edit existing job
      //TO-DO
    } else {
      // Add new job 
      const job = {
        description: e.changes[0].data.description,
        location: e.changes[0].data.location,
        priority: e.changes[0].data.priority,
        status: e.changes[0].data.status,
        createdAt: e.changes[0].data.createdAt,
        updatedAt: e.changes[0].data.updatedAt,
      };

      fetch("/new-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      }).then(() => {
        console.log('React - new job added');
        window.location.href = "/";
      });
    }
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
    e.cancel = true;
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
          <Column dataField="description" />
          <Column dataField="location" />
          <Column dataField="status" caption="Status" width={125}>
            <Lookup dataSource={status} displayExpr="Name" valueExpr="ID" />
          </Column>
          <Column dataField="priority" width={170} />
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
