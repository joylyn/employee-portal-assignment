import React, {Component} from 'react';
import { Tabs, Tab, Button, Table, Form } from 'react-bootstrap';
import Select from 'react-select';
import editIcon from '../edit-ico.png';
import deleteIcon from '../delete-ico.png';
import CommonModal from "./Modal.js";

class EmployeeForm extends Component {
    constructor(props){
        super(props);
        let deptObj = localStorage.getItem("DepartmentList");
        if (deptObj !== null) {
            this.departments = JSON.parse(deptObj);
        }
        this.state = {
            timestamp: props.data ? props.data.timestamp : null,
            name: props.data ? props.data.name : '',
            department:  props.data ? props.data.department :
                (this.departments.length > 0 ? this.departments[0].timestamp : null)
        }
    }
    handleDeptChange = (e)=> {
        this.setState({department: e.target.value});
    }
    handleNameChange = (e) => {
        this.setState({name: e.target.value});
    }
    render() {
    let {name, department} = this.state;
    return (
        <div className="emp-form">
            <div className="form-group">
                <label className="form-label">Employee Name *</label>
                <div className="input-group">
                    <input id="employeename" type="text" placeholder="Enter Name" className="form-control" value={name} onChange={this.handleNameChange} />
                </div>
            </div>
            <div className="form-group m-t-sm">
                <label className="form-label">Department *</label>
                <Form.Select aria-label="Department" placeholder="Select" value={department} onChange={this.handleDeptChange}>
                    {this.departments.map((d)=>{
                        return (<option value={d.timestamp}>{d.name}</option>)
                    })}
                </Form.Select>
            </div>
        </div>
    );
    }
}


