import { useState, useEffect } from "react";
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
} from 'devextreme-react/data-grid';
import 'devextreme-react/text-area';
import { Item } from 'devextreme-react/form';
import { employees, states } from './data.js';
import Header from "./components/Header";

const notesEditorOptions = { height: 100 };

function App() {
    //declare state(s)
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);

    const status = [{
      ID: 'submitted',
      Name: 'submitted',
    }, {
      ID: 'progress',
      Name: 'progress',
    }, {
      ID: 'completed',
      Name: 'completed',
    }];


useEffect(() => {
    //loadJobs(dispatch);
    //Do the API call
      fetch("/get-all-jobs")
        //.then((res) => console.log('res:',res))
        .then((res) => res.json())
        .then(
          (result) => {
            setIsLoaded(true);
            console.log('Jobs:', result);
            setItems(result);
          },
          (error) => {
            setIsLoaded(true);
            console.log('error:', error);
            setError(error);
          }
        );
    
  }, []);



  return (
    <>
    <Header  />
    <h4>Jobs:</h4>
    <div id="data-grid-demo">
        <DataGrid
          dataSource={items}
          keyExpr="_id"
          showBorders={true}
        >
          <Paging enabled={false} />
          <HeaderFilter visible={true}>
          <Search enabled={true} />
        </HeaderFilter>
          <Editing
            mode="popup"
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}>
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
          <Column
            dataField="status"
            caption="Status"
            width={125}
          >
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
