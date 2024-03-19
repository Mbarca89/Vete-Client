import "./Users.css"
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import UserList from "../../components/UserList/UserList";
import CreateUser from "../../components/CreateUser/CreateUser";


const Users = () => {

    return (
        <div className='container flex-grow-1 p-5 m-2 rounded custom'>
            <Tabs
                defaultActiveKey="users"
                id="uncontrolled-tab-example"
                className="mb-5"
            >
                <Tab eventKey="users" title="Usuarios">
                   <UserList/>
                </Tab>
                <Tab eventKey="create" title="Alta usuario">
                   <CreateUser/>
                </Tab>
            </Tabs>
        </div>
    )
}

export default Users