class EmployeeView extends Component {
    constructor(props){
        super(props);
        let employeeObj = localStorage.getItem("EmployeeList"),
            employees = [],
            deptObj = localStorage.getItem("DepartmentList"),
            departments = [];
        if (employeeObj !== null) {
            employees = JSON.parse(employeeObj);
        }        
        if (deptObj !== null) {
            departments = JSON.parse(deptObj);
        }
        this.state = {
            employees: employees,
            departments: departments,
            filterValue: ''
        }
    }
    fetchData() {
        let employees = JSON.parse(localStorage.getItem("EmployeeList"));
        let departments = JSON.parse(localStorage.getItem("DepartmentList"));
        this.setState({
            employees: employees,
            departments: departments
        });
    }
    onAdd = () => {
        this.refs.ModalRef.setState({modalTitle: "Add New Emloyee", data: null}, ()=>{
            this.refs.ModalRef.showModal();
        });
    }
    handleEdit = (timestamp) => {
        let employees = JSON.parse(localStorage.getItem("EmployeeList"));
        let empObj = employees.find((e)=>{
            return e.timestamp === timestamp;
        });
        this.refs.ModalRef.setState({
            modalTitle: "Edit Emloyee",
            data: empObj
        }, ()=>{
            this.refs.ModalRef.showModal();
        });
    }
    handleDelete = (timestamp) => {
        let employees = JSON.parse(localStorage.getItem("EmployeeList"));
        let index = employees.findIndex((e)=>{
            return e.timestamp === timestamp;
        });
        employees.splice(index, 1);
        localStorage.setItem("EmployeeList", JSON.stringify(employees));
        this.fetchData();
    }
    handleSaveEmployee = () => {
        let ModalRef = this.refs.ModalRef;
        let employeeFormRef = ModalRef.refs.BodyComp;
        let employees = this.state.employees;
        if(employeeFormRef.state.name === '' || employeeFormRef.state.department === '') {
            return;
        }
        if(ModalRef.state.data && ModalRef.state.data.timestamp != null) {
            let index = employees.findIndex((e)=>{
                return e.timestamp === ModalRef.state.data.timestamp;
            });
            employees[index] = employeeFormRef.state;
        } else {
            employees.push({
                timestamp: Date.now().toString(),
                name: employeeFormRef.state.name,
                department: employeeFormRef.state.department
            });
        }
        localStorage.setItem("EmployeeList", JSON.stringify(employees));
        this.refs.ModalRef.hideModal();
        this.fetchData();
    }
    handleFilterChange = (value) => {
        this.setState({filterValue: value});
    }
    render() {
        let {employees, departments, filterValue} = this.state;
        let deptOptions = departments.map((d)=>{return {label: d.name, value: d.timestamp}});
        if(filterValue.length > 0) {
            employees = employees.filter((e)=>{
                let isDept = filterValue.find((v)=>{return v.value === e.department});
                return !!isDept;
            });
        }
        return (
            <div className="employee-list">
                <div className="row">
                <div className="col-sm-3 m-t-sm list-filter">
                    <Select options={deptOptions}
                    value={filterValue}
                    isMulti onChange={this.handleFilterChange} />
                </div>
                <div className="add-btn col-sm-9">
                    <Button className="add-new-btn m-b-sm" onClick={this.onAdd}>+ Add Employee</Button>
                </div>
                </div>
                <div className="emp-table col-sm-12">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>Created</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.length > 0 ?
                            employees.map((emp, i)=>{
                                let dObj = departments.find((o)=>{return o.timestamp === emp.department;});
                                return(
                                    <tr key={i}>
                                    <td>{new Date(parseInt(emp.timestamp)).toLocaleString()}</td>
                                    <td>{emp.name}</td>
                                    <td>{dObj.name}</td>
                                    <td>
                                        <img className="action-btn" src={editIcon} alt="edit" title="Edit" onClick={this.handleEdit.bind(this, emp.timestamp)} />
                                        <img className="action-btn" src={deleteIcon} alt="delete" title="Delete" onClick={this.handleDelete.bind(this, emp.timestamp)} />
                                    </td>
                                    </tr>
                                )
                            })
                            : <tr>No entries found.</tr>}
                        </tbody>
                    </Table>
                </div>
                <CommonModal
                    ref="ModalRef"
                    modalBody={EmployeeForm}
                    modalTitle="Add New Employee"
                    saveBtn={true}
                    saveBtnText="Save"
                    onSaveBtnClick={this.handleSaveEmployee}
                    showCancelBtn={true}
                    cancelBtnText="Cancel"
                    showHeader={true}
                    showFooter={true}
                />
            </div>
        );
    }
}

class DepartmentForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            timestamp: props.data ? props.data.timestamp : null,
            name: props.data ? props.data.name : ''
        }
    }
    handleNameChange = (e) => {
        this.setState({name: e.target.value});
    }
    render() {
        let {name} = this.state;
    return (
        <div className="emp-form">
            <div className="form-group">
                <label className="form-label">Department Name *</label>
                <div className="input-group">
                    <input id="deptname" type="text" placeholder="Enter Name" className="form-control" value={name} onChange={this.handleNameChange} />
                </div>
            </div>
        </div>
    );
    }
}

