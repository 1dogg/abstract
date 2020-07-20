var ReactDOM = require('react-dom');
var React = require('react');
import UserEditPage from './components/UserEditPage.jsx';

const employeeId = document.getElementById('employeeId').value;
ReactDOM.render(<UserEditPage employeeId={employeeId}/>, document.getElementById('content'));