class DepartmentView extends Component {
    constructor(props){
        super(props);
        let deptObj = localStorage.getItem("DepartmentList");
        let departments = [];
        if (deptObj !== null) {
            departments = JSON.parse(deptObj);
        }
        this.state = {
            departments: departments
        }
    }
    fetchData() {
        let departments = JSON.parse(localStorage.getItem("DepartmentList"));
        this.setState({
            departments: departments
        });
    }
    onAdd = () => {
        this.refs.ModalRef.setState({modalTitle: "Add New Department", data: null}, ()=>{
            this.refs.ModalRef.showModal();
        });
    }
    handleEdit = (timestamp) => {
        let departments = JSON.parse(localStorage.getItem("DepartmentList"));
        let deptObj = departments.find((e)=>{
            return e.timestamp === timestamp;
        });
        this.refs.ModalRef.setState({
            modalTitle: "Edit Department",
            data: deptObj
        }, ()=>{
            this.refs.ModalRef.showModal();
        });
    }
    handleDelete = (timestamp) => {
        let departments = JSON.parse(localStorage.getItem("DepartmentList"));
        let employees = JSON.parse(localStorage.getItem("EmployeeList"));
        let hasEmployees = employees.findIndex((e)=>{return e.department === timestamp;});
        if(hasEmployees > -1) {
            window.alert('This department contains employees. Change department from Employee tab before deleting.');
            return;
        }
        let index = departments.findIndex((d)=>{
            return d.timestamp === timestamp;
        });
        departments.splice(index, 1);
        localStorage.setItem("DepartmentList", JSON.stringify(departments));
        this.fetchData();
    }
    handleSaveDepartment = () => {
        let ModalRef = this.refs.ModalRef;
        let deptFormRef = ModalRef.refs.BodyComp;
        let departments = this.state.departments;
        if(deptFormRef.state.name === '') {
            return;
        }
        if(ModalRef.state.data && ModalRef.state.data.timestamp != null) {
            let index = departments.findIndex((e)=>{
                return e.timestamp === ModalRef.state.data.timestamp;
            });
            departments[index] = deptFormRef.state;
        } else {
            departments.push({
                timestamp: Date.now().toString(),
                name: deptFormRef.state.name
            });
        }
        localStorage.setItem("DepartmentList", JSON.stringify(departments));
        this.refs.ModalRef.hideModal();
        this.fetchData();
    }
    render() {
        let {departments} = this.state;
        return (
            <div className="department-list">
                <div className="">
                </div>
                <div className="add-btn">
                    <Button className="add-new-btn m-t-sm m-b-sm" onClick={this.onAdd}>+ Add Department</Button>
                </div>                
                <div className="emp-table">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>Created</th>
                            <th>Name</th>
                            <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.length > 0 ?
                            departments.map((d, i)=>{
                                return(
                                    <tr key={i}>
                                    <td>{new Date(parseInt(d.timestamp)).toLocaleString()}</td>
                                    <td>{d.name}</td>
                                    <td>
                                        <img className="action-btn" src={editIcon} alt="edit" title="Edit" onClick={this.handleEdit.bind(this, d.timestamp)} />
                                        <img className="action-btn" src={deleteIcon} alt="delete" title="Delete" onClick={this.handleDelete.bind(this, d.timestamp)} />
                                    </td>
                                    </tr>
                                )
                            })
                        : <tr>No entries found.</tr>}                           
                        </tbody>
                    </Table>
                </div>
                <CommonModal
                    ref="ModalRef"
                    modalBody={DepartmentForm}
                    modalTitle="Add New Department"
                    saveBtn={true}
                    saveBtnText="Save"
                    onSaveBtnClick={this.handleSaveDepartment}
                    showCancelBtn={true}
                    cancelBtnText="Cancel"
                    showHeader={true}
                    showFooter={true}
                />
            </div>
        );
    }
}

class BaseContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabKey: 1
        }
        this.setInitialData();
    }

    fetchData() {
        this.refs.empViewRef.fetchData();
    }

    setInitialData() {
        localStorage.setItem("EmployeeList", JSON.stringify([]));
        localStorage.setItem("DepartmentList", JSON.stringify([]));
    }

    handleSelectTab = (key) => {
        if(key != this.state.tabKey) {
            this.setState({tabKey: key});
        }
        this.fetchData();
    }

    render() {
        let {tabKey} = this.state;
        return (
            <div className="tabs-container"
            >
                <Tabs activeKey={tabKey} onSelect={this.handleSelectTab}
                className="tab-container tab-likelihood"
                id={"mainTabs"}>
                  <Tab eventKey={1} title="Department">
                    <div><DepartmentView ref="deptViewRef" /></div> 
                  </Tab>
                  <Tab eventKey={2} title="Employee">
                    <div><EmployeeView ref="empViewRef" /></div>
                  </Tab>
                </Tabs>
            </div>
        );
    }
}

export default BaseContainer;
